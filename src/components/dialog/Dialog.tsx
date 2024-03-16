"use client"

import { cn } from "@/lib/utils"
import React from "react"
import { Button } from "../ui/button"
import { IconX } from "@tabler/icons-react"

type DialogProps = {
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
}

const Dialog = ({ dialogOpen, setDialogOpen }: DialogProps) => {
  const fileRef = React.useRef<HTMLInputElement | null>(null)

  const options = [
    {
      title: "Export to PDF",
      description:
        "Export the scene data as a PDF from which you can import later.",
      action: () => {},
      buttonText: "Export as PDF",
    },
    {
      title: "Export to image",
      description:
        "Export the scene data as an image from which you can import later.",
      action: () => {},
      buttonText: "Export as Image",
    },
    {
      title: "Import an image",
      description:
        "Import an image to the canvas from which you can export later.",
      action: () => fileRef.current?.click(),
      buttonText: "Import Image",
    },
  ]

  return (
    <div
      className={cn(
        "absolute top-0 left-0 w-full h-screen z-50 bg-black/30 hidden",
        {
          "flex items-center justify-center": dialogOpen,
        }
      )}
    >
      <section
        className={cn(
          "relative w-1/2 h-[400px] bg-white border-[1px] border-black/10 flex items-center justify-start flex-col gap-8 opacity-0 transition-all duration-200 rounded-lg shadow-xl dark:bg-[#070707] dark:border-white/20",
          {
            "opacity-100 transition-all duration-200": dialogOpen,
          }
        )}
      >
        <div className="w-full h-max flex items-center justify-center">
          <h1 className="text-black text-3xl font-normal my-12 dark:text-white">
            Load or export your scene data
          </h1>
        </div>
        <div className="absolute top-5 right-5">
          <IconX
            onClick={() => setDialogOpen(false)}
            size={22}
            className="text-black dark:text-white cursor-pointer"
          />
        </div>
        <main className="flex flex-row gap-3 px-2">
          {options.map((option, index) => (
            <div
              key={index}
              className="w-1/3 h-full flex items-center justify-center flex-col gap-3 text-center"
            >
              <h3 className="text-black/90 text-2xl font-normal dark:text-white/90">
                {option.title}
              </h3>
              <p className="text-black/70 text-xs font-normal dark:text-white/70">
                {option.description}
              </p>
              <Button
                onClick={option.action}
                className="w-2/3 mt-3 dark:text-white"
              >
                {option.buttonText}
              </Button>
            </div>
          ))}
        </main>
      </section>
    </div>
  )
}

export default Dialog
