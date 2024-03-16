import type { Metadata } from "next"
import { Room } from "../Room"
import { ThemeProvider } from "@/providers/ThemeProvider"

export const metadata: Metadata = {
  title: "Draw | Dashboard",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Room>
      <ThemeProvider defaultTheme="light" attribute="class">
        {children}
      </ThemeProvider>
    </Room>
  )
}
