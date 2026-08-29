export function verifyGithubUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.hostname === "github.com" && u.pathname.split("/").filter(Boolean).length >= 1;
  } catch {
    return false;
  }
}

export async function fetchGithubMeta(url: string): Promise<{ repoCount?: number }> {
  if (!verifyGithubUrl(url)) return {};
  const token = process.env.GITHUB_TOKEN || process.env.GITHUB_ID || "";
  const username = new URL(url).pathname.split("/").filter(Boolean)[0];
  if (!username) return {};
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      next: { revalidate: 3600 },
    } as any);
    if (!res.ok) return {};
    const data = await res.json();
    return { repoCount: data.public_repos };
  } catch {
    return {};
  }
}
