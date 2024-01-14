/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    // Enables styled server components
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
}

module.exports = nextConfig
