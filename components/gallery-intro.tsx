"use client"

import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export function GalleryIntro({ onCinematicTrigger }: { onCinematicTrigger?: () => void }) {
  const router = useRouter()

  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (onCinematicTrigger) {
      onCinematicTrigger()
    }
    // Navigate after the cinematic animation has time to play
    setTimeout(() => {
      router.push("/gallery")
    }, 1800)
  }

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tighter lg:text-4xl text-balance">Explore My Creative Work</h2>
        <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
          Dive into my collection of visuals, 3D artifacts, and musical compositions. Experience interactive 3D
          navigation and curated content across multiple creative disciplines.
        </p>
        <motion.button
          onClick={handleExploreClick}
          className="relative inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3 font-medium text-accent-foreground cursor-pointer overflow-hidden group/btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          <motion.span
            className="absolute inset-0 z-0"
            initial={{
              background: "linear-gradient(90deg, rgba(213, 55, 11, 1) 0%, rgba(213, 55, 11, 1) 100%)",
            }}
            whileHover={{
              background: [
                "linear-gradient(90deg, rgba(213, 55, 11, 1) 0%, rgba(255, 120, 70, 1) 0%, rgba(213, 55, 11, 1) 100%)",
                "linear-gradient(90deg, rgba(213, 55, 11, 1) 0%, rgba(255, 120, 70, 1) 50%, rgba(213, 55, 11, 1) 100%)",
                "linear-gradient(90deg, rgba(213, 55, 11, 1) 0%, rgba(255, 120, 70, 1) 100%, rgba(213, 55, 11, 1) 100%)",
              ],
            }}
            transition={{
              duration: 0.8,
              ease: "easeInOut",
            }}
          />
          <span className="relative z-10">Explore Gallery</span>
          <ArrowRight className="h-4 w-4 relative z-10" />
        </motion.button>
      </div>
    </section>
  )
}
