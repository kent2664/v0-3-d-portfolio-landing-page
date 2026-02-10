"use client"

import { useEffect, useState } from "react"
import { Hero } from "@/components/hero"
import { Projects } from "@/components/projects"
import { Skills } from "@/components/skills"
import { Contact } from "@/components/contact"
import { Navigation } from "@/components/navigation"
import { ThreeDBackground } from "@/components/3d-background"
// import { Loader } from "@/components/loader"
import { WarpLoading } from "@/components/warp-loading"
import { GalleryIntro } from "@/components/gallery-intro"
import { CareerTimeline } from "@/components/career-timeline"
import { motion } from "framer-motion"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisited")
    if (hasVisited) {
      setIsLoading(false)
      return
    }
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen text-foreground">
      <WarpLoading isLoading={isLoading} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <ThreeDBackground />
        <div className="absolute inset-0 -z-8 bg-black/30" />
        <Navigation />
        <main className="mx-auto max-w-7xl px-4">
          <Hero />
          <CareerTimeline />
          <Projects />
          <Skills />
          <GalleryIntro />
          <Contact />
        </main>
      </motion.div>
    </div>
  )
}
