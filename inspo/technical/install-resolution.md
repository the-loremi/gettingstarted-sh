# Install Resolution Algorithm

> How gettingstarted.sh detects your system and picks the best install method.

## Overview

When a user runs the install command, gettingstarted.sh serves a script that automatically detects which package managers are available on their system and uses the best one. No configuration needed — it just works.

## The Two Commands

### macOS and Linux

```bash
curl gettingstarted.sh/cursor | sh
```

This downloads a shell script and runs it. `curl` fetches the script from the internet, and `sh` executes it.

### Windows (PowerShell)

```powershell
irm gettingstarted.sh/cursor | iex
```

This is the Windows equivalent. `irm` (Invoke-RestMethod) downloads the script, and `iex` (Invoke-Expression) runs it. You need to run this in PowerShell (not Command Prompt).

### What is `irm | iex`?

If you're new to PowerShell: `irm` is a built-in command that downloads content from a web address. `iex` is a built-in command that runs whatever text it receives as a PowerShell command. Together, they download and run an installation script — the same concept as `curl | sh` on Mac and Linux.

This method is widely used for automating software setup on Windows. It can pull scripts from GitHub or other trusted web sources. However, it is very powerful — only run `irm | iex` with sources you trust. All gettingstarted.sh scripts are open source and auditable in the GitHub repo.

Users who prefer not to pipe scripts can always visit the tool's page on the website and copy the direct package manager command instead (e.g., `winget install Cursor.Cursor`).

## Detection Algorithm

### macOS / Linux Flow

1. Cloudflare Worker receives the request, detects OS from User-Agent
2. Serves a shell script tailored to the requested tool
3. Script checks for package managers in priority order:
   - **Platform-specific first:** `brew` → `snap` → `apt`
   - **Cross-platform second:** `npm` → `pip` → `cargo`
4. First detected manager that has a non-null entry in the manifest wins
5. If no package manager matches → use the OS fallback script (`mac:` or `linux:`)
6. If no fallback exists → exit with error message and link to the tool's page for manual install

### Windows Flow

1. Cloudflare Worker detects Windows, serves a PowerShell script
2. Script checks for package managers in priority order:
   - **Platform-specific first:** `winget` → `choco` → `scoop`
   - **Cross-platform second:** `npm` → `pip` → `cargo`
3. First detected manager with a non-null manifest entry wins
4. If no match → use the `win:` fallback script
5. If no fallback → exit with error and link to tool page

### Detection Priority Table

| Priority | macOS/Linux | Windows |
|----------|-------------|---------|
| 1 | brew | winget |
| 2 | snap | choco |
| 3 | apt | scoop |
| 4 | npm | npm |
| 5 | pip | pip |
| 6 | cargo | cargo |
| 7 | OS fallback script | OS fallback script |
| 8 | Error + manual link | Error + manual link |

## How Detection Works

### Shell Script (macOS/Linux)

```bash
#!/bin/sh
set -e

TOOL_SLUG="cursor"

# Package manager values from manifest (null = not supported)
BREW_PACKAGE="cursor --cask"
SNAP_PACKAGE="cursor"
APT_PACKAGE=""
NPM_PACKAGE=""
PIP_PACKAGE=""
CARGO_PACKAGE=""
FALLBACK_SCRIPT='curl -fsSL https://download.cursor.com/mac/install.sh | sh'

# Check if a command exists
command_exists() { command -v "$1" >/dev/null 2>&1; }

echo "gettingstarted.sh — installing $TOOL_SLUG"
echo "detecting package managers..."

if command_exists brew && [ -n "$BREW_PACKAGE" ]; then
    echo "found brew"
    brew install $BREW_PACKAGE
elif command_exists snap && [ -n "$SNAP_PACKAGE" ]; then
    echo "found snap"
    sudo snap install $SNAP_PACKAGE
elif command_exists apt && [ -n "$APT_PACKAGE" ]; then
    echo "found apt"
    sudo apt install -y $APT_PACKAGE
elif command_exists npm && [ -n "$NPM_PACKAGE" ]; then
    echo "found npm"
    npm install -g $NPM_PACKAGE
elif command_exists pip && [ -n "$PIP_PACKAGE" ]; then
    echo "found pip"
    pip install $PIP_PACKAGE
elif command_exists cargo && [ -n "$CARGO_PACKAGE" ]; then
    echo "found cargo"
    cargo install $CARGO_PACKAGE
elif [ -n "$FALLBACK_SCRIPT" ]; then
    echo "no package manager found, using fallback"
    eval "$FALLBACK_SCRIPT"
else
    echo "No supported install method found."
    echo "Visit https://gettingstarted.sh/$TOOL_SLUG for manual install options."
    exit 1
fi

echo "done — $TOOL_SLUG installed"
```

