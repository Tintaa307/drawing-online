import { IconClick, IconWand } from "@tabler/icons-react"
import React from "react"
import Link from "next/link"
import { v4 as UUIDV4 } from "uuid"

// million-ignore

const Landing = () => {
  return (
    <main className="w-full h-screen bg-hero-pattern bg-no-repeat bg-center">
      <div className="w-full h-full flex items-center justify-center flex-col">
        <article className="w-full h-max flex items-center justify-center flex-col gap-4 text-center">
          <div className="w-max h-max flex items-center justify-center px-4 py-2 flex-row gap-1 border-[1px] border-primary/30 rounded-full bg-bg_color animate-fade-in-y">
            <IconWand size={17} className="text-primary" />
            <small className="text-white/80">
              Your realtime time colaborative app
            </small>
          </div>
          <h1 className="text-white text-6xl font-bold leading-snug">
            Unlock your creativity and
            <br /> Collaborate in{" "}
            <span className="text-primary">Real-Time</span>
          </h1>
          <p className="text-white/80 text-base font-normal w-1/3">
            Welcome to Drawing Online - Where Every Stroke Tells a Story, and
            Every Line is a Journey. Get started by creating a new drawing or
            collaborating on an existing one.
          </p>
          <Link
            href={`/dashboard/?my-room=${UUIDV4()}`}
            className="w-44 px-2 h-12 text-white flex items-center justify-center flex-row gap-2 bg-primary rounded-lg text-sm"
          >
            Go to dashboard <IconClick />
          </Link>
        </article>
      </div>
    </main>
  )
}

export default Landing
