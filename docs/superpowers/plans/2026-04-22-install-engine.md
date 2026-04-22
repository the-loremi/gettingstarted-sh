# Install Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Cloudflare Worker that serves dynamically generated install scripts with smart package manager detection when users run `curl gettingstarted.sh/[tool] | sh` or `irm gettingstarted.sh/[tool] | iex`.

**Architecture:** A `worker/` directory alongside the Next.js project. A build script converts `tools/*.yaml` → `tools.json`. The Worker imports that JSON, detects CLI requests via User-Agent, and generates self-contained shell or PowerShell scripts with install values baked in. Non-CLI requests pass through to the static site.

**Tech Stack:** Cloudflare Workers, Wrangler CLI, TypeScript, tsx (for build script), js-yaml

**Spec:** `docs/superpowers/specs/2026-04-22-install-engine-design.md`

---

## File Map

| # | Action | File | Responsibility |
|---|--------|------|----------------|
| 1 | Create | `worker/package.json` | Dependencies and scripts |
| 2 | Create | `worker/tsconfig.json` | TypeScript config |
| 3 | Create | `worker/wrangler.toml` | Cloudflare Worker config |
| 4 | Create | `worker/.gitignore` | Ignore tools.json |
| 5 | Create | `worker/build-tools.ts` | YAML → JSON build script |
| 6 | Create | `worker/src/types.ts` | Tool and InstallMethods types |
| 7 | Create | `worker/src/tools.ts` | Tool lookup from bundled JSON |
| 8 | Create | `worker/src/scripts/shell.ts` | Shell script generator |
| 9 | Create | `worker/src/scripts/powershell.ts` | PowerShell script generator |
| 10 | Create | `worker/src/index.ts` | Request router |

---

## Task 1: Scaffold worker project

**Files:**
- Create: `worker/package.json`
- Create: `worker/tsconfig.json`
- Create: `worker/wrangler.toml`
- Create: `worker/.gitignore`

- [ ] **Step 1: Create worker directory**

```bash
mkdir -p worker/src/scripts
```

- [ ] **Step 2: Create package.json**

Write `worker/package.json`:

```json
{
  "name": "gettingstarted-worker",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "npx tsx build-tools.ts",
    "dev": "npx tsx build-tools.ts && wrangler dev",
    "deploy": "npx tsx build-tools.ts && wrangler deploy"
  },
  "dependencies": {
    "js-yaml": "^4.1.0"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20241230.0",
    "@types/js-yaml": "^4.0.9",
    "tsx": "^4.19.0",
    "typescript": "^5.9.3",
    "wrangler": "^4.14.0"
  }
}
```

- [ ] **Step 3: Create tsconfig.json**

Write `worker/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "types": ["@cloudflare/workers-types"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "outDir": "dist"
  },
  "include": ["src/**/*.ts", "build-tools.ts"]
}
```

- [ ] **Step 4: Create wrangler.toml**

Write `worker/wrangler.toml`:

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

- [ ] **Step 5: Create .gitignore**

Write `worker/.gitignore`:

```
node_modules/
dist/
tools.json
.wrangler/
```

- [ ] **Step 6: Install dependencies**

```bash
cd worker && pnpm install
```

- [ ] **Step 7: Commit**

```bash
git add worker/package.json worker/tsconfig.json worker/wrangler.toml worker/.gitignore worker/pnpm-lock.yaml
git commit -m "chore: scaffold cloudflare worker project"
```

---

## Task 2: Build script (YAML → JSON)

**Files:**
- Create: `worker/build-tools.ts`

- [ ] **Step 1: Create build-tools.ts**

Write `worker/build-tools.ts`:

