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
| `description` | string | yes | One-line description of what the tool does (under 120 characters) |
| `os` | array | yes | Supported platforms: `mac`, `win`, `linux` (at least one) |
| `verified` | boolean | no | Whether a maintainer has tested the install scripts. Default: `false` |

## The `install` Block

The `install` block maps package managers and OS fallback scripts. Set a value for supported managers, `null` for unsupported ones.

### Platform-specific package managers

| Key | Platform | Example value |
|-----|----------|---------------|
| `brew` | macOS, Linux | `cursor --cask` or `ollama` |
| `winget` | Windows | `Cursor.Cursor` |
| `choco` | Windows | `cursor` |
| `scoop` | Windows | `extras/cursor` |
| `snap` | Linux | `cursor` |
| `apt` | Debian/Ubuntu | `cursor` |

### Cross-platform package managers

| Key | Platform | Example value |
|-----|----------|---------------|
| `npm` | all | `@anthropic-ai/claude-code` (installs globally via `npm install -g`) |
| `pip` | all | `ollama` (installs via `pip install`) |
| `cargo` | all | `tool-name` (installs via `cargo install`) |

### Fallback scripts

Used when no supported package manager is found on the user's system.

| Key | Platform | Format |
|-----|----------|--------|
| `mac` | macOS | Shell script (multiline string, `curl \| sh` pattern) |
| `linux` | Linux | Shell script (multiline string, `curl \| sh` pattern) |
| `win` | Windows | PowerShell script (multiline string, `irm \| iex` pattern) |

## Validation Rules

- `slug` must match the regex `^[a-z0-9-]+$`
- `slug` must match the filename: `tools/cursor.yaml` means slug is `cursor`
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
