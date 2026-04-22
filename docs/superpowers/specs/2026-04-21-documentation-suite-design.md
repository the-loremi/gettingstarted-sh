# Documentation Suite Design — gettingstarted.sh

**Date:** 2026-04-21
**Status:** Approved
**Author:** Barnabas Oretan + Claude

---

## Context

gettingstarted.sh is a pre-launch, open-source setup registry for AI tools. Users run `curl gettingstarted.sh/[tool] | sh` (macOS/Linux) or `irm gettingstarted.sh/[tool] | iex` (Windows PowerShell) to install any tool in the registry with smart package manager detection.

The project currently has:
- A Next.js 16 static site with a landing page
- Strategic reference docs in `inspo/` (README.md, gettingstarted.md, gettingstarted.html)
- No public-facing documentation, no LICENSE, no CONTRIBUTING guide, no CI/CD
- One git commit on `master`

This spec defines the complete documentation suite needed to make the project open-source-ready and strategically coherent.

## Audience

**Primary:** Non-technical people who want to get started with AI tools. The tone across all public docs must be welcoming, jargon-free, and assume zero command-line experience.

**Secondary:** Developers contributing tools via PRs (YAML manifests).

**Tertiary:** Maintainers managing the registry, CMS, and deployments.

## Approach

**Approach 2: Organized by purpose.** Two layers:

