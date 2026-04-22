import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Nav() {
  return (
    <nav className="fixed top-0 right-0 left-0 z-50 flex h-14 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
      <Link href="/" className="text-sm font-medium">
        gettingstarted.sh
      </Link>
      <div className="hidden items-center gap-6 md:flex">
        <Link
          href="/browse"
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Registry
        </Link>
        <Link
          href="/about"
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          About
        </Link>
        <Link
          href="/contribute"
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Contribute
        </Link>
      </div>
      <Button size="sm" asChild>
        <a href="#">Star on GitHub</a>
      </Button>
    </nav>
  )
}
