"use client"

const tools = [
  { name: "Cursor", icon: "cursor" },
  { name: "Anthropic", icon: "anthropic" },
  { name: "Ollama", icon: "ollama" },
  { name: "Codeium", icon: "codeium" },
  { name: "ElevenLabs", icon: "elevenlabs" },
  { name: "LangChain", icon: "langchain" },
  { name: "Replicate", icon: "replicate" },
  { name: "OpenAI", icon: "openai" },
  { name: "Stability AI", icon: "stability" },
  { name: "Vercel", icon: "vercel" },
  { name: "Midjourney", icon: "midjourney" },
  { name: "ComfyUI", icon: "comfyui" },
]

export function LogoMarquee() {
  return (
    <div className="mt-12">
      <p className="mb-4 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
        Works with every AI tool in your stack
      </p>
      <div className="overflow-hidden">
        <div className="flex w-max animate-marquee gap-8 hover:[animation-play-state:paused]">
          {[...tools, ...tools].map((tool, i) => (
            <div
              key={`${tool.icon}-${i}`}
              className="flex items-center gap-2 opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://icons.lobehub.com/icons/${tool.icon}.svg`}
                alt={tool.name}
                width={24}
                height={24}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none"
                }}
              />
              <span className="whitespace-nowrap text-[10px] text-muted-foreground">
                {tool.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
