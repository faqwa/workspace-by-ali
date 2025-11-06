# Workspace Scripts

## Session Updater

Automatically generate session handoff documents based on git history and project state.

### Usage

```bash
# Generate for today's date
npx tsx scripts/session-updater.ts

# Generate for specific date
npx tsx scripts/session-updater.ts --date=2025-11-04
```

### What it does:

1. **Analyzes Git History**
   - Finds commits since last session handoff
   - Lists files created, modified, deleted
   - Counts lines added/deleted

2. **Scans Project Structure**
   - Lists all API endpoints (`/api/*`)
   - Lists all React components (`*.tsx`, `*.jsx`)
   - Lists all Astro pages (`*.astro`)

3. **Generates Markdown**
   - Creates formatted session handoff document
   - Saves to `docs/SESSION_HANDOFF_YYYY-MM-DD_AUTO.md`
   - Includes statistics and file listings

### Output Format:

```markdown
# Session Handoff - 2025-11-04

## 📊 Session Summary
- Files Changed: 15
- Files Created: 8
- API Endpoints: 10
- Components: 6
- Pages: 9

## 📝 Git Commits
- commits listed here

## ✨ Files Created
- new files listed here

## 🔌 API Endpoints
- GET /api/projects
- POST /api/projects
- etc...
```

### Manual Notes:

After generation, manually add:
- What was accomplished
- Known issues or blockers
- Next steps
- Important decisions made

### Installation:

Ensure `tsx` is available:

```bash
npm install -D tsx
```

Add to package.json scripts (optional):

```json
{
  "scripts": {
    "session": "tsx scripts/session-updater.ts"
  }
}
```

Then run with:

```bash
npm run session
npm run session -- --date=2025-11-04
```
