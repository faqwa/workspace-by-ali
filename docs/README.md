# Workspace Documentation

This directory contains all planning, architecture, and implementation documentation for the Workspace project.

---

## 📂 Directory Structure

```
docs/
├── README.md                        (this file)
├── architecture/                     Architecture & design decisions
│   ├── 01_Workspace_Language_and_Structure_Glossary.md
│   └── 02_Supabase_Vercel_Integration.md
└── planning/                         Phase-by-phase implementation plans
    ├── 00_Master_Roadmap.md
    ├── Phase_1_Personal_Workspace_MVP.md
    ├── Phase_2_Commons_Workspace_Core.md
    ├── Phase_3_Data_Visualization.md
    ├── Phase_4_Integration_and_Polish.md
    └── Phase_5_Federation_and_Discovery.md
```

---

## 🗺️ Where to Start

**New to the project?** Read in this order:

1. **[Master Roadmap](./planning/00_Master_Roadmap.md)** - Overview of the entire project
2. **[Language Glossary](./architecture/01_Workspace_Language_and_Structure_Glossary.md)** - Understand the terminology
3. **[Supabase + Vercel Architecture](./architecture/02_Supabase_Vercel_Integration.md)** - Technical foundation
4. **[Phase 1 Plan](./planning/Phase_1_Personal_Workspace_MVP.md)** - Current development phase

**Ready to build?** Jump straight to:
- [Phase 1 Implementation Plan](./planning/Phase_1_Personal_Workspace_MVP.md)

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

---

### Planning Documents

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

**Current Phase:** Phase 1 - Personal Workspace MVP
**Status:** Planning complete, ready to begin implementation
**Next Milestone:** Authentication working (Week 2)

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

**Last Updated:** 2025-10-22
**Status:** Phase 1 Planning Complete
**Next Review:** After Phase 1 Week 4
