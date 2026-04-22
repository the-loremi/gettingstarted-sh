import Link from "next/link"
import { InstallWidget } from "./install-widget"
import { LogoMarquee } from "./logo-marquee"

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

        <div className="mt-10">
          <InstallWidget />
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Or{" "}
          <Link href="/browse" className="underline hover:text-foreground">
            browse the registry
          </Link>
        </p>

        <LogoMarquee />
      </div>
    </section>
  )
}