```typescript
import fs from "fs"
import path from "path"
import yaml from "js-yaml"

interface InstallMethods {
  brew: string | null
  winget: string | null
  choco: string | null
  scoop: string | null
  snap: string | null
  apt: string | null
  npm: string | null
  pip: string | null
  cargo: string | null
  mac: string | null
  linux: string | null
  win: string | null
}

interface Tool {
  name: string
  slug: string
  category: string
  version: string
  homepage: string
  description: string
  os: string[]
  verified: boolean
  install: InstallMethods
}

const toolsDir = path.join(import.meta.dirname, "..", "tools")
const outFile = path.join(import.meta.dirname, "tools.json")

if (!fs.existsSync(toolsDir)) {
  console.error("tools/ directory not found at", toolsDir)
  process.exit(1)
}

const files = fs.readdirSync(toolsDir).filter((f) => f.endsWith(".yaml"))

console.log(`Building tools.json from ${files.length} manifests...`)

const tools: Tool[] = files.map((file) => {
  const content = fs.readFileSync(path.join(toolsDir, file), "utf-8")
  const data = yaml.load(content) as Record<string, unknown>
  const install = (data.install ?? {}) as Record<string, unknown>

  return {
    name: data.name as string,
    slug: data.slug as string,
    category: data.category as string,
    version: String(data.version ?? "latest"),
    homepage: data.homepage as string,
    description: data.description as string,
    os: data.os as string[],
    verified: (data.verified as boolean) ?? false,
    install: {
      brew: (install.brew as string) ?? null,
      winget: (install.winget as string) ?? null,
      choco: (install.choco as string) ?? null,
      scoop: (install.scoop as string) ?? null,
      snap: (install.snap as string) ?? null,
      apt: (install.apt as string) ?? null,
      npm: (install.npm as string) ?? null,
      pip: (install.pip as string) ?? null,
      cargo: (install.cargo as string) ?? null,
      mac: (install.mac as string) ?? null,
      linux: (install.linux as string) ?? null,
      win: (install.win as string) ?? null,
    },
  }
})

fs.writeFileSync(outFile, JSON.stringify(tools, null, 2))
console.log(`Wrote ${tools.length} tools to tools.json`)
```

- [ ] **Step 2: Test the build script**

```bash
cd worker && npx tsx build-tools.ts
```

Expected output:
```
Building tools.json from 5 manifests...
Wrote 5 tools to tools.json
```

Verify `worker/tools.json` exists and contains 5 tools.

- [ ] **Step 3: Commit**

```bash
git add worker/build-tools.ts
git commit -m "feat: add YAML to JSON build script for worker"
```

---

## Task 3: Types and tool lookup

**Files:**
- Create: `worker/src/types.ts`
- Create: `worker/src/tools.ts`

- [ ] **Step 1: Create types.ts**

Write `worker/src/types.ts`:

```typescript
export type InstallMethods = {
  brew: string | null
  winget: string | null
  choco: string | null
  scoop: string | null
  snap: string | null
  apt: string | null
  npm: string | null
  pip: string | null
  cargo: string | null
  mac: string | null
  linux: string | null
  win: string | null
}

export type Tool = {
  name: string
  slug: string
  category: string
  version: string
  homepage: string
  description: string
  os: string[]
  verified: boolean
  install: InstallMethods
}
```

- [ ] **Step 2: Create tools.ts**

Write `worker/src/tools.ts`:

```typescript
import type { Tool } from "./types"
import toolsData from "../tools.json"

const tools = toolsData as Tool[]

export function loadTool(slug: string): Tool | null {
  return tools.find((t) => t.slug === slug) ?? null
}

export function getAllSlugs(): string[] {
  return tools.map((t) => t.slug)
}
```

- [ ] **Step 3: Commit**

```bash
git add worker/src/types.ts worker/src/tools.ts
git commit -m "feat: add types and tool lookup for worker"
```

---

## Task 4: Shell script generator

**Files:**
- Create: `worker/src/scripts/shell.ts`

- [ ] **Step 1: Create shell.ts**

Write `worker/src/scripts/shell.ts`:

