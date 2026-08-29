import { prisma } from "@/lib/db";
import { ReportTable, type ReportItem } from "@/components/admin/report-table";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const rawReports = await prisma.report.findMany({
    include: {
      reporter: {
        select: { email: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const reports: ReportItem[] = rawReports.map((r) => ({
    id: r.id,
    reporterId: r.reporterId,
    targetType: r.targetType as any,
    targetId: r.targetId,
    reason: r.reason,
    details: r.details,
    status: r.status as any,
    resolutionNotes: r.resolutionNotes,
    createdAt: r.createdAt.toISOString(),
    reporter: r.reporter ? { email: r.reporter.email, name: r.reporter.name } : undefined,
  }));

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-ink)] p-8">
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
          <div>
            <span className="mono text-xs tracking-widest uppercase text-[var(--color-muted)] font-semibold">
              Admin Reports Moderation Center
            </span>
            <h1 className="text-2xl font-bold tracking-tight mt-1">Trust & Safety Queue</h1>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/users"
              className="px-3 py-1.5 rounded border border-[var(--color-border)] text-xs font-mono hover:bg-[var(--color-surface)]"
            >
              User Management →
            </Link>
          </div>
        </div>

        <ReportTable initialReports={reports} />
      </div>
    </div>
  );
}
