import { createHash, randomBytes } from "crypto";

const FREE_PROVIDERS = new Set([
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "aol.com",
  "protonmail.com",
  "icloud.com",
  "yahoo.co.in",
  "outlook.co.in",
]);

export function isFreeProvider(emailOrDomain: string) {
  const domain = emailOrDomain.includes("@") ? emailOrDomain.split("@")[1] : emailOrDomain;
  return FREE_PROVIDERS.has(domain.toLowerCase());
}

export function normalizeDomain(host: string) {
  try {
    const url = host.startsWith("http") ? new URL(host) : new URL(`https://${host}`);
    let h = url.hostname.toLowerCase().replace(/^www\./, "");
    return h;
  } catch {
    return host.toLowerCase().replace(/^www\./, "");
  }
}

export function domainMatches(email: string, website: string) {
  const emailDomain = email.split("@")[1]?.toLowerCase() || "";
  const siteDomain = normalizeDomain(website);
  return emailDomain === siteDomain || emailDomain.endsWith(`.${siteDomain}`) || siteDomain.endsWith(`.${emailDomain}`);
}

export function createToken() {
  const raw = randomBytes(32).toString("hex");
  const hash = createHash("sha256").update(raw).digest("hex");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return { raw, hash, expiresAt };
}

export function hashToken(raw: string) {
  return createHash("sha256").update(raw).digest("hex");
}
