# Vision — gettingstarted.sh

> The strategic north star for the project.

## What This Is

gettingstarted.sh is the canonical setup registry for AI tools. Not a tool directory. Not a list of links. A *setup command registry* — where every AI tool, model, SDK, and vibe-coding stack has a single command that installs it correctly on your machine, regardless of your operating system or what you already have installed.

The closest analogy: npm is to JavaScript packages as gettingstarted.sh is to tool setup. You don't search for install instructions. You don't read five different getting-started guides. You run one command and it works.

```
curl gettingstarted.sh/cursor | sh        # macOS / Linux
irm gettingstarted.sh/cursor | iex        # Windows PowerShell
```

The system detects what package managers you have (brew, winget, npm, pip, snap, etc.), picks the best one, and installs the tool. If none match, it falls back to a direct install script. The user doesn't need to know any of this — they just run the command.

## The Market Gap

AI tools are exploding. Cursor, Claude Code, Ollama, Runway, ElevenLabs, LM Studio, ComfyUI, Lovable — hundreds of tools, and the list grows every week. Every single one has its own getting-started page, its own install instructions, its own assumptions about what the user already has set up.

There is no unified experience. No single place where you can find and install any AI tool with confidence that it will work on your system. The getting-started page is the most-visited and most-abandoned section of every developer tool's documentation.

gettingstarted.sh fills that gap. One registry. One command format. Every tool.

## Why Non-Technical Users Matter

The audience for this project is not just developers. The AI era has brought tools into the hands of teachers, designers, writers, students, researchers — people who have never opened a terminal and don't know what `brew` or `npm` means.

This is the growth unlock that developer-only registries miss. Most tool registries assume command-line fluency. gettingstarted.sh assumes nothing. The website explains what a terminal is. The README explains what `curl | sh` and `irm | iex` mean in plain English. The install scripts handle every edge case so the user doesn't have to.

By being accessible to everyone entering the AI era — not just engineers — gettingstarted.sh can become the default starting point for anyone adopting AI tools. This is a much larger market than the developer-tools niche.

## The Playbook

The model is shadcn/ui. Open source the registry and CLI. Build community, accumulate GitHub stars as social proof, become the obvious answer to "how do I install this?" Then layer commercial infrastructure on top:

- **Verified publisher program** — AI companies pay to verify their tool entries and get priority placement
- **Hosted team workspaces** — companies set up curated tool stacks for their teams ("install our ML stack with one command")
- **Usage analytics** — tool creators get visibility into how many people install their tool via the registry

GitHub stars become the acquisition metric. Community contributions become the moat. The open-source registry is the growth engine; the commercial layer is the business.

## The Loremi Ltd

gettingstarted.sh is the second tenant on the Loremi CMS platform. This positions The Loremi Ltd as the infrastructure layer for AI developer onboarding — not just a CMS company, but the org that built the canonical AI tool registry.

The founding org gets attribution everywhere: "A The Loremi Ltd project" in the footer, in the README, in every discussion of the project. As gettingstarted.sh gains traction, The Loremi gains credibility and visibility in the AI tooling ecosystem.

## Acquisition Thesis

Every AI company needs their getting-started experience to be flawless. A well-maintained, community-trusted registry becomes infrastructure they'd rather buy than rebuild.

The most likely outcome paths:

1. **Contribution** — AI companies contribute to the registry to ensure their tool is listed correctly, driving growth
2. **Partnership** — AI companies link to gettingstarted.sh from their own docs ("Install via gettingstarted.sh"), driving traffic
3. **Acquisition** — A developer platform (GitHub, Vercel, Cloudflare, an AI company) acquires gettingstarted.sh as part of their developer experience stack

All three paths create value for The Loremi Ltd.

## What Success Looks Like

gettingstarted.sh becomes the default answer to "how do I install [AI tool]?" — the way Stack Overflow became the default for "how do I fix [error]?" and shadcn/ui became the default for "how do I add a component?"

Concrete markers:
- Someone asks "how do I install Cursor?" and the answer is `curl gettingstarted.sh/cursor | sh`
- AI companies include gettingstarted.sh in their own install docs
- Developers share gettingstarted.sh links as naturally as they share npm package names
- The GitHub repo is a signal of community trust, with hundreds of contributors maintaining the registry
