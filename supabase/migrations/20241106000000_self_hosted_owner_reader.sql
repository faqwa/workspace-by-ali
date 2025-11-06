-- Migration: Self-Hosted Owner/Reader Architecture
-- Description: Adds owner/reader roles, workspace settings, and reader acknowledgments
-- Date: November 6, 2025
-- Reference: docs/architecture - Self-Hosted Model

-- ============================================================================
-- 1. WORKSPACE_SETTINGS TABLE
-- ============================================================================
-- Stores workspace-level configuration (one per deployment)

CREATE TABLE IF NOT EXISTS workspace_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  workspace_name TEXT,
  workspace_description TEXT,
  default_license TEXT DEFAULT 'CC-BY-NC-SA-4.0', -- Default license for projects
  allow_readers BOOLEAN DEFAULT TRUE, -- Allow reader signups
  allow_suggestions BOOLEAN DEFAULT TRUE, -- Allow reader comments/suggestions
  auto_approve_experts BOOLEAN DEFAULT FALSE, -- Auto-approve expert suggestions
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on workspace_settings
ALTER TABLE workspace_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workspace_settings
CREATE POLICY "Owner can view workspace settings"
  ON workspace_settings
  FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Owner can insert workspace settings"
  ON workspace_settings
  FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owner can update workspace settings"
  ON workspace_settings
  FOR UPDATE
  USING (auth.uid() = owner_id);

-- Indexes for workspace_settings
CREATE INDEX IF NOT EXISTS idx_workspace_settings_owner ON workspace_settings(owner_id);

-- ============================================================================
-- 2. USER_ROLES TABLE
-- ============================================================================
-- Tracks user roles: owner (workspace deployer) or reader (guest account)

CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  workspace_owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('owner', 'reader')) NOT NULL,
  is_expert BOOLEAN DEFAULT FALSE, -- Flag expert readers
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, workspace_owner_id)
);

-- Enable RLS on user_roles
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles"
  ON user_roles
  FOR SELECT
  USING (auth.uid() = user_id OR auth.uid() = workspace_owner_id);

CREATE POLICY "Owners can manage user roles"
  ON user_roles
  FOR ALL
  USING (auth.uid() = workspace_owner_id);

-- Indexes for user_roles
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_workspace ON user_roles(workspace_owner_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- ============================================================================
-- 3. READER_ACKNOWLEDGMENTS TABLE
-- ============================================================================
-- Tracks safety protocol and license acknowledgments by readers

CREATE TABLE IF NOT EXISTS reader_acknowledgments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  workspace_owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  acknowledgment_type TEXT CHECK (acknowledgment_type IN ('safety', 'license', 'terms')) NOT NULL,
  acknowledgment_code TEXT NOT NULL, -- e.g., 'safety-v1.1', 'CC-BY-NC-SA-4.0'
  project_slug TEXT, -- Optional: project-specific acknowledgment
  subproject_slug TEXT, -- Optional: subproject-specific acknowledgment
  acknowledged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, workspace_owner_id, acknowledgment_type, acknowledgment_code, project_slug, subproject_slug)
);

-- Enable RLS on reader_acknowledgments
ALTER TABLE reader_acknowledgments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reader_acknowledgments
CREATE POLICY "Users can view own acknowledgments"
  ON reader_acknowledgments
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own acknowledgments"
  ON reader_acknowledgments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can view all acknowledgments in their workspace"
  ON reader_acknowledgments
  FOR SELECT
  USING (auth.uid() = workspace_owner_id);

-- Indexes for reader_acknowledgments
CREATE INDEX IF NOT EXISTS idx_reader_acks_user ON reader_acknowledgments(user_id);
CREATE INDEX IF NOT EXISTS idx_reader_acks_workspace ON reader_acknowledgments(workspace_owner_id);
CREATE INDEX IF NOT EXISTS idx_reader_acks_type ON reader_acknowledgments(acknowledgment_type);
CREATE INDEX IF NOT EXISTS idx_reader_acks_code ON reader_acknowledgments(acknowledgment_code);
CREATE INDEX IF NOT EXISTS idx_reader_acks_project ON reader_acknowledgments(project_slug);

-- ============================================================================
-- 4. READER_SUGGESTIONS TABLE
-- ============================================================================
-- Stores reader comments/suggestions (alternative to Git storage)

CREATE TABLE IF NOT EXISTS reader_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  workspace_owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_slug TEXT NOT NULL,
  subproject_slug TEXT,
  target_path TEXT, -- Path to the content being commented on
  content TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  is_expert BOOLEAN DEFAULT FALSE, -- Flagged if from expert user
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on reader_suggestions
ALTER TABLE reader_suggestions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for reader_suggestions
CREATE POLICY "Users can view own suggestions"
  ON reader_suggestions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Approved suggestions are public"
  ON reader_suggestions
  FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Users can insert suggestions"
  ON reader_suggestions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners can manage all suggestions"
  ON reader_suggestions
  FOR ALL
  USING (auth.uid() = workspace_owner_id);

-- Indexes for reader_suggestions
CREATE INDEX IF NOT EXISTS idx_reader_suggestions_user ON reader_suggestions(user_id);
CREATE INDEX IF NOT EXISTS idx_reader_suggestions_workspace ON reader_suggestions(workspace_owner_id);
CREATE INDEX IF NOT EXISTS idx_reader_suggestions_project ON reader_suggestions(project_slug);
CREATE INDEX IF NOT EXISTS idx_reader_suggestions_status ON reader_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_reader_suggestions_created ON reader_suggestions(created_at DESC);

-- ============================================================================
-- 5. UPDATE RLS POLICIES FOR EXISTING TABLES
-- ============================================================================
-- Allow readers to view public/gated projects after acknowledgment

