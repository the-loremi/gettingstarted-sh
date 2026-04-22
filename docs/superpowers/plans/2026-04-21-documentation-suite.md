# Documentation Suite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create 14 documentation files that make gettingstarted.sh open-source-ready, strategically coherent, and welcoming to non-technical users.

**Architecture:** Two-layer documentation — public-facing files at repo root (README, CONTRIBUTING, LICENSE, CODE_OF_CONDUCT, .env.example) and internal planning docs organized under `inspo/` in three subdirectories (strategy, technical, community). All files are markdown except LICENSE (plain text) and .env.example (env format).

**Tech Stack:** Markdown, GitHub-flavored. No code changes, no build tooling.

**Spec:** `docs/superpowers/specs/2026-04-21-documentation-suite-design.md`

**Source material (read-only, do not modify):**
- `inspo/README.md` — production init doc with architecture, manifest schema, build phases, env vars
- `inspo/gettingstarted.md` — strategic rationale, market positioning
- `inspo/gettingstarted.html` — landing page design reference

---

## File Map

| # | File | Action | Depends on |
|---|------|--------|------------|
| 1 | `LICENSE` | Create | — |
| 2 | `CODE_OF_CONDUCT.md` | Create | — |
| 3 | `.env.example` | Create | — |
| 4 | `inspo/technical/manifest-spec.md` | Create | — |
| 5 | `inspo/technical/install-resolution.md` | Create | — |
| 6 | `inspo/technical/architecture.md` | Create | — |
| 7 | `inspo/technical/sitemap.md` | Create | — |
| 8 | `inspo/technical/accounts-and-services.md` | Create | — |
| 9 | `inspo/strategy/vision.md` | Create | — |
| 10 | `inspo/strategy/roadmap.md` | Create | — |
| 11 | `inspo/strategy/growth-and-launch.md` | Create | — |
| 12 | `inspo/community/launch-playbook.md` | Create | #11 (references growth targets) |
| 13 | `CONTRIBUTING.md` | Create | #4 (references manifest spec) |
| 14 | `README.md` | Rewrite | #13 (links to CONTRIBUTING) |

**Parallelism:** Tasks 1-11 are independent and can run in parallel. Task 12 depends on 11. Task 13 depends on 4. Task 14 depends on 13. Three waves: [1-11] → [12, 13] → [14].

---

## Task 1: LICENSE

**Files:**
- Create: `LICENSE`

- [ ] **Step 1: Create MIT license file**

Write `LICENSE` with this exact content:

```text
MIT License

Copyright (c) 2025-present The Loremi Ltd

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 2: Commit**

```bash
git add LICENSE
git commit -m "docs: add MIT license"
```

---

## Task 2: CODE_OF_CONDUCT.md

**Files:**
- Create: `CODE_OF_CONDUCT.md`

- [ ] **Step 1: Create Contributor Covenant file**

Write `CODE_OF_CONDUCT.md` with the Contributor Covenant v2.1. Use the full standard text from https://www.contributor-covenant.org/version/2/1/code_of_conduct/. Set the enforcement contact to `conduct@gettingstarted.sh`.

The document must include:
- "Our Pledge" section
- "Our Standards" section with examples of positive/negative behavior
- "Enforcement Responsibilities" section
- "Scope" section
- "Enforcement" section with contact: `conduct@gettingstarted.sh`
- "Enforcement Guidelines" with the 4 levels (Correction, Warning, Temporary Ban, Permanent Ban)
- "Attribution" section crediting Contributor Covenant v2.1

- [ ] **Step 2: Commit**

```bash
git add CODE_OF_CONDUCT.md
git commit -m "docs: add Contributor Covenant code of conduct"
```

---

## Task 3: .env.example

**Files:**
- Create: `.env.example`

- [ ] **Step 1: Create env template**

Write `.env.example` with this exact content:

```env
# ============================================
# gettingstarted.sh — Environment Variables
# ============================================
# Copy this file to .env.local for local development.
# Most variables are only needed in later phases.

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

- [ ] **Step 2: Commit**

```bash
git add .env.example
git commit -m "docs: add .env.example with phase-annotated variables"
```

---

## Task 4: inspo/technical/manifest-spec.md

**Files:**
- Create: `inspo/technical/manifest-spec.md`
- Read: `inspo/README.md` (source for schema, lines 77-107 and 109-147)

- [ ] **Step 1: Create directories**

