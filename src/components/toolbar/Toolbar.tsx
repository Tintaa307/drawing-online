"use client"

import React, { useContext, useEffect, useState } from "react"
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
  IconFolder,
  IconDownload,
  IconLocationPlus,
  IconBrandGithub,
  IconBrandX,
  IconWorldLatitude,
  IconMoon,
  IconSun,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useTheme } from "next-themes"
import { Attributes } from "@/types/type"
import { modifyShape } from "@/lib/shapes"

export type ToolItemsProps = {
  title: string
  icon?: JSX.Element
  value: string
}

type ToolbarProps = {
  handleActive: (tool: ToolItemsProps, e?: KeyboardEvent) => void
  activeTool: string
  setActiveTool: (value: string) => void
  imageInputRef?: React.RefObject<HTMLInputElement> | null
  handleImageUpload?: (e: any) => void
  elementAttributes: Attributes
  setElementAttributes: React.Dispatch<React.SetStateAction<Attributes>>
  isEditingRef: React.MutableRefObject<boolean>
  fabricRef: React.MutableRefObject<fabric.Canvas | null>
  activeObjectRef: React.MutableRefObject<fabric.Object | null>
  syncShapeInStorage: any
  setDialogOpen: (open: boolean) => void
}

const Toolbar = ({
  handleActive,
  activeTool,
  setActiveTool,
  imageInputRef,
  handleImageUpload,
  activeObjectRef,
  elementAttributes,
  setElementAttributes,
  isEditingRef,
  fabricRef,
  syncShapeInStorage,
  setDialogOpen,
}: ToolbarProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [color, setColor] = useState("#393939")
  const { setTheme, theme } = useTheme()
  const toolItems = [
    {
      title: isLocked ? "Unlock" : "Lock",
      icon: isLocked ? (
        <IconLock
          className="text-black dark:text-white"
          size={16}
          strokeWidth={1.7}
        />
      ) : (
        <IconLockOpen
          className="text-black dark:text-white"
          size={16}
          strokeWidth={1.7}
        />
      ),
      value: "lock",
    },
    {
      title: "Divider",
    },
    {
      title: "Grab",
      icon: (
        <IconHandMove
          className="text-black dark:text-white"
          size={16}
          strokeWidth={1.7}
        />
      ),
      value: "grab",
    },
    {
      title: "Select",
      icon: (
        <IconPointer
          className="text-black dark:text-white"
          size={16}
          strokeWidth={1.7}
        />
      ),
      value: "select",
    },
    {
      title: "Rectangle",
      icon: (
        <IconSquare
          className="text-black dark:text-white"
          size={16}
          strokeWidth={1.7}
        />
      ),
      value: "rectangle",
    },
    {
      title: "Triangle",
      icon: (
        <IconTriangle
          className="text-black dark:text-white"
          size={16}
          strokeWidth={1.7}
        />
      ),
      value: "triangle",
    },
    {
      title: "Circle",
      icon: (
        <IconCircle
          className="text-black dark:text-white"
          size={16}
          strokeWidth={1.7}
        />
      ),
      value: "circle",
    },
    {
      title: "Line",
      icon: (
        <IconLine
          className="text-black dark:text-white"
          size={16}
          strokeWidth={1.5}
        />
      ),
      value: "line",
    },
    {
      title: "Free drawing",
      icon: (
        <IconPencil
          className="text-black dark:text-white"
          size={16}
          strokeWidth={1.5}
        />
      ),
      value: "freeform",
    },
    {
      title: "Text",
      icon: (
        <IconTextSize
          className="text-black dark:text-white"
          size={16}
          strokeWidth={1.5}
        />
      ),
      value: "text",
    },
    {
      title: "Image",
      icon: (
        <IconPhoto
          className="text-black dark:text-white"
          size={16}
          strokeWidth={1.5}
        />
      ),
      value: "image",
    },
    {
      title: "Eraser",
      icon: (
        <IconEraser
          className="text-black dark:text-white"
          size={16}
          strokeWidth={1.5}
        />
      ),
      value: "eraser",
    },
    {
      title: "Delete",
      icon: (
        <IconTrash
          className="text-black dark:text-white"
          size={16}
          strokeWidth={2}
        />
      ),
      value: "delete",
    },
    {
      title: "Clean the board",
      icon: (
        <IconRefresh
          className="text-black dark:text-white"
          size={16}
          strokeWidth={2}
        />
      ),
      value: "reset",
    },
    {
      title: "Divider",
    },
    {
      title: "More tools",
      icon: (
        <IconCategory2
          className="text-black dark:text-white"
          size={16}
          strokeWidth={1.5}
        />
      ),
      value: "more",
    },
  ] as ToolItemsProps[]

  const colors = ["#fff0cb", "#e1ffcb", "#cbffff", "#ffdfff"]
  const shapesColors = [
    "#fd5d5dff",
    "#fad963ff",
    "#93fa63ff",
    "#392bf7ff",
    "#fb4bffff",
  ]

  const fillColors = ["#fe8a8a", "#fbe48f", "#b2fb8f", "#6257f9", "#fc79ff"]

  const handleChangeShapeColor = (property: string, value: string) => {
    if (!isEditingRef.current) isEditingRef.current = true

    setElementAttributes((prev) => ({
      ...prev,
      [property]: value,
    }))

    modifyShape({
      canvas: fabricRef.current as fabric.Canvas,
      property,
      value,
      activeObjectRef,
      syncShapeInStorage,
    })
  }

  const asideArr = [
    {
      title: "Open",
      icon: (
        <IconFolder
          className="text-black ml-2 dark:text-white"
          size={16}
          strokeWidth={1.5}
        />
      ),
      kbd: "Ctrl+O",
    },
    {
      title: "Save as",
      icon: (
        <IconDownload
          className="text-black ml-2 dark:text-white"
          size={16}
          strokeWidth={1.5}
        />
      ),
    },
    {
      title: "Export image",
      icon: (
        <IconPhoto
          className="text-black ml-2 dark:text-white"
          size={16}
          strokeWidth={1.5}
        />
      ),
      kbd: "Ctrl+Shift+E",
    },
    {
      title: "Realtime colaboration",
      icon: (
        <IconLocationPlus
          className="text-black ml-2 dark:text-white"
          size={16}
          strokeWidth={1.5}
        />
      ),
    },
    {
      title: "Clean the board",
      icon: (
        <IconTrash
          className="text-black ml-2 dark:text-white"
          size={16}
          strokeWidth={2}
        />
      ),
    },
    {
      title: "separator",
    },
    {
      title: "Github",
      icon: (
        <IconBrandGithub
          className="text-black ml-2 dark:text-white"
          size={16}
          strokeWidth={1.5}
        />
      ),
    },
    {
      title: "Twitter",
      icon: (
        <IconBrandX
          className="text-black ml-2 dark:text-white"
          size={16}
          strokeWidth={1.5}
        />
      ),
    },
    {
      title: "My portfolio",
      icon: (
        <IconWorldLatitude
          className="text-black ml-2 dark:text-white"
          size={16}
          strokeWidth={1.5}
        />
      ),
    },
    {
      title: "separator",
    },
    {
      title: theme === "light" ? "Dark mode" : "Light mode",
      icon:
        theme === "light" ? (
          <IconMoon
            className="text-black ml-2 dark:text-white"
            size={16}
            strokeWidth={1.5}
          />
        ) : (
          <IconSun
            className="text-black ml-2 dark:text-white"
            size={16}
            strokeWidth={1.5}
          />
        ),
      kbd: "Ctrl+Alt+D",
    },
  ]

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value)

    if (event.target.name === "fill") {
      handleChangeShapeColor("fill", event.target.value)
    } else {
      handleChangeShapeColor("stroke", event.target.value)
    }
  }

  return (
    <header className="relative w-full h-20 flex items-center justify-evenly z-40 bg-white dark:bg-[#13131A]">
      <div className="w-1/4 h-full flex items-center justify-start">
        <div className="w-10 h-10 rounded-xl bg-white border-[1px] border-black/10 shadow-lg flex items-center justify-center mx-8 cursor-pointer hover:bg-white/90 transition-colors duration-150 dark:bg-[#090909] dark:border-white/10 dark:hover:bg-[#070707]">
          <DropdownMenu>
            <DropdownMenuTrigger className="select-none border-none outline-none ring-0">
              {" "}
              <BarsIcon isOpen={isOpen} setIsOpen={setIsOpen} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="ml-8 mt-4 bg-white border-[1px] border-black/10 shadow-xl flex flex-col gap-1 items-center px-2.5 dark:bg-[#090909] dark:border-white/10">
              {asideArr.map((item, index) => (
                <>
                  {item.title !== "separator" ? (
                    <DropdownMenuItem
                      key={index}
                      onClick={() => {
                        if (
                          item.title === "Dark mode" ||
                          item.title === "Light mode"
                        ) {
                          setTheme(theme === "light" ? "dark" : "light")
                        }
                        if (item.title === "Open") {
                          setDialogOpen(true)
                        }
                      }}
                      className={cn(
                        "w-full h-10 flex items-center justify-between text-black/80 text-sm cursor-pointer dark:text-white/80 dark:hover:bg-white/10",
                        {
                          "mt-2": index === 0,
                        }
                      )}
                    >
                      <div className="flex flex-row gap-2 items-center">
                        {item.icon}
                        <span>{item.title}</span>
                      </div>
                      {item.kbd && (
                        <kbd className="text-black/40 dark:text-white/40 text-xs">
                          {item.kbd}
                        </kbd>
                      )}
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuSeparator
                      className="w-full h-[1px] bg-black/20 dark:bg-white/20"
                      key={index}
                    />
                  )}
                </>
              ))}
              <DropdownMenuLabel className="w-[300px] flex flex-row gap-2 items-center font-normal text-black/80 text-sm my-0.5 mt-2 dark:text-white/80">
                Board background
              </DropdownMenuLabel>
              <DropdownMenuLabel className="w-[300px] h-full flex flex-row gap-4 items-center text-black/80 text-sm my-0.5 dark:text-white/80">
                {colors.map((item, index) => (
                  <div
                    key={index}
                    className="w-[35px] h-[35px] rounded-lg cursor-pointer border-[1px] border-black/10 dark:border-white/10"
                    style={{ backgroundColor: item }}
                  />
                ))}
                <span className="w-[1px] h-[35px] bg-black/10 dark:bg-white/10" />
                <Popover>
                  <PopoverTrigger>
                    <div
                      style={{ backgroundColor: color }}
                      className="w-[35px] h-[35px] rounded-lg cursor-pointer border-[1px] border-black/10 dark:border-white/10"
                    />
                  </PopoverTrigger>
                  <PopoverContent className="py-2 px-1 bg-white border-[1px] border-black/20 flex items-center justify-center flex-col gap-1 dark:bg-black dark:border-white/20">
                    <h6 className="text-black/80 text-base">
                      Hexadecimal code
                    </h6>
                    <input
                      type="text"
                      placeholder="#393939"
                      value={color}
                      onChange={handleColorChange}
                      className="w-[90%] h-8 bg-transparent px-2 border-[1px] border-black/20 text-black text-sm placeholder:text-black rounded-md dark:border-white/20 dark:text-white dark:placeholder:text-white"
                    />
                  </PopoverContent>
                </Popover>
              </DropdownMenuLabel>
              <DropdownMenuLabel className="w-[300px] flex flex-row gap-2 items-center font-normal text-black/80 text-sm my-0.5 mt-2 dark:text-white/80">
                Stroke color
              </DropdownMenuLabel>
              <DropdownMenuLabel className="w-[300px] h-full flex flex-row gap-3 items-center text-black/80 text-sm my-0.5 dark:text-white/80">
                {shapesColors.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleChangeShapeColor("stroke", item)}
                    className="w-[35px] h-[35px] rounded-lg cursor-pointer border-[1px] border-black/10 dark:border-white/10"
                    style={{ backgroundColor: item }}
                  />
                ))}
                <span className="w-[1px] h-[35px] bg-black/10 dark:bg-white/10" />
                <Popover>
                  <PopoverTrigger>
                    <div
                      style={{ backgroundColor: color }}
                      className="w-[35px] h-[35px] rounded-lg cursor-pointer border-[1px] border-black/10 dark:border-white/10"
                    />
                  </PopoverTrigger>
                  <PopoverContent className="py-2 px-1 bg-white border-[1px] border-black/20 flex items-center justify-center flex-col gap-1 dark:bg-black dark:border-white/20">
                    <h6 className="text-black/80 text-base">
                      Hexadecimal code
                    </h6>
                    <input
                      type="text"
                      name="stroke"
                      placeholder="#393939"
                      value={color}
                      onChange={handleColorChange}
                      className="w-[90%] h-8 bg-transparent px-2 border-[1px] border-black/20 text-black text-sm placeholder:text-black rounded-md dark:border-white/20 dark:text-white dark:placeholder:text-white"
                    />
                  </PopoverContent>
                </Popover>
              </DropdownMenuLabel>
              <DropdownMenuLabel className="w-[300px] flex flex-row gap-2 items-center font-normal text-black/80 text-sm my-0.5 mt-2 dark:text-white/80">
                Fill color
              </DropdownMenuLabel>
              <DropdownMenuLabel className="w-[300px] h-full flex flex-row gap-3 items-center text-black/80 text-sm my-0.5 dark:text-white/80">
                {fillColors.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleChangeShapeColor("fill", item)}
                    className="w-[35px] h-[35px] rounded-lg cursor-pointer border-[1px] border-black/10 dark:border-white/10"
                    style={{ backgroundColor: item }}
                  />
                ))}
                <span className="w-[1px] h-[35px] bg-black/10 dark:bg-white/10" />
                <Popover>
                  <PopoverTrigger>
                    <div
                      style={{ backgroundColor: color }}
                      className="w-[35px] h-[35px] rounded-lg cursor-pointer border-[1px] border-black/10 dark:border-white/10"
                    />
                  </PopoverTrigger>
                  <PopoverContent className="py-2 px-1 bg-white border-[1px] border-black/20 flex items-center justify-center flex-col gap-1 dark:bg-black dark:border-white/20">
                    <h6 className="text-black/80 text-base">
                      Hexadecimal code
                    </h6>
                    <input
                      type="text"
                      placeholder="#393939"
                      name="fill"
                      value={color}
                      onChange={handleColorChange}
                      className="w-[90%] h-8 bg-transparent px-2 border-[1px] border-black/20 text-black text-sm placeholder:text-black rounded-md dark:border-white/20 dark:text-white dark:placeholder:text-white"
                    />
                  </PopoverContent>
                </Popover>
              </DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <nav className="w-2/4 h-full flex items-center justify-center">
        <ul className="w-max h-max flex flex-row gap-2 bg-white border-[1px] border-black/10 shadow-md rounded-xl py-1 px-1.5 dark:bg-[#090909] dark:border-white/10">
          {toolItems.map((item, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger
                  onClick={() => {
                    setActiveTool(item.title)
                    handleActive(item)
                  }}
                >
                  <li
                    className={cn({
                      "w-[1px] h-10 flex items-center justify-center":
                        item.title === "Divider",
                      "w-10 h-10 flex items-center justify-center cursor-pointer rounded-xl hover:bg-black/10 dark:hover:bg-white/10":
                        item.title !== "Divider",
                      "bg-primary/20 text-white dark:bg-primary dark:hover:bg-primary/80":
                        activeTool === item.title,
                    })}
                  >
                    {item.icon}
                    {item.title === "Divider" && (
                      <span className="w-full h-8 bg-black/40 dark:bg-white/40" />
                    )}
                  </li>
                  <input
                    type="file"
                    hidden
                    ref={imageInputRef}
                    onChange={handleImageUpload}
                  />
                </TooltipTrigger>
                <TooltipContent className="dark:bg-[#070707] dark:text-white dark:border-white/10">
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
