import million from "million/compiler"

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "liveblocks.io",
        port: "",
      },
    ],
  },
}

const millionConfig = {
  auto: true, // Si estas usando RSC: auto: { rsc: true },
}

export default million.next(nextConfig, millionConfig)