```bash
mkdir -p inspo/technical
```

- [ ] **Step 2: Write the manifest spec**

Write `inspo/technical/manifest-spec.md` with the following structure and content:

```markdown
# Tool Manifest Specification

> Reference document for the YAML manifest schema used by gettingstarted.sh tool contributions.

## Overview

Every tool in the registry is defined by a single YAML file at `tools/[slug].yaml`. This file describes what the tool is, which platforms it supports, and how to install it using every available package manager.

## Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | yes | Human-readable tool name (e.g., "Cursor") |
| `slug` | string | yes | URL-safe identifier, lowercase with hyphens (e.g., "claude-code") |
| `category` | enum | yes | One of: `ai-coding`, `video-gen`, `audio-ai`, `local-llm`, `sdks`, `vibe-coding` |
| `version` | string | yes | Current version or "latest" |
| `homepage` | URL | yes | Official tool website |
| `description` | string | yes | One-line description of what the tool does |
| `os` | array | yes | Supported platforms: `mac`, `win`, `linux` (at least one) |
| `verified` | boolean | no | Whether a maintainer has tested the install scripts. Default: `false` |

### The `install` Block

The `install` block maps package managers and OS fallback scripts. Set a value for supported managers, `null` for unsupported ones.

**Platform-specific package managers:**

| Key | Platform | Example value |
|-----|----------|---------------|
| `brew` | macOS, Linux | `cursor --cask` or `ollama` |
| `winget` | Windows | `Cursor.Cursor` |
| `choco` | Windows | `cursor` |
| `scoop` | Windows | `extras/cursor` |
| `snap` | Linux | `cursor` |
| `apt` | Debian/Ubuntu | `cursor` |

**Cross-platform package managers:**

| Key | Platform | Example value |
|-----|----------|---------------|
| `npm` | all | `@anthropic-ai/claude-code` (installs globally via `npm install -g`) |
| `pip` | all | `ollama` (installs via `pip install`) |
| `cargo` | all | `tool-name` (installs via `cargo install`) |

**Fallback scripts** (used when no supported package manager is found):

| Key | Platform | Format |
|-----|----------|--------|
| `mac` | macOS | Shell script (multiline string, `curl \| sh` pattern) |
| `linux` | Linux | Shell script (multiline string, `curl \| sh` pattern) |
| `win` | Windows | PowerShell script (multiline string, `irm \| iex` pattern) |

## Validation Rules

- `slug` must match the regex `^[a-z0-9-]+$`
- `slug` must match the filename: `tools/cursor.yaml` → slug is `cursor`
- `category` must be one of the allowed values listed above
- `os` array must contain at least one of: `mac`, `win`, `linux`
- At least one install method must be provided (any package manager OR any fallback script)
- `homepage` must be a valid URL starting with `https://`
- `description` must be under 120 characters

## Complete Examples

### Example 1: Desktop App (Cursor)

A tool available via multiple platform-specific package managers with fallback scripts.

```yaml
name: Cursor
slug: cursor
category: ai-coding
version: "0.42.x"
homepage: https://cursor.com
description: AI-first code editor built on VS Code
os:
  - mac
  - win
  - linux
install:
  brew: cursor --cask
  winget: Cursor.Cursor
  choco: cursor
  scoop: extras/cursor
  snap: cursor
  apt: null
  npm: null
  pip: null
  cargo: null
  mac: |
    curl -fsSL https://download.cursor.com/mac/install.sh | sh
  linux: |
    curl -fsSL https://download.cursor.com/linux/install.sh | sh
  win: |
    powershell -c "irm https://download.cursor.com/win/install.ps1 | iex"
verified: true
```

### Example 2: CLI Tool (Claude Code)

A tool primarily installed via a cross-platform package manager (npm).

```yaml
name: Claude Code
slug: claude-code
category: ai-coding
version: latest
homepage: https://docs.anthropic.com/en/docs/claude-code
description: Anthropic's official CLI for Claude, the AI assistant
os:
  - mac
  - linux
install:
  brew: null
  winget: null
  choco: null
  scoop: null
  snap: null
  apt: null
  npm: "@anthropic-ai/claude-code"
  pip: null
  cargo: null
  mac: |
    curl -fsSL https://gettingstarted.sh/scripts/claude-code/mac.sh | sh
  linux: |
    curl -fsSL https://gettingstarted.sh/scripts/claude-code/linux.sh | sh
verified: true
```

