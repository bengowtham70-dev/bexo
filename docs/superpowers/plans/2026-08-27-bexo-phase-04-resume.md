# Phase 04 â€” Resume Intelligence & External Links Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** PDF/DOCX upload â†’ LLM structured extraction (human-in-loop, no fabrication) + LinkedIn/GitHub/portfolio links per PRD Â§9,10.

**Architecture:** S3 presigned upload + `pdf`+`docx` text extraction + LLM JSON schema (Zod) + review UI + OAuth link for GitHub.

**Tech Stack:** `pdf`, `docx`, `llm-integration`, `prompt-engineering-patterns`, `rag-implementation`, `api-integrator`, `supabase` storage, `aws` S3

## Global Constraints
- Support PDF/DOCX, store original securely, extracted draft requires candidate review, AI must not invent employers/dates/degrees

---

### Task 01: Resume Upload (S3 Signed URLs)

**Files:**
- Create: `src/lib/storage.ts`, `src/app/api/me/resume/route.ts`, `src/app/(candidate)/dashboard/import/page.tsx`
- Test: `tests/phase04/upload.test.ts`

**Interfaces:**
- Produces: `POST /api/me/resume` â†’ `{key, url}` presigned

- [ ] **Step 1: Test**
```ts
test("upload stores resume", async () => {
  const r = await fetch("/api/me/resume",{method:"POST", headers:{cookie:candidateCookie}, body: fdWithPdf()});
  expect(r.status).toBe(201);
  expect((await r.json()).storageKey).toContain("resumes/");
});
```
- [ ] **Step 2: Fail** 404
- [ ] **Step 3: Implement** `storage.ts` presigned PUT (S3/R2) using `aws/SKILL.md:1 (.claude + internet aws-agentic-ai)` + `supabase` storage fallback, validate PDF/DOCX mime + 5MB limit, store `Resume{storageKey, originalName}` â€” if `aws` missing, downloaded to `internet-skills/` already, else use local
- [ ] **Step 4: Pass** PASS + file in bucket
- [ ] **Step 5: Commit** `git commit -m "feat: resume upload Â§9"`

### Task 02: AI Extraction + Review

**Files:**
- Create: `src/lib/resume-parse.ts`, `src/app/api/me/resume/parse/route.ts`, `src/components/profile/review-draft.tsx`
- Test: `tests/phase04/parse.test.ts`

- [ ] **Step 1: Test**
```ts
test("parse returns structured draft without fabrication", async () => {
  const r = await fetch("/api/me/resume/parse",{method:"POST", headers:{cookie:candidateCookie}, body:JSON.stringify({resumeId:"1"})});
  const j = await r.json();
  expect(j.draft).toHaveProperty("companies");
  expect(j.draft.achievements).not.toContain(" invented ");
});
```
- [ ] **Step 2: Fail** 404
- [ ] **Step 3: Implement** `pdf/SKILL.md:1` `PdfReader extract_text` + `docx` unpack â†’ text â†’ `llm-integration/SKILL.md:1` with `prompt-engineering-patterns` strict JSON schema: `{name, headline, summary, companies:{title,dates,desc}[], skills[], projects[], education[]}` + guard "do not invent" + UI shows diff editable before save
- [ ] **Step 4: Pass** PASS + review UI editable
- [ ] **Step 5: Commit** `git commit -m "feat: resume AI Â§9"`

### Task 03: External Links (LinkedIn/GitHub/Portfolio)

**Files:**
- Create: `src/app/api/me/links/route.ts`, `src/lib/github.ts`
- Test: `tests/phase04/links.test.ts`

- [ ] **Step 1: Test**
```ts
test("add github link via OAuth", async () => {
  const r = await fetch("/api/me/links",{method:"POST", headers:{cookie:candidateCookie}, body:JSON.stringify({type:"GITHUB", url:"https://github.com/r"})});
  expect(r.status).toBe(201);
});
```
- [ ] **Step 2: Fail** 404
- [ ] **Step 3: Implement** `api-integrator/SKILL.md:1` GitHub OAuth API (no scraping per Â§10), LinkedIn URL add, portfolio custom URLs (Behance/Dribbble etc.) + `ExternalLink` table
- [ ] **Step 4: Pass** PASS
- [ ] **Step 5: Commit** `git commit -m "feat: external links Â§10"`

Skills: `pdf`, `docx`, `llm-integration` local; `aws` local + internet `api-integrator` â€” all present, no new download needed for this phase.

