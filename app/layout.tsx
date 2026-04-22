import { Geist, JetBrains_Mono, Fira_Mono } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Nav } from "@/components/landing/nav"
import { SiteFooter } from "@/components/landing/site-footer"
import { cn } from "@/lib/utils"

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const firaMono = Fira_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-fira-mono",
})

export const metadata = {
  title: "gettingstarted.sh — Every tool. One command.",
  description:
    "The canonical getting-started registry for AI tools, models, and vibe-coding stacks. One-line setup commands. Always current. Community maintained.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontSans.variable,
        "font-mono",
        jetbrainsMono.variable,
        firaMono.variable,
      )}
    >
      <body>
        <ThemeProvider defaultTheme="dark">
          <Nav />
          <main>{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  )
}