### Example 3: Local LLM Runtime (Ollama)

A tool available via both platform-specific and cross-platform managers.

```yaml
name: Ollama
slug: ollama
category: local-llm
version: "0.6.x"
homepage: https://ollama.com
description: Run large language models locally on your machine
os:
  - mac
  - win
  - linux
install:
  brew: ollama
  winget: Ollama.Ollama
  choco: null
  scoop: null
  snap: null
  apt: null
  npm: null
  pip: ollama
  cargo: null
  mac: |
    curl -fsSL https://ollama.com/install.sh | sh
  linux: |
    curl -fsSL https://ollama.com/install.sh | sh
  win: |
    powershell -c "irm https://ollama.com/download/OllamaSetup.exe -OutFile OllamaSetup.exe; Start-Process OllamaSetup.exe"
verified: true
```

## Testing a Manifest Locally

During Phase 0 (file-based), validate manifests by checking:

1. YAML is valid (no syntax errors)
2. All required fields are present
3. `slug` matches filename
4. `category` is in the allowed list
5. `os` array is non-empty
6. At least one install method is non-null

A CI validation script will automate this in Phase 2.
```

- [ ] **Step 3: Commit**

```bash
git add inspo/technical/manifest-spec.md
git commit -m "docs: add tool manifest YAML specification"
```

---

## Task 5: inspo/technical/install-resolution.md

**Files:**
- Create: `inspo/technical/install-resolution.md`
- Read: `inspo/README.md` (lines 109-147 for install resolution details)

- [ ] **Step 1: Write the install resolution spec**

Write `inspo/technical/install-resolution.md` with the following structure and content:

```markdown
# Install Resolution Algorithm

> How gettingstarted.sh detects your system and picks the best install method.

## Overview

When a user runs the install command, gettingstarted.sh serves a script that automatically detects which package managers are available on their system and uses the best one. No configuration needed — it just works.

## The Two Commands

### macOS and Linux

```bash
curl gettingstarted.sh/cursor | sh
```

This downloads a shell script and runs it. `curl` fetches the script from the internet, and `sh` executes it.

### Windows (PowerShell)

```powershell
irm gettingstarted.sh/cursor | iex
```

This is the Windows equivalent. `irm` (Invoke-RestMethod) downloads the script, and `iex` (Invoke-Expression) runs it. You need to run this in PowerShell (not Command Prompt).

**What is `irm | iex`?** If you're new to PowerShell: `irm` is a built-in command that downloads content from a web address. `iex` is a built-in command that runs whatever text it receives as a PowerShell command. Together, they download and run an installation script — the same concept as `curl | sh` on Mac and Linux. Only run this with sources you trust. All gettingstarted.sh scripts are open source and auditable in the GitHub repo.

## Detection Algorithm

### macOS / Linux Flow

1. Cloudflare Worker receives the request, detects OS from User-Agent
2. Serves a shell script tailored to the requested tool
3. Script checks for package managers in priority order:
   - **Platform-specific first:** `brew` → `snap` → `apt`
   - **Cross-platform second:** `npm` → `pip` → `cargo`
4. First detected manager that has a non-null entry in the manifest wins
5. If no package manager matches → use the OS fallback script (`mac:` or `linux:`)
6. If no fallback exists → exit with error message and link to the tool's page for manual install

### Windows Flow

1. Cloudflare Worker detects Windows, serves a PowerShell script
2. Script checks for package managers in priority order:
   - **Platform-specific first:** `winget` → `choco` → `scoop`
   - **Cross-platform second:** `npm` → `pip` → `cargo`
3. First detected manager with a non-null manifest entry wins
4. If no match → use the `win:` fallback script
5. If no fallback → exit with error and link to tool page

### Detection Priority Table

| Priority | macOS/Linux | Windows |
|----------|-------------|---------|
| 1 | brew | winget |
| 2 | snap | choco |
| 3 | apt | scoop |
| 4 | npm | npm |
| 5 | pip | pip |
| 6 | cargo | cargo |
| 7 | OS fallback script | OS fallback script |
| 8 | Error + manual link | Error + manual link |

### How Detection Works (Shell)

