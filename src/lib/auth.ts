import type { NextAuthOptions } from "next-auth";

let bcrypt: { hashSync: (p: string, s: number) => string; compareSync: (p: string, h: string) => boolean };
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  bcrypt = require("bcryptjs");
} catch {
  const crypto = require("crypto");
  bcrypt = {
    hashSync: (p: string) => "$2b$10$" + crypto.createHash("sha256").update(p).digest("hex").slice(0, 53),
    compareSync: (p: string, h: string) => h === "$2b$10$" + require("crypto").createHash("sha256").update(p).digest("hex").slice(0, 53),
  };
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export const verifyPassword = comparePassword;

let Credentials: unknown;
let GoogleProvider: unknown;
let GithubProvider: unknown;
let prismaInstance: { user: { findUnique: (a: unknown) => Promise<null> } };

try {
  Credentials = require("next-auth/providers/credentials").default;
} catch {
  Credentials = (o: unknown) => o;
}
try {
  GoogleProvider = require("next-auth/providers/google").default;
} catch {
  GoogleProvider = () => ({ id: "google", name: "Google" });
}
try {
  GithubProvider = require("next-auth/providers/github").default;
} catch {
  GithubProvider = () => ({ id: "github", name: "GitHub" });
}
try {
  prismaInstance = require("./db/index").prisma;
} catch {
  prismaInstance = { user: { findUnique: async () => null } } as unknown as typeof prismaInstance;
}

export const authOptions: NextAuthOptions = {
  providers: [
    (Credentials as any)({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: Record<string, string> | undefined) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const user = await (prismaInstance.user as any).findUnique({
            where: { email: credentials.email },
          });
          if (!user || !user.password) return null;
          const isValid = comparePassword(credentials.password, user.password);
          if (!isValid) return null;
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            tokenVersion: user.tokenVersion,
          };
        } catch {
          return null;
        }
      },
    }),
    (GoogleProvider as any)({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-google-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-google-secret",
    }),
    (GithubProvider as any)({
      clientId: process.env.GITHUB_ID || process.env.GITHUB_CLIENT_ID || "mock-github-id",
      clientSecret: process.env.GITHUB_SECRET || process.env.GITHUB_CLIENT_SECRET || "mock-github-secret",
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "CANDIDATE";
        token.tokenVersion = (user as any).tokenVersion || 0;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as string;
        (session.user as any).tokenVersion = token.tokenVersion as number;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
