# gettingstarted.sh

> Every tool. One command.

[![MIT License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

gettingstarted.sh is a free, open-source registry that lets you install any AI tool with a single command. It figures out the best way to install each tool on your computer — whether you're on Mac, Windows, or Linux — so you don't have to.

## How to use it

**Mac or Linux** — open Terminal and run:

```bash
curl gettingstarted.sh/cursor | sh
```

**Windows** — open PowerShell and run:

```powershell
irm gettingstarted.sh/cursor | iex
```

Replace `cursor` with any tool in the registry.

### New to the terminal?

A **terminal** is a text-based way to talk to your computer. Every Mac, Windows, and Linux machine has one built in.

- **Mac:** open the app called "Terminal" (search for it in Spotlight)
- **Windows:** open "PowerShell" (search for it in the Start menu)
- **Linux:** open your terminal emulator (usually Ctrl+Alt+T)

Then paste the command above and press Enter.

**What does `curl | sh` mean?** `curl` downloads a script from the internet. `sh` runs it. Together, they download and run an install script.

**What does `irm | iex` mean?** `irm` (Invoke-RestMethod) downloads a script. `iex` (Invoke-Expression) runs it. This is the Windows PowerShell way of doing the same thing. Only run these commands from sources you trust — all gettingstarted.sh scripts are open source and auditable.

## What happens when you run it

1. **Detects your system** — the script checks what package managers you have installed (brew, winget, npm, pip, snap, and more)
2. **Picks the best method** — it uses the first available package manager that supports the tool (e.g., brew on Mac, winget on Windows, npm for CLI tools)
3. **Installs the tool** — runs the install command and configures everything. If no package manager is found, it falls back to a direct download

You don't need to know which package manager to use. The script figures it out.

## Registry

| Tool | Category | Install |
|------|----------|---------|
| Cursor | AI Coding | `curl gettingstarted.sh/cursor \| sh` |
| Claude Code | AI Coding | `curl gettingstarted.sh/claude-code \| sh` |
| Ollama | Local LLM | `curl gettingstarted.sh/ollama \| sh` |
| Runway | Video Gen | `curl gettingstarted.sh/runway \| sh` |
| ElevenLabs | Audio AI | `curl gettingstarted.sh/elevenlabs \| sh` |

Browse the full registry at [gettingstarted.sh/browse](https://gettingstarted.sh/browse).

## Add a tool

Anyone can add a tool to the registry:

1. Fork this repo
2. Add a YAML file to `tools/` (e.g., `tools/your-tool.yaml`)
3. Submit a pull request

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide and manifest template.

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (Static Site Generation) |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Hosting | Cloudflare Pages |
| Install handler | Cloudflare Workers |
| Backend | Loremi CMS (Phase 1+) |
| Database | Supabase PostgreSQL (Phase 1+) |

## License

MIT — see [LICENSE](LICENSE).

---

A [The Loremi Ltd](https://theloremi.com) project.
