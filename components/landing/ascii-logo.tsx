const bgArt = ` ██████╗ ███████╗   ███████╗██╗  ██╗
██╔════╝ ██╔════╝   ██╔════╝██║  ██║
██║  ███╗███████╗   ███████╗███████║
██║   ██║╚════██║   ╚════██║██╔══██║
╚██████╔╝███████║██╗███████║██║  ██║
 ╚═════╝ ╚══════╝╚═╝╚══════╝╚═╝  ╚═╝`

const fgArt = ` ██████  ███████    ███████ ██   ██
██       ██         ██      ██   ██
██   ███ ███████    ███████ ████████
██    ██      ██         ██ ██   ██
 ██████  ███████ ██ ███████ ██   ██
                                      `

export function AsciiLogo() {
  return (
    <div className="relative max-w-[340px] overflow-hidden select-none lg:max-w-[420px]">
      <pre className="font-[family-name:var(--font-fira-mono)] text-[10px] leading-[125%] tracking-[-1px] text-muted-foreground/30 whitespace-pre lg:text-[13px]">
        {bgArt}
      </pre>
      <pre className="absolute top-0 left-0 font-[family-name:var(--font-fira-mono)] text-[10px] leading-[125%] tracking-[-1px] text-foreground whitespace-pre lg:text-[13px]">
        {fgArt}
      </pre>
    </div>
  )
}
