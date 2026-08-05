import type { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import * as argon2 from "argon2";
import { Server } from "node:net";
import * as request from "supertest";
import type { Response } from "supertest";
import type { App } from "supertest/types";
import { AppModule } from "../src/app.module";
import { configureApp } from "../src/app.setup";
import { PrismaService } from "../src/database/prisma.service";

const ASSOCIATION_ID = "10000000-0000-4000-8000-000000000001";
const PASSWORD = "e2e-password-only";
const users = {
  admin: { id: "10000000-0000-4000-8000-000000000101", email: "admin@e2e.test", role: "administrador" },
  manager: { id: "10000000-0000-4000-8000-000000000102", email: "gestor@e2e.test", role: "gestor" },
  sales: { id: "10000000-0000-4000-8000-000000000103", email: "comercial@e2e.test", role: "comercial" },
  traffic: { id: "10000000-0000-4000-8000-000000000104", email: "trafego@e2e.test", role: "gestor_trafego" },
} as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const isUnknownArray = (value: unknown): value is unknown[] => Array.isArray(value);

const bodyOf = (response: Response): Record<string, unknown> => {
  const parsed: unknown = JSON.parse(response.text);
  if (!isRecord(parsed)) throw new Error("Resposta JSON não é um objeto.");
  return parsed;
};

const stringField = (body: Record<string, unknown>, key: string): string => {
  const value = body[key];
  if (typeof value !== "string") throw new Error(`Campo ${key} ausente na resposta.`);
  return value;
};

const assertNoSensitiveFields = (value: unknown): void => {
  const forbidden = new Set(["password", "passwordHash", "refreshToken", "refreshTokenHash", "tokenHash", "cookie"]);
  if (Array.isArray(value)) return value.forEach(assertNoSensitiveFields);
  if (!isRecord(value)) return;
  for (const [key, child] of Object.entries(value)) {
    expect(forbidden.has(key)).toBe(false);
    assertNoSensitiveFields(child);
  }
};

describe("Risco Zero API (e2e)", () => {
  let app: INestApplication;
  let server: App;
  let prisma: PrismaService;

  beforeAll(async () => {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl || !new URL(databaseUrl).pathname.replace(/^\//, "").endsWith("_e2e")) {
      throw new Error("Limpeza E2E recusada: DATABASE_URL não aponta para um banco terminado em _e2e.");
    }

    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    configureApp(app, app.get(ConfigService));
    await app.init();
    const appServer: unknown = app.getHttpServer();
    if (!(appServer instanceof Server)) throw new Error("Servidor HTTP de teste indisponível.");
    server = appServer;
    prisma = app.get(PrismaService);

    await prisma.$transaction([
      prisma.refreshSession.deleteMany(), prisma.auditEntry.deleteMany(),
      prisma.leadAssignmentHistory.deleteMany(), prisma.leadStageHistory.deleteMany(),
      prisma.leadTask.deleteMany(), prisma.leadActivity.deleteMany(), prisma.leadTracking.deleteMany(),
      prisma.leadConsent.deleteMany(), prisma.membership.deleteMany(), prisma.vehicle.deleteMany(),
      prisma.member.deleteMany(), prisma.trafficMetricDaily.deleteMany(), prisma.campaign.deleteMany(),
      prisma.integrationCatalogItem.deleteMany(), prisma.lead.deleteMany(), prisma.user.deleteMany(),
      prisma.association.deleteMany(),
    ]);
    await prisma.association.create({ data: { id: ASSOCIATION_ID, name: "Associação E2E" } });
    const passwordHash = await argon2.hash(PASSWORD);
    for (const [name, fixture] of Object.entries(users)) {
      await prisma.user.create({ data: { id: fixture.id, associationId: ASSOCIATION_ID,
        name: `Usuário ${name}`, email: fixture.email, role: fixture.role, passwordHash } });
    }
  });

  afterAll(async () => {
    await app.close();
  });

  const login = async (email: string) => {
    const response = await request(server).post("/api/v1/auth/sign-in").send({ email, password: PASSWORD }).expect(201);
    const body = bodyOf(response);
    const token = stringField(body, "token");
    expect(response.headers["set-cookie"]).toBeDefined();
    expect(body).not.toHaveProperty("refreshToken");
    assertNoSensitiveFields(body.user);
    return { token, body };
  };

  const publicLead = (suffix: string) => ({
    name: `Lead E2E ${suffix}`, whatsapp: `(48) 99123-${suffix.padStart(4, "0").slice(-4)}`,
    plate: `E2E${suffix.padStart(4, "0").slice(-4)}`.slice(0, 7), city: "São José", consent: true,
    tracking: { consentVersion: "e2e-v1", utmSource: "Google", utmMedium: "cpc",
      utmCampaign: "e2e-campaign", landingPage: "/solicitar-cotacao", conversionCta: "e2e-form" },
  });

  it("responde aos health checks live e ready com PostgreSQL", async () => {
    await request(server).get("/api/v1/health/live").expect(200).expect(({ body }: Response) => {
      expect(body).toMatchObject({ status: "ok" });
    });
    await request(server).get("/api/v1/health/ready").expect(200).expect(({ body }: Response) => {
      expect(body).toMatchObject({ status: "ready", database: "ok" });
    });
  });

  it("aceita login válido, rejeita inválido e retorna sessão autenticada segura", async () => {
    await request(server).post("/api/v1/auth/sign-in").send({ email: users.manager.email, password: "senha-incorreta" }).expect(401);
    const { token } = await login(users.manager.email);
    const response = await request(server).get("/api/v1/auth/session").set("Authorization", `Bearer ${token}`).expect(200);
    const body = bodyOf(response);
    expect(body).toHaveProperty("user");
    assertNoSensitiveFields(body.user);
  });

  it("aplica autenticação e autorização real por perfil", async () => {
    await request(server).get("/api/v1/leads").expect(401);
    const { token } = await login(users.traffic.email);
    await request(server).get("/api/v1/leads").set("Authorization", `Bearer ${token}`).expect(403);
  });

  it("rejeita consentimento false e honeypot preenchido", async () => {
    await request(server).post("/api/v1/public/leads").send({ ...publicLead("101"), consent: false }).expect(400);
    await request(server).post("/api/v1/public/leads").send({ ...publicLead("102"), website: "bot" }).expect(400);
  });

  it("torna Idempotency-Key idempotente", async () => {
    const payload = publicLead("201");
    const first = bodyOf(await request(server).post("/api/v1/public/leads").set("Idempotency-Key", "e2e-key-201").send(payload).expect(201));
    const second = bodyOf(await request(server).post("/api/v1/public/leads").set("Idempotency-Key", "e2e-key-201").send(payload).expect(201));
    expect(stringField(second, "id")).toBe(stringField(first, "id"));
    expect(await prisma.lead.count({ where: { associationId: ASSOCIATION_ID, idempotencyKey: "e2e-key-201" } })).toBe(1);
  });

  it("deduplica temporalmente telefone e placa normalizados", async () => {
    const payload = publicLead("301");
    const first = bodyOf(await request(server).post("/api/v1/public/leads").send(payload).expect(201));
    const second = bodyOf(await request(server).post("/api/v1/public/leads").send(payload).expect(201));
    expect(stringField(second, "id")).toBe(stringField(first, "id"));
  });

  it("comprova o fluxo vertical completo com persistência e auditoria", async () => {
    const { token } = await login(users.manager.email);
    const headers = { Authorization: `Bearer ${token}` };
    const createdResponse = await request(server).post("/api/v1/public/leads").set("Idempotency-Key", "vertical-flow").send(publicLead("401")).expect(201);
    const created = bodyOf(createdResponse); const leadId = stringField(created, "id");
    assertNoSensitiveFields(created);

    const listed = bodyOf(await request(server).get("/api/v1/leads").query({ search: "Lead E2E 401" }).set(headers).expect(200));
    const items = listed.items; expect(Array.isArray(items)).toBe(true);
    expect(items).toEqual(expect.arrayContaining([expect.objectContaining({ id: leadId })]));

    const assigned = bodyOf(await request(server).patch(`/api/v1/leads/${leadId}/assign`).set(headers).send({ userId: users.sales.id }).expect(200));
    expect(assigned).toMatchObject({ ownerId: users.sales.id });
    await request(server).post(`/api/v1/leads/${leadId}/activities`).set(headers)
      .send({ type: "ligacao", title: "Contato E2E", description: "Atendimento demonstrativo" }).expect(201);
    const activitiesResponse = await request(server).get(`/api/v1/leads/${leadId}/activities`).set(headers).expect(200);
    const activities: unknown = JSON.parse(activitiesResponse.text);
    expect(activities).toEqual(expect.arrayContaining([expect.objectContaining({ title: "Contato E2E" })]));

    const task = bodyOf(await request(server).post("/api/v1/tasks").set(headers)
      .send({ leadId, title: "Retorno E2E", dueAt: "2026-08-10T15:00:00.000Z" }).expect(201));
    const taskId = stringField(task, "id");
    const completed = bodyOf(await request(server).patch(`/api/v1/tasks/${taskId}/complete`).set(headers).expect(200));
    expect(completed).toMatchObject({ status: "concluida" });

    const changed = bodyOf(await request(server).patch(`/api/v1/leads/${leadId}/stage`).set(headers)
      .send({ stage: "adesao_concluida" }).expect(200));
    expect(changed).toMatchObject({ stage: "adesao_concluida" });
    expect(await prisma.leadAssignmentHistory.count({ where: { leadId, toUserId: users.sales.id } })).toBe(1);
    expect(await prisma.leadStageHistory.count({ where: { leadId, toStage: "adesao_concluida" } })).toBe(1);

    const dashboard = bodyOf(await request(server).get("/api/v1/analytics/overview").set(headers).expect(200));
    const metrics = dashboard.metrics;
    expect(isUnknownArray(metrics)).toBe(true);
    if (!isUnknownArray(metrics)) throw new Error("Métricas ausentes.");
    const adhesionMetric = metrics.find((metric: unknown) => isRecord(metric) && metric.key === "adhesions");
    expect(isRecord(adhesionMetric) && typeof adhesionMetric.value === "number").toBe(true);

    const auditResponse = await request(server).get("/api/v1/audit").set(headers).expect(200);
    const audits: unknown = JSON.parse(auditResponse.text);
    expect(audits).toEqual(expect.arrayContaining([
      expect.objectContaining({ action: "lead.assign", resourceId: leadId }),
      expect.objectContaining({ action: "activity.create", resourceId: leadId }),
      expect.objectContaining({ action: "task.complete", resourceId: taskId }),
      expect.objectContaining({ action: "lead.stage_change", resourceId: leadId }),
    ]));
    assertNoSensitiveFields(audits);
  });
});
