const steps = [
  {
    step: "01",
    title: "Find your tool",
    description:
      "Browse the registry by category — AI coding, video gen, audio, local models, SDKs. Every tool is indexed with version, OS support, and available package managers.",
  },
  {
    step: "02",
    title: "Run one command",
    description:
      "The setup script auto-detects your package managers (brew, winget, snap, npm, pip, cargo) and picks the best install method. Falls back to OS-specific scripts if needed.",
  },
  {
    step: "03",
    title: "Ship faster",
    description:
      "Dependencies resolved, environment configured, tool ready. Go from zero to productive in seconds. Or skip the curl and use the package manager command directly.",
  },
]

export function HowItWorks() {
  return (
    <section id="how" className="border-t px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
          How it works
        </p>
        <h2 className="text-2xl font-medium md:text-3xl">
          Setup in seconds.{" "}
          <span className="text-muted-foreground">Not sessions.</span>
        </h2>

        <div className="mt-12 grid gap-px overflow-hidden rounded-lg border bg-border md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.step} className="bg-card p-6">
              <span className="text-xs text-muted-foreground">{s.step}</span>
              <h3 className="mt-3 text-sm font-medium">{s.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {s.description}
              </p>
            </div>
          ))}
        </div>

        {/* Supported package managers */}
        <div className="mt-8 rounded-lg border bg-card p-6">
          <p className="mb-3 text-xs text-muted-foreground">
            Supported package managers
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              "brew",
              "winget",
              "choco",
              "scoop",
              "snap",
              "apt",
              "npm",
              "pip",
              "cargo",
            ].map((pm) => (
              <span
                key={pm}
                className="rounded border bg-muted px-2 py-1 text-xs text-muted-foreground"
              >
                {pm}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
