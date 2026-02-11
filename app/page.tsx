"use client"

import { useEffect, useState, useCallback } from "react"
import { Hero } from "@/components/hero"
import { Projects } from "@/components/projects"
import { Skills } from "@/components/skills"
import { Contact } from "@/components/contact"
import { Navigation } from "@/components/navigation"
import { ThreeDBackground } from "@/components/3d-background"
import { WarpLoading } from "@/components/warp-loading"
import { GalleryIntro } from "@/components/gallery-intro"
import { CareerTimeline } from "@/components/career-timeline"
import { BackToTop } from "@/components/back-to-top"
import { motion, AnimatePresence } from "framer-motion"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [cinematicActive, setCinematicActive] = useState(false)

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

  const handleCinematicTrigger = useCallback(() => {
    setCinematicActive(true)
  }, [])

  return (
    <div className="min-h-screen text-foreground">
      <WarpLoading isLoading={isLoading} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <ThreeDBackground cinematic={cinematicActive} />
        <div className="absolute inset-0 -z-8 bg-black/30" />

        {/* Cinematic overlay fade */}
        <AnimatePresence>
          {cinematicActive && (
            <motion.div
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>

        <Navigation />
        <main className="mx-auto max-w-5xl">
          <Hero />
          <CareerTimeline />
          <Projects />
          <Skills />
          <GalleryIntro onCinematicTrigger={handleCinematicTrigger} />
          <Contact />
        </main>
        <BackToTop />
      </motion.div>
    </div>
  )
}
