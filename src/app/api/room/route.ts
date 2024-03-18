import { NextResponse } from "next/server"
import { v4 } from "uuid"

export async function POST(req: Request) {
  if (req.method !== "POST")
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 })

  try {
    const { roomId } = await req.json()
    let newRoomId = ""

    if (!roomId)
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      )

    newRoomId = v4()

    return NextResponse.json({ roomId: newRoomId })
  } catch (error) {
    return NextResponse.json({ error: "something went wrong" }, { status: 500 })
  }
}
