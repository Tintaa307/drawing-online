"use client"

import { ReactNode, useEffect } from "react"
import { RoomProvider } from "../../../liveblocks.config"
import { ClientSideSuspense } from "@liveblocks/react"
import Loader from "@/components/loader/Loader"
import { LiveMap } from "@liveblocks/client"
import { v4 } from "uuid"
import { useSearchParams } from "next/navigation"

export function Room({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams()

  return (
    <RoomProvider
      id={`my-room:${searchParams.get("my-room") || v4()}`}
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
