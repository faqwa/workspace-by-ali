-- Migration: Add activities table and is_public field
-- Run this in Supabase SQL Editor if you've already run the main schema

-- Add is_public field to users table (if it doesn't exist)
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT FALSE;

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  type TEXT CHECK (type IN ('project', 'update', 'stream')) NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on activities
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for activities
CREATE POLICY "Users can view own activities"
  ON activities
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create activities"
  ON activities
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activities"
  ON activities
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own activities"
  ON activities
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add indexes for activities
CREATE INDEX IF NOT EXISTS idx_activities_user ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_project ON activities(project_id);
CREATE INDEX IF NOT EXISTS idx_activities_type ON activities(type);
CREATE INDEX IF NOT EXISTS idx_activities_created ON activities(created_at DESC);
