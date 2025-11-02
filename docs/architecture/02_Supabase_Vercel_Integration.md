# Workspace Architecture — Supabase + Vercel Integration (v1.1)

**Authors:** Ali · Lumen · Claude
**Date:** 2025-10-22
**Purpose:** Unified hosting strategy and technical architecture for the Workspace ecosystem.

---

## 1. Context

Workspace requires a secure, scalable backend while maintaining free-tier compliance and simple deployment. This document defines the **Supabase + Vercel** integration as the core architecture.

**Decision:** Host **everything within Vercel + Supabase**, with optional free external compute only when necessary.

---

## 2. Core Decision — Supabase + Vercel Integration

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend (UI)** | Vercel + Astro + Astrowind | Website delivery, static caching, CMS integration |
| **Auth & DB** | Supabase | Authentication (OAuth, magic links), user roles, Row Level Security (RLS) |
| **Storage** | Supabase Storage | Uploads, signed URLs, safety documents, media |
| **Server Logic** | Supabase Edge Functions | Validation, schema enforcement, review workflows (JavaScript/TypeScript) |
| **Optional Compute** | GitHub Actions or Railway/Render (free tier) | For heavy Python visualization when needed |

This satisfies: **Free plan**, **secure**, **centralized**, and **scalable**.

---

## 3. Architecture Flow

```
Personal Workspace (Vercel)
     ↓  Submit via API (Supabase Edge Function)
Commons Workspace (Vercel UI)
     ↓  Reads verified data from Supabase DB + Storage
     ↓  Optionally triggers GitHub Action for Python visualization
```

- **Auth** handled once via Supabase (shared session between Personal + Commons)
- **Submissions** stored as DB records (status: draft → pending → verified → published)
- **Storage** holds uploaded datasets and generated artifacts
- **Edge Functions** perform lightweight checks (schema, safety)
- **GitHub Actions** handle periodic or triggered heavy tasks (visualizations, linting)

---

## 4. Why Supabase Works

✅ **Free Tier Friendly** — 500 MB Postgres, 1 GB Storage, generous function/runtime quota
✅ **Unified Stack** — Auth + DB + Storage + Functions under one API key
✅ **Security** — RLS and Policies let us enforce project/stream-level visibility
✅ **Realtime Support** — enables live submission status and notifications
✅ **Edge Functions** — act as backend routes; replace most Vercel Functions
✅ **Scales Later** — paid plan unlocks bigger DB + dedicated compute

---

## 5. Database Schema

### **users**
Stores all authenticated user profiles and permissions.

```sql
create table users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  full_name text,
  username text unique,
  bio text,
  avatar_url text,
  role text check (role in ('user', 'reviewer', 'admin')) default 'user',
  created_at timestamp default now(),
  last_signin timestamp
);
```

**Policy:** users can read their own record; admins can read all.

```sql
create policy "Users can view own data" on users
for select using (auth.uid() = id or exists(
  select 1 from users u where u.role = 'admin' and u.id = auth.uid()
));
```

---

### **projects**
Represents individual research projects (both Personal and Commons level).

```sql
create table projects (
  id uuid primary key default uuid_generate_v4(),
  owner uuid references users(id) on delete cascade,
  name text not null,
  description text,
  category text,
  visibility text check (visibility in ('public','private')) default 'private',
  created_at timestamp default now()
);
```

**Policy:** only project owner or admins can update; public if visibility='public'.

```sql
create policy "Users manage own projects" on projects
for all using (auth.uid() = owner);

create policy "Public projects visible to all" on projects
for select using (visibility = 'public');
```

---

### **streams**
Defines research streams (domains) within each project.

```sql
create table streams (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  name text not null,
  description text,
  schema_url text, -- link to JSON schema for data validation
  safety_version text,
  created_at timestamp default now()
);
```

---

### **submissions**
Logs all user submissions to a Commons Workspace.

```sql
create table submissions (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id) on delete cascade,
  stream_id uuid references streams(id),
  user_id uuid references users(id) on delete cascade,
  title text not null,
  description text,
  data_url text, -- Supabase Storage link
  artifact_url text, -- generated visualization or processed artifact
  safety_version text,
  status text check (status in ('draft','pending','verified','published')) default 'draft',
  created_at timestamp default now(),
  updated_at timestamp default now()
);
```

