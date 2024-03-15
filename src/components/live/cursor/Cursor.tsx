import React from "react"
import CursorSVG from "../../../../public/assets/CursorSVG"

type Props = {
  color: string
  x: number
  y: number
  message: string
}

const Cursor = ({ color, x, y, message }: Props) => {
  return (
    <div
      className="pointer-events-none absolute top-0 left-0 z-50"
      style={{
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
    >
      <CursorSVG color={color} />

      {message && (
        <div
          className="absolute top-5 left-2 px-4 py-2 text-sm leading-relaxed text-white rounded-xl"
          style={{ backgroundColor: color }}
        >
          <p className="text-white whitespace-nowrap text-sm leading-relaxed">
            {message}
          </p>
        </div>
      )}
    </div>
  )
}

export default Cursor
