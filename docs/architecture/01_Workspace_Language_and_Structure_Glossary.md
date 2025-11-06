# Workspace Language and Structure Glossary (v2)

**Authors:** Ali · Lumen · Claude
**Date:** 2025-10-22
**Last Updated:** 2025-11-06 (Architecture Refactoring)
**Purpose:** Unified terminology and naming conventions for the Workspace ecosystem to ensure clarity and consistency across development, documentation, and interface design.

**⚠️ MAJOR UPDATE (Nov 6, 2025):** Architecture refactored to self-hosted deployment model with owner/reader roles. "Streams" renamed to "Sub-Projects" for clarity.

---

## 1. Deployment Model

### Self-Hosted Architecture
**Definition:** Each researcher deploys their own independent workspace instance on their own Vercel account. There is no centralized multi-tenant deployment.

**Key Traits:**
- User owns their deployment, data, and infrastructure
- Each workspace has ONE owner (the person who deployed it)
- Owner can optionally enable reader (guest) accounts
- Content lives in user-owned GitHub repositories
- Supabase used only for: Auth, metadata cache, safety logs
- Full data portability (export, fork, migrate)

**Examples:**
- Ali deploys: `alis-workspace.vercel.app` (Ali's Vercel account)
- Sarah deploys: `sarahs-workspace.vercel.app` (Sarah's Vercel account)
- Arc^ deploys: `arc-commons.vercel.app` (Arc^ org Vercel account)

---

## 2. User Tiers

### Owner (Workspace Deployer)
**Definition:** The person who deployed the workspace. Has full control over their instance.

**Key Traits:**
- First user to deploy automatically becomes owner
- Full access to all features: Keystatic, settings, repo management
- Can enable/disable reader accounts
- Can moderate reader suggestions
- Owns the deployment infrastructure and costs

### Reader (Lightweight Guest)
**Definition:** A guest account on someone else's workspace, created to access gated content.

**Key Traits:**
- Signs up via magic link or Google OAuth
- Can read public content without account
- Can read gated content after acknowledging safety/license
- Can leave suggestions (if owner allows)
- Cannot edit content, cannot access owner tools
- No GitHub account required
- Stored in owner's Supabase

### Researcher (Self-Hosted User)
**Definition:** Someone who has deployed their own workspace (they are an owner of their own instance).

**Key Traits:**
- Has their own workspace deployment
- Full onboarding: GitHub OAuth, repo fork, Keystatic access
- Can create projects, sub-projects, methods, data
- Can collaborate via GitHub (fork/PR workflow)
- Owns their data completely

### Commons Contributor
**Definition:** Someone contributing to an organizational commons workspace (like Arc^).

**Key Traits:**
- Works on commons projects (Arc^ plasma research, etc.)
- May have direct access (core team) or PR access (external contributors)
- Subject to commons governance and review processes
- Shares Commons Safety Registry (no duplicate acknowledgments)

---

## 3. Core Concepts

### Commons Workspace (Organizational)
**Definition:** An organizational workspace representing a collective research effort (like Arc^). It's a self-hosted deployment managed by an organization, where contributors submit work for review and verification.

**Key Traits:**
- Self-hosted on org's Vercel account (e.g., Arc^ deploys `arc-commons.vercel.app`)
- Manual publishing only (human + automated checks)
- Strong governance — linked to ethical and safety frameworks
- Houses verified data, documentation, and visualizations
- Core team has direct access, external contributors submit via PR
- Commons Safety Registry (shared acknowledgment tracking)
- Acts as authoritative source for verified research

**Example:**
- **Arc^ Commons** (plasma systems for ecological resilience)
  - Deployed at: `arc-commons.vercel.app`
  - GitHub org: `arc-plasma` or similar
  - Content repos: `arc-plasma-systems`, `arc-soil-regeneration`, etc.
  - Core team: Ali (founder), + future co-founders
  - External contributors: Submit PRs from their own workspaces

**Access Tiers:**
- Core Team → Direct repo access, can merge
- External Contributors → Fork/PR workflow
- Readers → Can view public content, acknowledge safety to view gated

---

### Personal Workspace (Self-Hosted)
**Definition:** An individual researcher's self-hosted workspace, designed for autonomy, exploration, and expression. Each researcher deploys their own independent instance.

**Key Traits:**
- Self-hosted on researcher's Vercel account
- Owner has full control (Keystatic, settings, repo management)
- Content lives in owner's GitHub repo (`workspace-{username}`)
- Auto-publishing within personal domain (owner decides when to publish)
- Multi-project support with sub-projects (hierarchical organization)
- Lightweight, Git-backed CMS (Keystatic)
- Private by default, can be made public with CC licenses
- Optional reader accounts (guests who want to read gated content)
- Can collaborate with other researchers via GitHub (fork/PR)
- Option to submit work to Commons when ready

**Example:**
- **Ali's Workspace**
  - Deployed at: `alis-workspace.vercel.app` (Ali's Vercel account)
  - Content repo: `workspace-ali` (Ali's GitHub)
  - Owner: Ali (full access)
  - Readers: Optional (people reading his gated research)
  - Projects: "Plasma Systems for Ecology", "Remote Sensing for Salt Marshes", etc.
  - Can submit to Arc^ Commons when work is ready


---

### Sub-Project (formerly "Stream")
**Definition:** A hierarchical sub-division of a project, representing a phase, aspect, or nested experiment within research.

**Key Traits:**
- Can be nested infinitely (Project → Sub-Project → Sub-Sub-Project → ...)
- Useful for organizing phases (Design, Testing, Deployment)
- Useful for aspects (Hardware, Software, Data Analysis)
- Each can have its own methods, docs, updates, data
- Hierarchy displayed with breadcrumbs and tree navigation

**Terminology Change (Nov 6, 2025):**
- OLD: "Streams" (confusing, multiple meanings)
- NEW: "Sub-Projects" (clear, supports hierarchy)

**Example Hierarchy:**
```
Project: Plasma Systems for Ecology
  ├─ Sub-Project: Design Phase
  │   ├─ Sub-Project: Schematic Refinement
  │   └─ Sub-Project: Material Selection
  ├─ Sub-Project: Testing Phase
  │   └─ Sub-Project: Bench Testing
  └─ Sub-Project: Deployment Phase
```

---

## 4. Relationship Flow (Personal ↔ Commons)

### Distributed Collaboration Model

```
Personal Workspace (Ali)        Personal Workspace (Sarah)
  alis-workspace.vercel.app       sarahs-workspace.vercel.app
         ↓                                  ↓
    workspace-ali repo              workspace-sarah repo
         ↓                                  ↓
         └──────────────┬────────────────────┘
                        ↓
                 Fork & Submit PR
                        ↓
              Commons Workspace (Arc^)
              arc-commons.vercel.app
                        ↓
         Human Review + Automated Validation
                        ↓
              Verified Publication (public)
```

| Flow | Direction | Description |
|------|-----------|-------------|
| **Data** | Personal → Commons | Researchers submit completed work via PR |
| **Guidelines & Safety** | Commons → Personal | Commons provides safety protocols, standards |
| **Acknowledgement** | Commons → Personal | Commons Safety Registry tracks acknowledgments |
| **Collaboration** | Personal ↔ Personal | Researchers fork each other's repos, submit PRs |

**Metaphor:** The Personal Workspaces are gardens; the Commons Workspaces are forests. The former are places of cultivation and experimentation; the latter, shared ecological systems of verified growth. Gardens can exchange seeds (fork/PR), and forests curate the best specimens (review/merge).

---

## 3. Action Verbs

| Verb | Definition | Context |
|------|------------|---------|
| **Submit** | Send personal update/data for Commons review | Personal → Commons |
| **Verify** | Human + automated safety and schema checks | Commons internal |
| **Merge** | Integrate verified submission into Commons repo | Commons internal |
| **Publish** | Release verified content to the public | Commons → Public |
| **Acknowledge** | Confirm updated safety requirements | User action |

---

## 5. Naming Conventions

### Repository Naming (Standardized Nov 6, 2025)
| Type | Pattern | Example | Notes |
|------|---------|---------|-------|
| Personal Content Repo | `workspace-{username}` | `workspace-ali` | User's content lives here |
| Commons Content Repo | `arc-{project}` | `arc-plasma-systems` | Commons project repos |
| Template Repo | `workspace-template` | `workspace-template` | Official template for forking |

**Important:** Repository names do NOT include "by" (e.g., NOT `workspace-by-ali`). "Workspace by Ali" is the product/brand name only.

### Folder Structure
| Location | Purpose |
|----------|---------|
| `/projects.json` | Defines which Commons Workspaces a user belongs to |
| `/safety.yml` | Defines stream-specific safety protocols |
| `/visuals/` | Generated plots and data products |
| `/updates/` | Markdown posts created via CMS |
| `/data/` | Uploaded CSV/JSON files, pre-verification |
| `/schemas/` | JSON schemas for validation |

---

## 5. User Roles & Access Levels

| Role | Access | Capabilities |
|------|--------|--------------|
| **User** | Personal Workspace + approved Commons | Create, submit, view own content |
| **Contributor** | User + specific stream access | Submit to assigned streams |
| **Reviewer** | All submissions in assigned streams | Review, approve, reject submissions |
| **Admin** | Full Commons Workspace | Manage users, streams, settings, publish |
| **Public** | Published content only | Read verified data, view visualizations |

---

## 6. Content Types

| Type | Description | Location |
|------|-------------|----------|
| **Update** | Research progress post | Personal or Commons |
| **Experiment** | Structured experimental data | Commons (verified) |
| **Dataset** | CSV/JSON data files | Commons (verified) |
| **Visualization** | Generated charts/graphs | Commons (public) |
| **Documentation** | Methodology, protocols | Commons (gated) |
| **Reflection** | Personal notes, insights | Personal only |

---

## 7. Safety & Protocol Terms

| Term | Definition |
|------|------------|
| **Stream** | Thematic branch of a Commons (e.g., Biology, Hardware, Soil) |
| **Safety File** | `/safety.yml` defining per-stream protocol version |
| **Safety Version** | Versioned protocol identifier (e.g., `v1.2.3`) |
| **Acknowledgment** | User confirmation of reading and understanding safety protocols |
| **Safety Badge** | Visual indicator: 🟢 current · 🟡 pending · 🔴 required |
| **Re-sign** | Required when switching to new stream or major protocol change |

---

## 8. Status States

### Submission Status
| Status | Meaning | Who Can Transition |
|--------|---------|-------------------|
| **draft** | Work in progress, not submitted | User |
| **pending** | Submitted, awaiting review | System (on submit) |
| **verified** | Approved by reviewer | Reviewer |
| **published** | Live on public site | Admin or auto |

### Project Visibility
| Visibility | Who Can View |
|------------|--------------|
| **public** | Everyone (including non-authenticated) |
| **private** | Only project members |
| **restricted** | Specific approved users |

---

## 9. Technical Terms

| Term | Definition |
|------|------------|
| **RLS** | Row Level Security (Supabase database policies) |
| **Edge Function** | Serverless function running on Supabase edge network |
| **Signed URL** | Time-limited, secure link to storage object |
| **Schema Validation** | JSON Schema or Zod type checking |
| **Audit Log** | Immutable record of actions (who, what, when) |
| **GitHub App** | Fine-grained bot for repo operations |

---

## 10. UI/UX Terms

| Term | Definition |
|------|------------|
| **Project Switcher** | Dropdown/tabs to change active project context |
| **Dashboard** | Main view showing projects, stats, recent activity |
| **Profile** | Public-facing page showing user's work |
| **Contributions** | List of accepted submissions to Commons |
| **Gated Content** | Content requiring safety acknowledgment |
| **Onboarding Flow** | First-time setup wizard |

---

## 11. Guiding Principles

- **Transparency:** All published data must cite authors and licenses
- **Safety:** Never compromise researcher security or data integrity
- **Open Source:** Prefer free, community-maintained tools
- **Ethics:** Follow the Repractice Framework — openness without extractivism
- **Performance:** Keep deploys small, fast, and accessible
- **Recognition:** Always attribute contributors visibly, both Personal and Commons sides
- **Gratitude:** Every borrowed component is acknowledged in code and docs

---

**End of Glossary**
_This document serves as the authoritative reference for all Workspace terminology._