-- Update project_cache policies to allow readers
DROP POLICY IF EXISTS "Public projects are visible to all" ON project_cache;
CREATE POLICY "Public projects are visible to authenticated users"
  ON project_cache
  FOR SELECT
  USING (
    visibility = 'public'
    AND auth.uid() IS NOT NULL
  );

-- Add policy for gated projects (readers who have acknowledged)
CREATE POLICY "Gated projects visible to readers who acknowledged"
  ON project_cache
  FOR SELECT
  USING (
    visibility = 'gated'
    AND EXISTS (
      SELECT 1 FROM reader_acknowledgments
      WHERE reader_acknowledgments.user_id = auth.uid()
      AND reader_acknowledgments.workspace_owner_id = project_cache.user_id
      AND reader_acknowledgments.project_slug = project_cache.project_slug
      AND reader_acknowledgments.acknowledgment_type = 'safety'
    )
  );

-- Update stream_cache policies for readers (now called subprojects, but keeping table name for now)
DROP POLICY IF EXISTS "Streams inherit project visibility" ON stream_cache;
CREATE POLICY "Subprojects inherit project visibility for owners"
  ON stream_cache
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM project_cache
      WHERE project_cache.id = stream_cache.project_id
      AND project_cache.user_id = auth.uid()
    )
  );

CREATE POLICY "Subprojects visible to readers with project access"
  ON stream_cache
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM project_cache
      WHERE project_cache.id = stream_cache.project_id
      AND (
        project_cache.visibility = 'public'
        OR (
          project_cache.visibility = 'gated'
          AND EXISTS (
            SELECT 1 FROM reader_acknowledgments
            WHERE reader_acknowledgments.user_id = auth.uid()
            AND reader_acknowledgments.workspace_owner_id = project_cache.user_id
            AND reader_acknowledgments.project_slug = project_cache.project_slug
          )
        )
      )
    )
  );

-- ============================================================================
-- 6. HELPER FUNCTIONS
-- ============================================================================

-- Function to check if user is workspace owner
CREATE OR REPLACE FUNCTION is_workspace_owner(check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM workspace_settings
    WHERE owner_id = check_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has acknowledged safety protocol
CREATE OR REPLACE FUNCTION has_acknowledged_safety(
  check_user_id UUID,
  check_workspace_owner_id UUID,
  check_project_slug TEXT,
  check_safety_code TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM reader_acknowledgments
    WHERE user_id = check_user_id
    AND workspace_owner_id = check_workspace_owner_id
    AND acknowledgment_type = 'safety'
    AND acknowledgment_code = check_safety_code
    AND (project_slug IS NULL OR project_slug = check_project_slug)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has acknowledged license
CREATE OR REPLACE FUNCTION has_acknowledged_license(
  check_user_id UUID,
  check_workspace_owner_id UUID,
  check_project_slug TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM reader_acknowledgments
    WHERE user_id = check_user_id
    AND workspace_owner_id = check_workspace_owner_id
    AND acknowledgment_type = 'license'
    AND (project_slug IS NULL OR project_slug = check_project_slug)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to auto-assign first user as owner
CREATE OR REPLACE FUNCTION auto_assign_owner()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if this is the first user in workspace_settings
  IF NOT EXISTS (SELECT 1 FROM workspace_settings) THEN
    -- Create workspace settings with this user as owner
    INSERT INTO workspace_settings (owner_id, workspace_name)
    VALUES (NEW.id, 'My Workspace');

    -- Assign owner role
    INSERT INTO user_roles (user_id, workspace_owner_id, role)
    VALUES (NEW.id, NEW.id, 'owner');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-assign first user as owner
DROP TRIGGER IF EXISTS trigger_auto_assign_owner ON auth.users;
CREATE TRIGGER trigger_auto_assign_owner
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_assign_owner();

-- Generic function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update trigger for workspace_settings
DROP TRIGGER IF EXISTS update_workspace_settings_updated_at ON workspace_settings;
CREATE TRIGGER update_workspace_settings_updated_at
  BEFORE UPDATE ON workspace_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VERIFICATION QUERIES (Run these to verify the migration)
-- ============================================================================

-- Check that tables exist
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
-- AND table_name IN ('workspace_settings', 'user_roles', 'reader_acknowledgments', 'reader_suggestions');

-- Check RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables
-- WHERE schemaname = 'public'
-- AND tablename IN ('workspace_settings', 'user_roles', 'reader_acknowledgments', 'reader_suggestions');

-- Check policies exist
-- SELECT tablename, policyname FROM pg_policies
-- WHERE tablename IN ('workspace_settings', 'user_roles', 'reader_acknowledgments', 'reader_suggestions');

-- ============================================================================
-- NOTES
-- ============================================================================
--
-- Self-Hosted Model:
-- - Each workspace deployment has ONE owner (first user to deploy)
-- - Owner can enable/disable reader accounts in workspace_settings
-- - Readers can sign up via magic link or Google OAuth
-- - Readers must acknowledge safety protocols and licenses to access gated content
--
-- Reader Access:
-- - Public projects: Visible to all authenticated users
-- - Gated projects: Visible to readers who have acknowledged safety/license
-- - Private projects: Only visible to owner
--
-- Suggestions System:
-- - Readers can leave suggestions on projects
-- - Stored in database (alternative: could store as JSON in Git)
-- - Owner can approve/reject suggestions
-- - Expert readers can be flagged for auto-approval
--
-- Future Enhancements:
-- - Add parent_subproject_id to stream_cache for hierarchical sub-projects
-- - Add fork tracking (which users have forked which projects)
-- - Add collaboration requests (readers requesting to contribute)
-- - Add commons safety registry integration
-- ============================================================================
