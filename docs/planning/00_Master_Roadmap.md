# Workspace: Master Development Roadmap

**Project:** Workspace - Open Research Ecosystem
**Created:** 2025-10-22
**Status:** Planning Complete, Ready for Phase 1

---

## Project Vision

Workspace is a two-layer, open-research ecosystem that bridges individual experimentation with verified collective knowledge. It enables researchers to work openly, safely, and collaboratively while maintaining rigor and recognition.

**Personal Workspace** 🌱 - Your personal lab bench on the web
**Commons Workspace** 🌳 - The verified forest where knowledge becomes public good

---

## Technology Stack

| Component | Technology | Reason |
|-----------|-----------|--------|
| Frontend | Astro 5 + Astrowind | Fast, content-focused, component-based |
| Database | Supabase Postgres | Free tier, RLS, real-time |
| Auth | Supabase Auth | GitHub OAuth, magic links |
| Storage | Supabase Storage | Signed URLs, free tier |
| Backend | Supabase Edge Functions | Serverless, TypeScript |
| CMS | DecapCMS | Git-based, user-friendly |
| Hosting | Vercel | Free, fast deploys |
| Visualization | Python (FastAPI) | Plotly, Matplotlib |
| Validation | Zod | Type-safe schemas |

---

## Development Phases

### Phase 1: Personal Workspace MVP (6-8 weeks) ✅ READY TO START

**Goal:** Ali can use workspace for ArcUp plasma research

**Key Features:**
- Multi-project management
- Content creation with DecapCMS
- Safety onboarding and gating
- Public profile pages
- Mobile-optimized

**Deliverable:** Fully functional Personal Workspace at `workspace.xbyali.page`

**Status:** Planning complete, architecture finalized, ready to begin implementation

**Detailed Plan:** [Phase_1_Personal_Workspace_MVP.md](./Phase_1_Personal_Workspace_MVP.md)


WE NEED TO ADD = ⚖️ Licensing & Attribution
Workspace documentation and architecture files are shared under **CC BY-NC-SA 4.0**.  
All referenced technologies (Astro, Supabase, etc.) remain under their respective open-source licenses.


---

### Phase 2: Commons Workspace Core (6-8 weeks) ⏳ AFTER PHASE 1

**Goal:** ArcUp Commons can receive and verify submissions

**Key Features:**
- Submission pipeline (Personal → Commons)
- Admin review dashboard
- Schema validation system
- Manual approval workflow
- Contributor recognition
- Public verified content site

**Deliverable:** Working Commons at `arcup.xbyali.page`

**Prerequisites:**
- Phase 1 completed
- At least one active user
- Test data ready

**Detailed Plan:** [Phase_2_Commons_Workspace_Core.md](./Phase_2_Commons_Workspace_Core.md)

---

### Phase 3: Data Visualization (4-6 weeks) ⏳ AFTER PHASE 2

**Goal:** Process and display experimental data beautifully

**Key Features:**
- Python visualization microservice
- Multiple chart types (line, bar, scatter, heatmap, etc.)
- Interactive visualizations (Plotly)
- Public data gallery
- Data download functionality

**Deliverable:** Visualization pipeline from upload to public display

**Prerequisites:**
- Phase 2 completed
- Test datasets available

**Detailed Plan:** [Phase_3_Data_Visualization.md](./Phase_3_Data_Visualization.md)

---

### Phase 4: Integration & Polish (3-4 weeks) ⏳ AFTER PHASE 3

**Goal:** Connect everything seamlessly and prepare for launch

**Key Features:**
- Personal ↔ Commons integration
- Performance optimization
- Security audit
- Accessibility compliance
- Comprehensive documentation
- Launch preparation

**Deliverable:** Production-ready platform

**Prerequisites:**
- Phases 1-3 completed
- User feedback collected

**Detailed Plan:** [Phase_4_Integration_and_Polish.md](./Phase_4_Integration_and_Polish.md)

---

### Phase 5: Federation & Discovery (Future) 🔮 POST-LAUNCH

**Goal:** Connect multiple Commons nodes in a research network

**Key Features:**
- Multi-Commons network protocol
- Cross-project discovery
- Collaboration tools
- Notification system

**Timeline:** 12-18 months after launch

**Prerequisites:**
- Stable platform with active users
- Clear demand for federation
- Multiple Commons instances

**Detailed Plan:** [Phase_5_Federation_and_Discovery.md](./Phase_5_Federation_and_Discovery.md)

---

## Timeline Overview

```
Month 1-2:   Phase 1 (Weeks 1-8)   - Foundation & Auth, Multi-Project, Content
Month 3-4:   Phase 1 (Continued)   - Safety & Gating, Polish
Month 5-6:   Phase 2 (Weeks 1-8)   - Commons Infrastructure, Submission Pipeline
Month 7-8:   Phase 2 (Continued)   - Review System, Publication
Month 9-10:  Phase 3 (Weeks 1-6)   - Visualization Service, Integration
Month 11:    Phase 4 (Weeks 1-4)   - Integration, Polish, Launch Prep
Month 12:    Launch & Stabilization
Month 12+:   Phase 5 Planning

Total Time to Launch: ~11-12 months
```

