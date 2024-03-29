import type { Metadata } from "next"
import { Open_Sans } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "./providers/AuthProvider"
import { Analytics } from "@vercel/analytics/react"
import "@fortawesome/fontawesome-svg-core/styles.css"
import { config } from "@fortawesome/fontawesome-svg-core"
import { LoginModal } from "./modals/LoginModal"
import { DetailsModal } from "./modals/DetailsModal"
import Navbar from "./components/Navbar"
config.autoAddCss = false

const inter = Open_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Next Vacation",
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <AuthProvider>
          <Navbar />
          <LoginModal />
          <DetailsModal />
          {children}
          <Analytics />
        </AuthProvider>
      </body>
    </html>
  )
}
