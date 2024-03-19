"use client"

import React, { useEffect, useState } from "react"
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
  IconWorldLatitude,
  IconMoon,
  IconSun,
  IconBrandLinkedin,
  IconRestore,
  IconPolygon,
  IconVectorSpline,
  IconCopy,
  IconArrowRight,
  IconCheck,
  IconX,
  IconBorderRadius,
  IconBorderNone,
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
import Link from "next/link"
import usePermission from "@/hooks/usePermission"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { v4 } from "uuid"
import { IconLogout } from "@tabler/icons-react"

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
  setBoardBg: React.Dispatch<React.SetStateAction<string>>
  boardBg: string
  openEditor: boolean
  setOpenEditor: React.Dispatch<React.SetStateAction<boolean>>
}

type SideBarProps = {
  title: string
  icon?: JSX.Element
  kbd?: string
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
  setBoardBg,
  boardBg,
  openEditor,
  setOpenEditor,
}: ToolbarProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [color, setColor] = useState("#393939")
  const { setTheme, theme } = useTheme()
  const [isCopied, setIsCopied] = useState(false)
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
      title: "Arrow",
      icon: (
        <IconArrowNarrowRight
          className="text-black dark:text-white"
          size={16}
          strokeWidth={1.5}
        />
      ),
      value: "group",
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
  ] as ToolItemsProps[]
  const searchParams = useSearchParams()
  const setMyRoom = usePermission((state: any) => state.setRoomId)
  const isSharing = usePermission((state: any) => state.isSharing)
  const setSharing = usePermission((state: any) => state.setSharing)
  const pathname = usePathname()
  const router = useRouter()
  const [realtime, setRealtime] = useState(false)

  useEffect(() => {
    if (searchParams.get("my-room") && isSharing) {
      setMyRoom(searchParams.get("my-room"))
    }
  }, [isSharing, searchParams.get("my-room")])

  const colors = ["#fff0cb", "#e1ffcb", "#cbffff", "#ffdfff"]
  const shapesColors = [
    "transparent",
    "#fd5d5dff",
    "#fad963ff",
    "#93fa63ff",
    "#392bf7ff",
    "#fb4bffff",
  ]

  const drawColors = [
    "#fd5d5dff",
    "#fad963ff",
    "#93fa63ff",
    "#392bf7ff",
    "#fb4bffff",
  ]

  const fillColors = [
    "transparent",
    "#fe8a8a",
    "#fbe48f",
    "#b2fb8f",
    "#6257f9",
    "#fc79ff",
  ]

  const handleChangeShapeColor = (property: string, value: string | number) => {
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
        <IconRestore
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
        <Link
          href={"https://github.com/Tintaa307/drawing-online"}
          target="_blank"
        >
          <IconBrandGithub
            className="text-black ml-2 dark:text-white"
            size={16}
            strokeWidth={1.5}
          />
        </Link>
      ),
    },
    {
      title: "Linkedin",
      icon: (
        <Link
          href={"https://www.linkedin.com/in/valentin-gonzalez-6a1805276/"}
          target="_blank"
        >
          <IconBrandLinkedin
            className="text-black ml-2 dark:text-white"
            size={16}
            strokeWidth={1.5}
          />
        </Link>
      ),
    },
    {
      title: "My portfolio",
      icon: (
        <Link href={"https://valentin-portfolio.vercel.app"} target="_blank">
          <IconWorldLatitude
            className="text-black ml-2 dark:text-white"
            size={16}
            strokeWidth={1.5}
          />
        </Link>
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

  const handleExportAsImage = () => {
    const drawingData = localStorage.getItem("drawing")!

    const canvas = fabricRef.current

    if (canvas && drawingData) {
      canvas.discardActiveObject()
      canvas.requestRenderAll()
      const dataURL = canvas.toDataURL({
        format: "jpg",
        quality: 0.8,
      })

      const a = document.createElement("a")
      a.href = dataURL
      a.download = "drawing-online-image.png"
      a.click()
    }

    setDialogOpen(false)

    return
  }

  const handleSaveAs = () => {
    const drawingData = localStorage.getItem("drawing")!

    // quiero que el usuario elija donde guardar el archivo

    const canvas = fabricRef.current

    if (canvas && drawingData) {
      canvas.discardActiveObject()
      canvas.requestRenderAll()
      const dataURL = canvas.toDataURL({
        format: "jpg",
        quality: 0.8,
      })

      const a = document.createElement("a")
      a.href = dataURL
      a.download = "drawing-online-image.png"
      a.click()
    }

    return
  }

  const handleSideBar = (item: SideBarProps) => {
    switch (item.title) {
      case "Open":
        return () => {
          setDialogOpen(true)
        }
      case "Clean the board":
        return () => {
          handleActive({
            title: "Reset",
            value: "reset",
          })
        }
      case "Realtime colaboration":
        return () => {
          setRealtime(true)
        }

      case "Dark mode" || "Light mode":
        return () => {
          setTheme(theme === "light" ? "dark" : "light")
        }

      case "Github":
        return () => {
          router.push("https://github.com/Tintaa307/drawing-online")
        }

      case "Linkedin":
        return () => {
          router.push(
            "https://www.linkedin.com/in/valentin-gonzalez-6a1805276/"
          )
        }

      case "My portfolio":
        return () => {
          router.push("https://valentin-portfolio.vercel.app")
        }

      case "Export image":
        return () => {
          handleExportAsImage()
        }

      case "Save as":
        return () => {
          handleSaveAs()
        }
      default:
        return () => {}
    }
  }
  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setColor(event.target.value)
    setBoardBg(event.target.value)

    if (event.target.name === "fill") {
      handleChangeShapeColor("fill", event.target.value)
    } else {
      handleChangeShapeColor("stroke", event.target.value)
    }
  }

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.button === 1 && fabricRef.current) {
        setActiveTool("Grab")
        fabricRef.current.defaultCursor = "grab"
      }
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 1 && fabricRef.current) {
        setActiveTool("Select")
        fabricRef.current.defaultCursor = "default"
      }
    }

    window.addEventListener("mousedown", handleClick)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousedown", handleClick)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  return (
    <header
      className="relative w-full h-20 flex items-center justify-evenly z-40 bg-white dark:bg-[#13131A]"
      style={{ backgroundColor: boardBg }}
    >
      <small className="absolute top-20 text-black/50 text-xs font-light tracking-wider dark:text-white/50">
        Drawing-online by Valentin Gonzalez
      </small>
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
                      onClick={handleSideBar(item)}
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
                    onClick={() => {
                      setBoardBg(item)
                    }}
                    className="w-[25px] h-[25px] rounded-lg cursor-pointer border-[1px] border-black/10 dark:border-white/10"
                    style={{ backgroundColor: item }}
                  />
                ))}
                <span className="w-[1px] h-[35px] bg-black/10 dark:bg-white/10" />
                <Popover>
                  <PopoverTrigger>
                    <div
                      style={{ backgroundColor: color }}
                      className="w-[25px] h-[25px] rounded-lg cursor-pointer border-[1px] border-black/10 dark:border-white/10"
                    />
                  </PopoverTrigger>
                  <PopoverContent className="py-2 px-1 bg-white border-[1px] border-black/20 flex items-center justify-center flex-col gap-1 dark:bg-black dark:border-white/20">
                    <h6 className="text-black/80 text-base dark:text-white">
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
            </DropdownMenuContent>
          </DropdownMenu>
          {openEditor && (
            <DropdownMenu open={openEditor}>
              <DropdownMenuContent
                tabIndex={0}
                onBlur={() => setOpenEditor(false)}
                className="absolute w-max h-max flex flex-col dark:bg-[#090909] bg-white left-8 top-20 rounded-lg border-[1px] border-black/20 dark:border-white/20 px-3"
              >
                <DropdownMenuLabel
                  tabIndex={0}
                  className="w-[300px] flex flex-row gap-2 items-center font-normal text-black/80 text-sm my-0.5 mt-2 dark:text-white/80"
                >
                  Stroke color
                </DropdownMenuLabel>
                <DropdownMenuLabel className="w-[300px] h-full flex flex-row gap-3 items-center text-black/80 text-sm my-0.5 dark:text-white/80">
                  {shapesColors.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handleChangeShapeColor("stroke", item)}
                      className="w-[25px] h-[25px] rounded-lg cursor-pointer border-[1px] border-black/10 dark:border-white/10 flex items-center justify-center"
                      style={{ backgroundColor: item }}
                    >
                      {item === "transparent" && (
                        <IconX size={13} className="text-white" />
                      )}
                    </div>
                  ))}
                  <span className="w-[1px] h-[35px] bg-black/10 dark:bg-white/10" />
                  <Popover>
                    <PopoverTrigger>
                      <div
                        style={{ backgroundColor: color }}
                        className="w-[25px] h-[25px] rounded-lg cursor-pointer border-[1px] border-black/10 dark:border-white/10"
                      />
                    </PopoverTrigger>
                    <PopoverContent className="py-2 px-1 bg-white border-[1px] border-black/20 flex items-center justify-center flex-col gap-1 dark:bg-black dark:border-white/20">
                      <h6 className="text-black/80 text-base dark:text-white">
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
                      className="w-[25px] h-[25px] rounded-lg cursor-pointer border-[1px] border-black/10 dark:border-white/10 flex items-center justify-center"
                      style={{ backgroundColor: item }}
                    >
                      {item === "transparent" && (
                        <IconX size={13} className="text-white" />
                      )}
                    </div>
                  ))}
                  <span className="w-[1px] h-[35px] bg-black/10 dark:bg-white/10" />
                  <Popover>
                    <PopoverTrigger>
                      <div
                        style={{ backgroundColor: color }}
                        className="w-[25px] h-[25px] rounded-lg cursor-pointer border-[1px] border-black/10 dark:border-white/10"
                      />
                    </PopoverTrigger>
                    <PopoverContent className="py-2 px-1 bg-white border-[1px] border-black/20 flex items-center justify-center flex-col gap-1 dark:bg-black dark:border-white/20">
                      <h6 className="text-black/80 text-base dark:text-white">
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

                <DropdownMenuLabel
                  tabIndex={0}
                  className="w-[300px] flex flex-row gap-2 items-center font-normal text-black/80 text-sm my-0.5 mt-2 dark:text-white/80"
                >
                  Border width
                </DropdownMenuLabel>
                <DropdownMenuLabel className="w-[300px] h-full flex flex-row gap-3 items-center text-black/80 text-sm my-0.5 dark:text-white/80">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div
                          onClick={() =>
                            handleChangeShapeColor("strokeWidth", 1)
                          }
                          className="w-[35px] h-[35px] rounded-lg cursor-pointer border-[1px] border-black/10 dark:border-white/10 flex items-center justify-center"
                        >
                          <span className="dark:bg-white bg-black w-[50%] h-[1.5px] rounded-full" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="absolute -left-12 top-11 w-max px-2 bg-white text-black border-black/10 dark:bg-[#090909] dark:text-white border-[1px] dark:border-white/10">
                        <p className="text-xs font-normal">Border thin</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div
                          onClick={() =>
                            handleChangeShapeColor("strokeWidth", 3)
                          }
                          className="w-[35px] h-[35px] rounded-lg cursor-pointer border-[1px] border-black/10 dark:border-white/10 flex items-center justify-center"
                        >
                          <span className="dark:bg-white bg-black w-[50%] h-[2.5px] rounded-full" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="absolute -left-12 top-11 w-max px-2 bg-white text-black border-black/10 dark:bg-[#090909] dark:text-white border-[1px] dark:border-white/10">
                        <p className="text-xs font-normal">Border normal</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div
                          onClick={() =>
                            handleChangeShapeColor("strokeWidth", 5)
                          }
                          className="w-[35px] h-[35px] rounded-lg cursor-pointer border-[1px] border-black/10 dark:border-white/10 flex items-center justify-center"
                        >
                          <span className="dark:bg-white bg-black w-[50%] h-[4.5px] rounded-full" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="absolute -left-12 top-11 w-max px-2 bg-white text-black border-black/10 dark:bg-[#090909] dark:text-white border-[1px] dark:border-white/10">
                        <p className="text-xs font-normal">Border thick</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
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
                <TooltipContent className="bg-white text-black dark:bg-[#070707] dark:text-white dark:border-white/10 mt-1">
                  <p>{item.title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </ul>
      </nav>
      <section className="w-1/4 h-full flex items-center justify-end">
        <div className="w-max h-full flex items-center justify-center mx-8 flex-row gap-8">
          {isSharing && (
            <Button
              onClick={() => {
                setSharing(false)
                setMyRoom("")
                const newRoomId = v4()
                const newUrl = `${pathname}?my-room=${newRoomId}`
                router.push(newUrl)
              }}
              variant={"destructive"}
              className="gap-2"
            >
              Stop share
              <IconSquare className="text-white" size={18} />
            </Button>
          )}
          <Dialog open={realtime}>
            <DialogTrigger asChild>
              <Button className="w-max px-6 text-white bg-primary flex gap-2 select-none">
                Share
                <IconShare className="text-white" size={18} />
              </Button>
            </DialogTrigger>
            {isSharing ? (
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Share link</DialogTitle>
                  <DialogDescription>
                    Anyone who has this link will be able to view this.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor="link" className="sr-only">
                      Link
                    </Label>
                    <Input
                      id="link"
                      defaultValue={
                        process.env.NODE_ENV === "development"
                          ? `localhost:3000${pathname}?my-room=${searchParams.get(
                              "my-room"
                            )}`
                          : `https://drawing-online.vercel.app${pathname}?my-room=${searchParams.get(
                              "my-room"
                            )}`
                      }
                      readOnly
                    />
                  </div>
                  <Button type="submit" size="sm" className="px-3">
                    <span className="sr-only">Copy</span>
                    {!isCopied ? (
                      <IconCopy
                        onClick={() => {
                          process.env.NODE_ENV === "development"
                            ? navigator.clipboard.writeText(
                                `localhost:3000${pathname}?my-room=${searchParams.get(
                                  "my-room"
                                )}`
                              )
                            : navigator.clipboard.writeText(
                                `https://drawing-online.vercel.app${pathname}?my-room=${searchParams.get(
                                  "my-room"
                                )}`
                              )
                          setIsCopied(true)
                          setTimeout(() => {
                            setIsCopied(false)
                          }, 2000)
                        }}
                        className="h-4 w-4 text-white"
                      />
                    ) : (
                      <IconCheck size={20} className="h-4 w-4 text-white" />
                    )}
                  </Button>
                </div>
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            ) : (
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-yellow-300 my-1">
                    Important!
                  </DialogTitle>
                  <DialogDescription>
                    Anyone who has this link will be able to view this. Do you
                    want to continue?
                  </DialogDescription>
                </DialogHeader>
                <div className="w-full flex items-center justify-center space-x-2">
                  <Button
                    onClick={() => {
                      setSharing(true)
                    }}
                    size="sm"
                    className="w-1/2 h-11 text-white gap-2"
                    variant={"default"}
                  >
                    Continue <IconArrowRight size={20} className="text-white" />
                  </Button>
                  <Button
                    onClick={() => {
                      setRealtime(false)
                    }}
                    size="sm"
                    className="w-1/2 h-11 text-white gap-2"
                    variant={"secondary"}
                  >
                    Close <IconLogout size={20} className="text-white" />
                  </Button>
                </div>
              </DialogContent>
            )}
          </Dialog>

          <ActiveUsers />
        </div>
      </section>
    </header>
  )
}

export default Toolbar
