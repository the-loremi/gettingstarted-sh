import { CopyButton } from "@/components/landing/copy-button"

export const metadata = {
  title: "Contribute — gettingstarted.sh",
}

const manifestTemplate = `name: Your Tool Name
slug: your-tool-name
category: ai-coding
version: "1.0.0"
homepage: https://yourtool.com
description: One-line description (under 120 chars)
os:
  - mac
  - win
  - linux
install:
  brew: null
  winget: null
  choco: null
  scoop: null
  snap: null
  apt: null
  npm: null
  pip: null
  cargo: null
  mac: |
    echo "Add macOS install script here"
  linux: |
    echo "Add Linux install script here"
  win: |
    Write-Host "Add Windows install script here"
verified: false`

export default function ContributePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 pt-24 pb-16">
      <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
        Contribute
      </p>
      <h1 className="text-2xl font-medium md:text-3xl">
        Add a tool
      </h1>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p>
          Anyone can add a tool to the registry. It takes three steps:
        </p>

        <ol className="list-decimal space-y-4 pl-5">
          <li>
            <strong className="text-foreground">Fork the repo</strong> — go to the{" "}
            <a
              href="https://github.com/gettingstarted-sh/gettingstarted.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline"
            >
              GitHub repository
            </a>{" "}
            and click &quot;Fork&quot;
          </li>
          <li>
            <strong className="text-foreground">Add a YAML manifest</strong> — create
            a file at <code className="rounded bg-muted px-1 py-0.5 text-xs">tools/your-tool-name.yaml</code>{" "}
            using the template below
          </li>
          <li>
            <strong className="text-foreground">Submit a pull request</strong> —
            we&apos;ll review and merge within 48 hours
          </li>
        </ol>

        <h2 className="text-base font-medium text-foreground">Manifest template</h2>

        <div className="relative overflow-hidden rounded-lg border bg-card">
          <div className="flex items-center justify-between border-b px-4 py-2.5">
            <span className="text-[10px] text-muted-foreground">
              tools/your-tool-name.yaml
            </span>
            <CopyButton command={manifestTemplate} />
          </div>
          <pre className="overflow-x-auto p-4 text-xs leading-relaxed">
            {manifestTemplate}
          </pre>
        </div>

        <h2 className="text-base font-medium text-foreground">Categories</h2>
        <div className="flex flex-wrap gap-2">
          {[
            "ai-coding",
            "video-gen",
            "audio-ai",
            "local-llm",
            "sdks",
            "vibe-coding",
          ].map((cat) => (
            <span
              key={cat}
              className="rounded border bg-muted px-2 py-1 text-xs text-muted-foreground"
            >
              {cat}
            </span>
          ))}
        </div>

        <p>
          For the full schema reference, naming rules, and examples, see the{" "}
          <a
            href="https://github.com/gettingstarted-sh/gettingstarted.sh/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline"
          >
            Contributing Guide
          </a>{" "}
          on GitHub.
        </p>
      </div>
    </div>
  )
}
