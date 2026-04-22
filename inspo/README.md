# gettingstarted.sh — Production Initialization Document

> Every tool. One command.

**Product:** gettingstarted.sh
**Parent:** The Loremi Ltd (second CMS tenant)
**Verticals:** Technology + AI
**Backend:** Loremi CMS (gettingstarted.sh is a CMS tenant)
**License:** MIT (open source)
**Status:** Pre-launch (April 2026)

---

## What This Is

gettingstarted.sh is the canonical getting-started registry for AI tools, models, and vibe-coding stacks. One-line setup commands. Always current. Community maintained. Users run `curl gettingstarted.sh/[tool] | sh` to install and configure any tool in the registry.

It is the second tenant on the Loremi CMS platform. Tool entries, setup scripts, docs pages, and categories are all CMS content types. The open-source CLI and static site generator consume the CMS API.

## How It Works

```
CONTRIBUTOR                    LOREMI CMS                     USER
───────────                    ──────────                     ────
Submit PR (tool manifest)  →   Tool entry created in CMS  →   curl gettingstarted.sh/cursor | sh
  or                           Setup script stored             ↓
Add via CMS admin UI           Docs page generated         →   Dependencies installed
                               Static site rebuilt              Env vars configured
                                                                Tool ready to use
```

## Architecture

```
┌─────────────────────────────────────────────────┐
│          GETTINGSTARTED.SH FRONTEND              │
│  Static site (Next.js SSG or Astro)              │
│  Landing page, registry table, tool pages, docs  │
├─────────────────────────────────────────────────┤
│              CLI + SCRIPT ENGINE                  │
│  curl handler │ setup script execution            │
│  dependency checks │ env var configuration        │
├─────────────────────────────────────────────────┤
│              LOREMI CMS API                      │
│  Tool CRUD │ Script storage │ Category mgmt      │
│  (gettingstarted.sh tenant content types)        │
├─────────────────────────────────────────────────┤
│          SUPABASE + CLOUDFLARE R2                │
│  PostgreSQL │ R2 (script files) │ CDN            │
└─────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Static Site | Next.js SSG or Astro | Pre-built from CMS content at build time |
| CLI / Scripts | Bash (POSIX-compatible) | Cross-platform: macOS, Linux, WSL |
| Backend | Loremi CMS API | All tool data, scripts, docs via CMS tenant endpoints |
| Hosting | Cloudflare Pages (static site) + Workers (curl handler) | Global CDN, fast |
| Domain | gettingstarted.sh | Standalone domain, branded "A The Loremi Ltd project" |
| Repo | GitHub (MIT license) | Community contributions via PRs |

## CMS Content Types (gettingstarted.sh Tenant)

| Content Type | Key Fields | Notes |
|---|---|---|
| `tools` | name, slug, category, version, os_support[], homepage_url, description, logo_url, verified | Core registry entry |
| `setup_scripts` | tool_id, os (mac/linux/win), script_content, dependencies[], env_vars[], version | One per tool per OS |
| `docs_pages` | tool_id, body (markdown), generated_from_script | Auto-generated or manually written |
| `categories` | name, slug, description, icon | AI Coding, Video Gen, Audio AI, Local LLM, SDKs, etc. |

## Tool Manifest Schema (for GitHub PR contributions)

Contributors submit a YAML manifest that gets ingested into the CMS:

```yaml
name: cursor
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
  # Package managers (preferred — used when detected)
  brew: cursor --cask
  winget: Cursor.Cursor
  snap: cursor
  apt: null              # not available via apt
  choco: cursor
  scoop: extras/cursor
  npm: null              # not an npm package
  pip: null              # not a pip package
  cargo: null            # not a cargo crate
  # Fallback scripts (used when no supported package manager is found)
  mac: |
    curl -fsSL https://download.cursor.com/mac/install.sh | sh
  linux: |
    curl -fsSL https://download.cursor.com/linux/install.sh | sh
  win: |
    powershell -c "irm https://download.cursor.com/win/install.ps1 | iex"
