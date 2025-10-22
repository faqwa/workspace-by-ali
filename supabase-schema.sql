-- Workspace Database Schema
-- Run this entire file in Supabase SQL Editor
-- This creates all tables, policies, and functions needed for Phase 1

-- ============================================================================
-- TABLES
-- ============================================================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  username TEXT UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('user', 'reviewer', 'admin')) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_signin TIMESTAMP WITH TIME ZONE
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  visibility TEXT CHECK (visibility IN ('public', 'private')) DEFAULT 'private',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Streams table (research domains within projects)
CREATE TABLE IF NOT EXISTS streams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  schema_url TEXT,
  safety_version TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Submissions table (for Phase 2 - Commons submissions)
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  stream_id UUID REFERENCES streams(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  data_url TEXT,
  artifact_url TEXT,
  safety_version TEXT,
  status TEXT CHECK (status IN ('draft', 'pending', 'verified', 'published')) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Safety logs table (track safety protocol acknowledgments)
CREATE TABLE IF NOT EXISTS safety_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  stream_id UUID REFERENCES streams(id) ON DELETE SET NULL,
  protocol_version TEXT,
  signed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  acknowledgment BOOLEAN DEFAULT TRUE
);

-- Visualizations table (for Phase 3 - data viz)
CREATE TABLE IF NOT EXISTS visualizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE NOT NULL,
  chart_type TEXT,
  format TEXT,
  url TEXT,
  checksum TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE visualizations ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- Users can view their own data
CREATE POLICY "Users can view own data"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  USING (auth.uid() = id);

-- Admins can view all users
CREATE POLICY "Admins can view all users"
  ON users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Allow inserting user profiles (for first-time auth)
CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- PROJECTS TABLE POLICIES
-- ============================================================================

-- Users can view their own projects
CREATE POLICY "Users can view own projects"
  ON projects
  FOR SELECT
  USING (auth.uid() = owner);

-- Anyone can view public projects
CREATE POLICY "Public projects are visible"
  ON projects
  FOR SELECT
  USING (visibility = 'public');

-- Users can create projects
CREATE POLICY "Users can create projects"
  ON projects
  FOR INSERT
  WITH CHECK (auth.uid() = owner);

-- Users can update their own projects
CREATE POLICY "Users can update own projects"
  ON projects
  FOR UPDATE
  USING (auth.uid() = owner);

-- Users can delete their own projects
CREATE POLICY "Users can delete own projects"
  ON projects
  FOR DELETE
  USING (auth.uid() = owner);

-- ============================================================================
-- STREAMS TABLE POLICIES
-- ============================================================================

-- Users can view streams from projects they own
CREATE POLICY "Users can view streams from own projects"
  ON streams
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = streams.project_id
      AND projects.owner = auth.uid()
    )
  );

-- Anyone can view streams from public projects
CREATE POLICY "Public project streams are visible"
  ON streams
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = streams.project_id
      AND projects.visibility = 'public'
    )
  );

-- Project owners can manage streams
CREATE POLICY "Project owners can manage streams"
  ON streams
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = streams.project_id
      AND projects.owner = auth.uid()
    )
  );

-- ============================================================================
-- SUBMISSIONS TABLE POLICIES
-- ============================================================================

-- Users can view their own submissions
CREATE POLICY "Users can view own submissions"
  ON submissions
  FOR SELECT
  USING (auth.uid() = user_id);

-- Project owners can view all submissions to their projects
CREATE POLICY "Project owners can view submissions"
  ON submissions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = submissions.project_id
      AND projects.owner = auth.uid()
    )
  );

-- Anyone can view published submissions from public projects
CREATE POLICY "Published submissions are public"
  ON submissions
  FOR SELECT
  USING (
    status = 'published'
    AND EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = submissions.project_id
      AND projects.visibility = 'public'
    )
  );

-- Users can create submissions
CREATE POLICY "Users can create submissions"
  ON submissions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own draft submissions
CREATE POLICY "Users can update own submissions"
  ON submissions
  FOR UPDATE
  USING (auth.uid() = user_id AND status = 'draft');

-- Reviewers and admins can update submission status
CREATE POLICY "Reviewers can update status"
  ON submissions
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role IN ('reviewer', 'admin')
    )
  );

-- ============================================================================
-- SAFETY LOGS TABLE POLICIES
-- ============================================================================

-- Users can view their own safety logs
CREATE POLICY "Users can view own safety logs"
  ON safety_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create safety acknowledgments
CREATE POLICY "Users can create safety logs"
  ON safety_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all safety logs
CREATE POLICY "Admins can view all safety logs"
  ON safety_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- ============================================================================
-- VISUALIZATIONS TABLE POLICIES
-- ============================================================================

-- Anyone can view visualizations from published submissions
CREATE POLICY "Published visualizations are public"
  ON visualizations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM submissions
      WHERE submissions.id = visualizations.submission_id
      AND submissions.status = 'published'
    )
  );

-- Submission owners can manage their visualizations
CREATE POLICY "Users can manage own visualizations"
  ON visualizations
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM submissions
      WHERE submissions.id = visualizations.submission_id
      AND submissions.user_id = auth.uid()
    )
  );

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for submissions table
CREATE TRIGGER update_submissions_updated_at
  BEFORE UPDATE ON submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Index on project owner for faster queries
CREATE INDEX IF NOT EXISTS idx_projects_owner ON projects(owner);

-- Index on submission status and project
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_project ON submissions(project_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user ON submissions(user_id);

-- Index on streams project_id
CREATE INDEX IF NOT EXISTS idx_streams_project ON streams(project_id);

-- Index on safety logs
CREATE INDEX IF NOT EXISTS idx_safety_logs_user ON safety_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_safety_logs_stream ON safety_logs(stream_id);

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================

-- Create storage buckets (run these in Supabase Storage section, not SQL editor)
-- Or use the SQL below if you have access:

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES
--   ('uploads', 'uploads', false),
--   ('artifacts', 'artifacts', true),
--   ('schemas', 'schemas', false),
--   ('safety', 'safety', false);

-- ============================================================================
-- INITIAL DATA (OPTIONAL)
-- ============================================================================

-- You can add initial data here if needed
-- For example, create default streams for ArcUp project after creating the project

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Run these to verify everything is set up correctly:

-- Check tables exist
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public';

-- Check RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Check policies exist
-- SELECT * FROM pg_policies WHERE schemaname = 'public';

-- ============================================================================
-- NOTES
-- ============================================================================

-- 1. Make sure to enable the uuid-ossp extension if not already enabled:
--    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Storage buckets need to be created manually in Supabase dashboard
--    or via their API/CLI

-- 3. Remember to set up GitHub OAuth in Supabase Authentication settings

-- 4. For production, consider adding more indexes based on query patterns

-- 5. Backup your database regularly, especially before schema changes

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
