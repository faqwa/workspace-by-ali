# Workspace Documentation

This directory contains all planning, architecture, and implementation documentation for the Workspace project.

**🔄 ARCHITECTURE PIVOT (Nov 5, 2025):** The project is transitioning from Supabase-centric data storage to a **Git-first architecture** using Keystatic CMS. See [01_Phase1_Git_First_MVP.md](implementation/01_Phase1_Git_First_MVP.md) for details.

---

## 📂 Directory Structure

```
docs/
├── README.md                             (this file)
├── MASTER_TASKLIST.md                    ⭐ Current tasks & progress tracker
├── REPOSITORY_STRUCTURE.md               🆕 Dual-repo setup (main app + template)
├── SESSION_HANDOFF_Nov_6_2025_Git_APIs.md  🆕 Latest session notes (Git Infrastructure)
├── SESSION_HANDOFF_Nov_5_2025.md         Previous session notes
├── SESSION_HANDOFF_Nov_4_2025.md         Older session notes
├── BRAND_QUICK_START.md                  Brand & design quick reference
│
├── architecture/                         Architecture & design decisions
│   ├── 01_Workspace_Language_and_Structure_Glossary.md
│   ├── 02_Supabase_Vercel_Integration.md (⚠️ Being replaced by Git-first)
│   ├── 03_Authentication_Security.md
│   ├── 04_Brand_Design_System.md
│   ├── 05_Keystatic_Integration.md       🆕 Git-backed CMS architecture
│   ├── 06_Supabase_Caching_Strategy.md   🆕 Metadata cache for performance
│   └── 07_Safety_Protocol_System.md      🆕 Safety gating implementation
│
├── implementation/                       🆕 Implementation guides
│   └── 01_Phase1_Git_First_MVP.md        🆕 Complete Phase 1 roadmap
│
├── reference/                            🆕 Technical reference
│   ├── API_Endpoints.md                  🆕 Complete API specification
│   └── Data_Structures.md                🆕 Frontmatter & data formats
│
├── new/                                  Planning documents (work-in-progress)
│   ├── git_hub_federated_repo_model_and_gating_spec.md
│   ├── 06_claude_qa_followup_notes_keystatic_and_git_first_mvp.md
│   ├── 08_content_structure_and_branch_workflow.md
│   └── 09_claude_qa_implementation_answers.md
│
└── planning/                             Phase-by-phase implementation plans
    ├── 00_Master_Roadmap.md
    ├── Phase_1_Personal_Workspace_MVP.md (⚠️ Being updated for Git-first)
    ├── Phase_2_Commons_Workspace_Core.md
    ├── Phase_3_Data_Visualization.md
    ├── Phase_4_Integration_and_Polish.md
    └── Phase_5_Federation_and_Discovery.md
```

---

## 🗺️ Where to Start

**Starting a new session?** Check these first:
- **[MASTER TASKLIST](./MASTER_TASKLIST.md)** - Current tasks, progress tracker, and what's next
- **[REPOSITORY_STRUCTURE](./REPOSITORY_STRUCTURE.md)** - 🆕 Explains dual-repo setup (main app + template)
- **[Phase 1 Git-First MVP](./implementation/01_Phase1_Git_First_MVP.md)** - Complete implementation roadmap
- **[Latest Session Handoff](./SESSION_HANDOFF_Nov_6_2025_Git_APIs.md)** - Most recent work and context (Nov 6, 2025)

**New to the project?** Read in this order:

1. **[Master Roadmap](./planning/00_Master_Roadmap.md)** - Overview of the entire project
2. **[Language Glossary](./architecture/01_Workspace_Language_and_Structure_Glossary.md)** - Understand the terminology
3. **[Phase 1 Git-First MVP](./implementation/01_Phase1_Git_First_MVP.md)** - Current architecture & implementation plan
4. **[Keystatic Integration](./architecture/05_Keystatic_Integration.md)** - Git-backed CMS setup

**Ready to build?** Jump straight to:
- **[MASTER TASKLIST](./MASTER_TASKLIST.md)** - See what tasks need to be done
- **[Phase 1 Git-First MVP](./implementation/01_Phase1_Git_First_MVP.md)** - Step-by-step implementation guide
- [API Endpoints Reference](./reference/API_Endpoints.md) - Complete API specification
- [Data Structures Reference](./reference/Data_Structures.md) - Frontmatter schemas & formats
- [Brand Quick Start Guide](./BRAND_QUICK_START.md) - Design & styling reference

