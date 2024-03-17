import React, { useCallback, useEffect, useState } from "react"
import LiveCursors from "./cursor/LiveCursors"
import { useMyPresence, useOthers } from "../../../liveblocks.config"
import CursorChat from "./cursor/CursorChat"
import { CursorMode, CursorState } from "@/types/type"
import { motion } from "framer-motion"

type Props = {
  canvasRef: React.RefObject<HTMLCanvasElement> | null
  toolSelected: string
  boardBg: string
}

const Live = ({ canvasRef, toolSelected, boardBg }: Props) => {
  const others = useOthers()
  const [{ cursor }, updateMyPresence] = useMyPresence() as any
  const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden,
  })

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    e.preventDefault()

    const x = e.clientX - e.currentTarget.getBoundingClientRect().x
    const y = e.clientY - e.currentTarget.getBoundingClientRect().y

    updateMyPresence({ cursor: { x, y } })
  }, [])

  const handlePointerLeave = useCallback((e: React.PointerEvent) => {
    setCursorState({ mode: CursorMode.Hidden })

    updateMyPresence({ cursor: null, message: null })
  }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const x = e.clientX - e.currentTarget.getBoundingClientRect().x
    const y = e.clientY - e.currentTarget.getBoundingClientRect().y

    updateMyPresence({ cursor: { x, y } })
  }, [])

  useEffect(() => {
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "Enter" && e.ctrlKey) {
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: "",
        })
      } else if (e.key === "Escape") {
        updateMyPresence({ message: null })
        setCursorState({ mode: CursorMode.Hidden })
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault()
      }
    }

    window.addEventListener("keyup", onKeyUp)
    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keyup", onKeyUp)
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [updateMyPresence])

  return (
    <div
      id="canvas"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      className="relative w-full h-full bg-white dark:bg-[#13131A]"
    >
      <canvas ref={canvasRef} style={{ backgroundColor: boardBg }} />
      {cursor && (
        <CursorChat
          cursor={cursor}
          cursorState={cursorState}
          setCursorState={setCursorState}
          updateMyPresence={updateMyPresence}
        />
      )}
      <LiveCursors others={others} />
    </div>
  )
}

export default Live