```typescript
import type { Tool } from "../types"

export function generateShellScript(tool: Tool): string {
  const lines: string[] = []

  lines.push("#!/bin/sh")
  lines.push("set -e")
  lines.push("")
  lines.push(`# gettingstarted.sh — install script for ${tool.name}`)
  lines.push(`# https://gettingstarted.sh/${tool.slug}`)
  lines.push("")

  // Bake in manifest values as variables
  lines.push(`TOOL_NAME="${tool.name}"`)
  lines.push(`TOOL_SLUG="${tool.slug}"`)
  lines.push(`BREW_PACKAGE=${tool.install.brew ? `"${tool.install.brew}"` : '""'}`)
  lines.push(`SNAP_PACKAGE=${tool.install.snap ? `"${tool.install.snap}"` : '""'}`)
  lines.push(`APT_PACKAGE=${tool.install.apt ? `"${tool.install.apt}"` : '""'}`)
  lines.push(`NPM_PACKAGE=${tool.install.npm ? `"${tool.install.npm}"` : '""'}`)
  lines.push(`PIP_PACKAGE=${tool.install.pip ? `"${tool.install.pip}"` : '""'}`)
  lines.push(`CARGO_PACKAGE=${tool.install.cargo ? `"${tool.install.cargo}"` : '""'}`)

  // Encode fallback scripts
  const macFallback = tool.install.mac?.trim() ?? ""
  const linuxFallback = tool.install.linux?.trim() ?? ""

  lines.push("")
  lines.push("# Detection helper")
  lines.push('command_exists() { command -v "$1" >/dev/null 2>&1; }')
  lines.push("")
  lines.push('echo "gettingstarted.sh — installing $TOOL_NAME"')
  lines.push('echo "detecting package managers..."')
  lines.push("")

  lines.push('if command_exists brew && [ -n "$BREW_PACKAGE" ]; then')
  lines.push('  echo "found brew"')
  lines.push('  brew install $BREW_PACKAGE')
  lines.push('elif command_exists snap && [ -n "$SNAP_PACKAGE" ]; then')
  lines.push('  echo "found snap (requires sudo)"')
  lines.push('  sudo snap install $SNAP_PACKAGE')
  lines.push('elif command_exists apt && [ -n "$APT_PACKAGE" ]; then')
  lines.push('  echo "found apt (requires sudo)"')
  lines.push('  sudo apt install -y $APT_PACKAGE')
  lines.push('elif command_exists npm && [ -n "$NPM_PACKAGE" ]; then')
  lines.push('  echo "found npm"')
  lines.push('  npm install -g $NPM_PACKAGE')
  lines.push('elif command_exists pip && [ -n "$PIP_PACKAGE" ]; then')
  lines.push('  echo "found pip"')
  lines.push('  pip install $PIP_PACKAGE')
  lines.push('elif command_exists cargo && [ -n "$CARGO_PACKAGE" ]; then')
  lines.push('  echo "found cargo"')
  lines.push('  cargo install $CARGO_PACKAGE')

  // OS-specific fallbacks
  if (macFallback || linuxFallback) {
    lines.push("else")
    lines.push('  echo "no package manager found, using fallback"')
    lines.push('  OS="$(uname -s)"')

    if (macFallback && linuxFallback) {
      lines.push('  if [ "$OS" = "Darwin" ]; then')
      lines.push(`    ${macFallback}`)
      lines.push('  elif [ "$OS" = "Linux" ]; then')
      lines.push(`    ${linuxFallback}`)
      lines.push("  else")
      lines.push('    echo "Unsupported OS: $OS"')
      lines.push('    echo "Visit https://gettingstarted.sh/$TOOL_SLUG for manual install options."')
      lines.push("    exit 1")
      lines.push("  fi")
    } else if (macFallback) {
      lines.push('  if [ "$OS" = "Darwin" ]; then')
      lines.push(`    ${macFallback}`)
      lines.push("  else")
      lines.push('    echo "No supported install method found for $OS."')
      lines.push('    echo "Visit https://gettingstarted.sh/$TOOL_SLUG for manual install options."')
      lines.push("    exit 1")
      lines.push("  fi")
    } else {
      lines.push('  if [ "$OS" = "Linux" ]; then')
      lines.push(`    ${linuxFallback}`)
      lines.push("  else")
      lines.push('    echo "No supported install method found for $OS."')
      lines.push('    echo "Visit https://gettingstarted.sh/$TOOL_SLUG for manual install options."')
      lines.push("    exit 1")
      lines.push("  fi")
    }
  } else {
    lines.push("else")
    lines.push('  echo "No supported install method found."')
    lines.push('  echo "Visit https://gettingstarted.sh/$TOOL_SLUG for manual install options."')
    lines.push("  exit 1")
  }

  lines.push("fi")
  lines.push("")
  lines.push('echo ""')
  lines.push('echo "done — $TOOL_NAME installed"')

  return lines.join("\n")
}
```

- [ ] **Step 2: Commit**

```bash
git add worker/src/scripts/shell.ts
git commit -m "feat: add shell script generator"
```

---

## Task 5: PowerShell script generator

**Files:**
- Create: `worker/src/scripts/powershell.ts`

- [ ] **Step 1: Create powershell.ts**

Write `worker/src/scripts/powershell.ts`:

```typescript
import type { Tool } from "../types"