---

## Key Milestones

| Milestone | Target | Description |
|-----------|--------|-------------|
| **M1: Auth Works** | Week 2 | Users can log in with GitHub |
| **M2: Multi-Project** | Week 4 | Create and switch between projects |
| **M3: Content Creation** | Week 6 | Write updates via DecapCMS |
| **M4: Phase 1 Complete** | Week 8 | Personal Workspace fully functional |
| **M5: Submission Flow** | Week 12 | Submit to Commons works |
| **M6: Review System** | Week 14 | Admins can review submissions |
| **M7: Phase 2 Complete** | Week 16 | Commons operational |
| **M8: Visualization** | Week 20 | Generate charts from data |
| **M9: Phase 3 Complete** | Week 22 | Viz pipeline complete |
| **M10: Security Audit** | Week 24 | No critical vulnerabilities |
| **M11: Soft Launch** | Week 26 | Launch to test users |
| **M12: Public Launch** | Week 28 | Open to everyone |

---

## Success Metrics

### Phase 1
- [ ] Ali uses workspace daily
- [ ] 3+ projects created
- [ ] 10+ research updates published
- [ ] Mobile experience smooth
- [ ] No critical bugs

### Phase 2
- [ ] 10+ submissions processed
- [ ] 5+ submissions approved and published
- [ ] Review workflow used regularly
- [ ] Contributors page populated

### Phase 3
- [ ] 20+ visualizations generated
- [ ] All chart types working
- [ ] Public gallery live
- [ ] Good performance (<10s generation)

### Phase 4
- [ ] Lighthouse score > 90
- [ ] WCAG AA compliant
- [ ] Security audit passed
- [ ] 10+ active users

---

## Resource Requirements

### Development
- **Developer Time:** 1 full-time equivalent for 11 months
- **Tools:** GitHub, Supabase, Vercel (all free tier)
- **Testing:** Browser testing tools, accessibility checkers

### Infrastructure Costs
- **Hosting:** Vercel (free tier, $0/month)
- **Database:** Supabase (free tier, $0/month initially)
- **Storage:** Supabase Storage (free tier, $0/month initially)
- **Email:** SendGrid/Resend (free tier, $0/month)
- **Total:** $0/month during development

**Note:** Costs may increase with scale, but free tiers are generous enough for MVP and early growth.

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Supabase free tier limits | Medium | Monitor usage, upgrade if needed ($25/month) |
| Security vulnerability | High | Regular audits, security-first development |
| Low user adoption | Medium | Focus on solving real problems, iterate on feedback |
| Scope creep | High | Stick to phase plans, defer non-essential features |
| Technical complexity | Medium | Start simple, add complexity gradually |
| Time overruns | Medium | Build in buffer time, prioritize ruthlessly |

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-10-22 | Use Supabase + Vercel | Unified stack, free tier, developer-friendly |
| 2025-10-22 | Refactor existing repo | Keep history, gradual evolution |
| 2025-10-22 | Extract Astrowind components | Leverage OSS, maintain simplicity |
| 2025-10-22 | Build Personal first | Ali needs it ASAP, simpler to start |
| 2025-10-22 | Manual review in Phase 2 | Human judgment critical for research quality |
| 2025-10-22 | Defer federation to Phase 5 | Validate core concept first |

---

## Architecture Documents

Detailed architecture and design decisions:
- [Language & Structure Glossary](../architecture/01_Workspace_Language_and_Structure_Glossary.md)
- [Supabase + Vercel Integration](../architecture/02_Supabase_Vercel_Integration.md)

---

## Next Steps

### Immediate (This Week)
1. ✅ Planning complete
2. ⏳ Create Supabase project
3. ⏳ Run database schema
4. ⏳ Create feature branch
5. ⏳ Start Phase 1, Week 1 tasks

### Short Term (This Month)
1. Complete authentication flow
2. Build multi-project system
3. Integrate DecapCMS
4. Deploy to Vercel

### Medium Term (Next 3 Months)
1. Complete Phase 1
2. Start using Personal Workspace daily
3. Collect feedback and iterate
4. Begin Phase 2 planning

---

## Communication Plan

### Weekly Updates
- Progress report on tasks completed
- Blockers and challenges
- Next week's priorities

### Monthly Reviews
- Demo of new features
- Metrics review
- Plan adjustment if needed

### Quarterly Planning
- Review phase completion
- Plan next phase
- Adjust roadmap based on learnings

---

## Open Questions

- Should we add collaborative editing in Phase 1 or defer?
- Python visualization: GitHub Actions or Railway?
- What analytics tool to use? (Plausible recommended)
- When to add rate limiting?
- Should we support multiple languages (i18n)?

---

## Getting Started

Ready to begin? Start here:

1. Read [Phase 1 Plan](./Phase_1_Personal_Workspace_MVP.md)
2. Review [Architecture Docs](../architecture/)
3. Create Supabase project
4. Run Week 1-2 tasks
5. Ship first milestone!

---

**Let's build something meaningful together. 🌱→🌳**
