import type { User } from "@prisma/client";
import { ROLE_PERMISSIONS } from "../rbac/rbac";

export function presentAuthUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    permissions: ROLE_PERMISSIONS[user.role],
    status: user.status,
    ...(user.lastAccessAt ? { lastAccessAt: user.lastAccessAt.toISOString() } : {}),
  };
}
