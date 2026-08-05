import type { UserRole } from "@prisma/client";

export interface AuthPrincipal {
  sub: string;
  associationId: string;
  role: UserRole;
  sid: string;
}

export interface RequestContext {
  user: AuthPrincipal;
  ip?: string;
  headers: Record<string, string | string[] | undefined>;
}
