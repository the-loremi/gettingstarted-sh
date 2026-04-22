# Install Engine Design — gettingstarted.sh

**Date:** 2026-04-22
**Status:** Approved
**Author:** Barnabas Oretan + Claude

---

## Context

The gettingstarted.sh static site and YAML data layer are built. Tool manifests exist in `tools/*.yaml` with install methods for 9 package managers and 3 OS fallback scripts. The site shows install commands on tool pages, but running `curl gettingstarted.sh/cursor | sh` or `irm gettingstarted.sh/cursor | iex` doesn't actually work yet. This spec defines the install engine that makes it work.

## Goal

Build a Cloudflare Worker that serves dynamically generated install scripts when users run `curl gettingstarted.sh/[tool] | sh` (macOS/Linux) or `irm gettingstarted.sh/[tool] | iex` (Windows PowerShell). The scripts use smart package manager detection as defined in `inspo/technical/install-resolution.md`.

## Approach

**Cloudflare Worker** in a `worker/` directory alongside the Next.js project. Separate deployment, separate `package.json`. Tool data is bundled as JSON at build time (converted from `tools/*.yaml`). The Worker detects CLI requests via User-Agent and generates self-contained install scripts with tool data baked in.

---

## Architecture

### Two Deployments

| Deployment | What | Where |
|-----------|------|-------|
| Static site | Next.js pages (landing, browse, tool pages, about, contribute) | Cloudflare Pages |
| Install engine | Cloudflare Worker (serves install scripts) | Cloudflare Workers on `gettingstarted.sh/*` |

### Request Routing

The Worker sits on the domain and intercepts all requests:

1. Check `User-Agent` header
2. If CLI request (`curl`, `wget`, `Invoke-RestMethod`, `PowerShell`) AND path matches a tool slug → generate and serve install script
3. If not a CLI request → `fetch()` the origin (static site on Cloudflare Pages) and return that response (pass-through)

### CLI Detection

A request is considered a CLI request if the `User-Agent` header contains any of:
- `curl`
- `wget`
- `PowerShell`

If `User-Agent` contains `PowerShell` → serve PowerShell script.
Otherwise (curl, wget) → serve shell script.

---

## File Structure

```
worker/
  src/
    index.ts              — Request router (CLI detection, tool lookup, dispatch)
    scripts/
      shell.ts            — generateShellScript(tool: Tool): string
      powershell.ts       — generatePowerShellScript(tool: Tool): string
    tools.ts              — loadTool(slug): Tool | null, getAllSlugs(): string[]
    types.ts              — Tool, InstallMethods types (copied from lib/tool-types.ts)
  tools.json              — Generated at build time from tools/*.yaml (gitignored)
  build-tools.ts          — Build script: YAML → JSON conversion
  wrangler.toml           — Cloudflare Worker configuration
  package.json            — Worker dependencies and scripts
  tsconfig.json           — TypeScript config for Worker
```

---

## Script Generation

### Shell Script (macOS/Linux)

Served when User-Agent contains `curl` or `wget`. `Content-Type: text/plain; charset=utf-8`.

The generated script is a self-contained POSIX shell script with the tool's install method values baked in as variables. Detection order:

1. `brew` (if manifest value non-null)
2. `snap` (if manifest value non-null)
3. `apt` (if manifest value non-null)
4. `npm` (if manifest value non-null)
5. `pip` (if manifest value non-null)
6. `cargo` (if manifest value non-null)
7. OS fallback script: `mac` if on macOS, `linux` if on Linux (if non-null)
8. Error: "No supported install method found" + link to tool page

Detection uses `command -v [manager]` to check if a package manager exists.

Script behavior:
- Prints banner: `gettingstarted.sh — installing [tool name]`
- Prints each detection step: `detecting package managers...`
- Prints what it found: `found brew`
- Runs the install command
- Prints success: `done — [tool name] installed`
- No `sudo` without notice — when apt/snap need sudo, the script prints a notice before running
- Exits with code 0 on success, 1 on failure

OS detection in the shell script (for choosing mac vs linux fallback):
```sh
OS="$(uname -s)"
# OS will be "Darwin" for macOS, "Linux" for Linux
```

