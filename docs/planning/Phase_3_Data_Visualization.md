# Phase 3: Data Visualization Pipeline (Now Phase 4)

**Timeline:** 4-6 weeks (original estimate)
**Goal:** Process and display experimental data with beautiful visualizations

**⚠️ PHASE SHIFTED (Nov 6, 2025):** Phases renumbered after architecture refactoring. This is now Phase 4 (Data Visualization comes after Commons).

**📖 See updated roadmap:** [00_Master_Roadmap.md](./00_Master_Roadmap.md)

---

## Prerequisites

- Phase 2 completed (Commons can receive and publish submissions)
- Test datasets available for visualization
- Python environment requirements documented

---

## Deliverables

By the end of Phase 3:
- ✅ Python visualization microservice operational
- ✅ Data upload and parsing functional
- ✅ Multiple chart types supported
- ✅ Visualizations cached and served efficiently
- ✅ Public data gallery live
- ✅ Download functionality for raw data

---

## Week 1-2: Python Microservice Setup

### Step 1.1: Infrastructure Decision
Choose one:
- **Option A:** GitHub Actions (free, simple, periodic jobs)
- **Option B:** Railway free tier (persistent service)
- **Option C:** Render free tier (persistent service)
- **Option D:** Supabase Edge Functions with Deno

Document decision and rationale.

### Step 1.2: FastAPI Service Setup (If Option B/C)
- [ ] Create new repo `workspace-visualization-service`
- [ ] Set up FastAPI project structure
- [ ] Configure Python dependencies:
  - pandas (data processing)
  - matplotlib (static charts)
  - plotly (interactive charts)
  - pillow (image processing)
- [ ] Create Dockerfile for deployment
- [ ] Set up health check endpoint

### Step 1.3: GitHub Actions Setup (If Option A)
- [ ] Create workflow `.github/workflows/visualize.yml`
- [ ] Configure triggers (manual dispatch, webhook)
- [ ] Set up Python environment in action
- [ ] Install dependencies
- [ ] Configure artifact storage

### Step 1.4: Security Sandboxing
- [ ] Implement execution timeout (max 5 minutes)
- [ ] Limit memory usage (max 512MB)
- [ ] Restrict file system access
- [ ] Validate all inputs
- [ ] Sanitize file paths
- [ ] Implement rate limiting

**Deliverable:** Visualization service infrastructure ready

---

## Week 3-4: Visualization Pipeline

### Step 2.1: Data Upload & Parsing
- [ ] Create `/api/upload-data` endpoint
- [ ] Support file formats:
  - CSV (comma-separated values)
  - JSON (structured data)
  - Excel (XLSX)
- [ ] Parse and validate structure
- [ ] Store in Supabase Storage
- [ ] Return data preview

### Step 2.2: Chart Generation API
Create endpoints for chart types:
- [ ] `/api/visualize/line` - Line charts (time series)
- [ ] `/api/visualize/bar` - Bar/column charts
- [ ] `/api/visualize/scatter` - Scatter plots
- [ ] `/api/visualize/heatmap` - Heatmaps
- [ ] `/api/visualize/box` - Box plots
- [ ] `/api/visualize/histogram` - Histograms

Each endpoint should:
- Accept data and configuration
- Validate inputs
- Generate chart
- Return image URL or JSON

### Step 2.3: Chart Configuration Options
Allow users to customize:
- [ ] Title and axis labels
- [ ] Colors and themes
- [ ] Legend position
- [ ] Grid lines
- [ ] Annotations
- [ ] Size/dimensions
- [ ] Export format (PNG, SVG, JSON)

### Step 2.4: Caching Layer
- [ ] Generate content hash for each visualization
- [ ] Check if visualization already exists
- [ ] Serve from cache if available
- [ ] Set appropriate cache headers
- [ ] Implement cache invalidation strategy

**Deliverable:** Can generate various chart types from data

---

## Week 5-6: Integration & Public Gallery

### Step 3.1: Visualization UI in Personal Workspace
- [ ] Add "Visualize Data" button in update editor
- [ ] Create visualization builder interface:
  - Upload CSV
  - Select chart type
  - Configure options
  - Preview
  - Save to update
- [ ] Embed visualizations in markdown
- [ ] Show loading states during generation

### Step 3.2: Automatic Visualization for Submissions
- [ ] Detect data files in submissions
- [ ] Automatically generate standard charts
- [ ] Attach visualizations to submission
- [ ] Display in review dashboard
- [ ] Include in published content

### Step 3.3: Public Data Gallery
- [ ] Create `/data` page on Commons site
- [ ] Build gallery grid view
- [ ] Filter by:
  - Stream
  - Chart type
  - Date range
  - Author
- [ ] Search functionality
- [ ] Pagination or infinite scroll

### Step 3.4: Interactive Visualization Viewer
- [ ] Create detail view for each visualization
- [ ] Display metadata:
  - Title, description
  - Author, date
  - Data source
  - Chart configuration
- [ ] Show full-size interactive chart (Plotly)
- [ ] Add zoom, pan, hover tooltips
- [ ] Link to related submissions

### Step 3.5: Data Download Functionality
- [ ] Add "Download Data" button
- [ ] Support formats:
  - Original CSV
  - Processed JSON
  - Image (PNG, SVG)
- [ ] Include citation information
- [ ] Track download counts
- [ ] Respect data licensing

**Deliverable:** Complete visualization pipeline from upload to public display

---

## Documentation & Tools

### For Users
- [ ] Document how to prepare data for upload
- [ ] Create visualization gallery with examples
- [ ] Provide chart type selection guide
- [ ] Document data formatting requirements
- [ ] Create troubleshooting guide

### For Developers
- [ ] Document API endpoints
- [ ] Provide Python code examples
- [ ] Document local visualization development
- [ ] Create testing datasets
- [ ] Document caching strategy

---

## Testing

- [ ] Test all chart types with sample data
- [ ] Test with various data sizes (10 rows to 10,000 rows)
- [ ] Test malformed data handling
- [ ] Test concurrent requests
- [ ] Performance testing (generation time)
- [ ] Test on mobile devices (image loading)
- [ ] Test accessibility of charts (alt text, labels)

---

## Performance Optimization

- [ ] Implement lazy loading for images
- [ ] Use WebP format for better compression
- [ ] Generate multiple sizes (thumbnail, full)
- [ ] Implement CDN caching
- [ ] Optimize Python code for speed
- [ ] Add progress indicators for slow operations

---

## Security Considerations

- [ ] Validate all data inputs
- [ ] Sanitize file names
- [ ] Prevent code injection in data
- [ ] Limit data processing time
- [ ] Monitor for abuse (rate limiting)
- [ ] Audit generated visualizations
- [ ] Implement data privacy controls

---

## Success Criteria

Phase 3 is complete when:
1. All 6 chart types work reliably
2. At least 10 visualizations generated from real data
3. Public gallery displays all visualizations
4. Users can generate visualizations independently
5. Performance is acceptable (<10s generation time)
6. No security vulnerabilities found
7. Documentation complete

---

## Known Limitations (To Address in Phase 4)

- Limited chart customization options
- No real-time/streaming data support
- No collaborative visualization editing
- No version history for visualizations
- Limited 3D visualization support

---

**Next:** Phase 4 - Integration & Polish
