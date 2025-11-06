-- Migration: Git-First Architecture - User Repos and Cache Tables
-- Description: Adds tables for GitHub repo management and metadata caching
-- Date: November 5, 2025
-- Reference: docs/architecture/06_Supabase_Caching_Strategy.md

-- ============================================================================
-- 1. USER_REPOS TABLE
-- ============================================================================
-- Stores user's GitHub repository information and encrypted access tokens

CREATE TABLE IF NOT EXISTS user_repos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  repo_url TEXT NOT NULL,
  repo_owner TEXT NOT NULL,
  repo_name TEXT NOT NULL,
  github_token_encrypted TEXT, -- Encrypted GitHub OAuth token
  default_branch TEXT DEFAULT 'main',
  is_template_forked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on user_repos
ALTER TABLE user_repos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_repos
CREATE POLICY "Users can view own repo info"
  ON user_repos
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own repo info"
  ON user_repos
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own repo info"
  ON user_repos
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own repo info"
  ON user_repos
  FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for user_repos
CREATE INDEX IF NOT EXISTS idx_user_repos_user ON user_repos(user_id);
CREATE INDEX IF NOT EXISTS idx_user_repos_owner ON user_repos(repo_owner);
CREATE INDEX IF NOT EXISTS idx_user_repos_created ON user_repos(created_at DESC);

-- ============================================================================
-- 2. PROJECT_CACHE TABLE
-- ============================================================================
-- Caches project metadata from GitHub for fast dashboard queries

CREATE TABLE IF NOT EXISTS project_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  repo_url TEXT NOT NULL,
  project_slug TEXT NOT NULL,
  title TEXT,
  description TEXT,
  visibility TEXT CHECK (visibility IN ('public', 'gated', 'private')) DEFAULT 'public',
  gated BOOLEAN DEFAULT FALSE,
  safety_code TEXT, -- Reference to required safety acknowledgment
  stream TEXT, -- Primary stream category
  tags TEXT[], -- Array of tags
  status TEXT CHECK (status IN ('draft', 'active', 'archived')) DEFAULT 'draft',
  stream_count INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, project_slug)
);

-- Enable RLS on project_cache
ALTER TABLE project_cache ENABLE ROW LEVEL SECURITY;

-- RLS Policies for project_cache
CREATE POLICY "Users can view own projects"
  ON project_cache
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Public projects are visible to all"
  ON project_cache
  FOR SELECT
  USING (visibility = 'public');

CREATE POLICY "Users can insert own project cache"
  ON project_cache
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own project cache"
  ON project_cache
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own project cache"
  ON project_cache
  FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for project_cache
CREATE INDEX IF NOT EXISTS idx_project_cache_user ON project_cache(user_id);
CREATE INDEX IF NOT EXISTS idx_project_cache_visibility ON project_cache(visibility);
CREATE INDEX IF NOT EXISTS idx_project_cache_gated ON project_cache(gated);
CREATE INDEX IF NOT EXISTS idx_project_cache_slug ON project_cache(project_slug);
CREATE INDEX IF NOT EXISTS idx_project_cache_updated ON project_cache(last_updated DESC);
CREATE INDEX IF NOT EXISTS idx_project_cache_synced ON project_cache(synced_at DESC);

-- ============================================================================
-- 3. STREAM_CACHE TABLE
-- ============================================================================
-- Caches stream metadata from GitHub (nested under projects)

CREATE TABLE IF NOT EXISTS stream_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES project_cache(id) ON DELETE CASCADE NOT NULL,
  stream_slug TEXT NOT NULL,
  title TEXT,
  description TEXT,
  gated BOOLEAN DEFAULT FALSE,
  update_count INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, stream_slug)
);

-- Enable RLS on stream_cache
ALTER TABLE stream_cache ENABLE ROW LEVEL SECURITY;

-- RLS Policies for stream_cache
CREATE POLICY "Streams inherit project visibility"
  ON stream_cache
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM project_cache
      WHERE project_cache.id = stream_cache.project_id
      AND (project_cache.user_id = auth.uid() OR project_cache.visibility = 'public')
    )
  );