**Understanding Git-First Architecture?** Read these:
- **[Phase 1 Git-First MVP](./implementation/01_Phase1_Git_First_MVP.md)** - Complete overview
- [Keystatic Integration](./architecture/05_Keystatic_Integration.md) - CMS configuration
- [Supabase Caching Strategy](./architecture/06_Supabase_Caching_Strategy.md) - Metadata cache
- [Safety Protocol System](./architecture/07_Safety_Protocol_System.md) - Gating implementation
- [Content Structure & Branch Workflow](./new/08_content_structure_and_branch_workflow.md) - Git workflow
- [Implementation Q&A](./new/09_claude_qa_implementation_answers.md) - Architecture decisions

---

## 📖 Document Descriptions

### Architecture Documents

#### [01_Workspace_Language_and_Structure_Glossary.md](./architecture/01_Workspace_Language_and_Structure_Glossary.md)
Defines all terminology used throughout the project:
- Personal Workspace vs Commons Workspace
- Action verbs (submit, verify, merge, publish)
- User roles and access levels
- Content types
- Safety protocol terms
- Status states

**Read this first** to understand the vocabulary.

#### [02_Supabase_Vercel_Integration.md](./architecture/02_Supabase_Vercel_Integration.md)
Technical architecture document covering:
- Database schema (users, projects, streams, submissions, etc.)
- Supabase Storage layout
- Edge Functions examples
- RLS policies
- Security considerations
- Environment variables

**Essential for developers** implementing features.

#### [03_Authentication_Security.md](./architecture/03_Authentication_Security.md)
Security and authentication implementation details:
- Supabase Auth configuration
- Session management
- Protected routes
- Security best practices

**Critical for security** implementation.

#### [04_Brand_Design_System.md](./architecture/04_Brand_Design_System.md)
Complete brand and design guidelines covering:
- Brand foundation (purpose, vision, values)
- Visual identity (colors, typography, spacing)
- UI component standards
- Accessibility requirements
- Voice and messaging
- Implementation examples

**Essential for designers and frontend developers** building the interface.

#### [05_Keystatic_Integration.md](./architecture/05_Keystatic_Integration.md) 🆕
Complete technical specification for Keystatic CMS integration:
- Why Keystatic over alternatives
- Installation and configuration
- Collection schemas (projects, streams, updates)
- GitHub token authentication flow
- Branch workflow (draft → main)
- Performance considerations for nested collections
- Troubleshooting guide

**Essential for implementing the Git-backed CMS.**

#### [06_Supabase_Caching_Strategy.md](./architecture/06_Supabase_Caching_Strategy.md) 🆕
Metadata caching architecture for performance:
- Why cache when Git is source of truth
- What to cache vs. fetch from Git
- Cache schema (`project_cache`, `stream_cache` tables)
- Webhook-based cache invalidation
- Query patterns and optimization
- Performance targets and monitoring

**Essential for understanding Supabase's role in Git-first architecture.**

#### [07_Safety_Protocol_System.md](./architecture/07_Safety_Protocol_System.md) 🆕
Safety gating implementation specification:
- Philosophy and goals of safety system
- `.access.yml` configuration format
- Safety modal UX flow
- Database logging and acknowledgment tracking
- Middleware enforcement
- Safety documentation requirements
- Future enhancements (quizzes, expiration, versioning)

**Critical for implementing responsible content sharing.**

---

### Implementation Guides

#### [01_Phase1_Git_First_MVP.md](./implementation/01_Phase1_Git_First_MVP.md) 🆕
Complete Phase 1 implementation roadmap with:
- Architecture overview (before/after diagrams)
- 40+ actionable tasks with time estimates
- 6 implementation phases
- Step-by-step code examples
- Acceptance criteria for each task
- Testing strategy
- Risk mitigation
- Success metrics

**THE primary implementation guide for Phase 1.**

---

### Technical Reference

#### [API_Endpoints.md](./reference/API_Endpoints.md) 🆕
Complete API specification including:
- Authentication endpoints
- GitHub integration (`/api/repo/fork`, `/api/publish`, etc.)
- Safety & gating endpoints
- Webhooks
- Request/response formats
- Error codes
- Rate limiting
- Example usage with cURL and code

**Essential reference for all API development.**

#### [Data_Structures.md](./reference/Data_Structures.md) 🆕
Comprehensive data format reference:
- Directory structure
- Frontmatter schemas (projects, streams, updates)
- `.access.yml` configuration format
- Database table schemas
- API payload formats
- Validation rules
- TypeScript type definitions
- File size limits

**Essential reference for content creation and data handling.**

---

### Planning Documents (Original)

#### [00_Master_Roadmap.md](./planning/00_Master_Roadmap.md)
High-level project roadmap including:
- Project vision and goals
- Technology stack decisions
- All 5 phases overview
- Timeline (11-12 months to launch)
- Milestones and success metrics
- Resource requirements
- Risk assessment

**Start here** for the big picture.

