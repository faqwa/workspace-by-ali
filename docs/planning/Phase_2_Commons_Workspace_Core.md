# Phase 2: Commons Workspace Core (Now Phase 3)

**Timeline:** 6-8 weeks (original estimate)
**Goal:** ArcUp Commons can receive, verify, and publish submissions from Personal Workspaces

**⚠️ OUTDATED & PHASE SHIFTED (Nov 6, 2025):** Architecture refactored to self-hosted model. Commons features moved to Phase 3. Phase 2 is now Reader Accounts & Collaboration.

**📖 See updated roadmap:**
- [00_Master_Roadmap.md](./00_Master_Roadmap.md) - Updated phases
- Phase 2 (New): Reader Accounts & Collaboration
- Phase 3 (New): Commons Workspace (this content)

**This document needs rewriting for self-hosted Arc^ model.**

---

## Prerequisites

- Phase 1 completed (Personal Workspace MVP functional)
- At least one active user using Personal Workspace
- Test data and submissions ready for validation

---

## Deliverables

By the end of Phase 2:
- ✅ Commons Workspace infrastructure deployed
- ✅ Submission pipeline functional (Personal → Commons)
- ✅ Admin review dashboard operational
- ✅ Schema validation system in place
- ✅ Manual review workflow complete
- ✅ Contributor recognition visible
- ✅ Public-facing verified content site live

---

## Week 1-2: Commons Infrastructure

### Step 1.1: Commons Repository Setup
- [ ] Create new repo `commons-arcup` or use subdirectory
- [ ] Set up Astro project for Commons frontend
- [ ] Configure Vercel deployment for Commons
- [ ] Set up custom domain `arcup.xbyali.page`
- [ ] Share Supabase instance with Personal Workspace

### Step 1.2: Commons Database Schema
- [ ] Verify `submissions` table in Supabase
- [ ] Create additional tables if needed:
  - `review_actions` (audit log for reviews)
  - `commons_settings` (project-level config)
- [ ] Set up RLS policies for Commons-specific access
- [ ] Create admin role assignments

### Step 1.3: GitHub App Setup
- [ ] Create GitHub App for automated commits
- [ ] Configure fine-grained permissions (repo write)
- [ ] Set up webhook for submission events
- [ ] Create verified-content repository
- [ ] Test bot commit functionality

### Step 1.4: Commons Dashboard UI Foundation
- [ ] Create admin-only `/admin` route
- [ ] Build sidebar navigation
- [ ] Create dashboard home with stats
- [ ] Add role-based access control
- [ ] Design responsive layout

**Deliverable:** Commons infrastructure ready for submissions

---

## Week 3-4: Submission Pipeline

### Step 2.1: Submission API Endpoint
- [ ] Create Edge Function `/functions/submit-to-commons`
- [ ] Implement request validation (Zod schema)
- [ ] Check user safety acknowledgments
- [ ] Upload files to Supabase Storage
- [ ] Insert submission record with status='pending'
- [ ] Return submission ID and status

### Step 2.2: Personal Workspace Submission UI
- [ ] Add "Submit to Commons" button in update editor
- [ ] Create submission form with:
  - Select target Commons project
  - Select stream
  - Add description/notes for reviewers
  - Attach data files (CSV, images)
- [ ] Show submission progress indicator
- [ ] Display submission status after submit

### Step 2.3: Submission Status Tracking
- [ ] Create `/submissions` page in Personal Workspace
- [ ] Show all submissions with status badges
- [ ] Allow viewing reviewer feedback
- [ ] Enable resubmission if rejected
- [ ] Send notifications on status changes

### Step 2.4: File Upload & Validation
- [ ] Implement drag-and-drop file upload
- [ ] Validate file types (whitelist: CSV, JSON, PNG, JPG, PDF)
- [ ] Check file size limits (max 50MB)
- [ ] Scan for malicious content (ClamAV or similar)
- [ ] Generate checksums for integrity
- [ ] Store in Supabase Storage with metadata

**Deliverable:** Users can submit work from Personal to Commons

---

## Week 5-6: Schema Validation & Review System

### Step 3.1: JSON Schema System
- [ ] Define JSON Schema format for streams
- [ ] Create schemas for ArcUp streams:
  - Biology experiments schema
  - Hardware build schema
  - Data measurement schema
