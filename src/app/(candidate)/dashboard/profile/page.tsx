"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");

  async function save() {
    const res = await fetch("/api/me/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-user-id": "demo-candidate-id" },
      body: JSON.stringify({ headline, location, bio }),
    });
    if (res.ok) alert("Saved");
    else alert("Error: " + (await res.text()));
  }

  return (
    <div className="max-w-[800px] mx-auto p-6 grid gap-4">
      <h1 className="text-2xl font-semibold tracking-tighter">Profile</h1>
      <p className="mono text-xs tracking-[0.14em] uppercase text-[var(--color-muted)]">PRD §8 — label above input per taste 4.6</p>
      <div className="grid gap-2">
        <label className="text-sm font-medium">Headline (3-80ch)</label>
        <input value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="AI Engineer — 4y RAG" className="h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-violet)]" />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium">Location</label>
        <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Bangalore" className="h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border-strong)]" />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium">Bio (max 800)</label>
        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="p-3 rounded-[var(--radius-md)] border border-[var(--color-border-strong)]" />
      </div>
      <Button onClick={save}>Save</Button>
    </div>
  );
}
