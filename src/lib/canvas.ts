import { fabric } from "fabric"
import { v4 as uuid4 } from "uuid"

import {
  CanvasMouseDown,
  CanvasMouseMove,
  CanvasMouseUp,
  CanvasObjectModified,
  CanvasObjectScaling,
  CanvasPathCreated,
  CanvasSelectionCreated,
  RenderCanvas,
} from "@/types/type"
import { defaultNavElement } from "@/constants"
import { createSpecificShape } from "./shapes"

// initialize fabric canvas
export const initializeFabric = ({
  fabricRef,
  canvasRef,
}: {
  fabricRef: React.MutableRefObject<fabric.Canvas | null>
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>
}) => {
  // get canvas element
  const canvasElement = document.getElementById("canvas")

  // create fabric canvas
  const canvas = new fabric.Canvas(canvasRef.current, {
    width: canvasElement?.clientWidth,
    height: canvasElement?.clientHeight,
  })

  // set canvas reference to fabricRef so we can use it later anywhere outside canvas listener
  fabricRef.current = canvas

  return canvas
}

// instantiate creation of custom fabric object/shape and add it to canvas
export const handleCanvasMouseDown = ({
  options,
  canvas,
  selectedShapeRef,
  isDrawing,
  shapeRef,
  theme,
}: CanvasMouseDown) => {
  // get pointer coordinates
  const pointer = canvas.getPointer(options.e)

  const target = canvas.findTarget(options.e, false)

  // set canvas drawing mode to false
  canvas.isDrawingMode = false

  // if selected shape is freeform, set drawing mode to true and return
  if (selectedShapeRef.current === "freeform") {
    isDrawing.current = true
    canvas.isDrawingMode = true
    canvas.freeDrawingBrush.width = 5
    canvas.freeDrawingBrush.color = theme === "dark" ? "#fff" : "#141414"
    return
  }

  canvas.isDrawingMode = false

  // if target is the selected shape or active selection, set isDrawing to false
  if (
    target &&
    (target.type === selectedShapeRef.current ||
      target.type === "activeSelection")
  ) {
    isDrawing.current = false

    // set active object to target
    canvas.setActiveObject(target)

    target.setCoords()
  } else {
    isDrawing.current = true

    // create custom fabric object/shape and set it to shapeRef
    shapeRef.current = createSpecificShape(
      selectedShapeRef.current,
      pointer as any,
      theme
    )

    // if shapeRef is not null, add it to canvas
    if (shapeRef.current) {
      canvas.add(shapeRef.current)
    }
  }
}

// handle mouse move event on canvas to draw shapes with different dimensions
export const handleCanvaseMouseMove = ({
  options,
  canvas,
  isDrawing,
  selectedShapeRef,
  shapeRef,
  syncShapeInStorage,
}: CanvasMouseMove) => {
  // if selected shape is freeform, return
  if (!isDrawing.current) return
  if (selectedShapeRef.current === "freeform") return

  canvas.isDrawingMode = false

  // get pointer coordinates
  const pointer = canvas.getPointer(options.e)

  // depending on the selected shape, set the dimensions of the shape stored in shapeRef in previous step of handelCanvasMouseDown
  // calculate shape dimensions based on pointer coordinates
  switch (selectedShapeRef?.current) {
    case "rectangle":
      shapeRef.current?.set({
        width: pointer.x - (shapeRef.current?.left || 0),
        height: pointer.y - (shapeRef.current?.top || 0),
      })
      break

    case "circle":
      shapeRef.current.set({
        radius: Math.abs(pointer.x - (shapeRef.current?.left || 0)) / 2,
      })
      break

    case "triangle":
      shapeRef.current?.set({
        width: pointer.x - (shapeRef.current?.left || 0),
        height: pointer.y - (shapeRef.current?.top || 0),
      })
      break

    case "line":
      shapeRef.current?.set({
        x2: pointer.x,
        y2: pointer.y,
      })
      break

    case "image":
      shapeRef.current?.set({
        width: pointer.x - (shapeRef.current?.left || 0),
        height: pointer.y - (shapeRef.current?.top || 0),
      })
      break
    case "group":
      shapeRef.current?.item(0).set({
        x2: pointer.x,
        y2: pointer.y,
      })

      shapeRef.current?.item(1).set({
        left: pointer.x + 17,
        top: pointer.y + 7,
      })
      break

    default:
      break
  }

  // render objects on canvas
  // renderAll: http://fabricjs.com/docs/fabric.Canvas.html#renderAll
  canvas.renderAll()

  // sync shape in storage
  if (shapeRef.current?.objectId) {
    syncShapeInStorage(shapeRef.current)
  }
}

