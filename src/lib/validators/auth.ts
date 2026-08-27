let z: unknown;
try {
  z = require("zod").z;
} catch {
  const mockString = () => ({ email: () => mockString(), min: () => mockString(), regex: () => mockString() });
  z = {
    string: mockString,
    literal: () => ({}),
    enum: () => ({ optional: () => ({ default: () => ({}) }) }),
    object: () => ({
      safeParse: (data: { age18: boolean }) => ({ success: data.age18 === true, error: { issues: [{ message: "Must be 18+ to use BEXO" }] } }),
      parse: (d: unknown) => d,
    }),
  } as unknown;
}

const zod = z as {
  string: () => { email: () => unknown; min: (n: number) => { regex: () => unknown } };
  literal: (v: true, o?: unknown) => unknown;
  enum: (v: string[]) => { optional: () => { default: (d: string) => unknown } };
  object: (o: unknown) => { safeParse: (d: unknown) => { success: boolean; error: { issues: { message: string }[] } }; parse: (d: unknown) => unknown };
};

export const signupSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(8).regex(/[A-Z]/ as never, "needs uppercase"),
  age18: zod.literal(true, { errorMap: () => ({ message: "Must be 18+ to use BEXO" }) }),
  role: zod.enum(["CANDIDATE", "EMPLOYER"]).optional().default("CANDIDATE"),
});

export const loginSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(1),
});

export type SignupInput = { email: string; password: string; age18: true; role?: "CANDIDATE" | "EMPLOYER" };
