import type { User } from "@prisma/client";
import { presentAuthUser } from "./auth.presenter";

describe("presentAuthUser", () => {
  it("não expõe hash da senha nem tokens", () => {
    const date = new Date("2026-08-05T12:00:00.000Z");
    const user: User = { id: "user-1", associationId: "association-1", name: "Gestora", email: "gestora@example.test",
      passwordHash: "argon-secret", role: "gestor", status: "ativo", lastAccessAt: date,
      createdAt: date, updatedAt: date, version: 1 };
    const result = presentAuthUser(user);
    expect(result).toMatchObject({ id: "user-1", role: "gestor" });
    expect(result).not.toHaveProperty("passwordHash");
    expect(result).not.toHaveProperty("token");
  });
});
