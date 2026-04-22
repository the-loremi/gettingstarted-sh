# Growth & Launch Strategy

> How to get gettingstarted.sh from 0 to 1,000 stars and become the canonical AI tool setup registry.

## Seed Tool List

Before launch, the registry needs 20+ tools with complete YAML manifests. Prioritized by category:

### AI Coding
| Tool | Slug | Primary install method |
|------|------|-----------------------|
| Cursor | `cursor` | brew, winget, scoop |
| Claude Code | `claude-code` | npm |
| Windsurf | `windsurf` | brew, winget |
| Continue.dev | `continue` | VS Code extension marketplace |

### Vibe Coding
| Tool | Slug | Primary install method |
|------|------|-----------------------|
| Lovable | `lovable` | npm |

### Local LLM
| Tool | Slug | Primary install method |
|------|------|-----------------------|
| Ollama | `ollama` | brew, winget, pip |
| LM Studio | `lm-studio` | brew, winget |
| GPT4All | `gpt4all` | brew, winget |
| Jan | `jan` | brew, winget |

### Video Gen
| Tool | Slug | Primary install method |
|------|------|-----------------------|
| Runway | `runway` | pip |
| Pika | `pika` | Web-based (docs only) |
| Midjourney | `midjourney` | Web-based (docs only) |

### Audio AI
| Tool | Slug | Primary install method |
|------|------|-----------------------|
| ElevenLabs | `elevenlabs` | pip, npm |
| Suno | `suno` | Web-based (docs only) |
| Whisper | `whisper` | pip, brew |

### SDKs
| Tool | Slug | Primary install method |
|------|------|-----------------------|
| Vercel AI SDK | `vercel-ai-sdk` | npm |
| LangChain | `langchain` | pip, npm |
| Replicate | `replicate` | pip, npm |

### Image Gen
| Tool | Slug | Primary install method |
|------|------|-----------------------|
| Stable Diffusion (AUTOMATIC1111) | `stable-diffusion` | pip, git clone |
| ComfyUI | `comfyui` | pip, git clone |

---

## Pre-Launch Requirements

Everything that must be true before going public:

- 20+ tools seeded with complete, tested YAML manifests
- `curl gettingstarted.sh/[tool] | sh` working on macOS and Linux
- `irm gettingstarted.sh/[tool] | iex` working on Windows PowerShell
- README.md polished — explains curl and irm for non-technical users
- CONTRIBUTING.md tested end-to-end (someone actually followed it and submitted a PR)
- LICENSE (MIT) and CODE_OF_CONDUCT.md in repo root
- og:image social preview set in GitHub repo settings
- GitHub repo set to public
- GitHub org profile README configured
- Landing page deployed and accessible at gettingstarted.sh
- All links verified working

---

## Launch Day

### ProductHunt

**Title:** gettingstarted.sh — Every AI tool. One command.

**Tagline:** The open-source setup registry for the AI tooling era. One command installs any AI tool with smart package manager detection.

**Maker's first comment:**

> We built gettingstarted.sh because every AI tool has its own getting-started page, its own install instructions, and its own assumptions about what you already have installed. We wanted one command that just works.
>
> `curl gettingstarted.sh/cursor | sh` detects whether you have brew, snap, apt, npm, or pip — and uses the best one. On Windows, `irm gettingstarted.sh/cursor | iex` does the same with winget, choco, or scoop.
>
> The registry is open source (MIT). Anyone can add a tool by submitting a YAML manifest via PR. We've seeded it with 20+ AI tools and we're growing fast.
>
> Built by The Loremi Ltd. Would love your feedback and contributions.

**Screenshots needed:** Landing page, terminal demo (install flow), registry table, tool page, contribution flow

### Show HN

**Title:** Show HN: gettingstarted.sh — One command to install any AI tool

**Body:**

