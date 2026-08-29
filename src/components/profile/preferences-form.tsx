"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function PreferencesForm() {
  const [availability, setAvailability] = useState("IMMEDIATELY");
  const [jobStatus, setJobStatus] = useState("ACTIVELY_LOOKING");

  async function save() {
    const res = await fetch("/api/me/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-user-id": "demo-candidate-id" },
      body: JSON.stringify({ availability, jobStatus }),
    });
    alert(res.ok ? "Saved" : "Error");
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="grid gap-2">
        <label className="text-sm font-medium">Availability</label>
        <select value={availability} onChange={(e) => setAvailability(e.target.value)} className="h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)]">
          <option value="IMMEDIATELY">Immediately</option>
          <option value="TWO_WEEKS">2 weeks</option>
          <option value="THIRTY_DAYS">30 days</option>
          <option value="SIXTY_PLUS">60+ days</option>
        </select>
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium">Job Status</label>
        <select value={jobStatus} onChange={(e) => setJobStatus(e.target.value)} className="h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border-strong)]">
          <option value="ACTIVELY_LOOKING">Actively looking</option>
          <option value="OPEN">Open to opportunities</option>
          <option value="NOT_LOOKING">Not looking</option>
        </select>
      </div>
      <Button onClick={save}>Save Preferences</Button>
    </div>
  );
}
