-- Migration: Rename Streams to Sub-Projects
-- Description: Renames stream_cache table to subproject_cache for terminology consistency
-- Date: November 7, 2025
-- Reference: Terminology standardization - streams → sub-projects

-- ===========================================================================
-- 1. RENAME TABLE
-- ============================================================================

-- Rename stream_cache to subproject_cache
ALTER TABLE IF EXISTS stream_cache RENAME TO subproject_cache;

-- ============================================================================
-- 2. UPDATE INDEXES
-- ============================================================================

-- Indexes are automatically renamed with the table, but we can verify:
-- The indexes should now be named with subproject_cache prefix

-- ============================================================================
-- 3. UPDATE FOREIGN KEY CONSTRAINTS (if any exist)
-- ============================================================================

-- Foreign key constraints are maintained automatically during table rename

-- ============================================================================
-- 4. RECREATE RLS POLICIES WITH NEW NAMES
-- ============================================================================

-- Drop old policies (they still reference old table name in policy name)
DROP POLICY IF EXISTS "Subprojects inherit project visibility for owners" ON subproject_cache;
DROP POLICY IF EXISTS "Subprojects visible to readers with project access" ON subproject_cache;

-- Recreate policies with better names
CREATE POLICY "Sub-projects inherit project visibility for owners"
  ON subproject_cache
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM project_cache
      WHERE project_cache.id = subproject_cache.project_id
      AND project_cache.user_id = auth.uid()
    )
  );

CREATE POLICY "Sub-projects visible to readers with project access"
  ON subproject_cache
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM project_cache
      WHERE project_cache.id = subproject_cache.project_id
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
-- VERIFICATION QUERIES (Run these to verify the migration)
-- ============================================================================

-- Check that table was renamed
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
-- AND table_name = 'subproject_cache';

-- Check RLS policies exist with new names
-- SELECT tablename, policyname FROM pg_policies
-- WHERE tablename = 'subproject_cache';

-- ============================================================================
-- NOTES
-- ============================================================================
--
-- This migration renames stream_cache to subproject_cache for consistency
-- with the new terminology (streams → sub-projects).
--
-- The table structure remains the same, only the name changes.
--
-- All RLS policies are recreated with updated names.
--
-- ============================================================================
