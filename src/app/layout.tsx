import type { Metadata } from "next"
import { Rubik } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/header/Navbar"

const rubik = Rubik({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Drawing online",
  description:
    "Drawing Online is a real-time collaborative application where users can create diagrams, shapes, and drawings directly in the browser. Similar to Excalidraw or Paint, this intuitive and accessible tool fosters creativity and collaboration in visual projects effortlessly",
  keywords:
    "drawing, online, real-time, collaborative, diagrams, shapes, drawings, browser, excalidraw, paint, intuitive, accessible, creativity, collaboration, visual, projects, effortlessly",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={rubik.className}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
