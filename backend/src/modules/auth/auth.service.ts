import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { createHash, randomBytes, randomUUID } from "node:crypto";
import * as argon2 from "argon2";
import type { User } from "@prisma/client";
import { PrismaService } from "../../database/prisma.service";
import { AuditService } from "../audit/audit.service";
import { presentAuthUser } from "./auth.presenter";

const hashToken = (value: string) => createHash("sha256").update(value).digest("hex");

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService, private readonly jwt: JwtService,
    private readonly config: ConfigService, private readonly audit: AuditService) {}

  private async issue(user: User) {
    const sessionId = randomUUID();
    const accessToken = await this.jwt.signAsync({ sub: user.id, associationId: user.associationId, role: user.role, sid: sessionId });
    const refreshToken = randomBytes(48).toString("base64url");
    const days = this.config.get<number>("REFRESH_TOKEN_TTL_DAYS", 7);
    const expiresAt = new Date(Date.now() + days * 86_400_000);
    await this.prisma.refreshSession.create({ data: { id: sessionId, associationId: user.associationId,
      userId: user.id, tokenHash: hashToken(refreshToken), expiresAt } });
    return { session: { user: presentAuthUser(user), token: accessToken,
      expiresAt: new Date(Date.now() + 15 * 60_000).toISOString() }, refreshToken, refreshExpiresAt: expiresAt };
  }

  async signIn(email: string, password: string, ip?: string, device?: string) {
    const user = await this.prisma.user.findFirst({ where: { email: email.trim().toLowerCase(), status: "ativo" } });
    if (!user || !(await argon2.verify(user.passwordHash, password))) throw new UnauthorizedException("E-mail ou senha inválidos.");
    await this.prisma.user.update({ where: { id: user.id }, data: { lastAccessAt: new Date() } });
    const issued = await this.issue(user);
    await this.audit.record({ associationId: user.associationId, userId: user.id, userName: user.name,
      action: "auth.sign_in", resource: "session", ip, device });
    return issued;
  }

  async refresh(token: string) {
    const stored = await this.prisma.refreshSession.findUnique({ where: { tokenHash: hashToken(token) }, include: { user: true } });
    if (!stored || stored.revokedAt || stored.expiresAt <= new Date() || stored.user.status !== "ativo") throw new UnauthorizedException("Sessão expirada.");
    await this.prisma.refreshSession.update({ where: { id: stored.id }, data: { revokedAt: new Date() } });
    return this.issue(stored.user);
  }

  async signOut(token: string | undefined, userId?: string) {
    if (token) await this.prisma.refreshSession.updateMany({ where: { tokenHash: hashToken(token), revokedAt: null }, data: { revokedAt: new Date() } });
    if (userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      if (user) await this.audit.record({ associationId: user.associationId, userId: user.id, userName: user.name, action: "auth.sign_out", resource: "session" });
    }
  }

  async session(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.status !== "ativo") throw new UnauthorizedException();
    return { user: presentAuthUser(user), token: "", expiresAt: new Date(Date.now() + 15 * 60_000).toISOString() };
  }
}
