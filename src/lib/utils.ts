import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import jsPDF from "jspdf"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const adjectives = [
  "Happy",
  "Creative",
  "Energetic",
  "Lively",
  "Dynamic",
  "Radiant",
  "Joyful",
  "Vibrant",
  "Cheerful",
  "Sunny",
  "Sparkling",
  "Bright",
  "Shining",
]

const animals = [
  "Dolphin",
  "Tiger",
  "Elephant",
  "Penguin",
  "Kangaroo",
  "Panther",
  "Lion",
  "Cheetah",
  "Giraffe",
  "Hippopotamus",
  "Monkey",
  "Panda",
  "Crocodile",
]

export function generateRandomName(): string {
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)]
  const randomAnimal = animals[Math.floor(Math.random() * animals.length)]

  return `${randomAdjective} ${randomAnimal}`
}

export const exportToPdf = () => {
  const canvas = document.querySelector("canvas")

  if (!canvas) return

  // use jspdf
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [canvas.width, canvas.height],
  })

  // get the canvas data url
  const data = canvas.toDataURL()

  // add the image to the pdf
  doc.setFillColor(0, 0, 0, 0.4)
  doc.addImage(data, "jpg", 0, 0, canvas.width, canvas.height)

  // download the pdf
  doc.save("drawing-online.pdf")
}