### PowerShell Script (Windows)

Served when User-Agent contains `PowerShell`. `Content-Type: text/plain; charset=utf-8`.

Same pattern as shell but in PowerShell syntax. Detection order:

1. `winget` (if manifest value non-null)
2. `choco` (if manifest value non-null)
3. `scoop` (if manifest value non-null)
4. `npm` (if manifest value non-null)
5. `pip` (if manifest value non-null)
6. `cargo` (if manifest value non-null)
7. OS fallback script: `win` (if non-null)
8. Error: "No supported install method found" + link to tool page

Detection uses `Get-Command [manager] -ErrorAction SilentlyContinue` to check if a package manager exists.

Script behavior mirrors the shell version: banner, detection steps, install, success message.

---

## Tool Data

### Build Step

`worker/build-tools.ts` is a Node script that:

1. Reads all `*.yaml` files from `../tools/` (relative to worker directory)
2. Parses each with `js-yaml`
3. Maps to `Tool` objects (same shape as `lib/tool-types.ts`)
4. Writes `worker/tools.json` — a JSON array of all tools

This runs before every `wrangler dev` and `wrangler deploy`.

### Runtime Lookup

`worker/src/tools.ts` imports `tools.json` directly (Cloudflare Workers support JSON imports). Exports:

```
loadTool(slug: string): Tool | null
getAllSlugs(): string[]
```

---

## Error Handling

| Scenario | Response |
|----------|----------|
| Tool slug not found | `404`, plain text: `Tool "[slug]" not found.\nBrowse the registry at https://gettingstarted.sh/browse` |
| No install method matched on user's system | Script exits with code 1, prints: `No supported install method found.\nVisit https://gettingstarted.sh/[slug] for manual install options.` |
| Non-CLI request to a tool slug | Pass through to static site (which has the tool detail page) |
| Non-CLI request to any other path | Pass through to static site |
| Request to `/` with CLI User-Agent | Plain text help: `gettingstarted.sh — usage: curl gettingstarted.sh/[tool] \| sh` |

---

## Worker Configuration

### wrangler.toml

```toml
name = "gettingstarted-install"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[build]
command = "npx tsx build-tools.ts"

# Route configuration (set up after domain is connected)
# routes = [
#   { pattern = "gettingstarted.sh/*", zone_name = "gettingstarted.sh" }
# ]
```

Routes are commented out until the domain is set up. During development, `wrangler dev` serves on localhost.

### package.json scripts

```json
{
  "scripts": {
    "build": "npx tsx build-tools.ts",
    "dev": "npx tsx build-tools.ts && wrangler dev",
    "deploy": "npx tsx build-tools.ts && wrangler deploy"
  }
}
```

---

## Local Development

```bash
cd worker
pnpm install
pnpm dev
```

Test shell script:
```bash
curl http://localhost:8787/cursor
```

Test PowerShell script:
```powershell
irm http://localhost:8787/cursor
```

Test unknown tool:
```bash
curl http://localhost:8787/nonexistent
# Expected: 404 "Tool not found"
```

Test browser request (no CLI User-Agent):
```bash
curl -H "User-Agent: Mozilla/5.0" http://localhost:8787/cursor
# Expected: pass-through to origin (or 502 if origin not running locally)
```

---

## Out of Scope

- Custom domain DNS setup (manual step, separate from code)
- Telemetry / analytics (Phase 2)
- Checksum verification for fallback script downloads (future)
- Caching layer (Cloudflare CDN handles natively)
- Rate limiting (Cloudflare handles natively)
- Static site deployment to Cloudflare Pages (separate concern)

## File Map

| Action | File |
|--------|------|
| Create | `worker/package.json` |
| Create | `worker/tsconfig.json` |
| Create | `worker/wrangler.toml` |
| Create | `worker/build-tools.ts` |
| Create | `worker/src/types.ts` |
| Create | `worker/src/tools.ts` |
| Create | `worker/src/scripts/shell.ts` |
| Create | `worker/src/scripts/powershell.ts` |
| Create | `worker/src/index.ts` |
| Create | `worker/.gitignore` (ignore tools.json) |
