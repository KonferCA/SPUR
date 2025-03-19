import "@/app/globals.css"
import type React from "react"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "SPUR Innovation Center",
  description: "The SPUR Innovation Center is a platform for innovation, research, and development.",
}

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
          {children}
      </body>
    </html>
  )
}
