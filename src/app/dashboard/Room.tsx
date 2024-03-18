"use client"

import { ReactNode, useEffect, useState } from "react"
import { RoomProvider } from "../../../liveblocks.config"
import { ClientSideSuspense } from "@liveblocks/react"
import Loader from "@/components/loader/Loader"
import { LiveMap } from "@liveblocks/client"
import { v4 } from "uuid"
import { useSearchParams } from "next/navigation"
import usePermission from "@/hooks/usePermission"

export function Room({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams()
  const [isSharing, setIsSharing] = useState(false)

  useEffect(() => {
    const values = localStorage.getItem("room-id")!
    const isSharing = JSON.parse(values)
    setIsSharing(isSharing.state.isSharing)
  }, [localStorage.getItem("room-id")])

  useEffect(() => {
    console.log("isSharing", isSharing)
  }, [isSharing])

  return (
    <RoomProvider
      id={`my-room:${searchParams.get("my-room")}`}
      initialPresence={{
        cursor: null,
        cursorColor: null,
        editingText: null,
      }}
      initialStorage={{
        canvasObjects: new LiveMap(),
      }}
    >
      <ClientSideSuspense fallback={<Loader />}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  )
}
