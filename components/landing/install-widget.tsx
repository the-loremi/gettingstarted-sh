"use client"

import { useState, useEffect } from "react"

const platforms = [
  { id: "macos", label: "macOS" },
  { id: "linux", label: "Linux" },
  { id: "windows", label: "Windows" },
] as const

type Platform = (typeof platforms)[number]["id"]

const commands: Record<Platform, string> = {
  macos: "curl gettingstarted.sh/cursor | sh",
  linux: "curl gettingstarted.sh/cursor | sh",
  windows: "irm gettingstarted.sh/cursor | iex",
}

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "macos"
  const ua = navigator.userAgent
  if (ua.includes("Win")) return "windows"
  if (ua.includes("Mac")) return "macos"
  return "linux"
}

export function InstallWidget() {
  const [platform, setPlatform] = useState<Platform>("macos")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setPlatform(detectPlatform())
  }, [])

  const command = commands[platform]

  const handleCopy = () => {
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div className="flex items-stretch overflow-hidden rounded-lg border bg-card">
      {/* Platform select */}
      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value as Platform)}
        className="appearance-none border-r bg-transparent px-4 py-3 pr-8 text-xs outline-none transition-colors hover:bg-muted/50 cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' fill='none'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23888' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.75rem center",
        }}
      >
        {platforms.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </select>

      {/* Command display */}
      <div className="flex-1 px-4 py-3 font-mono text-xs select-all">
        {command}
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="border-l px-4 py-3 text-xs text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
      >
        {copied ? "✓" : "copy"}
      </button>
    </div>
  )
}
