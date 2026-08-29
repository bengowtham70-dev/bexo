"use client";

import { useState } from "react";

export interface ReportItem {
  id: string;
  reporterId: string;
  targetType: "CANDIDATE" | "EMPLOYER" | "MESSAGE";
  targetId: string;
  reason: string;
  details?: string | null;
  status: "PENDING" | "RESOLVED" | "DISMISSED";
  resolutionNotes?: string | null;
  createdAt: string;
  reporter?: {
    email: string;
    name?: string | null;
  };
}

export function ReportTable({ initialReports }: { initialReports: ReportItem[] }) {
  const [reports, setReports] = useState<ReportItem[]>(initialReports);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleResolve = async (
    id: string,
    status: "RESOLVED" | "DISMISSED",
    actionTaken: "SUSPEND_USER" | "HIDE_PROFILE" | "NONE"
  ) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          actionTaken,
          resolutionNotes: `Action ${actionTaken} taken by admin`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setReports((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: data.report.status } : r))
        );
      }
    } catch (err) {
      console.error("Failed to update report:", err);
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
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Target ID</th>
              <th className="py-3 px-4">Reason</th>
              <th className="py-3 px-4">Reporter</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {reports.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[var(--color-muted)]">
                  No moderation reports in queue.
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id} className="hover:bg-[var(--color-bg)]/50">
                  <td className="py-3 px-4 font-mono text-[var(--color-muted)]">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 font-semibold">{report.targetType}</td>
                  <td className="py-3 px-4 font-mono text-[var(--color-muted)] truncate max-w-[120px]">
                    {report.targetId}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-[var(--color-error)]/10 text-[var(--color-error)] font-medium">
                      {report.reason}
                    </span>
                    {report.details && (
                      <p className="text-[11px] text-[var(--color-muted)] mt-1 max-w-[200px] truncate">
                        {report.details}
                      </p>
                    )}
                  </td>
                  <td className="py-3 px-4 text-[var(--color-muted)]">
                    {report.reporter?.email || report.reporterId}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] ${
                        report.status === "PENDING"
                          ? "bg-[var(--color-warning)]/15 text-[var(--color-warning)]"
                          : report.status === "RESOLVED"
                          ? "bg-[var(--color-success)]/15 text-[var(--color-success)]"
                          : "bg-[var(--color-muted)]/15 text-[var(--color-muted)]"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    {report.status === "PENDING" && (
                      <>
                        <button
                          disabled={loadingId === report.id}
                          onClick={() => handleResolve(report.id, "RESOLVED", "SUSPEND_USER")}
                          className="px-2 py-1 rounded bg-[var(--color-error)] text-white text-[11px] font-semibold hover:opacity-90 disabled:opacity-50"
                        >
                          Suspend User
                        </button>
                        <button
                          disabled={loadingId === report.id}
                          onClick={() => handleResolve(report.id, "RESOLVED", "HIDE_PROFILE")}
                          className="px-2 py-1 rounded bg-[var(--color-warning)] text-black text-[11px] font-semibold hover:opacity-90 disabled:opacity-50"
                        >
                          Hide Profile
                        </button>
                        <button
                          disabled={loadingId === report.id}
                          onClick={() => handleResolve(report.id, "DISMISSED", "NONE")}
                          className="px-2 py-1 rounded border border-[var(--color-border)] text-[var(--color-muted)] text-[11px] hover:bg-[var(--color-bg)] disabled:opacity-50"
                        >
                          Dismiss
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