```bash
# Check if a command exists
command_exists() { command -v "$1" >/dev/null 2>&1; }

# Priority detection
if command_exists brew && [ -n "$BREW_PACKAGE" ]; then
    brew install $BREW_PACKAGE
elif command_exists snap && [ -n "$SNAP_PACKAGE" ]; then
    sudo snap install $SNAP_PACKAGE
elif command_exists apt && [ -n "$APT_PACKAGE" ]; then
    sudo apt install -y $APT_PACKAGE
elif command_exists npm && [ -n "$NPM_PACKAGE" ]; then
    npm install -g $NPM_PACKAGE
elif command_exists pip && [ -n "$PIP_PACKAGE" ]; then
    pip install $PIP_PACKAGE
elif command_exists cargo && [ -n "$CARGO_PACKAGE" ]; then
    cargo install $CARGO_PACKAGE
elif [ -n "$FALLBACK_SCRIPT" ]; then
    eval "$FALLBACK_SCRIPT"
else
    echo "No supported install method found."
    echo "Visit https://gettingstarted.sh/$TOOL_SLUG for manual install options."
    exit 1
fi
```

### How Detection Works (PowerShell)

```powershell
function Test-Command($cmd) { $null -ne (Get-Command $cmd -ErrorAction SilentlyContinue) }

if ((Test-Command winget) -and $WingetPackage) {
    winget install $WingetPackage
} elseif ((Test-Command choco) -and $ChocoPackage) {
    choco install $ChocoPackage -y
} elseif ((Test-Command scoop) -and $ScoopPackage) {
    scoop install $ScoopPackage
} elseif ((Test-Command npm) -and $NpmPackage) {
    npm install -g $NpmPackage
} elseif ((Test-Command pip) -and $PipPackage) {
    pip install $PipPackage
} elseif ((Test-Command cargo) -and $CargoPackage) {
    cargo install $CargoPackage
} elseif ($FallbackScript) {
    Invoke-Expression $FallbackScript
} else {
    Write-Host "No supported install method found."
    Write-Host "Visit https://gettingstarted.sh/$ToolSlug for manual install options."
    exit 1
}
```

## The Direct Alternative

Users don't have to use the `curl` or `irm` command. Every tool's page on the website shows ALL available install methods:

```
gettingstarted.sh/cursor

  Install Cursor
  ─────────────────────────────
  brew    brew install --cask cursor
  winget  winget install Cursor.Cursor
  scoop   scoop install extras/cursor
  snap    snap install cursor
  auto    curl gettingstarted.sh/cursor | sh
  auto    irm gettingstarted.sh/cursor | iex
```

Users who already know their package manager can just run the command directly.

## Security

