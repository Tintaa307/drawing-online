import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

const usePermission = create(
  persist(
    (set: any) => ({
      roomId: "",
      setRoomId: (roomId: string) => set({ roomId }),
      isSharing: false,
      setSharing: (isSharing: boolean) => set({ isSharing }),
    }),
    {
      name: "room-id",
      storage: createJSONStorage(() => localStorage),
    }
  )
)

export default usePermission
