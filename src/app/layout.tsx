import type { Metadata } from "next"
import { Rubik } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/providers/ThemeProvider"
import db from "@/lib/supabase/db"
import Navbar from "@/components/header/Navbar"
import { RoomProvider } from "../../liveblocks.config"

const rubik = Rubik({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Drawing online",
  description:
    "Drawing Online is a real-time collaborative application where users can create diagrams, shapes, and drawings directly in the browser. Similar to Excalidraw or Paint, this intuitive and accessible tool fosters creativity and collaboration in visual projects effortlessly",
  keywords:
    "drawing, online, real-time, collaborative, diagrams, shapes, drawings, browser, excalidraw, paint, intuitive, accessible, creativity, collaboration, visual, projects, effortlessly",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  console.log(db)
  return (
    <html lang="en">
      <body className={rubik.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
