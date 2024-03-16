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
    strokeWidth: 2.5,
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
    strokeWidth: 2.5,
    objectId: uuidv4(),
  } as CustomFabricObject<fabric.Triangle>)
}

export const createCircle = (pointer: PointerEvent, theme: string) => {
  return new fabric.Circle({
    left: pointer.x,
    top: pointer.y,
    radius: 100,
    strokeWidth: 2.5,
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
      strokeWidth: 2.5,
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

export const createPolygon = (pointer: PointerEvent, theme: string) => {
  return new fabric.Polygon(
    [
      { x: 250, y: 0 },
      { x: 500, y: 500 },
      { x: 0, y: 500 },
    ],
    {
      left: pointer.x,
      top: pointer.y,
      fill: "transparent",
      stroke: theme === "light" ? "#141414" : "#f2f2f2",
      strokeWidth: 2.5,
      objectId: uuidv4(),
    } as CustomFabricObject<fabric.Polygon>
  )
}

export const createPolyLine = (pointer: PointerEvent, theme: string) => {
  return new fabric.Polyline(
    [
      { x: 250, y: 0 },
      { x: 500, y: 500 },
      { x: 0, y: 500 },
    ],
    {
      left: pointer.x,
      top: pointer.y,
      fill: "transparent",
      stroke: theme === "light" ? "#141414" : "#f2f2f2",
      strokeWidth: 2.5,
      objectId: uuidv4(),
    } as CustomFabricObject<fabric.Polyline>
  )
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

    case "polygon":
      createPolygon(pointer, theme)

    case "polyline":
      createPolyLine(pointer, theme)

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

  // if  property is width or height, set the scale of the selected element
  if (property === "width") {
    selectedElement.set("scaleX", 1)
    selectedElement.set("width", value)
  } else if (property === "height") {
    selectedElement.set("scaleY", 1)
    selectedElement.set("height", value)
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
    if (obj instanceof fabric.Rect) {
      obj.set({
        stroke: theme === "light" ? "#141414" : "#fff",
      })
    }

    if (obj instanceof fabric.Triangle) {
      obj.set({
        stroke: theme === "light" ? "#141414" : "#fff",
      })
    }

    if (obj instanceof fabric.Circle) {
      obj.set({
        stroke: theme === "light" ? "#141414" : "#fff",
      })
    }

    if (obj instanceof fabric.Line) {
      obj.set({
        stroke: theme === "light" ? "#141414" : "#fff",
      })
    }

    if (obj instanceof fabric.IText) {
      obj.set({
        fill: theme === "light" ? "#1e1e1e" : "#fff",
      })
    }

    obj.setCoords()
    syncShapeInStorage(obj)
  })

  canvas.requestRenderAll()
}
