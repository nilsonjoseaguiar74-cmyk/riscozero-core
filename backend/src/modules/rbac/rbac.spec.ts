import { ALL_PERMISSIONS, ROLE_PERMISSIONS } from "./rbac";

describe("RBAC", () => {
  it("concede todas as permissões somente ao administrador", () => {
    expect(ROLE_PERMISSIONS.administrador).toEqual(ALL_PERMISSIONS);
    expect(ROLE_PERMISSIONS.gestor).not.toContain("users.manage");
    expect(ROLE_PERMISSIONS.gestor).toContain("settings.manage");
    expect(ROLE_PERMISSIONS.comercial).not.toContain("audit.view");
    expect(ROLE_PERMISSIONS.comercial).not.toContain("settings.manage");
  });

  it("mantém os acessos mínimos de cada perfil do protótipo", () => {
    expect(ROLE_PERMISSIONS.comercial).toEqual(
      expect.arrayContaining(["dashboard.view", "crm.view", "crm.edit"]),
    );
    expect(ROLE_PERMISSIONS.gestor_trafego).toEqual(
      expect.arrayContaining(["traffic.view", "traffic.manage"]),
    );
    expect(ROLE_PERMISSIONS.desenvolvedor).toEqual(
      expect.arrayContaining(["developer.access", "integrations.view"]),
    );
  });
});
