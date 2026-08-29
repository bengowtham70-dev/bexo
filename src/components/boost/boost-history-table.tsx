import React from "react";

export interface BoostItem {
  id: string;
  categoryId: string;
  amount: number;
  currency: string;
  startAt: string;
  endAt: string;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED" | "DRAFT";
  hoursRemaining: number;
}

export function BoostHistoryTable({ boosts }: { boosts: BoostItem[] }) {
  if (boosts.length === 0) {
    return (
      <div className="border border-dashed border-[var(--color-border)] rounded-md p-6 text-center text-xs text-[var(--color-muted)]">
        No boost history found. Select a category above to boost your visibility.
      </div>
    );
  }

  return (
    <div className="border border-[var(--color-border)] rounded-md overflow-hidden text-xs">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[var(--color-surface-hover)] border-b border-[var(--color-border)] font-medium">
          <tr>
            <th className="p-3">Category</th>
            <th className="p-3">Status</th>
            <th className="p-3">Remaining</th>
            <th className="p-3">Price</th>
            <th className="p-3">Activated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {boosts.map((b) => (
            <tr key={b.id}>
              <td className="p-3 uppercase font-mono font-medium">{b.categoryId}</td>
              <td className="p-3">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                    b.status === "ACTIVE"
                      ? "bg-[var(--color-lime)] text-[var(--color-ink)] font-bold"
                      : "bg-[var(--color-surface-hover)] text-[var(--color-muted)]"
                  }`}
                >
                  {b.status}
                </span>
              </td>
              <td className="p-3 font-mono">{b.status === "ACTIVE" ? `${b.hoursRemaining}h left` : "—"}</td>
              <td className="p-3 font-mono">${(b.amount / 100).toFixed(2)}</td>
              <td className="p-3 text-[var(--color-muted)]">{new Date(b.startAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