CREATE POLICY "Users can insert streams for own projects"
  ON stream_cache
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM project_cache
      WHERE project_cache.id = stream_cache.project_id
      AND project_cache.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update streams in own projects"
  ON stream_cache
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM project_cache
      WHERE project_cache.id = stream_cache.project_id
      AND project_cache.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete streams in own projects"
  ON stream_cache
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM project_cache
      WHERE project_cache.id = stream_cache.project_id
      AND project_cache.user_id = auth.uid()
    )
  );

-- Indexes for stream_cache
CREATE INDEX IF NOT EXISTS idx_stream_cache_project ON stream_cache(project_id);
CREATE INDEX IF NOT EXISTS idx_stream_cache_gated ON stream_cache(gated);
CREATE INDEX IF NOT EXISTS idx_stream_cache_slug ON stream_cache(stream_slug);
CREATE INDEX IF NOT EXISTS idx_stream_cache_updated ON stream_cache(last_updated DESC);
CREATE INDEX IF NOT EXISTS idx_stream_cache_synced ON stream_cache(synced_at DESC);

-- ============================================================================
-- 4. UPDATED_AT TRIGGER FUNCTION
-- ============================================================================
-- Automatically updates the updated_at timestamp when a row is modified

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to user_repos
DROP TRIGGER IF EXISTS update_user_repos_updated_at ON user_repos;
CREATE TRIGGER update_user_repos_updated_at
  BEFORE UPDATE ON user_repos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 5. HELPER FUNCTIONS
-- ============================================================================

-- Function to sync project count to user_repos
CREATE OR REPLACE FUNCTION sync_project_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_repos
  SET updated_at = NOW()
  WHERE user_id = COALESCE(NEW.user_id, OLD.user_id);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update project count
DROP TRIGGER IF EXISTS trigger_sync_project_count ON project_cache;
CREATE TRIGGER trigger_sync_project_count
  AFTER INSERT OR UPDATE OR DELETE ON project_cache
  FOR EACH ROW
  EXECUTE FUNCTION sync_project_count();

-- Function to sync stream count to project_cache
CREATE OR REPLACE FUNCTION sync_stream_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE project_cache
    SET stream_count = (
      SELECT COUNT(*) FROM stream_cache WHERE project_id = OLD.project_id
    )
    WHERE id = OLD.project_id;
    RETURN OLD;
  ELSE
    UPDATE project_cache
    SET stream_count = (
      SELECT COUNT(*) FROM stream_cache WHERE project_id = NEW.project_id
    )
    WHERE id = NEW.project_id;
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update stream count
DROP TRIGGER IF EXISTS trigger_sync_stream_count ON stream_cache;
CREATE TRIGGER trigger_sync_stream_count
  AFTER INSERT OR UPDATE OR DELETE ON stream_cache
  FOR EACH ROW
  EXECUTE FUNCTION sync_stream_count();

-- ============================================================================
-- VERIFICATION QUERIES (Run these to verify the migration)
-- ============================================================================

-- Check that tables exist
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('user_repos', 'project_cache', 'stream_cache');

-- Check RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('user_repos', 'project_cache', 'stream_cache');

-- Check policies exist
-- SELECT tablename, policyname FROM pg_policies WHERE tablename IN ('user_repos', 'project_cache', 'stream_cache');

-- Check indexes exist
-- SELECT tablename, indexname FROM pg_indexes WHERE schemaname = 'public' AND tablename IN ('user_repos', 'project_cache', 'stream_cache');

-- ============================================================================
-- NOTES
-- ============================================================================
--
-- Token Encryption:
-- - github_token_encrypted should be encrypted using Supabase Vault or similar
-- - Never expose tokens to client-side code
-- - Tokens are only decrypted server-side for GitHub API operations
--
-- Cache Sync Strategy:
-- - GitHub webhooks push to /api/cache/sync endpoint
-- - Endpoint updates project_cache and stream_cache
-- - synced_at tracks last sync time for staleness detection
--
-- Performance:
-- - Indexes on user_id, visibility, and timestamps for fast queries
-- - Dashboard queries use cache tables (not GitHub API)
-- - Detail pages can fetch fresh content from GitHub
--
-- Future Enhancements:
-- - Add update_cache table for individual updates
-- - Add cache invalidation logic
-- - Add webhook signature verification
-- ============================================================================
