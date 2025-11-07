# Archived Documentation

**Purpose:** Historical session handoffs and outdated planning docs
**Status:** Reference only - not current
**Last Updated:** November 7, 2025

---

## 📋 What's Here

This folder contains **historical session handoffs** from the development process. These are kept for reference but represent outdated states of the project.

**⚠️ DO NOT use these for current development!**

**✅ For current status, see:**
- [docs/current/](../current/) - Active session documentation
  - [SESSION_HANDOFF_Nov6_2025_Architecture_Refactoring.md](../current/SESSION_HANDOFF_Nov6_2025_Architecture_Refactoring.md) - Architecture pivot
  - [SESSION_HANDOFF_Nov7_2025.md](../current/SESSION_HANDOFF_Nov7_2025.md) - Testing & validation (Nov 7)
  - [REFACTORING_TRACKER.md](../current/REFACTORING_TRACKER.md) - Documentation updates
  - [TESTING_GUIDE_Nov6.md](../current/TESTING_GUIDE_Nov6.md) - Migration testing
  - [TESTING_RESULTS_Nov7_2025.md](../current/TESTING_RESULTS_Nov7_2025.md) - Test results (100% success)
  - [QUICK_START_Nov6_2025.md](../current/QUICK_START_Nov6_2025.md) - Getting started
- [docs/sprints/SPRINT_HISTORY.md](../sprints/SPRINT_HISTORY.md) - Completed sprint summaries
- [MASTER_TASKLIST.md](../MASTER_TASKLIST.md) - Current tasks and priorities

---

## 📚 Archived Session Handoffs

### **SESSION_HANDOFF.md** (Original)
- **Date:** Early November 2025
- **Focus:** Initial project setup, Supabase auth
- **Status:** Outdated - pre-Git-first architecture

### **SESSION_HANDOFF_Nov_3_2025.md**
- **Date:** November 3, 2025
- **Focus:** Dashboard UI, project cards, activity log
- **Status:** Outdated - Supabase-centric model

### **SESSION_HANDOFF_Nov_4_2025.md**
- **Date:** November 4, 2025
- **Focus:** Onboarding flow, GitHub OAuth
- **Status:** Outdated - multi-tenant assumptions

### **SESSION_HANDOFF_Nov_5_2025.md**
- **Date:** November 5, 2025
- **Focus:** Git-first architecture pivot
- **Key Decision:** Move from Supabase tables to Git content storage
- **Status:** Historically important - architecture shift documented

### **SESSION_HANDOFF_Nov_5_2025_Keystatic.md**
- **Date:** November 5, 2025
- **Focus:** Keystatic installation and configuration
- **Issues:** Nested collections don't work for creation
- **Solution:** Flat structure with relationship fields
- **Status:** Still relevant for understanding Keystatic choices

### **SESSION_HANDOFF_Nov_6_2025_Git_APIs.md**
- **Date:** November 6, 2025 (morning)
- **Focus:** Git API testing, fork/publish endpoints
- **Status:** Partially relevant - APIs still work

### **SESSION_HANDOFF_Nov_6_2025_Infrastructure_First.md**
- **Date:** November 6, 2025 (afternoon)
- **Focus:** Dashboard reads from Git, Keystatic integration
- **Status:** Partially relevant - some features still valid

---

## 🔄 Major Architectural Changes (Timeline)

### **Phase 1: Supabase-Centric** (Nov 1-4, 2025)
- All content in Supabase tables
- Projects, updates, activities in database
- Dashboard queries database directly

### **Phase 2: Git-First Pivot** (Nov 5, 2025)
**Decision:** Move content to user-owned GitHub repos
- Content in Git (projects, streams, updates)
- Supabase only for: Auth, cache, safety logs
- Keystatic CMS for editing
- Dashboard reads from Git via GitHub API

### **Phase 3: Self-Hosted Refactoring** (Nov 6, 2025)
**Discovery:** We were building multi-tenant, but vision is self-hosted!
- Each user deploys their own workspace
- Owner/reader roles introduced
- Database refactored for roles
- Middleware refactored for permissions
- Environment config for self-hosting

---

## 📊 What These Handoffs Show

**Development Evolution:**
1. Started simple (Supabase database)
2. Realized user ownership matters (Git-first)
3. Realized deployment model matters (self-hosted)
4. Each pivot improved alignment with values

**Key Learnings:**
- User data ownership is critical
- Decentralization requires different architecture
- Multi-tenant assumptions were baked in everywhere
- Better to discover misalignment early than late

**Preserved Decisions:**
- Git-first content storage ✅ (still correct)
- Keystatic CMS ✅ (still correct)
- Flat content structure ✅ (still correct)
- Safety protocol system ✅ (still correct)

---

## 🔍 How to Use This Archive

**For Historical Context:**
- Understand why certain decisions were made
- See evolution of architecture thinking
- Learn from pivots and course corrections

**For Reference:**
- Check specific implementation details from old sessions
- Understand what was tried and why it changed
- See examples of completed work (some still valid)

**Don't Use For:**
- Current development (use latest handoff instead)
- Architecture decisions (outdated models)
- Implementation guides (refactored since)

---

## 📅 Archive Date

**Files Archived:** November 6, 2025
**Reason:** Architecture refactoring to self-hosted model
**Superseded By:** SESSION_HANDOFF_Nov6_2025_Architecture_Refactoring.md

---

**For current status, always refer to the latest documentation in the main docs/ folder.**