**Policy:** users can read/write own; reviewers can update status; public can view published.

```sql
create policy "Users manage their own submissions" on submissions
for all using (auth.uid() = user_id);

create policy "Reviewers can verify" on submissions
for update using (exists(
  select 1 from users u
  where u.id = auth.uid()
  and u.role in ('reviewer','admin')
));

create policy "Public can read published" on submissions
for select using (status = 'published');
```

---

### **safety_logs**
Tracks signed acknowledgments of safety protocols per user per stream.

```sql
create table safety_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  stream_id uuid references streams(id),
  protocol_version text,
  signed_at timestamp default now(),
  acknowledgment boolean default true
);
```

**Purpose:** Gate access to streams requiring latest safety acknowledgment.

---

### **visualizations**
Caches metadata of generated artifacts for Commons dashboards.

```sql
create table visualizations (
  id uuid primary key default uuid_generate_v4(),
  submission_id uuid references submissions(id) on delete cascade,
  chart_type text,
  format text,
  url text,
  checksum text,
  created_at timestamp default now()
);
```

---

## 6. Supabase Storage Layout

```
/storage
  /uploads/<user_id>/<filename>
  /artifacts/<project_id>/<hash>.png
  /schemas/<stream_id>/schema.json
  /safety/<stream_id>/protocol.pdf
```

All files use **signed URLs (15-minute TTL)**. Artifacts are immutable (content-hash filenames).

---

## 7. Edge Functions

### `/functions/validate-submission/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

serve(async (req) => {
  const body = await req.json();

  const schema = z.object({
    title: z.string().min(3),
    project_id: z.string().uuid(),
    stream_id: z.string().uuid(),
    data_url: z.string().url(),
  });

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error }), { status: 400 });
  }

  // Check safety acknowledgment
  const { project_id, stream_id, user_id } = body;
  const { data } = await supabase
    .from('safety_logs')
    .select('*')
    .eq('user_id', user_id)
    .eq('stream_id', stream_id)
    .single();

  if (!data) {
    return new Response(
      JSON.stringify({ error: 'Safety acknowledgment required' }),
      { status: 403 }
    );
  }

  // Insert submission record
  const { error } = await supabase
    .from('submissions')
    .insert([{ ...body, status: 'pending' }]);

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
});
```

---

## 8. Environment Variables

### Vercel Environment Variables
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Local Development (.env.local)
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

---

## 9. Schema Diagram

```
users ─┬─< projects ─┬─< streams ─┬─< submissions ─┬─< visualizations
       │              │             └─< safety_logs
       │              └─< submissions
```

---

## 10. Security & Compliance

- **Auth:** Supabase Auth (OAuth + 2FA)
- **Secrets:** Encrypted environment variables in Vercel; quarterly rotation
- **Storage:** Signed URLs (15 min TTL), AV scan, MIME/type whitelist
- **Validation:** Zod/JSON-Schema; sanitize Markdown and filenames
- **Network:** HTTPS only, CSP, HSTS, CSRF tokens, rate limiting
- **Audit:** Immutable logs (user, IP, timestamp, hash)
- **CI/CD:** Dependabot + CodeQL + pinned lockfiles
- **Legal:** GDPR-compliant data handling and delete-on-request functionality

---

## 11. Hosting & Domain Strategy

| Component | Host | Domain |
|-----------|------|--------|
| **Personal Workspaces** | Vercel | `workspace.xbyali.page` |
| **Commons Workspaces** | Vercel | `arcup.xbyali.page` |
| **Static Verified Data** | Vercel CDN | Same domains |
| **Storage** | Supabase Storage | Internal URLs with signed access |
| **Database** | Supabase Postgres | Internal |

**Development:**
- `workspace-by-ali.vercel.app` (free Vercel subdomain)

---

## 12. Benefits Summary

✅ Unified hosting (Vercel + Supabase only)
✅ Free and open-source-aligned
✅ Minimal DevOps burden
✅ Shared Auth across both layers
✅ Future-proof: add Railway/Render only if compute expands
✅ Maintains full safety, schema, and ethical governance

---

**End of Document**
_This architecture provides the technical foundation for all Workspace development._