> gettingstarted.sh is an open-source setup registry for AI tools. Run `curl gettingstarted.sh/cursor | sh` (or `irm gettingstarted.sh/cursor | iex` on Windows) and it detects your package managers, picks the best one, and installs the tool.
>
> We built it because the getting-started experience for AI tools is fragmented. Every tool has different install instructions for different OSes. We wanted a unified, community-maintained registry where one command just works.
>
> The registry is MIT-licensed and community-driven. Tools are defined as YAML manifests — anyone can add one via PR. Smart detection supports brew, winget, npm, pip, snap, apt, choco, scoop, and cargo with fallback scripts.
>
> GitHub: https://github.com/gettingstarted-sh/gettingstarted.sh

### Twitter/X Thread

**Tweet 1 (hook):**
> We just launched gettingstarted.sh — one command to install any AI tool.
>
> `curl gettingstarted.sh/cursor | sh`
>
> It detects your package managers and picks the best install method. Works on Mac, Linux, and Windows.
>
> Thread on how it works:

**Tweet 2 (demo):**
> The install script auto-detects what you have:
> - Got brew? Uses brew
> - Got winget? Uses winget
> - Got npm? Uses npm
> - Nothing? Falls back to a direct install
>
> On Windows: `irm gettingstarted.sh/cursor | iex`
>
> No config needed.

**Tweet 3 (how it works):**
> Every tool is a YAML manifest:
>
> name: cursor
> install:
>   brew: cursor --cask
>   winget: Cursor.Cursor
>   npm: null
>
> The script reads the manifest and picks the first available manager. Simple.

**Tweet 4 (open source):**
> It's fully open source (MIT). Anyone can add a tool:
>
> 1. Fork the repo
> 2. Add a YAML file to tools/
> 3. Submit a PR
>
> We've seeded 20+ tools. Looking for contributors to help us hit 100.

**Tweet 5 (CTA):**
> Try it: gettingstarted.sh
> Star it: github.com/gettingstarted-sh/gettingstarted.sh
>
> Built by @TheLoremiLtd. We're building the canonical setup registry for the AI era.

### Reddit

Target subreddits with tailored angles:

| Subreddit | Angle |
|-----------|-------|
| r/LocalLLaMA | "One command to install Ollama, LM Studio, GPT4All, or Jan — detects your package manager automatically" |
| r/ChatGPT | "Getting started with AI tools shouldn't require reading 5 different install guides. We built a registry." |
| r/vibecoding | "curl gettingstarted.sh/lovable \| sh — setup your vibe coding stack in seconds" |
| r/commandline | "We built a smart install script registry that detects brew/winget/snap/npm/pip and picks the best method" |
| r/devtools | "Open source tool registry with smart package manager detection — looking for contributors" |

---

## Post-Launch (Weeks 1-4)

- **GitHub issues:** respond to every issue within 24 hours
- **First PRs:** merge external contributor PRs quickly, thank each contributor publicly (GitHub comment + Twitter mention)
- **Tool creator outreach:** contact 5 tool creators to verify their listing (Ollama, Cursor, Continue.dev, ElevenLabs, LangChain)
- **Blog post:** publish "Why we built gettingstarted.sh" — the story, the market gap, the technical approach
- **Metrics:** track weekly — stars, forks, PRs opened, unique contributors, curl/irm commands run

---

## Ongoing Growth

### Contributor flywheel

Every contributor who adds a tool becomes an advocate. They share the registry because their tool is in it. The more tools, the more contributors, the more valuable the registry.

### Tactics

- **"Good first issue" labels** — maintain 5+ open issues tagged for newcomers at all times
- **Monthly changelog** — publish what's new, which tools were added, who contributed
- **Contributor spotlight** — monthly highlight of a top contributor (GitHub + Twitter)
- **Partnership play** — reach out to tool creators to link to gettingstarted.sh from their own install docs ("Install via gettingstarted.sh")
- **Conference talks** — submit to developer conferences about the project and the AI tooling fragmentation problem

### Metrics to Track

| Metric | Tool | Frequency |
|--------|------|-----------|
| GitHub stars | GitHub | Weekly |
| Forks | GitHub | Weekly |
| PRs opened/merged | GitHub | Weekly |
| Unique contributors | GitHub | Monthly |
| curl/irm commands run | Cloudflare Analytics | Weekly |
| Page views | Plausible or Cloudflare | Weekly |
| Tools in registry | Manual count | Monthly |
