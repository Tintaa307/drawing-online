"use client"

import React from "react"
import { IconClick } from "@tabler/icons-react"
import { Button } from "../ui/button"
import Item from "./Item"
import { usePathname } from "next/navigation"

const Navbar = () => {
  const pathname = usePathname()
  const navItems = [
    {
      title: "About",
      path: "/about",
    },
    {
      title: "Features",
      path: "/features",
    },
    {
      title: "Pricing",
      path: "/pricing",
    },
    {
      title: "Blog",
      path: "/blog",
    },
    {
      title: "Contact",
      path: "/contact",
    },
  ]
  return (
    <>
      {pathname === "/dashboard" ? null : (
        <header className="fixed top-0 left-0 w-full h-[72px] flex items-center justify-center border-b-[1px] border-b-primary/20">
          <nav className="w-[85%] h-full flex items-center justify-evenly">
            <div className="w-1/4 flex items-center justify-start flex-row gap-2 cursor-pointer">
              <IconClick size={24} className="text-primary select-none" />
              <small className="text-white text-base font-medium select-none">
                dw-on
              </small>
            </div>
            <div className="w-2/4 flex items-center justify-center">
              <ul className="w-max h-full items-center flex flex-row gap-12 border-[1px] border-primary/30 rounded-xl px-5 py-2.5">
                {navItems.map((item, index) => (
                  <Item key={index} title={item.title} path={item.path} />
                ))}
              </ul>
            </div>
            <div className="w-1/4 h-full flex items-center justify-end flex-row gap-2">
              <Button className="w-32 h-10 text-white">Sign in</Button>
              <Button variant={"link"} className="w-32 h-10 text-primary">
                Sign up
              </Button>
            </div>
          </nav>
        </header>
      )}
    </>
  )
}

export default Navbar
