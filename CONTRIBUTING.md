# Contributing to gettingstarted.sh

Thank you for helping build the setup registry for the AI era. The registry grows because of contributors like you — every tool you add helps someone get started faster.

## Quick Start

Adding a tool takes three steps:

1. **Fork** this repository
2. **Create** a file at `tools/your-tool-name.yaml` using the template below
3. **Submit** a pull request

That's it. We'll review and merge within 48 hours.

## Your First Contribution

New to GitHub? Here's the step-by-step:

1. **Fork the repo** — click the "Fork" button at the top of the [GitHub page](https://github.com/gettingstarted-sh/gettingstarted.sh). This creates your own copy. ([GitHub's fork guide](https://docs.github.com/en/get-started/quickstart/fork-a-repo))

2. **Create your manifest file** — in your fork, navigate to the `tools/` folder and create a new file. Name it `your-tool-name.yaml` (lowercase, hyphens, no spaces).

3. **Fill in the template** — copy the template below and fill in the details for your tool.

4. **Submit a pull request** — go back to the original repo and click "New pull request". Select your fork and branch. ([GitHub's PR guide](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork))

5. **Wait for review** — we'll validate your manifest and test the install methods. Verified tools get merged within 48 hours.

## Manifest Template

Copy this into `tools/your-tool-name.yaml` and fill in the details:

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

## Complete Examples

### Example 1: Desktop App (Cursor)

Multiple platform package managers with fallback scripts for each OS.

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

Primarily installed via npm (cross-platform package manager).

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

Available via both platform-specific and cross-platform package managers.

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

## Categories

| Slug | Name | What belongs here |
|------|------|-------------------|
| `ai-coding` | AI Coding | Code editors, coding assistants, developer tools with AI |
| `video-gen` | Video Gen | AI video generation and editing tools |
| `audio-ai` | Audio AI | Text-to-speech, music generation, audio processing |
| `local-llm` | Local LLM | Tools for running language models on your own machine |
| `sdks` | SDKs | AI SDKs, frameworks, and developer libraries |
| `vibe-coding` | Vibe Coding | AI-powered app builders and no-code/low-code tools |

## Naming Rules

- **Slug** must be lowercase with hyphens only: `my-tool-name`
- **Slug** must match the regex `^[a-z0-9-]+$`
- **Filename** must match the slug: `tools/my-tool-name.yaml`
- **Description** must be under 120 characters

## What Reviewers Check

When you submit a PR, we check:

1. YAML is valid (no syntax errors)
2. All required fields are present (`name`, `slug`, `category`, `version`, `homepage`, `description`, `os`)
3. `slug` matches the filename
4. `category` is one of the six allowed values
5. `os` array has at least one entry
6. At least one install method is provided (any package manager or fallback script)
7. `homepage` starts with `https://`
8. `description` is under 120 characters

## Review Process

- **Verified tools** (install methods tested by maintainers): merged within 48 hours
- **Unverified tools** (`verified: false`): merged after basic validation, marked for testing
- If we find issues, we'll comment on the PR with what needs fixing

## Full Schema Reference

For the complete field-by-field specification, see [inspo/technical/manifest-spec.md](inspo/technical/manifest-spec.md).

## Code of Conduct

All contributors are expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md). Be kind, be constructive, be welcoming.

## Questions?

Open an issue on GitHub — we're happy to help.
