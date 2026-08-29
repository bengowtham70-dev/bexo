import { z } from "zod";

export const LinkTypeEnum = z.enum(["GITHUB", "LINKEDIN", "PORTFOLIO", "CUSTOM"]);

export const linkSchema = z.object({
  type: LinkTypeEnum,
  url: z.string().url({ message: "Invalid URL" }),
  displayName: z.string().max(100).optional(),
});

export const linkDeleteSchema = z.object({
  id: z.string().cuid(),
});

export function normalizeUrl(url: string): string {
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
}
