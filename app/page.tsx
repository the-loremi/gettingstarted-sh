import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { RegistryTable } from "@/components/landing/registry-table"
import { OpenSourceSection } from "@/components/landing/open-source"
import { getAllTools } from "@/lib/tools"

export default function Page() {
  const tools = getAllTools().slice(0, 5)

  return (
    <>
      <Hero />
      <HowItWorks />
      <RegistryTable tools={tools} />
      <OpenSourceSection />
    </>
  )
}
