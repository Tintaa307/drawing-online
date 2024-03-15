"use client"

import React, { useContext, useState } from "react"
import { BarsIcon } from "../icons/Bars"
import {
  IconLockOpen,
  IconLock,
  IconHandMove,
  IconPointer,
  IconSquare,
  IconCircle,
  IconArrowNarrowRight,
  IconLine,
  IconPencil,
  IconTextSize,
  IconPhoto,
  IconEraser,
  IconCategory2,
  IconShare,
  IconTriangle,
  IconTrash,
  IconRefresh,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import ActiveUsers from "../users/ActiveUsers"

export type ToolItemsProps = {
  title: string
  icon?: JSX.Element
  value: string
}

type ToolbarProps = {
  handleActive: (tool: ToolItemsProps) => void
  activeTool: string
  setActiveTool: (value: string) => void
}

const Toolbar = ({ handleActive, activeTool, setActiveTool }: ToolbarProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const toolItems = [
    {
      title: isLocked ? "Unlock" : "Lock",
      icon: isLocked ? (
        <IconLock className="text-black" size={16} strokeWidth={1.7} />
      ) : (
        <IconLockOpen className="text-black" size={16} strokeWidth={1.7} />
      ),
      value: "lock",
    },
    {
      title: "Divider",
    },
    {
      title: "Grab",
      icon: <IconHandMove className="text-black" size={16} strokeWidth={1.7} />,
      value: "grab",
    },
    {
      title: "Select",
      icon: <IconPointer className="text-black" size={16} strokeWidth={1.7} />,
      value: "select",
    },
    {
      title: "Rectangle",
      icon: <IconSquare className="text-black" size={16} strokeWidth={1.7} />,
      value: "rectangle",
    },
    {
      title: "Triangle",
      icon: <IconTriangle className="text-black" size={16} strokeWidth={1.7} />,
      value: "triangle",
    },
    {
      title: "Circle",
      icon: <IconCircle className="text-black" size={16} strokeWidth={1.7} />,
      value: "circle",
    },
    {
      title: "Line",
      icon: (
        <IconArrowNarrowRight
          className="text-black"
          size={16}
          strokeWidth={1.5}
        />
      ),
      value: "line",
    },
    {
      title: "Free drawing",
      icon: <IconPencil className="text-black" size={16} strokeWidth={1.5} />,
      value: "freeform",
    },
    {
      title: "Text",
      icon: <IconTextSize className="text-black" size={16} strokeWidth={1.5} />,
      value: "text",
    },
    {
      title: "Image",
      icon: <IconPhoto className="text-black" size={16} strokeWidth={1.5} />,
      value: "image",
    },
    {
      title: "Eraser",
      icon: <IconEraser className="text-black" size={16} strokeWidth={1.5} />,
      value: "eraser",
    },
    {
      title: "Delete",
      icon: <IconTrash className="text-black" size={16} strokeWidth={2} />,
      value: "delete",
    },
    {
      title: "Clean the board",
      icon: <IconRefresh className="text-black" size={16} strokeWidth={2} />,
      value: "reset",
    },
    {
      title: "Divider",
    },
    {
      title: "More tools",
      icon: (
        <IconCategory2 className="text-black" size={16} strokeWidth={1.5} />
      ),
      value: "more",
    },
  ] as ToolItemsProps[]

  return (
    <header className="relative w-full h-20 flex items-center justify-evenly z-40">
      <div className="w-1/4 h-full flex items-center justify-start">
        <div className="w-10 h-10 rounded-xl bg-white border-[1px] border-black/10 shadow-lg flex items-center justify-center mx-8 cursor-pointer">
          <BarsIcon isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </div>
      <nav className="w-2/4 h-full flex items-center justify-center">
        <ul className="w-max h-max flex flex-row gap-2 bg-white border-[1px] border-black/10 shadow-md rounded-xl py-1 px-1.5">
          {toolItems.map((item, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger>
                  <li
                    onClick={() => {
                      setActiveTool(item.title)
                      handleActive(item)
                    }}
                    className={cn({
                      "w-[1px] h-10 flex items-center justify-center":
                        item.title === "Divider",
                      "w-10 h-10 flex items-center justify-center cursor-pointer rounded-xl hover:bg-black/10":
                        item.title !== "Divider",
                      "bg-primary/20 text-white": activeTool === item.title,
                    })}
                  >
                    {item.icon}
                    {item.title === "Divider" && (
                      <span className="w-full h-8 bg-black/40" />
                    )}
                  </li>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </ul>
      </nav>
      <section className="w-1/4 h-full flex items-center justify-end">
        <div className="w-max h-full flex items-center justify-center mx-8 flex-row gap-8">
          <Button className="w-max px-6 text-white bg-primary flex gap-2 select-none">
            Share
            <IconShare className="text-white" size={18} />
          </Button>
          <ActiveUsers />
        </div>
      </section>
    </header>
  )
}

export default Toolbar
