import type { Metadata } from "next"
import { Rubik } from "next/font/google"
import { Room } from "../../providers/Room"
import { ThemeProvider } from "@/providers/ThemeProvider"

const rubik = Rubik({ subsets: ["latin"] })

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
