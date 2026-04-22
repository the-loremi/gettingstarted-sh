export function SiteFooter() {
  return (
    <footer className="border-t px-6 py-12">
      <div className="mx-auto flex max-w-2xl flex-col gap-8 md:flex-row md:justify-between">
        <div>
          <p className="text-sm font-medium">gettingstarted.sh</p>
          <p className="mt-1 max-w-[240px] text-xs leading-relaxed text-muted-foreground">
            The setup registry for the AI tooling era.
          </p>
        </div>
        <div className="flex gap-12 text-xs">
          <div className="space-y-2">
            <p className="text-muted-foreground">Registry</p>
            <a
              href="#registry"
              className="block text-foreground hover:underline"
            >
              Browse tools
            </a>
            <a href="#" className="block text-foreground hover:underline">
              Categories
            </a>
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground">Project</p>
            <a href="#" className="block text-foreground hover:underline">
              GitHub
            </a>
            <a
              href="#contribute"
              className="block text-foreground hover:underline"
            >
              Contribute
            </a>
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground">Company</p>
            <a href="#" className="block text-foreground hover:underline">
              The Loremi
            </a>
            <a href="#" className="block text-foreground hover:underline">
              Blog
            </a>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-8 flex max-w-2xl items-center justify-between border-t pt-6 text-[10px] text-muted-foreground">
        <p>© 2025 gettingstarted.sh · MIT Licensed</p>
        <p>A The Loremi Ltd project</p>
      </div>
    </footer>
  )
}