### PowerShell Script (Windows)

```powershell
$ErrorActionPreference = "Stop"

$ToolSlug = "cursor"

# Package manager values from manifest ($null = not supported)
$WingetPackage = "Cursor.Cursor"
$ChocoPackage = "cursor"
$ScoopPackage = "extras/cursor"
$NpmPackage = $null
$PipPackage = $null
$CargoPackage = $null
$FallbackScript = 'irm https://download.cursor.com/win/install.ps1 | iex'

function Test-Command($cmd) {
    $null -ne (Get-Command $cmd -ErrorAction SilentlyContinue)
}

Write-Host "gettingstarted.sh - installing $ToolSlug"
Write-Host "detecting package managers..."

if ((Test-Command winget) -and $WingetPackage) {
    Write-Host "found winget"
    winget install $WingetPackage
} elseif ((Test-Command choco) -and $ChocoPackage) {
    Write-Host "found choco"
    choco install $ChocoPackage -y
} elseif ((Test-Command scoop) -and $ScoopPackage) {
    Write-Host "found scoop"
    scoop install $ScoopPackage
} elseif ((Test-Command npm) -and $NpmPackage) {
    Write-Host "found npm"
    npm install -g $NpmPackage
} elseif ((Test-Command pip) -and $PipPackage) {
    Write-Host "found pip"
    pip install $PipPackage
} elseif ((Test-Command cargo) -and $CargoPackage) {
    Write-Host "found cargo"
    cargo install $CargoPackage
} elseif ($FallbackScript) {
    Write-Host "no package manager found, using fallback"
    Invoke-Expression $FallbackScript
} else {
    Write-Host "No supported install method found."
    Write-Host "Visit https://gettingstarted.sh/$ToolSlug for manual install options."
    exit 1
}

Write-Host "done - $ToolSlug installed"
```

## The Direct Alternative

Users don't have to use the `curl` or `irm` command. Every tool's page on the website shows ALL available install methods:

```
gettingstarted.sh/cursor

  Install Cursor
  ──────────────────────────────────────────────
  brew     brew install --cask cursor
  winget   winget install Cursor.Cursor
  choco    choco install cursor
  scoop    scoop install extras/cursor
  snap     snap install cursor
  auto     curl gettingstarted.sh/cursor | sh
  auto     irm gettingstarted.sh/cursor | iex
```

Users who already know their package manager can just run the command directly.

## Security

- **No `sudo` without prompting.** If root access is needed (e.g., `apt install`), the script asks first.
- **No telemetry.** The scripts don't phone home or collect data.
- **Open source.** Every install script is in the GitHub repo. Anyone can audit them.
- **No arbitrary code execution.** The scripts only run the package manager commands defined in the manifest.
- **Future: checksum verification.** For fallback scripts that download binaries, we plan to add SHA256 checksum verification.

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| No package manager found, no fallback | Error message + link to tool page |
| Tool not in registry | 404 response with suggestion to search the registry |
| Network error mid-install | Package manager handles its own retry/error |
| Unsupported OS (e.g., FreeBSD) | Error message suggesting manual install |
| User runs `curl` on Windows CMD | Script detects non-POSIX shell, suggests using `irm \| iex` in PowerShell |
| Multiple package managers available | First match in priority order wins (no prompt) |
