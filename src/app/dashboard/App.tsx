"use client"

import React, { useRef, useEffect, useState } from "react"
import Live from "@/components/live/Live"
import { fabric } from "fabric"
import {
  handleCanvasMouseDown,
  handleCanvasMouseUp,
  handleCanvasObjectModified,
  handleCanvasObjectMoving,
  handleCanvasObjectScaling,
  handleCanvasSelectionCreated,
  handleCanvasZoom,
  handleCanvaseMouseMove,
  handlePathCreated,
  handleResize,
  initializeFabric,
  renderCanvas,
} from "@/lib/canvas"
import Toolbar, { ToolItemsProps } from "@/components/toolbar/Toolbar"
import {
  useMutation,
  useRedo,
  useStorage,
  useUndo,
} from "../../../liveblocks.config"
import { handleDelete, handleKeyDown } from "@/lib/key-events"
import { handleImageUpload, updateShapesColor } from "@/lib/shapes"
import { useTheme } from "next-themes"
import { Attributes } from "@/types/type"
import Dialog from "@/components/dialog/Dialog"

const Dashboard = ({ params }: { params: { id: string } }) => {
  const undo = useUndo()
  const redo = useRedo()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<fabric.Canvas | null>(null)
  const isDrawing = useRef(false)
  const shapeRef = useRef<fabric.Object | null>(null)
  const [activeElement, setActiveElement] = useState<string>("")
  const selectedShapeRef = useRef<string | null>(null)
  const activeObjectRef = useRef<fabric.Object | null>(null)
  const [activeTool, setActiveTool] = useState("Select")
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const { theme, setTheme } = useTheme()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [boardBg, setBoardBg] = useState<string>("")
  const [openEditor, setOpenEditor] = useState(false)
  const isEditingRef = useRef(false)
  const [elementAttributes, setElementAttributes] = useState<Attributes>({
    fill: "",
    stroke: "",
    fontFamily: "",
    fontSize: "",
    fontWeight: "",
    borderWidth: 3,
    rx: 10,
    ry: 10,
  })

  const canvasObjects = useStorage((root) => root.canvasObjects)

  const syncShapeInStorage = useMutation(({ storage }, object) => {
    if (!object) return

    const { objectId } = object

    const shapeData = object.toJSON()
    shapeData.objectId = objectId

    const canvasObjects = storage.get("canvasObjects")

    canvasObjects.set(objectId, shapeData)
  }, [])

  useEffect(() => {
    const canvas = initializeFabric({ canvasRef, fabricRef })

    if (!theme) return

    canvas.on("mouse:down", (options) => {
      handleCanvasMouseDown({
        options,
        canvas,
        selectedShapeRef,
        isDrawing,
        shapeRef,
        theme,
      })
    })

    canvas.on("mouse:move", (options) => {
      handleCanvaseMouseMove({
        options,
        canvas,
        selectedShapeRef,
        isDrawing,
        shapeRef,
        syncShapeInStorage,
      })
    })

    canvas.on("mouse:up", () => {
      handleCanvasMouseUp({
        canvas,
        isDrawing,
        shapeRef,
        activeObjectRef,
        selectedShapeRef,
        syncShapeInStorage,
        setActiveElement,
      })
    })

    canvas.on("object:modified", (options) => {
      handleCanvasObjectModified({
        options,
        syncShapeInStorage,
      })
    })

    window.addEventListener("keydown", (e) => {
      handleKeyDown({
        e,
        canvas: fabricRef.current,
        undo,
        redo,
        syncShapeInStorage,
        deleteShapeFromStorage,
      })
    })

    window.addEventListener("resize", () => {
      handleResize({ canvas: fabricRef.current })
    })

    canvas.on("mouse:wheel", (options) => {
      handleCanvasZoom({ options, canvas })
    })

    canvas.on("selection:created", (options) => {
      setOpenEditor(true)
      handleCanvasSelectionCreated({
        options,
        isEditingRef,
        setElementAttributes,
      })
    })

    canvas?.on("object:moving", (options) => {
      handleCanvasObjectMoving({
        options,
      })
    })

    canvas.on("path:created", (options) => {
      handlePathCreated({
        options,
        syncShapeInStorage,
      })
    })

    return () => {
      canvas.dispose()
    }
  }, [])

  useEffect(() => {
    if (fabricRef.current && theme) {
      updateShapesColor({
        canvas: fabricRef.current,
        theme,
        syncShapeInStorage,
      })
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key === "d") {
        setTheme(theme === "light" ? "dark" : "light")
      }

      if (e.ctrlKey && e.key === "o") {
        setDialogOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [theme, localStorage.getItem("theme")])

  useEffect(() => {
    selectedShapeRef.current = activeElement
  }, [activeElement])

  useEffect(() => {
    renderCanvas({
      fabricRef,
      canvasObjects,
      activeObjectRef,
      theme: theme as string,
      elementAttributes,
    })
  }, [canvasObjects])

  const deleteAllShapes = useMutation(({ storage }) => {
    const canvasObjects = storage.get("canvasObjects")

    if (!canvasObjects || canvasObjects.size === 0) return

    // @ts-ignore
    for (const [key, value] of canvasObjects.entries()) {
      canvasObjects.delete(key)
    }

    return canvasObjects.size === 0
  }, [])

  const deleteShapeFromStorage = useMutation(
    ({ storage }, objectId: string) => {
      const canvasObjects = storage.get("canvasObjects")

      canvasObjects.delete(objectId)
    },
    []
  )

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Delete") {
        handleDelete(fabricRef.current as any, deleteShapeFromStorage)
        setActiveElement("select")
        setActiveTool("Select")
      }
    }

    window.addEventListener("keydown", keyDownHandler)

    return () => {
      window.removeEventListener("keydown", keyDownHandler)
    }
  }, [])

  const handleActive = (el: ToolItemsProps, e?: KeyboardEvent) => {
    setActiveElement(el.value)

    switch (el.value) {
      case "reset":
        deleteAllShapes()
        fabricRef.current?.clear()
        setActiveElement("select")
        setActiveTool("Select")
        break
      case "delete":
        handleDelete(fabricRef.current as any, deleteShapeFromStorage)
        setActiveElement("select")
        setActiveTool("Select")
        break
      case "image":
        imageInputRef.current?.click()
        isDrawing.current = false

        if (fabricRef.current) {
          fabricRef.current.isDrawingMode = false
        }
        break

      default:
        break
    }
  }

  return (
    <main className="h-screen overflow-hidden">
      <Toolbar
        handleActive={handleActive}
        setActiveTool={setActiveTool}
        activeTool={activeTool}
        imageInputRef={imageInputRef}
        handleImageUpload={(e: any) => {
          e.stopPropagation()

          handleImageUpload({
            file: e.target.files[0],
            canvas: fabricRef as any,
            shapeRef,
            syncShapeInStorage,
          })
        }}
        elementAttributes={elementAttributes}
        setElementAttributes={setElementAttributes}
        fabricRef={fabricRef}
        isEditingRef={isEditingRef}
        activeObjectRef={activeObjectRef}
        syncShapeInStorage={syncShapeInStorage}
        setDialogOpen={setDialogOpen}
        setBoardBg={setBoardBg}
        boardBg={boardBg}
        openEditor={openEditor}
        setOpenEditor={setOpenEditor}
      />
      {dialogOpen && (
        <Dialog setDialogOpen={setDialogOpen} dialogOpen={dialogOpen} />
      )}
      <Live
        canvasRef={canvasRef}
        toolSelected={activeElement}
        boardBg={boardBg}
      />
    </main>
  )
}

export default Dashboard
