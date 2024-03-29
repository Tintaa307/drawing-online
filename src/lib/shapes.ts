import { fabric } from "fabric"
import { v4 as uuidv4 } from "uuid"

import {
  CustomFabricObject,
  ElementDirection,
  ImageUpload,
  ModifyShape,
} from "@/types/type"

export const createRectangle = (pointer: PointerEvent, theme: string) => {
  const rect = new fabric.Rect({
    left: pointer.x,
    top: pointer.y,
    width: 100,
    height: 100,
    fill: "transparent",
    stroke: theme === "light" ? "#141414" : "#f2f2f2",
    strokeWidth: 3,
    objectId: uuidv4(),
  } as CustomFabricObject<fabric.Rect>)

  rect.set({
    rx: 10,
    ry: 10,
    originX: "left",
    originY: "top",
    objectCaching: false,
    dirty: true,
  })

  return rect
}

export const createTriangle = (pointer: PointerEvent, theme: string) => {
  return new fabric.Triangle({
    left: pointer.x,
    top: pointer.y,
    width: 100,
    height: 100,
    fill: "transparent",
    stroke: theme === "light" ? "#141414" : "#f2f2f2",
    strokeWidth: 3,
    objectId: uuidv4(),
  } as CustomFabricObject<fabric.Triangle>)
}

export const createCircle = (pointer: PointerEvent, theme: string) => {
  return new fabric.Circle({
    left: pointer.x,
    top: pointer.y,
    radius: 100,
    strokeWidth: 3,
    fill: "transparent",
    stroke: theme === "light" ? "#141414" : "#f2f2f2",
    objectId: uuidv4(),
  } as any)
}

export const createLine = (pointer: PointerEvent, theme: string) => {
  return new fabric.Line(
    [pointer.x, pointer.y, pointer.x + 100, pointer.y + 100],
    {
      stroke: theme === "light" ? "#141414" : "#f2f2f2",
      strokeWidth: 3,
      objectId: uuidv4(),
    } as CustomFabricObject<fabric.Line>
  )
}

export const createText = (
  pointer: PointerEvent,
  theme: string,
  text: string
) => {
  return new fabric.IText(text, {
    left: pointer.x,
    top: pointer.y,
    fill: theme === "light" ? "#1e1e1e" : "#f2f2f2",
    fontFamily: "Rubik",
    fontSize: 36,
    fontWeight: "400",
    objectId: uuidv4(),
  } as fabric.ITextOptions)
}

export const createArrow = (pointer: PointerEvent, theme: string) => {
  const arrow = new fabric.Triangle({
    width: 15,
    height: 15,
    fill: "#fff",
    stroke: theme === "light" ? "#141414" : "#f2f2f2",
    strokeWidth: 2,
    angle: 140,
    selectable: false,
    objectId: uuidv4(),
  } as CustomFabricObject<fabric.Triangle>)
  const line = new fabric.Line(
    [pointer.x, pointer.y, pointer.x + 100, pointer.y + 100],
    {
      stroke: theme === "light" ? "#141414" : "#f2f2f2",
      strokeWidth: 2,
      objectId: uuidv4(),
    } as CustomFabricObject<fabric.Line>
  )
  arrow.set({
    left: line.x2! + 17,
    top: line.y2! + 7,
  })
  return new fabric.Group([line, arrow], {
    left: pointer.x,
    top: pointer.y,
    objectId: uuidv4(),
  } as CustomFabricObject<fabric.Group>)
}

export const createSpecificShape = (
  shapeType: string,
  pointer: PointerEvent,
  theme: string
) => {
  switch (shapeType) {
    case "rectangle":
      return createRectangle(pointer, theme)

    case "triangle":
      return createTriangle(pointer, theme)

    case "circle":
      return createCircle(pointer, theme)

    case "line":
      return createLine(pointer, theme)

    case "text":
      return createText(pointer, theme, "Write something here...")

    case "group":
      return createArrow(pointer, theme)

    default:
      return null
  }
}

export const handleImageUpload = ({
  file,
  canvas,
  shapeRef,
  syncShapeInStorage,
}: ImageUpload) => {
  const reader = new FileReader()

  reader.onload = () => {
    fabric.Image.fromURL(reader.result as string, (img) => {
      img.scaleToWidth(200)
      img.scaleToHeight(200)

      canvas.current.add(img)

      // @ts-ignore
      img.objectId = uuidv4()

      shapeRef.current = img

      syncShapeInStorage(img)
      canvas.current.requestRenderAll()
    })
  }

  reader.readAsDataURL(file)
}

export const modifyShape = ({
  canvas,
  property,
  value,
  activeObjectRef,
  syncShapeInStorage,
}: ModifyShape) => {
  const selectedElement = canvas.getActiveObject()

  if (!selectedElement || selectedElement?.type === "activeSelection") return

  if (property === "fill") {
    selectedElement.set("fill", value)
  } else if (property === "stroke") {
    selectedElement.set("stroke", value)
  } else if (property === "draw") {
    selectedElement.set("stroke", value)
  } else if (property === "strokeWidth") {
    selectedElement.set("strokeWidth", Number(value))
  } else {
    if (selectedElement[property as keyof object] === value) return
    selectedElement.set(property as keyof object, value)
  }

  // set selectedElement to activeObjectRef
  activeObjectRef.current = selectedElement

  syncShapeInStorage(selectedElement)
}

export const bringElement = ({
  canvas,
  direction,
  syncShapeInStorage,
}: ElementDirection) => {
  if (!canvas) return

  // get the selected element. If there is no selected element or there are more than one selected element, return
  const selectedElement = canvas.getActiveObject()

  if (!selectedElement || selectedElement?.type === "activeSelection") return

  // bring the selected element to the front
  if (direction === "front") {
    canvas.bringToFront(selectedElement)
  } else if (direction === "back") {
    canvas.sendToBack(selectedElement)
  }

  // canvas.renderAll();
  syncShapeInStorage(selectedElement)

  // re-render all objects on the canvas
}

export const updateShapesColor = ({
  canvas,
  theme,
  syncShapeInStorage,
}: {
  canvas: fabric.Canvas
  theme: string
  syncShapeInStorage: (shape: fabric.Object) => void
}) => {
  canvas.getObjects().forEach((obj) => {
    if (obj.stroke === "#141414" || obj.stroke === "#fff") {
      switch (obj.type) {
        case "rect":
          obj.set({
            stroke: theme === "light" ? "#141414" : "#fff",
          })
          break
        case "triangle":
          obj.set({
            stroke: theme === "light" ? "#141414" : "#fff",
          })
          break
        case "circle":
          obj.set({
            stroke: theme === "light" ? "#141414" : "#fff",
          })
          break
        case "line":
          obj.set({
            stroke: theme === "light" ? "#141414" : "#fff",
          })
          break
        case "i-text":
          obj.set({
            fill: theme === "light" ? "#1e1e1e" : "#fff",
          })
          break

        case "group":
          obj.set({
            stroke: theme === "light" ? "#141414" : "#fff",
          })
          break

        default:
          break
      }
    }

    obj.setCoords()
    syncShapeInStorage(obj)
  })

  canvas.requestRenderAll()
}
