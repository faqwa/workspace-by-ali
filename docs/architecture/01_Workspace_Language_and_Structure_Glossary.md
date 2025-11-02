# Workspace Language and Structure Glossary (v1)

**Authors:** Ali · Lumen · Claude
**Date:** 2025-10-22
**Purpose:** Unified terminology and naming conventions for the Workspace ecosystem to ensure clarity and consistency across development, documentation, and interface design.

---

## 1. Core Concepts

### Commons Workspace
**Definition:** The verified, project-level environment that represents an entity like ArcUp, Remote Sensing, or any collective research effort. It is the custodian of integrity — where all user contributions flow into for review, validation, and public release.

**Key Traits:**
- Manual publishing only (human + automated checks)
- Strong governance — linked to ethical and safety frameworks
- Houses verified data, documentation, and visualizations
- Access tiers: Admins → Reviewers → Approved Contributors → Public viewers
- Acts as the "Commons Node" in a federated network

**Example Repositories:**
- `commons-arcup/`
- `commons-remote-sensing/`
- `commons-soil-systems/`

**Example Domains:**
- `arcup.xbyali.page`
- `commons.xbyali.page`

---

### Personal Workspace
**Definition:** The individual researcher's environment, designed for autonomy, exploration, and expression. This is where drafts, reflections, and early data live — each user's lab bench within the ecosystem.

**Key Traits:**
- Auto-publishing (no review gate within personal domain)
- Multi-project navigation tabs — easy context switching between connected Commons Workspaces
- Lightweight, Markdown-based interface (via CMS)
- Supports both technical and reflective writing — notes, updates, art, insights
- Option to submit work to a Commons Workspace when ready
- Ethical baseline inherited from parent Commons (users must pass initial safety onboarding)

**Example Repositories:**
- `workspace-ali/`
- `workspace-leila/`
- `workspace-dr_singh/`

**Example Domains:**
- `workspace.xbyali.page/ali`
- `workspace.xbyali.page/leila`

---

## 2. Relationship Between the Two

```
Personal Workspace  →  Submission (API/PR)  →  Commons Workspace
                                   ↓
                 Human Review + Automated Validation
                                   ↓
                      Verified Publication (public data)
```

| Flow | Direction | Description |
|------|-----------|-------------|
| **Data** | Upward | Personal → Commons → Public |
| **Guidelines & Safety** | Downward | Commons → Personal |
| **Acknowledgement & Learning** | Both | Researchers learn, Commons gains data |

**Metaphor:** The Personal Workspaces are gardens; the Commons Workspaces are forests. The former are places of cultivation and experimentation; the latter, shared ecological systems of verified growth.

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

## 4. Naming Conventions

### Repository Naming
| Type | Pattern | Example |
|------|---------|---------|
| Commons Workspace | `commons-{project}` | `commons-arcup` |
| Personal Workspace | `workspace-{username}` | `workspace-ali` |

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