export function generatePowerShellScript(tool: Tool): string {
  const lines: string[] = []

  lines.push('$ErrorActionPreference = "Stop"')
  lines.push("")
  lines.push(`# gettingstarted.sh - install script for ${tool.name}`)
  lines.push(`# https://gettingstarted.sh/${tool.slug}`)
  lines.push("")

  // Bake in manifest values as variables
  lines.push(`$ToolName = "${tool.name}"`)
  lines.push(`$ToolSlug = "${tool.slug}"`)
  lines.push(`$WingetPackage = ${tool.install.winget ? `"${tool.install.winget}"` : "$null"}`)
  lines.push(`$ChocoPackage = ${tool.install.choco ? `"${tool.install.choco}"` : "$null"}`)
  lines.push(`$ScoopPackage = ${tool.install.scoop ? `"${tool.install.scoop}"` : "$null"}`)
  lines.push(`$NpmPackage = ${tool.install.npm ? `"${tool.install.npm}"` : "$null"}`)
  lines.push(`$PipPackage = ${tool.install.pip ? `"${tool.install.pip}"` : "$null"}`)
  lines.push(`$CargoPackage = ${tool.install.cargo ? `"${tool.install.cargo}"` : "$null"}`)
  lines.push("")

  lines.push("function Test-Command($cmd) {")
  lines.push("  $null -ne (Get-Command $cmd -ErrorAction SilentlyContinue)")
  lines.push("}")
  lines.push("")

  lines.push('Write-Host "gettingstarted.sh - installing $ToolName"')
  lines.push('Write-Host "detecting package managers..."')
  lines.push("")

  lines.push("if ((Test-Command winget) -and $WingetPackage) {")
  lines.push('  Write-Host "found winget"')
  lines.push("  winget install $WingetPackage")
  lines.push("} elseif ((Test-Command choco) -and $ChocoPackage) {")
  lines.push('  Write-Host "found choco"')
  lines.push("  choco install $ChocoPackage -y")
  lines.push("} elseif ((Test-Command scoop) -and $ScoopPackage) {")
  lines.push('  Write-Host "found scoop"')
  lines.push("  scoop install $ScoopPackage")
  lines.push("} elseif ((Test-Command npm) -and $NpmPackage) {")
  lines.push('  Write-Host "found npm"')
  lines.push("  npm install -g $NpmPackage")
  lines.push("} elseif ((Test-Command pip) -and $PipPackage) {")
  lines.push('  Write-Host "found pip"')
  lines.push("  pip install $PipPackage")
  lines.push("} elseif ((Test-Command cargo) -and $CargoPackage) {")
  lines.push('  Write-Host "found cargo"')
  lines.push("  cargo install $CargoPackage")

  // Windows fallback
  const winFallback = tool.install.win?.trim() ?? ""
  if (winFallback) {
    lines.push("} else {")
    lines.push('  Write-Host "no package manager found, using fallback"')
    lines.push(`  ${winFallback}`)
  } else {
    lines.push("} else {")
    lines.push('  Write-Host "No supported install method found."')
    lines.push('  Write-Host "Visit https://gettingstarted.sh/$ToolSlug for manual install options."')
    lines.push("  exit 1")
  }

  lines.push("}")
  lines.push("")
  lines.push('Write-Host ""')
  lines.push('Write-Host "done - $ToolName installed"')

  return lines.join("\n")
}
```

- [ ] **Step 2: Commit**

```bash
git add worker/src/scripts/powershell.ts
git commit -m "feat: add PowerShell script generator"
```

---

## Task 6: Request router (index.ts)

**Files:**
- Create: `worker/src/index.ts`

- [ ] **Step 1: Create index.ts**

Write `worker/src/index.ts`:

```typescript
import { loadTool } from "./tools"
import { generateShellScript } from "./scripts/shell"
import { generatePowerShellScript } from "./scripts/powershell"

function isCLI(userAgent: string): boolean {
  const ua = userAgent.toLowerCase()
  return ua.includes("curl") || ua.includes("wget") || ua.includes("powershell")
}

function isPowerShell(userAgent: string): boolean {
  return userAgent.toLowerCase().includes("powershell")
}

