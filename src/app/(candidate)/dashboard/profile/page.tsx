"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { User, Upload, GitBranch, Star, CheckCircle, ExternalLink } from "lucide-react";

interface SyncedRepo {
  name: string;
  description: string;
  stars: number;
  url: string;
  language: string;
}

export default function ProfilePage() {
  const [headline, setHeadline] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [githubUser, setGithubUser] = useState("");
  const [syncedRepos, setSyncedRepos] = useState<SyncedRepo[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSyncGitHub() {
    if (!githubUser.trim()) return;
    setSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await fetch(`https://api.github.com/users/${githubUser.trim()}/repos?sort=stars&per_page=3`);
      if (!res.ok) {
        throw new Error("GitHub user not found or rate limited");
      }
      const data = await res.json();
      const repos: SyncedRepo[] = data.map((r: any) => ({
        name: r.name,
        description: r.description || "Open source repository",
        stars: r.stargazers_count || 0,
        url: r.html_url,
        language: r.language || "TypeScript",
      }));
      setSyncedRepos(repos);
      setSyncFeedback(`Successfully imported ${repos.length} top repositories!`);
    } catch (err: any) {
      setSyncFeedback(err.message || "Failed to fetch GitHub repositories");
    } finally {
      setSyncing(false);
    }
  }

  async function save() {
    const res = await fetch("/api/me/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-user-id": "demo-candidate-id" },
      body: JSON.stringify({ headline, location, bio, image: photoPreview }),
    });
    if (res.ok) alert("Profile Saved!");
    else alert("Error: " + (await res.text()));
  }

  return (
    <div className="max-w-[800px] mx-auto p-6 grid gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Candidate Profile</h1>
        <p className="text-xs text-[var(--color-muted)] mt-1">
          Customize your profile photo, headline, and background shown to founders on the leaderboard.
        </p>
      </div>

      {/* Profile Photo / Avatar Upload */}
      <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative w-20 h-20 rounded-full border-2 border-[var(--color-border)] overflow-hidden bg-[var(--color-warm)] flex items-center justify-center flex-shrink-0">
          {photoPreview ? (
            <img src={photoPreview} alt="Profile photo preview" className="w-full h-full object-cover" />
          ) : (
            <User className="w-8 h-8 text-[var(--color-muted)]" />
          )}
        </div>

        <div className="space-y-1.5 flex-1">
          <label className="block text-xs font-bold text-[var(--color-ink)]">
            Profile Photo
          </label>
          <p className="text-xs text-[var(--color-muted)]">
            Upload a clear headshot or avatar (JPG, PNG, WebP up to 5MB).
          </p>
          <label className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-ink)] text-xs font-semibold cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5 text-[var(--color-muted)]" />
            <span>Choose Photo</span>
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* 1-Click GitHub Project Sync */}
      <div className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[var(--color-ink)]" />
            <h3 className="text-xs font-bold text-[var(--color-ink)] uppercase tracking-wider">
              1-Click GitHub Repository Syncer
            </h3>
          </div>
          <span className="mono text-[10px] text-[var(--color-muted)]">Proof of Work</span>
        </div>
        <p className="text-xs text-[var(--color-muted)]">
          Enter your GitHub username to automatically pull in your top starred repositories and tech stack tags.
        </p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={githubUser}
            onChange={(e) => setGithubUser(e.target.value)}
            placeholder="e.g. torvalds, shadcn, or your username"
            className="flex-1 h-9 px-3 text-xs rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] placeholder-[var(--color-muted)] focus:outline-none focus:border-[var(--color-ink)]"
          />
          <button
            type="button"
            onClick={handleSyncGitHub}
            disabled={syncing || !githubUser.trim()}
            className="h-9 px-4 rounded-lg bg-[var(--color-ink)] text-[var(--color-bg)] text-xs font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {syncing ? "Fetching..." : "Sync Repos"}
          </button>
        </div>

        {syncFeedback && (
          <p className="text-[11px] font-mono text-[var(--color-muted)]">{syncFeedback}</p>
        )}

        {/* Display Synced Repos */}
        {syncedRepos.length > 0 && (
          <div className="grid sm:grid-cols-3 gap-2.5 pt-2">
            {syncedRepos.map((repo) => (
              <div key={repo.name} className="p-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-warm)]/50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[var(--color-ink)] truncate">{repo.name}</span>
                  <span className="flex items-center gap-0.5 text-[10px] mono text-[var(--color-muted)]">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    {repo.stars}
                  </span>
                </div>
                <p className="text-[10px] text-[var(--color-muted)] line-clamp-2">{repo.description}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="mono text-[9px] px-1.5 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-ink)]">
                    {repo.language}
                  </span>
                  <a href={repo.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-[var(--color-ink)] hover:underline inline-flex items-center gap-0.5">
                    Code <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Headline (3-80ch)</label>
        <input
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="AI Engineer — 4y RAG & LLMs"
          className="h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border-strong)] bg-[var(--color-surface)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ink)]"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Location</label>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="San Francisco, CA or Remote"
          className="h-10 px-3 rounded-[var(--radius-md)] border border-[var(--color-border-strong)]"
        />
      </div>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Bio (max 800)</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          placeholder="Tell founders and teams what you build, your tech stack, and your key achievements..."
          className="p-3 rounded-[var(--radius-md)] border border-[var(--color-border-strong)]"
        />
      </div>

      <Button onClick={save}>Save Profile</Button>
    </div>
  );
}
