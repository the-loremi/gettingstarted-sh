import type { Tool } from "../types"

export function generateShellScript(tool: Tool): string {
  const lines: string[] = []

  lines.push("#!/bin/sh")
  lines.push("set -e")
  lines.push("")
  lines.push(`# gettingstarted.sh — install script for ${tool.name}`)
  lines.push(`# https://gettingstarted.sh/${tool.slug}`)
  lines.push("")

  // Bake in manifest values as variables
  lines.push(`TOOL_NAME="${tool.name}"`)
  lines.push(`TOOL_SLUG="${tool.slug}"`)
  lines.push(`BREW_PACKAGE=${tool.install.brew ? `"${tool.install.brew}"` : '""'}`)
  lines.push(`SNAP_PACKAGE=${tool.install.snap ? `"${tool.install.snap}"` : '""'}`)
  lines.push(`APT_PACKAGE=${tool.install.apt ? `"${tool.install.apt}"` : '""'}`)
  lines.push(`NPM_PACKAGE=${tool.install.npm ? `"${tool.install.npm}"` : '""'}`)
  lines.push(`PIP_PACKAGE=${tool.install.pip ? `"${tool.install.pip}"` : '""'}`)
  lines.push(`CARGO_PACKAGE=${tool.install.cargo ? `"${tool.install.cargo}"` : '""'}`)

  // Encode fallback scripts
  const macFallback = tool.install.mac?.trim() ?? ""
  const linuxFallback = tool.install.linux?.trim() ?? ""

  lines.push("")
  lines.push("# Banner")
  lines.push('cat << \'BANNER\'')
  lines.push("")
  lines.push(" ██████  ███████    ███████ ██   ██")
  lines.push("██       ██         ██      ██   ██")
  lines.push("██   ███ ███████    ███████ ████████")
  lines.push("██    ██      ██         ██ ██   ██")
  lines.push(" ██████  ███████ ██ ███████ ██   ██")
  lines.push("")
  lines.push("BANNER")
  lines.push("")
  lines.push("# Detection helper")
  lines.push('command_exists() { command -v "$1" >/dev/null 2>&1; }')
  lines.push("")
  lines.push('echo "gettingstarted.sh — installing $TOOL_NAME"')
  lines.push('echo "detecting package managers..."')
  lines.push("")

  lines.push('if command_exists brew && [ -n "$BREW_PACKAGE" ]; then')
  lines.push('  echo "found brew"')
  lines.push('  brew install $BREW_PACKAGE')
  lines.push('elif command_exists snap && [ -n "$SNAP_PACKAGE" ]; then')
  lines.push('  echo "found snap (requires sudo)"')
  lines.push('  sudo snap install $SNAP_PACKAGE')
  lines.push('elif command_exists apt && [ -n "$APT_PACKAGE" ]; then')
  lines.push('  echo "found apt (requires sudo)"')
  lines.push('  sudo apt install -y $APT_PACKAGE')
  lines.push('elif command_exists npm && [ -n "$NPM_PACKAGE" ]; then')
  lines.push('  echo "found npm"')
  lines.push('  npm install -g $NPM_PACKAGE')
  lines.push('elif command_exists pip && [ -n "$PIP_PACKAGE" ]; then')
  lines.push('  echo "found pip"')
  lines.push('  pip install $PIP_PACKAGE')
  lines.push('elif command_exists cargo && [ -n "$CARGO_PACKAGE" ]; then')
  lines.push('  echo "found cargo"')
  lines.push('  cargo install $CARGO_PACKAGE')

  // OS-specific fallbacks
  if (macFallback || linuxFallback) {
    lines.push("else")
    lines.push('  echo "no package manager found, using fallback"')
    lines.push('  OS="$(uname -s)"')

    if (macFallback && linuxFallback) {
      lines.push('  if [ "$OS" = "Darwin" ]; then')
      lines.push(`    ${macFallback}`)
      lines.push('  elif [ "$OS" = "Linux" ]; then')
      lines.push(`    ${linuxFallback}`)
      lines.push("  else")
      lines.push('    echo "Unsupported OS: $OS"')
      lines.push('    echo "Visit https://gettingstarted.sh/$TOOL_SLUG for manual install options."')
      lines.push("    exit 1")
      lines.push("  fi")
    } else if (macFallback) {
      lines.push('  if [ "$OS" = "Darwin" ]; then')
      lines.push(`    ${macFallback}`)
      lines.push("  else")
      lines.push('    echo "No supported install method found for $OS."')
      lines.push('    echo "Visit https://gettingstarted.sh/$TOOL_SLUG for manual install options."')
      lines.push("    exit 1")
      lines.push("  fi")
    } else {
      lines.push('  if [ "$OS" = "Linux" ]; then')
      lines.push(`    ${linuxFallback}`)
      lines.push("  else")
      lines.push('    echo "No supported install method found for $OS."')
      lines.push('    echo "Visit https://gettingstarted.sh/$TOOL_SLUG for manual install options."')
      lines.push("    exit 1")
      lines.push("  fi")
    }
  } else {
    lines.push("else")
    lines.push('  echo "No supported install method found."')
    lines.push('  echo "Visit https://gettingstarted.sh/$TOOL_SLUG for manual install options."')
    lines.push("  exit 1")
  }

  lines.push("fi")
  lines.push("")
  lines.push('echo ""')
  lines.push('echo "done — $TOOL_NAME installed"')

  return lines.join("\n")
}
