"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { redirect } from "next/navigation"
import leftImage from "../public/2.png"
import rightImage from "../public/3.png"


export default function SplitScreenLanding() {
  const [activeCard, setActiveCard] = useState<"left" | "right" | null>(null)

  return (
    <main className="h-screen w-screen flex overflow-hidden">
      <div
        className={cn(
          "relative h-full transition-all duration-500 ease-in-out flex-1 backdrop-blur-3xl",
          activeCard === "right" ? "flex-[0.45] backdrop-blur-3xl" : activeCard === "left" ? "cursor-pointer flex-[0.55]" : "flex-1",
        )}
        onMouseEnter={() => setActiveCard("left")}
        onMouseLeave={() => setActiveCard(null)}
        onMouseDown={() => redirect("https://capital.spuric.com")}
      >
        <Image
          src={rightImage}
          alt="Payment terminal with credit card"
          fill
          className={cn("object-cover transition duration-500 blur-sm", activeCard !== "left" && "blur-lg")}
          priority
        />
        <div className="absolute inset-0 bg-black/30 p-8 md:p-12 flex flex-col justify-center align-center items-center text-white">
          <div>
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-xl rounded-full text-sm">
              capital.spuric.com
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold max-w-md">SPUR Capital</h2>
            <p className="mt-4 max-w-md text-white/80">For partners, investors, and eco-system partners.</p>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "relative h-full transition-all duration-500 ease-in-out flex-1 backdrop-blur-3xl",
          activeCard === "left" ? "flex-[0.45] backdrop-blur-3xl" : activeCard === "right" ? "cursor-pointer flex-[0.55]" : "flex-1",
        )}
        onMouseEnter={() => setActiveCard("right")}
        onMouseLeave={() => setActiveCard(null)}
        onMouseDown={() => redirect("https://innovation.spuric.com")}
      >
        <Image
          src={leftImage}
          alt="Night city skyline with illuminated bridge"
          fill
          className={cn("object-cover transition duration-500 blur-sm", activeCard !== "right" && "blur-lg")}
          priority
        />
        <div className="absolute inset-0 bg-black/30 p-8 md:p-12 flex flex-col justify-center items-center text-white">
          <div>
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-xl rounded-full text-sm">
              innovation.spuric.com
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold max-w-md">SPUR Innovation</h2>
            <p className="mt-4 max-w-md text-white/80">For students, developers, startups, and growth companies.</p>
          </div>
        </div>
      </div>
    </main>
  )
}