- [ ] Store schemas in Supabase Storage `/schemas/`
- [ ] Build schema editor UI for admins

### Step 3.2: Local Validation in Personal Workspace
- [ ] Fetch relevant schema from Commons
- [ ] Validate data against schema (Zod)
- [ ] Show validation errors before submission
- [ ] Suggest fixes for common issues
- [ ] Allow override with warning

### Step 3.3: Server-Side Re-Validation
- [ ] Create Edge Function `/functions/validate-against-schema`
- [ ] Re-validate submitted data server-side
- [ ] Run automated checks:
  - File integrity (checksums)
  - Required fields present
  - Data types correct
  - No suspicious patterns
- [ ] Log validation results

### Step 3.4: Review Dashboard
- [ ] Create `/admin/submissions` queue page
- [ ] Show pending submissions in list/grid
- [ ] Display submission details panel:
  - Title, description, author
  - Attached files (preview)
  - Validation results
  - Safety acknowledgment status
- [ ] Add filters (by stream, date, author)
- [ ] Add search functionality

### Step 3.5: Manual Review Workflow
- [ ] Create review panel UI
- [ ] Add actions:
  - ✅ Approve
  - ❌ Reject (with reason)
  - 💬 Request Changes (with feedback)
- [ ] Implement state transitions
- [ ] Record reviewer identity and timestamp
- [ ] Notify submitter of decision
- [ ] Create audit log entry

**Deliverable:** Complete review and validation system operational

---

## Week 7-8: Publication & Recognition

### Step 4.1: Publication System
- [ ] Create Edge Function `/functions/publish-submission`
- [ ] Generate markdown file from submission
- [ ] Commit to verified-content repo via GitHub App
- [ ] Update submission status to 'published'
- [ ] Generate public URL
- [ ] Clear caches

### Step 4.2: Public Commons Site
- [ ] Create public-facing Commons website
- [ ] Build experiment browser:
  - Grid/list view
  - Filter by stream, date, author
  - Search functionality
- [ ] Create experiment detail pages
- [ ] Display visualizations and data
- [ ] Show contributor attribution
- [ ] Add download links for data

### Step 4.3: Contributor Recognition
- [ ] Create `/contributors` page on Commons
- [ ] List all contributors with:
  - Avatar, name, bio
  - Link to Personal Workspace
  - Total contributions count
  - Recent activity
- [ ] Add opt-in consent in Personal Workspace settings
- [ ] Display contributor list on project pages
- [ ] Add badges for milestone contributions (optional)

### Step 4.4: Safety Protocol Management
- [ ] Create admin UI for managing safety files
- [ ] Upload/update safety PDFs per stream
- [ ] Increment version numbers
- [ ] Trigger re-acknowledgment for affected users
- [ ] Show acknowledgment status in admin dashboard

**Deliverable:** End-to-end flow from submission to publication works

---

## Testing & Quality Assurance

- [ ] Test full submission flow (Personal → Commons → Published)
- [ ] Test all review actions (approve, reject, request changes)
- [ ] Test schema validation with valid and invalid data
- [ ] Test file upload with various file types and sizes
- [ ] Test permissions (regular user can't access admin panel)
- [ ] Test notification delivery
- [ ] Security audit of submission endpoint
- [ ] Performance testing with multiple submissions

---

## Documentation

- [ ] Document submission process for users
- [ ] Create reviewer guidelines and best practices
- [ ] Document schema creation for admins
- [ ] Add API documentation for submission endpoint
- [ ] Create troubleshooting guide
- [ ] Update main README with Commons info

---

## Deployment

- [ ] Deploy Commons site to Vercel
- [ ] Configure custom domain
- [ ] Set up edge functions in production
- [ ] Test in production environment
- [ ] Monitor logs for errors
- [ ] Set up uptime monitoring

---

## Success Criteria

Phase 2 is complete when:
1. At least 5 test submissions processed successfully
2. Review workflow used to approve/reject submissions
3. At least 3 submissions published to public site
4. Contributor page displays all contributors
5. Schema validation catches invalid data
6. No critical security vulnerabilities
7. Documentation complete

---

## Known Limitations (To Address in Phase 3)

- No data visualization pipeline yet
- Limited automated checks
- No batch operations
- No advanced search across all content
- No notification preferences

---

**Next:** Phase 3 - Data Visualization Pipeline
