import { prisma } from "@/lib/db";
import { UserTable, type AdminUserItem } from "@/components/admin/user-table";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const rawUsers = await prisma.user.findMany({
    include: {
      candidateProfile: {
        select: {
          id: true,
          slug: true,
          headline: true,
          visibility: true,
        },
      },
      employerProfile: {
        select: {
          id: true,
          company: true,
          verificationStatus: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const users: AdminUserItem[] = rawUsers.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    createdAt: u.createdAt.toISOString(),
    candidateProfile: u.candidateProfile
      ? {
          id: u.candidateProfile.id,
          slug: u.candidateProfile.slug,
          headline: u.candidateProfile.headline,
          visibility: u.candidateProfile.visibility as any,
        }
      : null,
    employerProfile: u.employerProfile
      ? {
          id: u.employerProfile.id,
          company: u.employerProfile.company,
          verificationStatus: u.employerProfile.verificationStatus,
        }
      : null,
  }));

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)] p-8">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
          <div>
            <span className="mono text-xs tracking-widest uppercase text-[var(--color-muted)] font-semibold">
              Admin User Management Dashboard
            </span>
            <h1 className="text-2xl font-bold tracking-tight mt-1">Platform Users & Roles</h1>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/reports"
              className="px-3 py-1.5 rounded border border-[var(--color-border)] text-xs font-mono hover:bg-[var(--color-surface)]"
            >
              ← Reports Moderation Queue
            </Link>
          </div>
        </div>

        <UserTable initialUsers={users} />
      </div>
    </div>
  );
}
