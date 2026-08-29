export function canonicalFor(slug: string) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://bexo.com";
  return `${base}/p/${slug}`;
}
export function ogFor(profile: any) {
  return { title: profile.headline || "BEXO Profile", description: profile.bio?.slice(0, 160) || "", url: canonicalFor(profile.slug) };
}
