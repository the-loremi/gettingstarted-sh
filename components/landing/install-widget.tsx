"use client"

import { useState, useEffect, useRef } from "react"

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
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setPlatform(detectPlatform())
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const command = commands[platform]
  const currentLabel = platforms.find((p) => p.id === platform)!.label

  const handleCopy = () => {
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div
      ref={ref}
      className="relative flex items-stretch overflow-hidden rounded-lg border bg-card"
    >
      {/* Platform dropdown */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 border-r px-4 py-3 text-xs transition-colors hover:bg-muted/50"
      >
        <span>{currentLabel}</span>
        <svg
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M1 1L5 5L9 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute top-full left-0 z-10 mt-1 overflow-hidden rounded-lg border bg-card shadow-lg">
          {platforms.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setPlatform(p.id)
                setOpen(false)
              }}
              className={`block w-full px-4 py-2.5 text-left text-xs transition-colors hover:bg-muted/50 ${
                p.id === platform ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {/* Command display */}
      <div className="flex-1 px-4 py-3 font-mono text-xs select-all">
        {command}
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        className="border-l px-4 py-3 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        {copied ? "✓" : "copy"}
      </button>
    </div>
  )
}