- **No `sudo` without prompting.** If root access is needed (e.g., `apt install`), the script asks first.
- **No telemetry.** The scripts don't phone home or collect data.
- **Open source.** Every install script is in the GitHub repo. Anyone can audit them.
- **No arbitrary code execution.** The scripts only run the package manager commands defined in the manifest.
- **Future: checksum verification.** For fallback scripts that download binaries, we plan to add SHA256 checksum verification.

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| No package manager found, no fallback | Error message + link to tool page |
| Tool not in registry | 404 response with suggestion to search the registry |
| Network error mid-install | Package manager handles its own retry/error |
| Unsupported OS (e.g., FreeBSD) | Error message suggesting manual install |
| User runs `curl` on Windows CMD | Script detects non-POSIX shell, suggests using `irm \| iex` in PowerShell |
| Multiple package managers available | First match in priority order wins (no prompt) |
```

- [ ] **Step 2: Commit**

```bash
git add inspo/technical/install-resolution.md
git commit -m "docs: add install resolution algorithm spec"
```

---

## Task 6: inspo/technical/architecture.md

**Files:**
- Create: `inspo/technical/architecture.md`
- Read: `inspo/README.md` (lines 34-61 for architecture and tech stack)

- [ ] **Step 1: Write the architecture doc**

Write `inspo/technical/architecture.md` covering:

- **Phase 0 (current):** file-based architecture diagram — `tools/*.yaml` in repo → Next.js reads at build time → static pages on Cloudflare Pages. No backend, no database, no Workers.
- **Phase 1+ (future):** full architecture diagram — Contributor PR → CI → Loremi CMS API → Supabase. User curl/irm → Cloudflare Worker → install script. Next.js SSG ← CMS API → Cloudflare Pages.
- **Frontend stack:** Next.js 16, App Router, Tailwind CSS 4, shadcn/ui (radix-lyra), JetBrains Mono + Geist fonts, Phosphor Icons
- **Data flow per phase:** YAML files (Phase 0) → CMS API (Phase 1) → Supabase PostgreSQL
- **Curl/irm handler:** Cloudflare Worker serves OS-appropriate scripts, detection is client-side in the served script
- **Build pipeline:** PR merged → GitHub Action → Next.js static export → Cloudflare Pages
- **Key design decisions:** (1) Static over SSR for speed/CDN, (2) File-based first to ship fast, CMS later for scale, (3) Package manager detection client-side not server-side

Use text-based diagrams (ASCII art or code blocks), not images.

- [ ] **Step 2: Commit**

```bash
git add inspo/technical/architecture.md
git commit -m "docs: add system architecture document"
```

---

## Task 7: inspo/technical/sitemap.md

**Files:**
- Create: `inspo/technical/sitemap.md`

- [ ] **Step 1: Write the sitemap**

Write `inspo/technical/sitemap.md` covering:

- **Phase 0 routes:**
  - `/` — landing page (status: built)
  - `/browse` — full registry with search/filter (status: not built)
  - `/browse/[category]` — filtered by category (status: not built)
  - `/[tool]` — individual tool page showing all install methods, OS support, description (status: not built)
  - `/[tool]/docs` — tool-specific getting-started guide (status: not built)
  - `/about` — about the project + The Loremi Ltd (status: not built)
  - `/contribute` — contributor guide, renders CONTRIBUTING.md (status: not built)
- **Phase 1+ additions:**
  - `/api/install/[tool]` — Cloudflare Worker endpoint for curl/irm
  - `/changelog` — version history
  - `/blog` — announcements, contributor spotlights
- **Data sources per phase:** Phase 0 = YAML files in `tools/`, Phase 1+ = Loremi CMS API at build time (SSG)
- **SEO:** each tool page needs unique title, meta description, og:image
- **Category slugs:** ai-coding, video-gen, audio-ai, local-llm, sdks, vibe-coding
- Table format: route, description, phase, status, data source

- [ ] **Step 2: Commit**

```bash
git add inspo/technical/sitemap.md
git commit -m "docs: add sitemap with all routes per phase"
```

---

## Task 8: inspo/technical/accounts-and-services.md

**Files:**
- Create: `inspo/technical/accounts-and-services.md`

- [ ] **Step 1: Write the accounts checklist**

Write `inspo/technical/accounts-and-services.md` as a brief table:

```markdown
# Accounts & Services Checklist

> External services needed for gettingstarted.sh, organized by when they're needed.

## Needed Now (Phase 0)

| Service | Purpose | Cost | Action |
|---------|---------|------|--------|
| GitHub | Org `gettingstarted-sh`, public repo, Actions for CI | Free | Create org, transfer or create repo |
| Domain registrar | `gettingstarted.sh` (.sh is the Saint Helena TLD) | ~$30/yr | Register via Namecheap, Gandi, or Cloudflare Registrar |

## Needed for Phase 1

| Service | Purpose | Cost | Action |
|---------|---------|------|--------|
| Cloudflare | Pages (static hosting), Workers (curl/irm handler), R2 (script storage) | Free tier | Create account, set up Pages project |
| Supabase | PostgreSQL database for CMS data | Free tier | Create project, configure connection |
| Loremi CMS | Tenant `gettingstarted` for tool/script/docs content types | Internal | Set up tenant after CMS core is live |

## Needed for Phase 2+

| Service | Purpose | Cost | Action |
|---------|---------|------|--------|
| Analytics | Page views, command usage tracking | Free | Plausible ($9/mo) or Cloudflare Web Analytics (free) |
| Vercel | Backup hosting option if Cloudflare doesn't work out | Free tier | Only if needed |
```

- [ ] **Step 2: Commit**

```bash
git add inspo/technical/accounts-and-services.md
git commit -m "docs: add accounts and services checklist"
```

---

## Task 9: inspo/strategy/vision.md

**Files:**
- Create: `inspo/strategy/vision.md`
- Read: `inspo/gettingstarted.md` (strategic rationale), `inspo/README.md` (product definition)

- [ ] **Step 1: Create directories**

```bash
mkdir -p inspo/strategy
```

- [ ] **Step 2: Write the vision document**

Write `inspo/strategy/vision.md` covering these points in clear, direct prose (not bullet lists — this is a narrative strategy document):

1. **What it is:** gettingstarted.sh is the canonical setup registry for AI tools — not a tool list, not a directory, but a *setup command registry* where every tool has a one-line install command that just works. Think "npm is to packages as gettingstarted.sh is to setup."
2. **The market gap:** AI tools are exploding (Cursor, Claude, Ollama, Runway, ElevenLabs, hundreds more). Every one has its own getting-started page, its own install instructions, its own assumptions about what you already have installed. There's no unified experience. gettingstarted.sh fills that gap.
3. **Why non-technical users matter:** The audience isn't just developers. Teachers, designers, writers, students — everyone is entering the AI era and needs to install these tools. The product must be accessible to someone who has never opened a terminal. This is the growth unlock that developer-only registries miss.
4. **The shadcn playbook:** Open source the registry and CLI → build community and GitHub stars as social proof → layer commercial infrastructure on top (hosted team workspaces, verified publisher program for AI companies, usage analytics). Stars become the acquisition metric.
5. **The Loremi Ltd angle:** gettingstarted.sh is the second tenant on the Loremi CMS platform, positioning The Loremi as the infrastructure layer for AI developer onboarding. The founding org gets attribution and credibility.
6. **Acquisition thesis:** AI companies want their getting-started experience to be flawless. A well-maintained registry becomes infrastructure they'd rather buy than rebuild. They'll either contribute to the registry or acquire it.
7. **What success looks like:** gettingstarted.sh becomes the default answer to "how do I install [AI tool]?" — the way Stack Overflow became the default for "how do I fix [error]?"

- [ ] **Step 3: Commit**

```bash
git add inspo/strategy/vision.md
git commit -m "docs: add strategic vision document"
```

---

## Task 10: inspo/strategy/roadmap.md

**Files:**
- Create: `inspo/strategy/roadmap.md`
- Read: `inspo/README.md` (lines 109-129 for build phases and success criteria)

- [ ] **Step 1: Write the roadmap**

Write `inspo/strategy/roadmap.md` with four phases. Each phase must have: description, deliverables (checkboxes), success criteria, dependencies/blockers.

**Phase 0 — Foundation (April 2026, current):**
- File-based registry: YAML manifests in `tools/` directory
- Static Next.js site with landing page + registry table
- PR-based contributions, no CMS yet
- Seed 20 tools with complete manifests
- README + CONTRIBUTING + LICENSE live
- Deliverables: site deployed, docs complete, 20+ tools, accepting PRs
- Success: public repo with working site and external PRs welcome
- Blockers: none (self-contained)

**Phase 1 — Registry + Infrastructure (Weeks 5-8, after CMS core is live):**
- CMS content types for gettingstarted.sh tenant
- Manifest ingestion pipeline: PR → CI validates → CMS API creates entry
- `curl` handler via Cloudflare Worker (macOS + Linux)
- `irm` handler via Cloudflare Worker (Windows PowerShell)
- Static site rebuilds from CMS API at build time
- 50 tools seeded with verified install scripts
- Success: working curl/irm handlers, CMS-backed, 50+ tools
- Blockers: Loremi CMS core must be live first

**Phase 2 — Community (Weeks 9-12):**
- Full CI pipeline: lint manifests, validate scripts, auto-merge verified tools
- Community contributor guide battle-tested with real external contributors
- ProductHunt + Show HN launch
- Success: 100+ GitHub stars, first external contributors, media coverage
- Blockers: Phase 1 complete, 50+ tools for launch credibility

**Phase 3 — Growth (Q3-Q4 2026):**
- 100+ tools in registry
- 1,000+ GitHub stars
- Featured in developer onboarding flows and tool creators' own docs
- Revenue exploration: sponsored tool listings, premium enterprise registry
- Success: recognized as canonical AI tool setup registry
- Blockers: community momentum from Phase 2

Include a dependency diagram showing which phases gate others.

- [ ] **Step 2: Commit**

```bash
git add inspo/strategy/roadmap.md
git commit -m "docs: add phased roadmap with milestones"
```

---

## Task 11: inspo/strategy/growth-and-launch.md

**Files:**
- Create: `inspo/strategy/growth-and-launch.md`
- Read: `inspo/gettingstarted.md` (launch strategy notes)

- [ ] **Step 1: Write the growth and launch playbook**

Write `inspo/strategy/growth-and-launch.md` covering:

**Seed tool list** — prioritized list of 20 tools to seed before launch, organized by category:
- AI Coding: Cursor, Claude Code, Windsurf, Continue.dev
- Vibe Coding: Lovable
- Local LLM: Ollama, LM Studio, GPT4All, Jan
- Video Gen: Runway, Pika, Midjourney
- Audio AI: ElevenLabs, Suno, Whisper
- SDKs: Vercel AI SDK, LangChain, Replicate
- Image Gen: Stable Diffusion, ComfyUI

**Pre-launch requirements:** 20+ tools seeded, curl+irm working, README polished, og:image set, repo public with MIT license

**Launch channels with draft content:**
- ProductHunt: draft title ("gettingstarted.sh — Every AI tool. One command."), tagline, maker comment
- Show HN: draft post title and body (3 paragraphs: what it is, why we built it, how to contribute)
- Twitter/X: 5-tweet thread draft (hook → demo → how it works → open source angle → CTA)
- Reddit: target subreddits (r/LocalLLaMA, r/ChatGPT, r/vibecoding, r/commandline, r/devtools) with tailored post angles for each community

**Post-launch (weeks 1-4):** GitHub issue response SLA (24hr), fast merging of first external PRs, outreach to tool creators for verification, blog post outline

**Ongoing growth:** good first issue labels, monthly changelog, contributor spotlight, partnership play (get listed in tool creators' install docs)

**Metrics:** stars, forks, PRs, unique contributors, curl/irm commands run (tracked via Cloudflare analytics)

- [ ] **Step 2: Commit**

```bash
git add inspo/strategy/growth-and-launch.md
git commit -m "docs: add growth strategy and launch playbook"
```

---

## Task 12: inspo/community/launch-playbook.md

**Files:**
- Create: `inspo/community/launch-playbook.md`
- Read: `inspo/strategy/growth-and-launch.md` (references growth targets and channel drafts)

- [ ] **Step 1: Create directory**

```bash
mkdir -p inspo/community
```

- [ ] **Step 2: Write the launch playbook**

Write `inspo/community/launch-playbook.md` as an actionable checklist (tickable checkboxes) organized into four phases. This is the *operational* checklist, while `growth-and-launch.md` is the *strategic* document.

**Pre-launch checklist:**
- [ ] 20+ tools seeded with complete YAML manifests
- [ ] curl handler working for macOS + Linux
- [ ] irm handler working for Windows PowerShell
- [ ] README.md polished and beginner-friendly
- [ ] CONTRIBUTING.md live and tested end-to-end
- [ ] LICENSE (MIT) in repo root
- [ ] CODE_OF_CONDUCT.md in repo root
- [ ] og:image social preview configured in repo settings
- [ ] GitHub repo set to public
- [ ] GitHub org profile README set up
- [ ] All links in README verified working
- [ ] Landing page deployed and accessible

**Launch day checklist:**
- [ ] Submit to ProductHunt (draft in growth-and-launch.md)
- [ ] Post Show HN (draft in growth-and-launch.md)
- [ ] Publish Twitter/X thread (draft in growth-and-launch.md)
- [ ] Post to Reddit communities (drafts in growth-and-launch.md)
- [ ] Send DMs to developer friends and network
- [ ] Monitor GitHub for first issues/PRs (respond within 2 hours on launch day)

**Post-launch week 1-4 checklist:**
- [ ] Respond to every GitHub issue within 24 hours
- [ ] Merge first external contributor PRs quickly
- [ ] Publicly thank each contributor (GitHub comment + Twitter mention)
- [ ] Send verification outreach emails to 5 tool creators (template below)
- [ ] Write and publish blog post: "Why we built gettingstarted.sh"
- [ ] Track metrics weekly: stars, forks, PRs, contributors

**Tool creator outreach template:**
Include a short email template:
- Subject line
- 3-paragraph body: what gettingstarted.sh is, that their tool is listed, invitation to verify the install scripts
- Sign-off with links

**Ongoing cadence:**
- Weekly: triage issues, merge PRs, update metrics
- Monthly: publish changelog, spotlight a contributor
- Quarterly: review roadmap, adjust targets

- [ ] **Step 3: Commit**

```bash
git add inspo/community/launch-playbook.md
git commit -m "docs: add operational launch playbook with checklists"
```

---

## Task 13: CONTRIBUTING.md

**Files:**
- Create: `CONTRIBUTING.md`
- Read: `inspo/technical/manifest-spec.md` (must reference same schema)

- [ ] **Step 1: Write the contributing guide**

Write `CONTRIBUTING.md` with this structure. Tone: encouraging, assume the reader has never submitted a PR before.

1. **Welcome header:** "Contributing to gettingstarted.sh" + one paragraph thanking contributors and explaining that the registry grows because of them
2. **Quick start (3 steps):**
   - Fork the repo
   - Create `tools/[your-tool].yaml` using the manifest template
   - Submit a pull request
3. **Step-by-step walkthrough ("Your first contribution"):**
   - How to fork a repo on GitHub (link to GitHub docs)
   - How to create a new file in the `tools/` directory
   - The manifest template (copy-paste ready, with comments explaining each field)
   - How to submit a PR (link to GitHub docs)
   - What happens after you submit (CI validates → maintainer reviews → merged within 48hr)
4. **Manifest reference:** Include three complete examples inline (Cursor = desktop app with brew/winget/scoop + fallbacks, Claude Code = CLI with npm primary, Ollama = local LLM with brew/pip). These must match the examples in `inspo/technical/manifest-spec.md` exactly. Link to the full spec for field-level details.
5. **Categories:** ai-coding, video-gen, audio-ai, local-llm, sdks, vibe-coding — one sentence describing each
6. **Naming rules:** slug must be lowercase-hyphens matching `^[a-z0-9-]+$`, filename must match slug
7. **What reviewers check:** valid YAML, required fields present, at least one install method, slug matches filename, category is valid
8. **Code of conduct:** link to CODE_OF_CONDUCT.md
9. **Questions?** Open an issue on GitHub

Include a copy-paste manifest template:

```yaml
name: Your Tool Name
slug: your-tool-name
category: ai-coding  # ai-coding | video-gen | audio-ai | local-llm | sdks | vibe-coding
version: "1.0.0"
homepage: https://yourtool.com
description: One-line description of what your tool does (under 120 chars)
os:
  - mac
  - win
  - linux
install:
  # Package managers (set to null if not supported)
  brew: null
  winget: null
  choco: null
  scoop: null
  snap: null
  apt: null
  npm: null
  pip: null
  cargo: null
  # Fallback install scripts (used when no package manager is found)
  mac: |
    echo "Add macOS install script here"
  linux: |
    echo "Add Linux install script here"
  win: |
    Write-Host "Add Windows PowerShell install script here"
verified: false
```

- [ ] **Step 2: Commit**

```bash
git add CONTRIBUTING.md
git commit -m "docs: add contributing guide with manifest template"
```

---

## Task 14: README.md (rewrite)

**Files:**
- Modify: `README.md` (full rewrite, existing content is a template placeholder)
- Read: `CONTRIBUTING.md` (links to it)

- [ ] **Step 1: Rewrite the README**

Replace the entire contents of `README.md`. The tone must be welcoming and accessible to someone who has never used a terminal.

Structure:

1. **Header:** `# gettingstarted.sh` + tagline "Every tool. One command." + MIT badge
2. **What it is (1 paragraph):** Plain English. "gettingstarted.sh is a free, open-source registry that lets you install any AI tool with a single command. It figures out the best way to install each tool on your computer — whether you're on Mac, Windows, or Linux — so you don't have to."
3. **How to use it:**
   - Mac/Linux: `curl gettingstarted.sh/cursor | sh`
   - Windows PowerShell: `irm gettingstarted.sh/cursor | iex`
   - "New to the terminal?" section explaining what these commands do in plain English, including what `curl | sh` and `irm | iex` mean
4. **What happens when you run it:** 3-step plain English explanation — (1) detects your system, (2) finds the best installer (brew, winget, npm, etc.), (3) installs and configures the tool
5. **Registry preview:** table with 5 tools — Cursor, Claude Code, Ollama, Runway, ElevenLabs — showing name, category, and the install command
6. **Add a tool:** 3 steps (fork, add YAML, submit PR) with link to CONTRIBUTING.md
7. **Tech stack:** small table (Next.js, Tailwind, Cloudflare, Loremi CMS)
8. **Footer:** "A The Loremi Ltd project" + "Licensed under MIT" + link to LICENSE

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: rewrite README for non-technical audience with curl + irm examples"
```

---

## Execution Summary

| Wave | Tasks | Can run in parallel |
|------|-------|---------------------|
| 1 | Tasks 1-11 | Yes, all independent |
| 2 | Tasks 12, 13 | Yes (12 depends on 11, 13 depends on 4, but both wave-1 deps are done) |
| 3 | Task 14 | No, depends on 13 |

**Total:** 14 tasks, 14 files, ~30 steps.
