import { Button } from "@/components/ui/button"

export function OpenSourceSection() {
  return (
    <section id="contribute" className="border-t px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
          Open Source
        </p>
        <h2 className="text-2xl font-medium md:text-3xl">
          Built in public.{" "}
          <span className="text-muted-foreground">Owned by everyone.</span>
        </h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          gettingstarted.sh is MIT licensed and community-driven. The registry,
          CLI, and docs engine are fully open. Anyone can add a tool, fix a
          script, or improve docs.
        </p>

        {/* Contribution preview */}
        <div className="mt-8 overflow-hidden rounded-lg border bg-card">
          <div className="flex items-center justify-between border-b px-4 py-2.5">
            <span className="text-[10px] text-muted-foreground">
              tools/cursor.yaml
            </span>
            <span className="rounded border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
              manifest
            </span>
          </div>
          <div className="space-y-1 p-4 text-xs">
            <p>
              <span className="text-muted-foreground">name:</span> cursor
            </p>
            <p>
              <span className="text-muted-foreground">category:</span> ai-coding
            </p>
            <p>
              <span className="text-muted-foreground">install:</span>
            </p>
            <p className="pl-4">
              <span className="text-muted-foreground">brew:</span> cursor --cask
            </p>
            <p className="pl-4">
              <span className="text-muted-foreground">winget:</span>{" "}
              Cursor.Cursor
            </p>
            <p className="pl-4">
              <span className="text-muted-foreground">snap:</span> cursor
            </p>
            <p>
              <span className="text-muted-foreground">verified:</span> true
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          Fork the repo, add a YAML manifest, submit a PR. CI validates, the CMS
          ingests, and the registry updates. A project of The Loremi Ltd.
        </p>

        <div className="mt-8 flex gap-3">
          <Button asChild>
            <a href="#">Star on GitHub</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="#registry">Browse registry</a>
          </Button>
        </div>
      </div>
    </section>
  )
}
