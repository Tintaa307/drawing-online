"use client"

import React from "react"
import { motion } from "framer-motion"

const Item = ({ title, path }: { title: string; path: string }) => {
  return (
    <motion.li className="text-white text-base font-normal cursor-pointer hover:text-primary transition-colors duration-200">
      {title}
    </motion.li>
  )
}

export default Item
