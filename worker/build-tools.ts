import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import yaml from "js-yaml"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

interface InstallMethods {
  brew: string | null
  winget: string | null
  choco: string | null
  scoop: string | null
  snap: string | null
  apt: string | null
  npm: string | null
  pip: string | null
  cargo: string | null
  mac: string | null
  linux: string | null
  win: string | null
}

interface Tool {
  name: string
  slug: string
  category: string
  version: string
  homepage: string
  description: string
  os: string[]
  verified: boolean
  install: InstallMethods
}

const toolsDir = path.join(__dirname, "..", "tools")
const outFile = path.join(__dirname, "tools.json")

if (!fs.existsSync(toolsDir)) {
  console.error("tools/ directory not found at", toolsDir)
  process.exit(1)
}

const files = fs.readdirSync(toolsDir).filter((f: string) => f.endsWith(".yaml"))

console.log(`Building tools.json from ${files.length} manifests...`)

const tools: Tool[] = files.map((file: any) => {
  const content = fs.readFileSync(path.join(toolsDir, file), "utf-8")
  const data = yaml.load(content) as Record<string, unknown>
  const install = (data.install ?? {}) as Record<string, unknown>

  return {
    name: data.name as string,
    slug: data.slug as string,
    category: data.category as string,
    version: String(data.version ?? "latest"),
    homepage: data.homepage as string,
    description: data.description as string,
    os: data.os as string[],
    verified: (data.verified as boolean) ?? false,
    install: {
      brew: (install.brew as string) ?? null,
      winget: (install.winget as string) ?? null,
      choco: (install.choco as string) ?? null,
      scoop: (install.scoop as string) ?? null,
      snap: (install.snap as string) ?? null,
      apt: (install.apt as string) ?? null,
      npm: (install.npm as string) ?? null,
      pip: (install.pip as string) ?? null,
      cargo: (install.cargo as string) ?? null,
      mac: (install.mac as string) ?? null,
      linux: (install.linux as string) ?? null,
      win: (install.win as string) ?? null,
    },
  }
})

fs.writeFileSync(outFile, JSON.stringify(tools, null, 2))
console.log(`Wrote ${tools.length} tools to tools.json`)
