-- FTS GIN per database-optimization/SKILL.md:1 + hybrid-search V2 gate
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS candidate_search_gin ON "CandidateProfile" USING GIN (headline gin_trgm_ops);
CREATE INDEX IF NOT EXISTS candidate_visibility_idx ON "CandidateProfile" (visibility) WHERE visibility='PUBLIC';
CREATE INDEX IF NOT EXISTS boost_active_idx ON "Boost" ("categoryId", status, "startAt") WHERE status='ACTIVE';

