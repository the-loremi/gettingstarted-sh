export function Hero() {
  return (
    <section className="flex min-h-[calc(100vh-3.5rem)] flex-col justify-center px-6 pt-14">
      <div className="mx-auto w-full max-w-2xl">
        <p className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">
          Open Source Registry
        </p>
        <h1 className="text-3xl font-medium leading-tight md:text-5xl">
          Every tool.{" "}
          <span className="text-muted-foreground">One command.</span>
        </h1>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
          The getting-started registry for AI tools, models, and vibe-coding
          stacks. Smart install detection. Always current. Community maintained.
        </p>

        {/* Terminal demo */}
        <div className="mt-10 overflow-hidden rounded-lg border bg-card">
          <div className="flex items-center gap-2 border-b px-4 py-2.5">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
              <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
              <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground/20" />
            </div>
            <span className="ml-auto text-[10px] text-muted-foreground">
              bash
            </span>
          </div>
          <div className="space-y-3 p-4 text-xs">
            <div>
              <p>
                <span className="text-muted-foreground">$</span> curl
                gettingstarted.sh/cursor | sh
              </p>
              <p className="text-muted-foreground">
                detecting package managers... found brew
              </p>
              <p className="text-muted-foreground">
                brew install --cask cursor
              </p>
              <p className="text-muted-foreground">✓ cursor installed</p>
            </div>
            <div>
              <p>
                <span className="text-muted-foreground">$</span> curl
                gettingstarted.sh/claude-code | sh
              </p>
              <p className="text-muted-foreground">
                detecting package managers... found npm
              </p>
              <p className="text-muted-foreground">
                npm install -g @anthropic-ai/claude-code
              </p>
              <p className="text-muted-foreground">✓ claude-code installed</p>
            </div>
            <p>
              <span className="text-muted-foreground">$</span>{" "}
              <span className="inline-block h-3.5 w-1.5 animate-pulse bg-foreground" />
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