function textResponse(body: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const userAgent = request.headers.get("User-Agent") ?? ""

    // Strip leading slash, ignore trailing slashes
    const slug = url.pathname.replace(/^\/+|\/+$/g, "").toLowerCase()

    // Non-CLI requests: pass through to origin (static site)
    if (!isCLI(userAgent)) {
      // In production, this fetches from the Cloudflare Pages origin
      // In dev, this will return a message since there's no origin
      try {
        return await fetch(request)
      } catch {
        return textResponse("Non-CLI request. Visit https://gettingstarted.sh in your browser.", 302)
      }
    }

    // CLI request to root: show usage
    if (!slug) {
      return textResponse(
        "gettingstarted.sh — Every tool. One command.\n\n" +
        "Usage:\n" +
        "  curl gettingstarted.sh/[tool] | sh          (macOS/Linux)\n" +
        "  irm gettingstarted.sh/[tool] | iex           (Windows)\n\n" +
        "Browse tools: https://gettingstarted.sh/browse\n"
      )
    }

    // Look up the tool
    const tool = loadTool(slug)

    if (!tool) {
      return textResponse(
        `Tool "${slug}" not found.\nBrowse the registry at https://gettingstarted.sh/browse\n`,
        404
      )
    }

    // Generate and serve the appropriate script
    if (isPowerShell(userAgent)) {
      return textResponse(generatePowerShellScript(tool))
    } else {
      return textResponse(generateShellScript(tool))
    }
  },
}
```

- [ ] **Step 2: Build tools.json (required before wrangler can start)**

```bash
cd worker && npx tsx build-tools.ts
```

Expected: `Wrote 5 tools to tools.json`

- [ ] **Step 3: Verify wrangler dev starts**

```bash
cd worker && npx wrangler dev
```

Expected: Worker starts on `http://localhost:8787`. Press Ctrl+C to stop after confirming.

- [ ] **Step 4: Commit**

```bash
git add worker/src/index.ts
git commit -m "feat: add request router for install engine"
```

---

## Task 7: End-to-end testing

No new files. Test the complete Worker locally.

- [ ] **Step 1: Start the worker**

```bash
cd worker && npx tsx build-tools.ts && npx wrangler dev &
```

Wait for it to start on localhost:8787.

- [ ] **Step 2: Test shell script for cursor**

```bash
curl http://localhost:8787/cursor
```

Expected: A shell script containing:
- `#!/bin/sh`
- `TOOL_NAME="Cursor"`
- `BREW_PACKAGE="cursor --cask"`
- Detection logic with `command_exists brew`
- Fallback script for macOS/Linux

- [ ] **Step 3: Test PowerShell script for cursor**

```bash
curl -H "User-Agent: PowerShell/7.0" http://localhost:8787/cursor
```

Expected: A PowerShell script containing:
- `$ToolName = "Cursor"`
- `$WingetPackage = "Cursor.Cursor"`
- Detection logic with `Test-Command winget`

- [ ] **Step 4: Test unknown tool**

```bash
curl http://localhost:8787/nonexistent
```

Expected: `Tool "nonexistent" not found.` with 404 status.

- [ ] **Step 5: Test CLI root request**

```bash
curl http://localhost:8787/
```

Expected: Usage message with `curl gettingstarted.sh/[tool] | sh`.

- [ ] **Step 6: Test npm-based tool (claude-code)**

```bash
curl http://localhost:8787/claude-code
```

Expected: Shell script with `NPM_PACKAGE="@anthropic-ai/claude-code"` and npm detection.

- [ ] **Step 7: Stop the worker**

```bash
kill %1
```

- [ ] **Step 8: Commit (no changes, but tag as tested)**

```bash
git commit --allow-empty -m "test: verify install engine end-to-end locally"
```

---

## Execution Summary

| Task | What it does | Dependencies |
|------|-------------|--------------|
| 1 | Scaffold worker project (package.json, tsconfig, wrangler, gitignore) | — |
| 2 | Build script (YAML → JSON) | Task 1 |
| 3 | Types and tool lookup | Task 2 (needs tools.json) |
| 4 | Shell script generator | Task 3 (needs types) |
| 5 | PowerShell script generator | Task 3 (needs types) |
| 6 | Request router (index.ts) | Tasks 3, 4, 5 |
| 7 | End-to-end testing | Task 6 |

**Parallelism:** Tasks 4 and 5 are independent (both depend on 3). Everything else is sequential.

**Total:** 7 tasks, 10 files, ~25 steps.
