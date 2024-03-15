import { Button } from "@/components/ui/button"
import React from "react"
import { IconBrandGoogle } from "@tabler/icons-react"

// million-ignore

const SignIn = () => {
  return (
    <main className="w-full h-screen">
      <div className="w-full h-full flex items-center justify-center flex-col">
        <header className="w-1/5 flex flex-col gap-2 my-12">
          <h1 className="text-white/80 text-4xl font-normal">Register here</h1>
          <p className="text-white/60 text-sm font-normal">
            Create your account to continue using Drawing Online.
          </p>
        </header>
        <div className="w-full h-max flex items-center justify-center">
          <Button className="w-1/5 h-12 bg-white text-black/90 text-base font-normal gap-2 hover:bg-white/80">
            Sign up with Google
            <IconBrandGoogle size={20} className="text-black" />
          </Button>
        </div>
        <span className="w-1/5 h-[1px] bg-white/20 my-8"></span>
        <form
          autoComplete="off"
          className="w-full h-max flex items-center justify-center flex-col gap-4"
        >
          <input
            type="username"
            className="w-1/5 h-12 outline-none bg-primary/20 text-white/80 text-sm font-normal rounded-lg focus:outline-2 focus:outline-primary placeholder:text-white/80 placeholder:text-sm px-4 transition-all duration-150"
            placeholder="Your username"
            name="username"
          />
          <input
            type="email"
            className="w-1/5 h-12 outline-none bg-primary/20 text-white/80 text-sm font-normal rounded-lg focus:outline-2 focus:outline-primary placeholder:text-white/80 placeholder:text-sm px-4 transition-all duration-150"
            placeholder="Your email"
            name="email"
          />
          <input
            type="password"
            className="w-1/5 h-12 outline-none bg-primary/20 text-white/80 text-sm font-normal rounded-lg focus:outline-2 focus:outline-primary placeholder:text-white/80 placeholder:text-sm px-4 transition-all duration-150"
            placeholder="Your password"
            name="password"
          />
          <Button className="w-1/5 h-12 text-white mt-3">Sign up</Button>
        </form>
      </div>
    </main>
  )
}

export default SignIn
