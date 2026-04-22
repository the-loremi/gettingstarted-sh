"use client"

import Cursor from "@lobehub/icons/es/Cursor"
import Anthropic from "@lobehub/icons/es/Anthropic"
import Ollama from "@lobehub/icons/es/Ollama"
import OpenAI from "@lobehub/icons/es/OpenAI"
import ElevenLabs from "@lobehub/icons/es/ElevenLabs"
import LangChain from "@lobehub/icons/es/LangChain"
import Replicate from "@lobehub/icons/es/Replicate"
import Stability from "@lobehub/icons/es/Stability"
import Vercel from "@lobehub/icons/es/Vercel"
import Midjourney from "@lobehub/icons/es/Midjourney"
import ComfyUI from "@lobehub/icons/es/ComfyUI"
import Suno from "@lobehub/icons/es/Suno"
import Pika from "@lobehub/icons/es/Pika"
import LmStudio from "@lobehub/icons/es/LmStudio"
import Claude from "@lobehub/icons/es/Claude"

const tools = [
  { name: "Cursor", Icon: Cursor },
  { name: "Anthropic", Icon: Anthropic },
  { name: "Claude", Icon: Claude },
  { name: "Ollama", Icon: Ollama },
  { name: "OpenAI", Icon: OpenAI },
  { name: "ElevenLabs", Icon: ElevenLabs },
  { name: "LangChain", Icon: LangChain },
  { name: "Replicate", Icon: Replicate },
  { name: "Stability AI", Icon: Stability },
  { name: "Vercel", Icon: Vercel },
  { name: "Midjourney", Icon: Midjourney },
  { name: "ComfyUI", Icon: ComfyUI },
  { name: "Suno", Icon: Suno },
  { name: "Pika", Icon: Pika },
  { name: "LM Studio", Icon: LmStudio },
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
              key={`${tool.name}-${i}`}
              className="flex items-center gap-2 opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0"
            >
              <tool.Icon size={24} />
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
