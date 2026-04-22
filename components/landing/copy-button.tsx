"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

export function CopyButton({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <Button variant="outline" size="xs" onClick={handleCopy}>
      {copied ? "✓ copied" : "copy"}
    </Button>
  )
}