verified: true
```

### How Install Resolution Works

The setup script auto-detects the user's available package managers and uses the best option:

```bash
$ curl gettingstarted.sh/cursor | sh

# Detection order (first match wins):
# 1. Check for package managers: brew → snap → apt → winget → choco → scoop
# 2. If a supported package manager is found AND the tool has an entry → use it
# 3. If no package manager matches → fall back to OS-specific script
# 4. If no OS script → error with install instructions link
```

**Supported package managers:**

| Manager | Platform | Example |
|---|---|---|
| `brew` | macOS, Linux | `brew install --cask cursor` |
| `winget` | Windows | `winget install Cursor.Cursor` |
| `choco` | Windows | `choco install cursor` |
| `scoop` | Windows | `scoop install extras/cursor` |
| `snap` | Linux | `snap install cursor` |
| `apt` | Debian/Ubuntu | `apt install cursor` |
| `npm` | Cross-platform | `npm install -g @anthropic-ai/claude-code` |
| `pip` | Cross-platform | `pip install ollama` |
| `cargo` | Cross-platform | `cargo install tool-name` |

Tools set `null` for package managers that don't support them. The script skips those silently.

**Users can also install directly via their package manager** without the curl pipe:
```bash
# If you already know the package manager command:
brew install --cask cursor
npm install -g @anthropic-ai/claude-code
pip install ollama
```

The registry page for each tool shows ALL available install methods — curl, brew, npm, pip, etc.

## Key User Flows

1. **User installs a tool:** `curl gettingstarted.sh/cursor | sh` → Cloudflare Worker serves setup script → script detects package managers → uses best available (brew/winget/snap) or falls back to direct install
2. **Contributor adds a tool:** Fork repo → add `tools/cursor.yaml` → submit PR → CI validates manifest → merged → CMS ingests → static site rebuilds
3. **Maintainer manages registry:** Log into CMS admin → edit tool entries, approve scripts, manage categories, toggle verified status

## Build Phases

### Phase 1 — Registry + CMS Integration (Weeks 5-8, after CMS core is live)
- [ ] Define CMS content types for gettingstarted.sh tenant
- [ ] Build manifest ingestion: GitHub PR → CI validates → CMS API creates tool entry
- [ ] Build curl handler: Cloudflare Worker detects OS, serves correct setup script from CMS
- [ ] Seed 50 tools with verified setup scripts
- [ ] Static site generator: pull tools from CMS API, build landing page + registry table + per-tool pages

### Phase 2 — Community (Weeks 9-12)
- [ ] GitHub PR contribution workflow documented and tested
- [ ] CI pipeline: lint manifests, validate scripts, auto-merge verified tools
- [ ] Community contributor guide, CODE_OF_CONDUCT, CONTRIBUTING.md
- [ ] Announce at 1-2 developer events
- [ ] Target: 100+ GitHub stars, first external contributors

### Phase 3 — Growth (Q3-Q4 2026)
- [ ] 100+ tools in registry
- [ ] 1,000+ GitHub stars
- [ ] Featured in developer onboarding flows
- [ ] Revenue exploration: sponsored tool listings, premium enterprise registry

## Success Criteria (End of 90 Days)

- 50+ tools in registry, all consuming CMS API
- curl handler working for macOS + Linux
- Static site live with landing page, registry table, and per-tool docs
- GitHub repo public, MIT licensed, community PRs flowing
- 100+ GitHub stars

## Environment Variables

```env
CMS_API_URL=                    # Loremi CMS API base URL
CMS_TENANT_SLUG=gettingstarted  # Tenant identifier
CLOUDFLARE_ACCOUNT_ID=          # For Workers + Pages deployment
CLOUDFLARE_API_TOKEN=           # Deploy token
GITHUB_TOKEN=                   # For CI manifest ingestion
NEXT_PUBLIC_SITE_URL=           # https://gettingstarted.sh
```

---

*This document serves as the base prompt for initializing the gettingstarted.sh project. Depends on Loremi CMS being live first.*
*Version 1.0 — April 2026*