#### [Phase_1_Personal_Workspace_MVP.md](./planning/Phase_1_Personal_Workspace_MVP.md)
Detailed 6-8 week plan for building Personal Workspace:
- Authentication and user management
- Multi-project system
- Content management with DecapCMS
- Safety onboarding and gating
- Public profiles
- Mobile optimization

**Current active phase** - this is what we're building now.

#### [Phase_2_Commons_Workspace_Core.md](./planning/Phase_2_Commons_Workspace_Core.md)
6-8 week plan for Commons infrastructure:
- Submission pipeline
- Review and verification dashboard
- Schema validation
- Publication system
- Contributor recognition

**Starts after** Phase 1 is complete.

#### [Phase_3_Data_Visualization.md](./planning/Phase_3_Data_Visualization.md)
4-6 week plan for visualization pipeline:
- Python microservice setup
- Chart generation (line, bar, scatter, heatmap, etc.)
- Data upload and parsing
- Public data gallery
- Interactive visualizations

**Starts after** Phase 2 is complete.

#### [Phase_4_Integration_and_Polish.md](./planning/Phase_4_Integration_and_Polish.md)
3-4 week plan for launch preparation:
- Personal ↔ Commons integration
- Performance optimization
- Security audit
- Accessibility compliance
- Documentation
- Launch strategy

**Final phase** before public launch.

#### [Phase_5_Federation_and_Discovery.md](./planning/Phase_5_Federation_and_Discovery.md)
Future vision for network of Commons:
- Multi-Commons federation
- Cross-project discovery
- Collaboration tools
- Notification system

**Long-term vision** - 12-18 months post-launch.

---

## 🎯 Development Status

**🔄 ARCHITECTURE PIVOT IN PROGRESS**

**Current Phase:** Phase 1 - Git-First MVP Migration (~20% Complete)
**Last Updated:** November 5, 2025
**Status:** Planning complete, implementation starting
**Next Milestone:** Create workspace template repo, install Keystatic (Week 3-4)

**Architecture Transition:**
- ✅ Git-first architecture planning (100%)
- ✅ Documentation sprint (100%)
- ⏳ Template repo setup (0%)
- ⏳ Keystatic integration (0%)
- ⏳ GitHub API endpoints (0%)
- ⏳ Cache migration (0%)

**Phase 1 Git-First Progress:**
- ✅ Planning & Q&A (100%)
- ✅ Documentation (100% - 7 new docs)
- ⏳ Setup & Infrastructure (0%)
- ⏳ Supabase Schema Migration (0%)
- ⏳ Safety & Gating System (0%)
- ⏳ UI Updates (0%)

**Preserved from Previous Architecture:**
- ✅ Authentication & user management (100%)
- ✅ Brand & design system (100%)

See **[MASTER_TASKLIST.md](./MASTER_TASKLIST.md)** for detailed Git-first migration tasks.

See **[01_Phase1_Git_First_MVP.md](./implementation/01_Phase1_Git_First_MVP.md)** for complete implementation roadmap.

---

## 📝 Contributing to Documentation

### Adding New Documents
- Place architecture docs in `docs/architecture/`
- Place planning docs in `docs/planning/`
- Use descriptive, numbered filenames (e.g., `03_New_Topic.md`)
- Update this README when adding new docs

### Updating Existing Documents
- All documents are versioned in git
- Add date and version notes when making significant changes
- Keep the master roadmap in sync with phase plans

### Document Format
- Use markdown with clear headings
- Include table of contents for long documents
- Add code examples where relevant
- Use checklists for actionable items
- Link between related documents

---

## 🔗 External Resources

### Technology Documentation
- [Astro Docs](https://docs.astro.build)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [DecapCMS Docs](https://decapcms.org/docs/)
- [Zod Docs](https://zod.dev/)

### Related Projects
- [Astrowind](https://github.com/onwidget/astrowind) - UI component library
- [ArcUp Research Framework](https://arcup.xbyali.page) - Parent project

---

## 💡 Philosophy

These documents embody the Workspace principles:
- **Transparency** - All planning is open and documented
- **Iteration** - Plans evolve based on learning
- **Recognition** - Credit all contributors and influences
- **Ethics** - Build with care for users and community

---

## ❓ Questions?

If something in the docs is unclear:
1. Check the [Glossary](./architecture/01_Workspace_Language_and_Structure_Glossary.md) for terminology
2. Review the [Master Roadmap](./planning/00_Master_Roadmap.md) for context
3. Open an issue in the repo
4. Ask in project discussions

---

**Last Updated:** November 5, 2025
**Status:** Architecture Pivot - Git-First Planning Complete, Documentation Complete
**Next Review:** After workspace template repo creation (Week 3-4)
