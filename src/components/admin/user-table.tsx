"use client";

import { useState } from "react";

export interface AdminUserItem {
  id: string;
  email: string;
  name?: string | null;
  role: string;
  createdAt: string;
  candidateProfile?: {
    id: string;
    slug: string;
    headline?: string | null;
    visibility: "PUBLIC" | "PRIVATE" | "HIDDEN";
  } | null;
  employerProfile?: {
    id: string;
    company: string;
    verificationStatus: string;
  } | null;
}

export function UserTable({ initialUsers }: { initialUsers: AdminUserItem[] }) {
  const [users, setUsers] = useState<AdminUserItem[]>(initialUsers);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const toggleSuspension = async (userId: string, currentHidden: boolean) => {
    setLoadingId(userId);
    const newSuspended = !currentHidden;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suspended: newSuspended,
          reason: newSuspended ? "Admin manual suspension" : "Admin manual reinstatement",
        }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => {
            if (u.id === userId && u.candidateProfile) {
              return {
                ...u,
                candidateProfile: {
                  ...u.candidateProfile,
                  visibility: newSuspended ? "HIDDEN" : "PUBLIC",
                },
              };
            }
            return u;
          })
        );
      }
    } catch (err) {
      console.error("Failed to toggle suspension:", err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[var(--color-bg)] border-b border-[var(--color-border)] uppercase tracking-wider text-[var(--color-muted)] font-mono">
            <tr>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Profile Type</th>
              <th className="py-3 px-4">Visibility / Status</th>
              <th className="py-3 px-4">Joined</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[var(--color-muted)]">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const isHidden = user.candidateProfile?.visibility === "HIDDEN";

                return (
                  <tr key={user.id} className="hover:bg-[var(--color-bg)]/50">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[var(--color-ink)]">{user.name || "Unnamed"}</div>
                      <div className="font-mono text-[11px] text-[var(--color-muted)]">{user.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[var(--color-bg)] border border-[var(--color-border)]">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {user.candidateProfile && (
                        <span className="text-xs">Candidate ({user.candidateProfile.slug})</span>
                      )}
                      {user.employerProfile && (
                        <span className="text-xs">Employer ({user.employerProfile.company})</span>
                      )}
                      {!user.candidateProfile && !user.employerProfile && (
                        <span className="text-xs text-[var(--color-muted)]">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {user.candidateProfile && (
                        <span
                          className={`font-mono text-[10px] px-2 py-0.5 rounded ${
                            isHidden
                              ? "bg-[var(--color-error)]/15 text-[var(--color-error)]"
                              : "bg-[var(--color-success)]/15 text-[var(--color-success)]"
                          }`}
                        >
                          {user.candidateProfile.visibility}
                        </span>
                      )}
                      {user.employerProfile && (
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[var(--color-violet)]/15 text-[var(--color-violet)]">
                          {user.employerProfile.verificationStatus}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[var(--color-muted)]">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {user.candidateProfile && (
                        <button
                          disabled={loadingId === user.id}
                          onClick={() => toggleSuspension(user.id, isHidden)}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-opacity disabled:opacity-50 ${
                            isHidden
                              ? "bg-[var(--color-success)] text-white hover:opacity-90"
                              : "bg-[var(--color-error)] text-white hover:opacity-90"
                          }`}
                        >
                          {isHidden ? "Reinstate" : "Suspend"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
