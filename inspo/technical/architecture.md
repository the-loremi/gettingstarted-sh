# System Architecture

> How gettingstarted.sh is built, from frontend to infrastructure.

## Phase 0 — Current Architecture

The simplest possible setup. No backend, no database, no Workers.

```
tools/*.yaml ──→ Next.js reads at build time ──→ Static HTML ──→ Cloudflare Pages
  (in repo)        (generates pages)               (deployed)       (CDN)
```

- Tool data lives as YAML files in the `tools/` directory of the repo
- Next.js reads these files at build time and generates static pages
- The static site is deployed to Cloudflare Pages (or Vercel as a backup)
- Contributors add tools by submitting PRs with new YAML manifests
- No CMS, no API, no Workers — just files and static builds

### Phase 0 Data Flow

```
Contributor                              User
──────────                               ────
1. Fork repo                            1. Visit gettingstarted.sh
2. Add tools/mytool.yaml                2. Browse registry
3. Submit PR                            3. Copy install command
4. CI validates YAML                    4. Run: curl gettingstarted.sh/tool | sh
5. Maintainer merges                       or: irm gettingstarted.sh/tool | iex
6. GitHub Action rebuilds site
7. Cloudflare Pages deploys
```

## Phase 1+ — Full Architecture

Once the Loremi CMS is live, the architecture expands.

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  Next.js 16 (Static Site Generation)                        │
│  Landing page, registry table, tool pages, docs             │
│  Pulls data from CMS API at build time                      │
├─────────────────────────────────────────────────────────────┤
│                    CURL / IRM HANDLER                        │
│  Cloudflare Worker                                          │
│  Detects OS from User-Agent                                 │
│  Serves shell script (macOS/Linux) or PowerShell (Windows)  │
│  Package manager detection runs client-side in script       │
├─────────────────────────────────────────────────────────────┤
│                     LOREMI CMS API                           │
│  Tool CRUD  |  Script storage  |  Category management       │
│  gettingstarted.sh tenant content types                     │
├─────────────────────────────────────────────────────────────┤
│                  SUPABASE + CLOUDFLARE R2                    │
│  PostgreSQL (tool data)  |  R2 (script files)  |  CDN       │
└─────────────────────────────────────────────────────────────┘
```

### Phase 1+ Data Flow

```
Contributor                    Loremi CMS                     User
──────────                     ──────────                     ────
Submit PR (tool manifest)  →   CI validates YAML
Merged                     →   CMS API creates tool entry →   curl gettingstarted.sh/tool | sh
                               Setup script stored in R2       or: irm gettingstarted.sh/tool | iex
                               Docs page generated                    ↓
                               Static site rebuilds        →   Cloudflare Worker detects OS
                                                               Serves install script
                                                               Script detects package managers
                                                               Best method used
                                                               Tool installed
```

## Frontend Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.1.7 | App Router, Static Site Generation |
| React | 19.2.x | UI framework |
| Tailwind CSS | 4.2.x | Styling (CSS variables, PostCSS) |
| shadcn/ui | radix-lyra | Component library (Radix primitives) |
| Phosphor Icons | 2.1.x | Icon library |
| JetBrains Mono | — | Monospace font (body text) |
| Geist | — | Sans-serif font (UI elements) |
| next-themes | 0.4.x | Dark/light mode toggle |
| TypeScript | 5.9.x | Type safety (strict mode) |

## Data Storage Per Phase

| Phase | Where tool data lives | How frontend reads it |
|-------|----------------------|----------------------|
| Phase 0 | `tools/*.yaml` files in repo | Next.js reads YAML at build time |
| Phase 1+ | Loremi CMS API → Supabase PostgreSQL | Next.js fetches CMS API at build time (SSG) |

## Curl/irm Handler

The handler is a Cloudflare Worker that:

1. Receives request to `gettingstarted.sh/[tool-slug]`
2. Checks `User-Agent` header to detect OS
3. Looks up the tool's manifest (Phase 0: from a bundled JSON, Phase 1+: from CMS API)
4. Generates a shell script (macOS/Linux) or PowerShell script (Windows) with the tool's install methods baked in
5. Serves the script with appropriate `Content-Type`

Package manager detection happens **client-side** in the served script, not on the server. The Worker doesn't need to know what package managers the user has — it just serves the script and the script figures it out.

## Build Pipeline

```
PR merged to main
       ↓
GitHub Action triggers
       ↓
Next.js static export (reads tools/*.yaml or CMS API)
       ↓
Output: static HTML/CSS/JS
       ↓
Deployed to Cloudflare Pages
       ↓
Live at gettingstarted.sh
```

## Key Design Decisions

### Static site, not server-rendered

The site is statically generated (SSG), not server-side rendered (SSR). This means:
- Pages are pre-built HTML, served from CDN edge nodes worldwide
- No server processing on each request — fast everywhere
- Cloudflare Pages free tier is generous for static sites
- Trade-off: site rebuilds needed when tool data changes (automated via GitHub Actions)

### File-based first, CMS later

Phase 0 uses YAML files in the repo. This lets us ship immediately without waiting for the CMS to be ready. The migration path to CMS is clean — same data structure, different source.

### Client-side package manager detection

The install script detects package managers on the user's machine, not on the server. This means:
- The server doesn't need to know anything about the user's system
- The script works offline after download
- No privacy concerns — no system info sent to the server
- Simpler Worker logic (just serve the script)
