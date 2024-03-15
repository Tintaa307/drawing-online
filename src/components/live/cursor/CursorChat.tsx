import { CursorChatProps, CursorMode } from "@/types/type"
import React from "react"
import CursorSVG from "../../../../public/assets/CursorSVG"

const CursorChat = ({
  cursor,
  cursorState,
  setCursorState,
  updateMyPresence,
}: CursorChatProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateMyPresence({ message: e.currentTarget.value })
    setCursorState({
      mode: CursorMode.Chat,
      previousMessage: null,
      message: e.currentTarget.value,
    })
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setCursorState({
        mode: CursorMode.Chat,
        // @ts-ignore
        previousMessage: cursorState.message,
        message: "",
      })
    } else if (e.key === "Escape") {
      setCursorState({
        mode: CursorMode.Hidden,
      })
    }
  }

  return (
    <div
      className="absolute top-0 left-0 z-30"
      style={{
        transform: `translateX(${cursor.x}px) translateY(${cursor.y}px)`,
      }}
    >
      {cursorState.mode === CursorMode.Chat && (
        <>
          <CursorSVG color="#000" />
          <div className="absolute top-5 left-2 bg-blue-500 px-4 py-2 text-sm leading-relaxed text-white rounded-xl">
            {cursorState.previousMessage && (
              <small>{cursorState.previousMessage}</small>
            )}
            <input
              className="relative z-10 w-60 border-none bg-transparent text-white placeholder-blue-300 outline-none"
              autoFocus
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={cursorState.previousMessage ? "" : "Type a message"}
              maxLength={50}
            />
          </div>
        </>
      )}
    </div>
  )
}

export default CursorChat
