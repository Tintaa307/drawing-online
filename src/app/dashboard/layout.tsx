import type { Metadata } from "next"
import { Rubik } from "next/font/google"
import Toolbar from "@/components/toolbar/Toolbar"
import { Room } from "../Room"

const rubik = Rubik({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Draw | Dashboard",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <Room>{children}</Room>
}