// handle mouse up event on canvas to stop drawing shapes
export const handleCanvasMouseUp = ({
  canvas,
  isDrawing,
  shapeRef,
  activeObjectRef,
  selectedShapeRef,
  syncShapeInStorage,
  setActiveElement,
}: CanvasMouseUp) => {
  isDrawing.current = false
  if (selectedShapeRef.current === "freeform") return

  // sync shape in storage as drawing is stopped
  syncShapeInStorage(shapeRef.current)

  // set everything to null
  shapeRef.current = null
  activeObjectRef.current = null
  selectedShapeRef.current = null

  // if canvas is not in drawing mode, set active element to default nav element after 700ms
  if (!canvas.isDrawingMode) {
    setTimeout(() => {
      setActiveElement(defaultNavElement)
    }, 700)
  }
}

// update shape in storage when object is modified
export const handleCanvasObjectModified = ({
  options,
  syncShapeInStorage,
}: CanvasObjectModified) => {
  const target = options.target
  if (!target) return

  if (target?.type == "activeSelection") {
    // fix this
  } else {
    syncShapeInStorage(target)
  }
}

// update shape in storage when path is created when in freeform mode
export const handlePathCreated = ({
  options,
  theme,
  syncShapeInStorage,
}: CanvasPathCreated) => {
  // get path object
  const path = options.path
  if (!path) return

  // set unique id to path object
  path.set({
    objectId: uuid4(),
  })

  // sync shape in storage
  syncShapeInStorage(path)
}

// check how object is moving on canvas and restrict it to canvas boundaries
export const handleCanvasObjectMoving = ({
  options,
}: {
  options: fabric.IEvent
}) => {
  // get target object which is moving
  const target = options.target as fabric.Object

  // target.canvas is the canvas on which the object is moving
  const canvas = target.canvas as fabric.Canvas

  // set coordinates of target object
  target.setCoords()

  // restrict object to canvas boundaries (horizontal)
  if (target && target.left) {
    target.left = Math.max(
      0,
      Math.min(
        target.left,
        (canvas.width || 0) - (target.getScaledWidth() || target.width || 0)
      )
    )
  }

  // restrict object to canvas boundaries (vertical)
  if (target && target.top) {
    target.top = Math.max(
      0,
      Math.min(
        target.top,
        (canvas.height || 0) - (target.getScaledHeight() || target.height || 0)
      )
    )
  }
}

// set element attributes when element is selected
export const handleCanvasSelectionCreated = ({
  options,
  isEditingRef,
  setElementAttributes,
}: CanvasSelectionCreated) => {
  // if user is editing manually, return
  if (isEditingRef.current) return

  // if no element is selected, return
  if (!options?.selected) return

  // get the selected element
  const selectedElements = options?.selected as fabric.Object[]

  selectedElements.forEach((element) => {
    const selectedElement = element as fabric.Object

    setElementAttributes({
      fill: selectedElement?.fill?.toString() || "",
      stroke: selectedElement?.stroke || "",
      // @ts-ignore
      fontSize: selectedElement?.fontSize || "",
      // @ts-ignore
      fontFamily: selectedElement?.fontFamily || "",
      // @ts-ignore
      fontWeight: selectedElement?.fontWeight || "",
      // @ts-ignore
      borderWidth: selectedElement?.strokeWidth || "",
      // @ts-ignore
      rx: selectedElement?.rx || "",
      // @ts-ignore
      ry: selectedElement?.ry || "",
    })
  })
}

// update element attributes when element is scaled
export const handleCanvasObjectScaling = ({
  options,
  setElementAttributes,
}: CanvasObjectScaling) => {
  const selectedElement = options.target

  // calculate scaled dimensions of the object
  const scaledWidth = selectedElement?.scaleX
    ? selectedElement?.width! * selectedElement?.scaleX
    : selectedElement?.width

  const scaledHeight = selectedElement?.scaleY
    ? selectedElement?.height! * selectedElement?.scaleY
    : selectedElement?.height

  setElementAttributes((prev) => ({
    ...prev,
    width: scaledWidth?.toFixed(0).toString() || "",
    height: scaledHeight?.toFixed(0).toString() || "",
    strokeWidth: 3,
  }))
}

