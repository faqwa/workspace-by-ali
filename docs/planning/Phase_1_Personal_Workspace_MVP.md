# Phase 1: Personal Workspace MVP

**Timeline:** 6-8 weeks
**Goal:** Ali can use workspace for ArcUp plasma research (single-user, multi-project, safety-gated, public-facing)

---

## Deliverables

By the end of Phase 1, Ali can:
- ✅ Log in with GitHub
- ✅ Create and manage multiple projects
- ✅ Switch between projects easily
- ✅ Write and publish research updates via CMS
- ✅ View updates on public-facing pages
- ✅ Complete safety onboarding
- ✅ Access gated content after acknowledgment
- ✅ Use on mobile devices
- ✅ Show workspace publicly at `workspace.xbyali.page/ali`

---

## Week 1-2: Foundation & Authentication

### Step 1.1: Supabase Project Setup
- [ ] Create Supabase project at [supabase.com](https://supabase.com)
- [ ] Run SQL schema from architecture document
- [ ] Set up RLS policies
- [ ] Configure Supabase Storage buckets (`uploads`, `artifacts`, `schemas`, `safety`)
- [ ] Generate API keys (anon + service role)
- [ ] Test connection from local environment

### Step 1.2: Vercel Environment Setup
- [ ] Add Supabase env vars to Vercel project settings
- [ ] Create feature branch: `git checkout -b feature/phase-1-foundation`
- [ ] Update `.gitignore` to include `.env.local`
- [ ] Create `.env.example` template with variable names
- [ ] Document setup process in README

### Step 1.3: Install Dependencies
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
npm install zod date-fns
npm install decap-cms-app
npm install -D @types/node
```

### Step 1.4: Supabase Client Setup
- [ ] Create `src/lib/supabase.ts` (client configuration)
- [ ] Create `src/lib/supabaseClient.ts` (browser client)
- [ ] Create `src/lib/supabaseServer.ts` (server-side client)
- [ ] Create `src/lib/auth.ts` (auth helpers and utilities)
- [ ] Set up middleware for auth state management

### Step 1.5: Authentication UI
- [ ] Create `/login` page
- [ ] Add GitHub OAuth button
- [ ] Add magic link email option
- [ ] Create protected route middleware
- [ ] Add logout functionality to navbar
- [ ] Display auth state in navbar (user avatar, name)
- [ ] Create `/profile` page for user settings
- [ ] Add error handling for auth failures

**Deliverable:** User can log in with GitHub and see authenticated state

---

## Week 3-4: Multi-Project System

### Step 2.1: Database Verification
- [ ] Verify `projects` table exists in Supabase
- [ ] Create seed data for testing (2-3 example projects)
- [ ] Test RLS policies with different user roles
- [ ] Verify foreign key constraints work

### Step 2.2: Project Management API
Create Astro API routes in `src/pages/api/`:
- [ ] `projects/index.ts` - GET all projects, POST new project
- [ ] `projects/[id].ts` - GET, PATCH, DELETE specific project
- [ ] Add Zod schemas for validation
- [ ] Add error handling and logging
- [ ] Test with Postman or similar

### Step 2.3: Projects Dashboard UI
- [ ] Create `/projects` page
- [ ] Build project grid/list view component
- [ ] Add "Create New Project" button and modal/form
- [ ] Design project cards with metadata (name, description, visibility)
- [ ] Implement empty state for no projects
- [ ] Add loading states
- [ ] Add error states

### Step 2.4: Project Switcher Component
- [ ] Create dropdown/tabs component for project switching
- [ ] Store active project ID in localStorage
- [ ] Create React/Astro context provider for current project
- [ ] Update navbar to show current project name
- [ ] Add keyboard shortcuts (optional)

### Step 2.5: Project Settings Page
- [ ] Create `/projects/[id]/settings` route
- [ ] Build form to edit name, description, category
- [ ] Add visibility toggle (public/private)
- [ ] Add delete project button with confirmation modal
- [ ] Show project creation date and stats
- [ ] Add save/cancel buttons with proper state management

**Deliverable:** User can create multiple projects and switch between them

---

## Week 5-6: Content Management

### Step 3.1: Content Structure Verification
- [ ] Verify `src/content/updates/` still works with Astro
- [ ] Update `src/content/config.ts` for new fields
- [ ] Add `project_id` to frontmatter schema
- [ ] Test existing content still displays
- [ ] Plan migration path for old content

### Step 3.2: DecapCMS Integration
- [ ] Create `public/admin/index.html` for CMS UI
- [ ] Configure `public/admin/config.yml` with:
  - GitHub backend
  - Collections (updates, experiments)
  - Media library settings
  - Workflow (draft/review/publish)
- [ ] Set up GitHub OAuth for DecapCMS
- [ ] Test CMS access at `/admin`
- [ ] Document CMS usage for non-technical users

### Step 3.3: Update Creation Flow
- [ ] Design CMS form for creating updates
- [ ] Link updates to projects (dropdown selector)
- [ ] Configure media upload (images/videos)
- [ ] Set up auto-commit to git on save
- [ ] Add preview functionality
- [ ] Test draft workflow

### Step 3.4: Update Display Pages
- [ ] Create `/projects/[id]/updates` (list all updates for project)
- [ ] Create `/projects/[id]/updates/[slug]` (single update view)
- [ ] Build UpdateCard component for grid display
- [ ] Add filter by tags/status
- [ ] Add search functionality
- [ ] Add pagination or infinite scroll
- [ ] Optimize for mobile

### Step 3.5: Public Profile Pages
- [ ] Create `/[username]` route (public profile)
- [ ] Display user bio, avatar, social links
- [ ] Show list of public projects
- [ ] Display public updates
- [ ] Add toggle for profile visibility in user settings
- [ ] Design attractive layout using Astrowind components
- [ ] Add SEO meta tags

**Deliverable:** User can create, edit, and display research updates per project

---

## Week 7-8: Safety & Gating

### Step 4.1: Safety Protocol System
- [ ] Create entries in `streams` table for ArcUp streams (Biology, Hardware, etc.)
- [ ] Upload safety protocol PDFs to Supabase Storage
- [ ] Create `/safety/[stream_id]` viewer page
- [ ] Implement version tracking in database
- [ ] Design safety badge UI (🟢🟡🔴)

### Step 4.2: Onboarding Flow
- [ ] Detect first-login in middleware
- [ ] Create multi-step onboarding wizard:
  - Welcome screen
  - Profile setup
  - Safety agreement per stream
  - Confirmation
- [ ] Record acknowledgment signature to `safety_logs`
- [ ] Redirect to dashboard after completion
- [ ] Allow skipping for testing (dev mode only)

### Step 4.3: Gated Content Implementation
- [ ] Add `requires_safety_ack` field to content schema
- [ ] Create middleware to check safety acknowledgments
- [ ] Gate methodology/build documentation
- [ ] Create "Acknowledge to Continue" button/modal
- [ ] Show safety badge in content headers
- [ ] Handle multiple safety requirements per content

### Step 4.4: Re-acknowledgment Flow
- [ ] Detect outdated safety versions on login
- [ ] Show banner for pending acknowledgments
- [ ] Block access to new streams until signed
- [ ] Keep old streams accessible (non-blocking)
- [ ] Send email notification (optional)

### Step 4.5: Mobile Optimization
- [ ] Test all pages on mobile devices (iOS, Android)
- [ ] Ensure responsive navigation (hamburger menu)
- [ ] Make buttons touch-friendly (min 44px)
- [ ] Optimize images for mobile (WebP, responsive)
- [ ] Test DecapCMS on mobile browsers
- [ ] Check form usability on small screens

### Step 4.6: Accessibility Audit
- [ ] Add ARIA labels on all interactive elements
- [ ] Ensure full keyboard navigation
- [ ] Check color contrast (WCAG AA minimum)
- [ ] Add alt text on all images
- [ ] Test with screen reader (NVDA or VoiceOver)
- [ ] Add skip navigation links
- [ ] Ensure focus indicators are visible

**Deliverable:** Complete Personal Workspace with safety gating and mobile support

---

## Astrowind Component Integration

Extract and adapt these components as needed throughout Phase 1:

### Layout Components
- [ ] Hero section for landing pages
- [ ] Header/navbar with dropdown
- [ ] Footer with links
- [ ] Container/grid layouts

### Interactive Components
- [ ] Card components for projects/updates
- [ ] Modal/dialog components
- [ ] Form components (inputs, textareas, selects)
- [ ] Tabs component for project switching
- [ ] Dropdown menus

### Dashboard Components
- [ ] Stat cards for metrics
- [ ] Timeline for activity
- [ ] List/grid toggles
- [ ] Dashboard widgets

**Process for each component:**
1. Identify needed component from Astrowind repo
2. Copy to `src/components/ui/`
3. Adapt styling to match current theme
4. Add credit to `ACKNOWLEDGMENTS.md`
5. Document props and usage

---

## Documentation

- [ ] Update README with comprehensive setup instructions
- [ ] Create `ACKNOWLEDGMENTS.md` with all OSS credits
- [ ] Document all environment variables in `.env.example`
- [ ] Create user guide for researchers (how to use CMS)
- [ ] Document API endpoints
- [ ] Create troubleshooting guide
- [ ] Record video walkthrough (optional)

---

## Testing & Quality Assurance

- [ ] Test auth flow (login, logout, session persistence)
- [ ] Test CRUD operations for projects
- [ ] Test content creation and publishing
- [ ] Test safety acknowledgment flow
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on mobile devices
- [ ] Run Lighthouse audit (performance, accessibility, SEO)
- [ ] Security review (XSS, CSRF, SQL injection)

---

## Deployment

- [ ] Push feature branch to GitHub
- [ ] Create pull request for review
- [ ] Merge to main after approval
- [ ] Deploy to Vercel (auto-deploy on merge)
- [ ] Configure custom domain `workspace.xbyali.page`
- [ ] Test production deployment
- [ ] Monitor for errors in Vercel logs

---

## Success Criteria

Phase 1 is complete when:
1. All 8 weeks of tasks are completed
2. Ali can log in and use the workspace daily
3. At least 3 projects are created and managed
4. At least 5 research updates are published
5. Safety onboarding works end-to-end
6. Mobile experience is smooth
7. No critical bugs in production
8. Documentation is complete

---

## Known Limitations (To Address in Phase 2)

- Single user only (no collaborators yet)
- No submission to Commons workflow yet
- No data visualization pipeline yet
- No notification system
- No cross-project search
- Limited admin features

---

**Next:** Phase 2 - Commons Workspace Core
