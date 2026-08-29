let S3Client: any, PutObjectCommand: any, GetObjectCommand: any, getSignedUrl: any;
try {
  const s3 = require("@aws-sdk/client-s3");
  S3Client = s3.S3Client;
  PutObjectCommand = s3.PutObjectCommand;
  GetObjectCommand = s3.GetObjectCommand;
  getSignedUrl = require("@aws-sdk/s3-request-presigner").getSignedUrl;
} catch {
  S3Client = class MockS3 {};
  PutObjectCommand = class MockPut {};
  GetObjectCommand = class MockGet {};
  getSignedUrl = async () => "mock://signed-url";
}

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_MIMES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export function validateResumeFile(file: File): { ok: true } | { ok: false; error: string; status: number } {
  if (!file) return { ok: false, error: "No file provided", status: 400 };
  if (file.size > MAX_SIZE) return { ok: false, error: "File too large (max 5MB)", status: 413 };
  if (!ALLOWED_MIMES.includes(file.type)) return { ok: false, error: "Invalid mime: only PDF and DOCX allowed", status: 415 };
  return { ok: true };
}

function getS3Client(): any | null {
  const region = process.env.AWS_REGION || "us-east-1";
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const endpoint = process.env.AWS_S3_ENDPOINT || undefined;
  if (!accessKeyId || !secretAccessKey) return null;
  return new S3Client({
    region,
    endpoint,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: !!endpoint,
  });
}

function sanitizeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 80);
}

export async function createPresignedPut(
  userId: string,
  originalName: string,
  mimeType: string
): Promise<{ url: string; key: string }> {
  const bucket = process.env.AWS_S3_BUCKET || "bexo-resumes";
  const cuid = Math.random().toString(36).slice(2, 10);
  const key = `resumes/${userId}/${cuid}-${sanitizeName(originalName)}`;
  const client = getS3Client();
  if (client) {
    const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: mimeType });
    const url = await getSignedUrl(client, command, { expiresIn: 60 });
    return { url, key };
  }
  // Fallback: return mock URL when no AWS creds (dev/test) — still stores key for DB
  return { url: `mock://s3/${bucket}/${key}`, key };
}

export async function getObjectBuffer(storageKey: string): Promise<Buffer | null> {
  const client = getS3Client();
  const bucket = process.env.AWS_S3_BUCKET || "bexo-resumes";
  if (!client) return null;
  try {
    const cmd = new GetObjectCommand({ Bucket: bucket, Key: storageKey });
    const res = await client.send(cmd);
    const bytes = await res.Body?.transformToByteArray();
    return bytes ? Buffer.from(bytes) : null;
  } catch {
    return null;
  }
}

// In-memory store for test/dev when S3 not available — key -> buffer
const memoryStore = new Map<string, Buffer>();
export function putMemoryBuffer(key: string, buf: Buffer) {
  memoryStore.set(key, buf);
}
export function getMemoryBuffer(key: string): Buffer | undefined {
  return memoryStore.get(key);
}