// render canvas objects coming from storage on canvas
export const renderCanvas = ({
  fabricRef,
  canvasObjects,
  activeObjectRef,
  theme,
  elementAttributes,
}: RenderCanvas) => {
  // clear canvas
  fabricRef.current?.clear()

  // render all objects on canvas
  Array.from(canvasObjects, ([objectId, objectData]) => {
    /**
     * enlivenObjects() is used to render objects on canvas.
     * It takes two arguments:
     * 1. objectData: object data to render on canvas
     * 2. callback: callback function to execute after rendering objects
     * on canvas
     *
     * enlivenObjects: http://fabricjs.com/docs/fabric.util.html#.enlivenObjectEnlivables
     */
    fabric.util.enlivenObjects(
      [objectData],
      (enlivenedObjects: fabric.Object[]) => {
        enlivenedObjects.forEach((enlivenedObj) => {
          // if element is active, keep it in active state so that it can be edited further
          if (activeObjectRef.current?.objectId === objectId) {
            fabricRef.current?.setActiveObject(enlivenedObj)
          }

          // verify the theme and set the stroke color of the object only if the object did not have previus a stroke color
          if (
            enlivenedObj.stroke === "#141414" ||
            enlivenedObj.stroke === "#fff" ||
            enlivenedObj.stroke === "#d1d1d1"
          ) {
            switch (enlivenedObj.type) {
              case "rect":
                enlivenedObj.set({
                  stroke: theme === "light" ? "#141414" : "#fff",
                })
                break
              case "circle":
                enlivenedObj.set({
                  stroke: theme === "light" ? "#141414" : "#fff",
                })
                break
              case "triangle":
                enlivenedObj.set({
                  stroke: theme === "light" ? "#141414" : "#fff",
                })
                break
              case "line":
                enlivenedObj.set({
                  stroke: theme === "light" ? "#141414" : "#fff",
                })
                break
              case "i-text":
                enlivenedObj.set({
                  fill: theme === "light" ? "#141414" : "#fff",
                })
                break
              case "path":
                enlivenedObj.set({
                  stroke: theme === "light" ? "#141414" : "#fff",
                })
                break
              case "group":
                enlivenedObj.set({
                  stroke: theme === "light" ? "#141414" : "#fff",
                  fill: theme === "light" ? "#141414" : "#fff",
                })
                break

              default:
                break
            }
          }

          // add object to canvas
          fabricRef.current?.add(enlivenedObj)
        })
      },
      /**
       * specify namespace of the object for fabric to render it on canvas
       * A namespace is a string that is used to identify the type of
       * object.
       *
       * Fabric Namespace: http://fabricjs.com/docs/fabric.html
       */
      "fabric"
    )
  })

  fabricRef.current?.renderAll()
}

// resize canvas dimensions on window resize
export const handleResize = ({ canvas }: { canvas: fabric.Canvas | null }) => {
  const canvasElement = document.getElementById("canvas")
  if (!canvasElement) return

  if (!canvas) return

  canvas.setDimensions({
    width: canvasElement.clientWidth,
    height: canvasElement.clientHeight,
  })
}

// zoom canvas on mouse scroll
export const handleCanvasZoom = ({
  options,
  canvas,
}: {
  options: fabric.IEvent & { e: WheelEvent }
  canvas: fabric.Canvas
}) => {
  const delta = options.e?.deltaY
  let zoom = canvas.getZoom()

  // allow zooming to min 20% and max 100%
  const minZoom = 0.2
  const maxZoom = 1
  const zoomStep = 0.001

  // calculate zoom based on mouse scroll wheel with min and max zoom
  zoom = Math.min(Math.max(minZoom, zoom + delta * zoomStep), maxZoom)

  // set zoom to canvas
  canvas.zoomToPoint({ x: options.e.offsetX, y: options.e.offsetY }, zoom)

  options.e.preventDefault()
  options.e.stopPropagation()
}
