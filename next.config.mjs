import million from "million/compiler"

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
      canvas: "commonjs canvas",
    })
    // config.infrastructureLogging = { debug: /PackFileCache/ };
    return config
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "liveblocks.io",
        port: "",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

const millionConfig = {
  auto: true, // Si estas usando RSC: auto: { rsc: true },
}

export default million.next(nextConfig, millionConfig)