1. **Repo root** — public-facing files GitHub surfaces to visitors (README, CONTRIBUTING, LICENSE, CODE_OF_CONDUCT, .env.example)
2. **inspo/** — internal planning docs organized into subdirectories by purpose (strategy, technical, community)

Existing files in `inspo/` (README.md, gettingstarted.md, gettingstarted.html) remain untouched as original reference material.

## File Structure

```
gettingstarted.sh/
├── README.md                          # Public: project intro (rewrite)
├── CONTRIBUTING.md                    # Public: how to add a tool
├── LICENSE                            # Public: MIT
├── CODE_OF_CONDUCT.md                 # Public: Contributor Covenant
├── .env.example                       # Dev setup: env vars template
├── inspo/
│   ├── README.md                      # (existing, untouched)
│   ├── gettingstarted.md              # (existing, untouched)
│   ├── gettingstarted.html            # (existing, untouched)
│   ├── strategy/
│   │   ├── vision.md                  # What, why, market positioning
│   │   ├── roadmap.md                 # Phased build plan
│   │   └── growth-and-launch.md       # Distribution playbook
│   ├── technical/
│   │   ├── architecture.md            # System design, data flow
│   │   ├── manifest-spec.md           # YAML schema reference
│   │   ├── install-resolution.md      # Smart detection algorithm
│   │   ├── sitemap.md                 # All pages/routes
│   │   └── accounts-and-services.md   # External services checklist
│   └── community/
│       └── launch-playbook.md         # Step-by-step launch checklist
```

**14 documents total.**

---

## Document Specifications

### Root: README.md (rewrite)

**Purpose:** First thing visitors see. Must convert a non-technical person into a user or contributor within 30 seconds of reading.

**Structure:**
1. Title: "gettingstarted.sh" + tagline "Every tool. One command."
2. One-paragraph explanation in plain English (no jargon)
3. Install examples for all platforms:
   - macOS/Linux: `curl gettingstarted.sh/cursor | sh`
   - Windows: `irm gettingstarted.sh/cursor | iex`
4. "What happens when you run it" — plain English walkthrough of smart detection (checks for brew/winget/npm/etc., picks the best, falls back to direct install)
5. Registry preview table (5 tools: Cursor, Claude Code, Ollama, Runway, ElevenLabs)
6. "Add a tool" — 3-step summary linking to CONTRIBUTING.md
7. Tech stack (brief, one table)
8. "A The Loremi Ltd project" branding
9. MIT license badge

**Tone:** Friendly, accessible. Explain what `curl | sh` and `irm | iex` mean for people who've never used a terminal. Include a "What is a terminal?" expandable section or link.

### Root: CONTRIBUTING.md

**Purpose:** Enable anyone to add a tool to the registry via a GitHub PR.

**Structure:**
1. Welcome message + "Your first contribution" walkthrough
2. Step-by-step: Fork → create `tools/[name].yaml` → fill manifest → submit PR
3. Complete manifest schema with every field explained:
   - name, slug, category, version, homepage, description, os, verified
   - `install:` block: brew, winget, choco, scoop, snap, apt, npm, pip, cargo
   - Fallback scripts: mac (`curl | sh`), linux (`curl | sh`), win (`irm | iex`)
   - Use `null` for unsupported package managers
4. Three complete examples:
   - Desktop app (Cursor) — brew/winget/scoop + fallback scripts
   - CLI tool (Claude Code) — npm primary
   - Python package (Ollama) — brew/pip + fallback scripts
5. Allowed categories: ai-coding, video-gen, audio-ai, local-llm, sdks, vibe-coding
6. Naming conventions: slug format (lowercase, hyphens)
7. Validation rules (what CI checks)
8. Review process: timeline (48hr for verified tools), what reviewers look for
9. Code of conduct link

**Tone:** Encouraging. Assume the contributor has never submitted a PR before.

### Root: LICENSE

Standard MIT license text. Copyright holder: The Loremi Ltd. Year: 2025-present.

### Root: CODE_OF_CONDUCT.md

Contributor Covenant v2.1 (industry standard). Contact email for reporting: `conduct@gettingstarted.sh` (or substitute with actual contact before going public).

### Root: .env.example

```env
# Loremi CMS (Phase 1 — not needed for local development yet)
CMS_API_URL=
CMS_TENANT_SLUG=gettingstarted

# Cloudflare (Phase 1 — deployment)
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_API_TOKEN=

# GitHub (CI — manifest ingestion)
GITHUB_TOKEN=

# Site
NEXT_PUBLIC_SITE_URL=https://gettingstarted.sh
```

---

### inspo/strategy/vision.md

**Purpose:** The strategic north star. Why this project exists and where it's going.

**Contents:**
- What gettingstarted.sh is: canonical setup registry, not a tool list
- The market gap: AI tools exploding, no unified getting-started experience
- Positioning: "npm is to packages as gettingstarted.sh is to setup"
- The shadcn playbook: open source registry → build authority → commercial layer (hosted team workspaces, verified publisher program, analytics)
- Non-technical audience strategy: why broadening beyond developers is the growth unlock — everyone uses AI tools now, not just engineers
- The Loremi Ltd angle: founding org, second CMS tenant, infrastructure layer for AI onboarding
- Acquisition thesis: AI companies need flawless onboarding → they'll contribute or acquire
- What success looks like: the default answer to "how do I install [AI tool]?"

### inspo/strategy/roadmap.md

**Purpose:** Phased build plan with concrete milestones and dates.

**Contents:**
- **Phase 0 — Foundation (now, April 2026):**
  - File-based registry (YAML manifests in `tools/` directory)
  - Static Next.js site with landing page, registry table
  - PR-based contributions, no CMS
  - Seed 20 tools with complete manifests
  - README + CONTRIBUTING live
  - Success: site deployed, 20+ tools, accepting external PRs
- **Phase 1 — Registry + Infrastructure (Weeks 5-8):**
  - CMS content types defined in Loremi CMS
  - Manifest ingestion: GitHub PR → CI validates → CMS API creates entry
  - `curl` handler: Cloudflare Worker detects OS, serves setup script
  - `irm` handler: same flow for Windows PowerShell
  - Static site rebuilds from CMS API at build time
  - 50 tools seeded with verified scripts
  - Success: working curl/irm handlers, CMS-backed registry
- **Phase 2 — Community (Weeks 9-12):**
  - CI pipeline: lint manifests, validate scripts, auto-merge verified
  - Community contributor guide battle-tested
  - ProductHunt + Show HN launch
  - Success: 100+ GitHub stars, first external contributors
- **Phase 3 — Growth (Q3-Q4 2026):**
  - 100+ tools in registry
  - 1,000+ GitHub stars
  - Featured in developer onboarding flows
  - Revenue exploration: sponsored tool listings, premium enterprise registry
  - Success: recognized as the canonical AI tool setup registry
- Dependencies between phases clearly marked
- Each phase has: deliverables, success criteria, blockers

### inspo/strategy/growth-and-launch.md

**Purpose:** Distribution playbook — how to get from 0 to 1,000 stars.

**Contents:**
- **Pre-launch checklist:**
  - 20+ seeded tools across all categories
  - Prioritized seed list: Cursor, Claude Code, Ollama, Windsurf, Lovable, ElevenLabs, Runway, ComfyUI, LM Studio, Vercel AI SDK, LangChain, Continue.dev, Suno, Pika, Replicate, Midjourney, Stable Diffusion, Whisper, GPT4All, Jan
  - curl + irm handlers working
  - README polished for non-technical visitors
  - Social preview image (og:image) for link sharing
  - GitHub repo public, MIT license visible
- **Launch day:**
  - ProductHunt: pre-written title, tagline, description, screenshots
  - Show HN: draft post included
  - Twitter/X: announcement thread draft
  - Reddit targets: r/LocalLLaMA, r/ChatGPT, r/vibecoding, r/commandline, r/devtools
- **Week 1-4 post-launch:**
  - Respond to every GitHub issue within 24hr
  - Merge first external PRs fast, welcome contributors publicly
  - Reach out to 5 tool creators for verification (Ollama, Cursor, etc.)
  - Blog post: "Why we built gettingstarted.sh"
- **Ongoing growth:**
  - "Good first issue" labels for newcomers
  - Monthly changelog updates
  - Contributor spotlight program
  - Partnership play: get listed in tool creators' own install docs
- **Metrics to track:** stars, forks, PRs, unique contributors, curl/irm commands run

---

### inspo/technical/architecture.md

**Purpose:** How the system works, end to end.

**Contents:**
- **Phase 0 architecture (current):**
  ```
  tools/*.yaml (in repo) → Next.js static build → Cloudflare Pages
  ```
  - Tool data lives in YAML files in the repo
  - Next.js reads YAML at build time, generates static pages
  - No backend, no database, no Workers yet
- **Phase 1+ architecture (future):**
  ```
  Contributor PR → CI → Loremi CMS API → Supabase (PostgreSQL)
                                              ↓
  User: curl/irm → Cloudflare Worker → serves install script
                                              ↓
  Next.js SSG ← CMS API → Cloudflare Pages (static site)
  ```
- **Frontend:** Next.js 16, App Router, Tailwind CSS 4, shadcn/ui
- **Data flow per phase:** YAML files → CMS API → Supabase
- **Curl/irm handler:** Cloudflare Worker, OS detection via User-Agent, package manager detection runs client-side in the served script
- **Build pipeline:** PR merged → GitHub Action triggers → Next.js static export → deployed to Cloudflare Pages
- **Key design decisions:**
  - Static site (not SSR) for speed and CDN caching
  - File-based first (Phase 0) to ship fast, CMS later for scale
  - Package manager detection client-side (in the shell/PowerShell script) not server-side

### inspo/technical/manifest-spec.md

**Purpose:** Complete reference for the tool YAML manifest schema.

**Contents:**
- Full schema with every field, type, required/optional, description
- Fields: name (string, required), slug (string, required, lowercase-hyphens), category (enum, required), version (string, required), homepage (URL, required), description (string, required), os (array of mac/win/linux, required), verified (boolean, default false)
- `install:` block — every package manager:
  - brew, winget, choco, scoop, snap, apt (platform-specific)
  - npm, pip, cargo (cross-platform)
  - Set to `null` if not supported
- Fallback scripts:
  - mac: shell script (`curl | sh` pattern)
  - linux: shell script (`curl | sh` pattern)
  - win: PowerShell script (`irm | iex` pattern)
- 3 complete annotated examples:
  - Cursor (desktop app): brew cask, winget, scoop, fallback shell/PowerShell scripts
  - Claude Code (CLI): npm primary, fallback curl/irm scripts
  - Ollama (local LLM): brew, pip, fallback scripts
- Validation rules:
  - slug must match `^[a-z0-9-]+$`
  - category must be one of: ai-coding, video-gen, audio-ai, local-llm, sdks, vibe-coding
  - At least one install method required (package manager or fallback)
  - os array must not be empty
- How to test a manifest locally (validation command)

### inspo/technical/install-resolution.md

**Purpose:** How the smart package manager detection algorithm works.

**Contents:**
- **macOS/Linux flow:**
  1. User runs `curl gettingstarted.sh/[tool] | sh`
  2. Cloudflare Worker serves a shell script for the requested tool
  3. Script runs detection: checks for package managers in order: brew → snap → apt
  4. First match with a non-null manifest entry wins
  5. If no match, falls back to OS-specific script (mac or linux)
  6. If no fallback, exits with error + link to tool page for manual install
- **Windows flow:**
  1. User runs `irm gettingstarted.sh/[tool] | iex` in PowerShell
  2. Worker serves a PowerShell script
  3. Script runs detection: checks for winget → choco → scoop
  4. First match wins, fallback to win script, error if nothing
- **Cross-platform package managers:** npm, pip, cargo are checked on all platforms
- **Detection priority order:** platform-specific first, then cross-platform
- **Security considerations:**
  - Scripts never run `sudo` without explicit user prompt
  - No data collection, no telemetry
  - Scripts are open source and auditable in the repo
  - Future: checksum verification for downloaded binaries
- **`irm | iex` explainer for non-technical users:**
  - What `irm` (Invoke-RestMethod) does: downloads a script from the internet
  - What `iex` (Invoke-Expression) does: runs that script
  - Why it's the Windows equivalent of `curl | sh`
  - Safety: only use with trusted sources (gettingstarted.sh scripts are open source)
- **Edge cases:** no package manager found, unsupported OS, network errors, tool not in registry
- **Direct install alternative:** every tool page shows ALL available methods so users can pick manually

### inspo/technical/sitemap.md

**Purpose:** Every page/route the site needs, across all phases.

**Contents:**
- **Phase 0 (now):**
  - `/` — landing page (built)
  - `/browse` — full registry with search/filter
  - `/browse/[category]` — filtered by category
  - `/[tool]` — individual tool page (all install methods, OS support, description)
  - `/[tool]/docs` — tool-specific getting-started guide
  - `/about` — about the project + The Loremi Ltd
  - `/contribute` — contributor guide (renders CONTRIBUTING.md)
- **Phase 1+ additions:**
  - `/api/install/[tool]` — Cloudflare Worker endpoint (curl/irm handler)
  - `/changelog` — version history
  - `/blog` — announcements, contributor spotlights
- **Data sources per phase:**
  - Phase 0: YAML files in `tools/` read at build time
  - Phase 1+: Loremi CMS API fetched at build time (SSG)
- **SEO requirements:** each tool page has unique title, description, og:image
- **Category slugs:** ai-coding, video-gen, audio-ai, local-llm, sdks, vibe-coding

### inspo/technical/accounts-and-services.md

**Purpose:** Brief checklist of external services, when they're needed, what they cost.

**Contents (one line each + brief note):**
- GitHub: org `gettingstarted-sh`, public repo, Actions — needed now, free
- Domain: gettingstarted.sh (.sh TLD via Namecheap/Gandi) — needed now, ~$30/yr
- Cloudflare: Pages (static hosting) + Workers (curl/irm handler) + R2 (script storage) — Phase 1, free tier
- Supabase: PostgreSQL for CMS data — Phase 1, free tier
- Loremi CMS: tenant `gettingstarted` — Phase 1, internal
- Vercel: alternative hosting if Cloudflare doesn't work out — backup option, free tier
- Analytics: Plausible or Cloudflare Web Analytics — Phase 2, free/cheap

---

### inspo/community/launch-playbook.md

**Purpose:** Step-by-step launch checklist with drafts and templates.

**Contents:**
- **Pre-launch checklist** (tickable):
  - 20+ tools seeded with complete manifests
  - curl handler working (macOS + Linux)
  - irm handler working (Windows PowerShell)
  - README polished for non-technical visitors
  - CONTRIBUTING.md live and tested (someone followed it end-to-end)
  - og:image social preview set
  - GitHub repo public, MIT license visible
  - GitHub org profile README set
- **Launch day checklist** (tickable):
  - ProductHunt submission (include draft: title, tagline, first comment, screenshots list)
  - Show HN post (include draft: title, body text)
  - Twitter/X thread (include draft: 5-tweet thread)
  - Reddit posts (include drafts for each subreddit, tailored to community norms)
  - Personal network outreach (DMs to developer friends)
- **Post-launch week 1-4** (tickable):
  - Monitor GitHub issues, respond within 24hr
  - Merge first external PRs fast, thank contributors publicly
  - Contact tool creators for verification (template email included)
  - Blog post draft outline: "Why we built gettingstarted.sh"
  - Track metrics weekly: stars, forks, PRs, contributors
- **Ongoing cadence:**
  - "Good first issue" label maintenance
  - Monthly changelog
  - Contributor spotlight (template included)
  - Quarterly roadmap review

---

## Out of Scope

- CI/CD GitHub Actions workflow files (those are implementation, not docs)
- Actual tool YAML manifests (seeding is a separate task)
- Cloudflare Worker code
- CMS content type definitions
- Blog/marketing content beyond drafts in the playbook

## Dependencies

- The existing `inspo/` reference files (README.md, gettingstarted.md, gettingstarted.html) are source material. They stay untouched.
- The manifest schema in these docs must match what the future CI validation will enforce.
- The sitemap must match what the Next.js app router will implement.

## Implementation Note

All 14 documents will be written as markdown files. This is a documentation-only task — no code changes, no component modifications, no CSS changes. The root README.md is a rewrite of the existing template README.
