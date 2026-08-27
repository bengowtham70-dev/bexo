export type Role = "CANDIDATE" | "EMPLOYER" | "ADMIN" | "MODERATOR";

type Perm = { resource: string; action: string };

const ROLE_PERMISSIONS: Record<Role, Perm[]> = {
  CANDIDATE: [
    { resource: "profile", action: "read" },
    { resource: "profile", action: "update" },
    { resource: "profile", action: "create" },
  ],
  EMPLOYER: [
    { resource: "talent", action: "read" },
    { resource: "lists", action: "create" },
    { resource: "lists", action: "read" },
  ],
  MODERATOR: [
    { resource: "reports", action: "read" },
    { resource: "reports", action: "update" },
  ],
  ADMIN: [
    { resource: "*", action: "create" },
    { resource: "*", action: "read" },
    { resource: "*", action: "update" },
    { resource: "*", action: "delete" },
  ],
};

export const hasPermission = (role: Role, resource: string, action: string) =>
  ROLE_PERMISSIONS[role]?.some((p) => (p.resource === resource || p.resource === "*") && p.action === action) ??
  false;

export const can = (user: { role: Role }, perm: string) => {
  const parts = perm.split(":");
  const action = parts.pop()!;
  const resource = parts.join(":") || parts[0];
  return hasPermission(user.role, resource, action);
};
