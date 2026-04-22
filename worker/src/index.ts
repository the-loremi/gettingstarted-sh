import { loadTool } from "./tools"
import { generateShellScript } from "./scripts/shell"
import { generatePowerShellScript } from "./scripts/powershell"

function isCLI(userAgent: string): boolean {
  const ua = userAgent.toLowerCase()
  return ua.includes("curl") || ua.includes("wget") || ua.includes("powershell")
}

function isPowerShell(userAgent: string): boolean {
  return userAgent.toLowerCase().includes("powershell")
}

function textResponse(body: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)
    const userAgent = request.headers.get("User-Agent") ?? ""

    // Strip leading slash, ignore trailing slashes
    const slug = url.pathname.replace(/^\/+|\/+$/g, "").toLowerCase()

    // Non-CLI requests: pass through to origin (static site)
    if (!isCLI(userAgent)) {
      try {
        return await fetch(request)
      } catch {
        return textResponse("Non-CLI request. Visit https://gettingstarted.sh in your browser.", 302)
      }
    }

    // CLI request to root: show usage
    if (!slug) {
      return textResponse(
        "\n" +
        " ██████  ███████    ███████ ██   ██\n" +
        "██       ██         ██      ██   ██\n" +
        "██   ███ ███████    ███████ ████████\n" +
        "██    ██      ██         ██ ██   ██\n" +
        " ██████  ███████ ██ ███████ ██   ██\n" +
        "\n" +
        "gettingstarted.sh — Every tool. One command.\n\n" +
        "Usage:\n" +
        "  curl gettingstarted.sh/[tool] | sh          (macOS/Linux)\n" +
        "  irm gettingstarted.sh/[tool] | iex           (Windows)\n\n" +
        "Browse tools: https://gettingstarted.sh/browse\n"
      )
    }

    // Look up the tool
    const tool = loadTool(slug)

    if (!tool) {
      return textResponse(
        `Tool "${slug}" not found.\nBrowse the registry at https://gettingstarted.sh/browse\n`,
        404
      )
    }

    // Generate and serve the appropriate script
    if (isPowerShell(userAgent)) {
      return textResponse(generatePowerShellScript(tool))
    } else {
      return textResponse(generateShellScript(tool))
    }
  },
}
