# Roadmap

> Phased build plan for gettingstarted.sh with milestones, deliverables, and success criteria.

## Phase Dependencies

```
Phase 0 (Foundation)
   ↓
Phase 1 (Registry + Infrastructure)  ← blocked by: Loremi CMS core live
   ↓
Phase 2 (Community + Launch)         ← blocked by: Phase 1 complete, 50+ tools
   ↓
Phase 3 (Growth)                     ← blocked by: community momentum from Phase 2
```

---

## Phase 0 — Foundation (April 2026, current)

The simplest possible version. Ship with files, not a CMS.

### Deliverables

- [ ] File-based registry: YAML manifests in `tools/` directory
- [ ] Static Next.js site with landing page and registry table
- [ ] Individual tool pages generated from YAML at build time
- [ ] Browse page with category filtering
- [ ] PR-based contributions (fork → add YAML → submit PR)
- [ ] Seed 20 tools with complete manifests across all categories
- [ ] README.md — beginner-friendly, explains curl and irm
- [ ] CONTRIBUTING.md — step-by-step guide to adding a tool
- [ ] LICENSE (MIT), CODE_OF_CONDUCT.md, .env.example
- [ ] Deploy to Cloudflare Pages (or Vercel as backup)
- [ ] Register gettingstarted.sh domain
- [ ] Set up GitHub org `gettingstarted-sh`

### Success Criteria

- Site deployed and accessible at gettingstarted.sh
- 20+ tools in the registry with valid manifests
- External contributors can submit PRs following the guide
- No CMS dependency — fully self-contained

### Blockers

None. Phase 0 is self-contained.

---

## Phase 1 — Registry + Infrastructure (Weeks 5-8)

Integrate with Loremi CMS. Build the curl/irm handler.

### Deliverables

- [ ] Define CMS content types for gettingstarted.sh tenant (tools, setup_scripts, docs_pages, categories)
- [ ] Build manifest ingestion pipeline: GitHub PR → CI validates YAML → CMS API creates tool entry
- [ ] Build `curl` handler: Cloudflare Worker detects OS, serves shell install script
- [ ] Build `irm` handler: same Worker serves PowerShell script for Windows
- [ ] Static site rebuilds from CMS API at build time (Next.js SSG)
- [ ] 50 tools seeded with verified install scripts
- [ ] Tool docs pages auto-generated from manifest data
- [ ] Supabase PostgreSQL set up for CMS data

### Success Criteria

- `curl gettingstarted.sh/cursor | sh` works on macOS and Linux
- `irm gettingstarted.sh/cursor | iex` works on Windows PowerShell
- Smart package manager detection working (brew → snap → apt → npm → pip → cargo → fallback)
- CMS-backed registry with 50+ tools
- Site rebuilds automatically when CMS content changes

### Blockers

- Loremi CMS core must be live and accepting tenants
- Cloudflare account with Workers and R2 access
- Domain DNS configured to point to Cloudflare

---

## Phase 2 — Community + Launch (Weeks 9-12)

Go public. Build community. Get traction.

### Deliverables

- [ ] Full CI pipeline: lint manifests, validate install scripts, auto-merge verified tools
- [ ] Community contributor guide battle-tested with real external contributors
- [ ] ProductHunt launch
- [ ] Show HN post
- [ ] Twitter/X announcement thread
- [ ] Reddit posts across target subreddits (r/LocalLLaMA, r/ChatGPT, r/vibecoding, r/commandline, r/devtools)
- [ ] Outreach to 5+ tool creators for verified listings
- [ ] Blog post: "Why we built gettingstarted.sh"
- [ ] "Good first issue" labels set up for newcomer contributors
- [ ] og:image social preview configured

### Success Criteria

- 100+ GitHub stars
- First external contributors (non-team PRs merged)
- At least 1 tool creator has verified their listing
- Community is self-sustaining: issues get opened, PRs get submitted without prompting

### Blockers

- Phase 1 complete (curl/irm handlers working)
- 50+ tools for launch credibility
- README and CONTRIBUTING polished for non-technical visitors

---

## Phase 3 — Growth (Q3-Q4 2026)

Scale the registry. Explore revenue.

### Deliverables

- [ ] 100+ tools in registry across all categories
- [ ] 1,000+ GitHub stars
- [ ] Featured in developer onboarding flows
- [ ] Tool creators linking to gettingstarted.sh from their own docs
- [ ] Monthly changelog and contributor spotlights
- [ ] Revenue exploration: sponsored tool listings, premium enterprise registry
- [ ] Hosted team workspaces (companies curate tool stacks for their teams)
- [ ] Usage analytics for tool creators

### Success Criteria

- Recognized as the canonical AI tool setup registry
- Self-sustaining community with regular external contributions
- Revenue pilot generating first dollars
- At least 3 AI companies officially partnered or linking to the registry

### Blockers

- Community momentum from Phase 2
- Enough tools and stars to be credible as "the" registry
- Legal/business setup for revenue features
