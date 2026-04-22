import type { Tool } from "../types"

export function generatePowerShellScript(tool: Tool): string {
  const lines: string[] = []

  lines.push('$ErrorActionPreference = "Stop"')
  lines.push("")
  lines.push(`# gettingstarted.sh - install script for ${tool.name}`)
  lines.push(`# https://gettingstarted.sh/${tool.slug}`)
  lines.push("")

  // Bake in manifest values as variables
  lines.push(`$ToolName = "${tool.name}"`)
  lines.push(`$ToolSlug = "${tool.slug}"`)
  lines.push(`$WingetPackage = ${tool.install.winget ? `"${tool.install.winget}"` : "$null"}`)
  lines.push(`$ChocoPackage = ${tool.install.choco ? `"${tool.install.choco}"` : "$null"}`)
  lines.push(`$ScoopPackage = ${tool.install.scoop ? `"${tool.install.scoop}"` : "$null"}`)
  lines.push(`$NpmPackage = ${tool.install.npm ? `"${tool.install.npm}"` : "$null"}`)
  lines.push(`$PipPackage = ${tool.install.pip ? `"${tool.install.pip}"` : "$null"}`)
  lines.push(`$CargoPackage = ${tool.install.cargo ? `"${tool.install.cargo}"` : "$null"}`)
  lines.push("")

  lines.push("function Test-Command($cmd) {")
  lines.push("  $null -ne (Get-Command $cmd -ErrorAction SilentlyContinue)")
  lines.push("}")
  lines.push("")

  lines.push('Write-Host "gettingstarted.sh - installing $ToolName"')
  lines.push('Write-Host "detecting package managers..."')
  lines.push("")

  lines.push("if ((Test-Command winget) -and $WingetPackage) {")
  lines.push('  Write-Host "found winget"')
  lines.push("  winget install $WingetPackage")
  lines.push("} elseif ((Test-Command choco) -and $ChocoPackage) {")
  lines.push('  Write-Host "found choco"')
  lines.push("  choco install $ChocoPackage -y")
  lines.push("} elseif ((Test-Command scoop) -and $ScoopPackage) {")
  lines.push('  Write-Host "found scoop"')
  lines.push("  scoop install $ScoopPackage")
  lines.push("} elseif ((Test-Command npm) -and $NpmPackage) {")
  lines.push('  Write-Host "found npm"')
  lines.push("  npm install -g $NpmPackage")
  lines.push("} elseif ((Test-Command pip) -and $PipPackage) {")
  lines.push('  Write-Host "found pip"')
  lines.push("  pip install $PipPackage")
  lines.push("} elseif ((Test-Command cargo) -and $CargoPackage) {")
  lines.push('  Write-Host "found cargo"')
  lines.push("  cargo install $CargoPackage")

  // Windows fallback
  const winFallback = tool.install.win?.trim() ?? ""
  if (winFallback) {
    lines.push("} else {")
    lines.push('  Write-Host "no package manager found, using fallback"')
    lines.push(`  ${winFallback}`)
  } else {
    lines.push("} else {")
    lines.push('  Write-Host "No supported install method found."')
    lines.push('  Write-Host "Visit https://gettingstarted.sh/$ToolSlug for manual install options."')
    lines.push("  exit 1")
  }

  lines.push("}")
  lines.push("")
  lines.push('Write-Host ""')
  lines.push('Write-Host "done - $ToolName installed"')

  return lines.join("\n")
}
