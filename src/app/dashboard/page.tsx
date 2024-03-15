"use client"

import React, { useRef, useEffect, useState } from "react"
import Live from "@/components/live/Live"
import { fabric } from "fabric"
import {
  handleCanvasMouseDown,
  handleCanvasMouseUp,
  handleCanvasObjectModified,
  handleCanvaseMouseMove,
  handleResize,
  initializeFabric,
  renderCanvas,
} from "@/lib/canvas"
import Toolbar, { ToolItemsProps } from "@/components/toolbar/Toolbar"
import { useMutation, useStorage } from "../../../liveblocks.config"
import { handleDelete } from "@/lib/key-events"

const Dashboard = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<fabric.Canvas | null>(null)
  const isDrawing = useRef(false)
  const shapeRef = useRef<fabric.Object | null>(null)
  const [activeElement, setActiveElement] = useState<string>("")
  const selectedShapeRef = useRef<string | null>(null)
  const activeObjectRef = useRef<fabric.Object | null>(null)
  const [activeTool, setActiveTool] = useState("Select")

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

    canvas.on("mouse:down", (options) => {
      handleCanvasMouseDown({
        options,
        canvas,
        selectedShapeRef,
        isDrawing,
        shapeRef,
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

    window.addEventListener("resize", () => {
      handleResize({ canvas })
    })

    return () => {
      canvas.dispose()
    }
  }, [])

  useEffect(() => {
    selectedShapeRef.current = activeElement
  }, [activeElement])

  useEffect(() => {
    renderCanvas({
      fabricRef,
      canvasObjects,
      activeObjectRef,
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

  const handleActive = (el: ToolItemsProps) => (event: KeyboardEvent) => {
    // if (event.key === "Backspace" || event.key === "Delete") {
    //   setActiveElement("delete")
    // }
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
      />
      <Live canvasRef={canvasRef} toolSelected={activeElement} />
    </main>
  )
}

export default Dashboard
