"use client"

import React, { useRef, useEffect, useState } from "react"
import Live from "@/components/live/Live"
import { fabric } from "fabric"
import {
  handleCanvasMouseDown,
  handleCanvasMouseUp,
  handleCanvasObjectModified,
  handleCanvasSelectionCreated,
  handleCanvaseMouseMove,
  handleResize,
  initializeFabric,
  renderCanvas,
} from "@/lib/canvas"
import Toolbar, { ToolItemsProps } from "@/components/toolbar/Toolbar"
import { useMutation, useStorage } from "../../../liveblocks.config"
import { defaultNavElement } from "@/constants"
import { handleDelete } from "@/lib/key-events"

// // draw and clean the canvas
// useEffect(() => {
//   const canvas = canvasRef.current
//   const context = canvas?.getContext("2d")

//   if (!canvas || !context) return

//   if (toolSelected === "Clear all") {
//     localStorage.removeItem("drawing")
//     context.clearRect(0, 0, canvas.width, canvas.height)
//   }

//   const saveDrawing = () => {
//     localStorage.setItem("drawing", canvas.toDataURL())
//   }

//   const restoreDrawing = () => {
//     const img = new Image()
//     img.onload = () => {
//       context.drawImage(img, 0, 0)
//     }
//     img.src = localStorage.getItem("drawing") as string
//   }

//   if (localStorage.getItem("drawing")) {
//     requestAnimationFrame(restoreDrawing)
//   }

//   if (toolSelected === "Pencil") {
//     canvas.width = window.innerWidth
//     canvas.height = window.innerHeight

//     context.lineCap = "round"
//     context.strokeStyle = "#303030"
//     context.lineWidth = 4

//     let prevX = 0
//     let prevY = 0

//     const startDrawing = (event: MouseEvent) => {
//       setIsDrawing(true)
//       const { clientX, clientY } = event
//       prevX = clientX - canvas.offsetLeft
//       prevY = clientY - canvas.offsetTop
//       context.beginPath()
//       context.moveTo(prevX, prevY)
//     }

//     const draw = (event: MouseEvent) => {
//       if (!isDrawing) return
//       const { clientX, clientY } = event
//       const currentX = clientX - canvas.offsetLeft
//       const currentY = clientY - canvas.offsetTop
//       context.lineTo(currentX, currentY)
//       context.stroke()
//       prevX = currentX
//       prevY = currentY
//     }

//     const stopDrawing = () => {
//       setIsDrawing(false)
//       saveDrawing()
//     }

//     canvas.addEventListener("mousedown", startDrawing)
//     canvas.addEventListener("mousemove", draw)
//     canvas.addEventListener("mouseup", stopDrawing)

//     return () => {
//       canvas.removeEventListener("mousedown", startDrawing)
//       canvas.removeEventListener("mousemove", draw)
//       canvas.removeEventListener("mouseup", stopDrawing)
//     }
//   }
// }, [isDrawing, toolSelected])
// const [isDrawing, setIsDrawing] = useState(false)

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
