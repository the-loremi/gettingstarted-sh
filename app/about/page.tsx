export const metadata = {
  title: "About — gettingstarted.sh",
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 pt-24 pb-16">
      <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
        About
      </p>
      <h1 className="text-2xl font-medium md:text-3xl">
        About gettingstarted.sh
      </h1>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">
        <p>
          gettingstarted.sh is a free, open-source registry that lets you install any
          AI tool with a single command. It figures out the best way to install each
          tool on your computer — whether you&apos;re on Mac, Windows, or Linux — so you
          don&apos;t have to.
        </p>

        <h2 className="text-base font-medium text-foreground">How it works</h2>
        <ol className="list-decimal space-y-2 pl-5">
          <li>
            <strong className="text-foreground">Detects your system</strong> — the
            script checks what package managers you have installed (brew, winget, npm,
            pip, snap, and more)
          </li>
          <li>
            <strong className="text-foreground">Picks the best method</strong> — it
            uses the first available package manager that supports the tool
          </li>
          <li>
            <strong className="text-foreground">Installs the tool</strong> — runs the
            install command and configures everything. If no package manager is found,
            it falls back to a direct download
          </li>
        </ol>

        <h2 className="text-base font-medium text-foreground">The Loremi Ltd</h2>
        <p>
          gettingstarted.sh is built by The Loremi Ltd. We&apos;re building
          infrastructure for how people discover and set up AI tools. The registry is
          MIT licensed and community-driven — anyone can add a tool, fix a script, or
          improve docs.
        </p>

        <h2 className="text-base font-medium text-foreground">License</h2>
        <p>
          MIT — see the{" "}
          <a
            href="https://github.com/gettingstarted-sh/gettingstarted.sh/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline"
          >
            LICENSE
          </a>{" "}
          file.
        </p>
      </div>
    </div>
  )
}
