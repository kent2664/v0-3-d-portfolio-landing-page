"use client"

import { Suspense, useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Gallery3DNav } from "@/components/gallery-3d-nav"
import { GalleryContent } from "@/components/gallery-content"
import { WarpLoading } from "@/components/warp-loading"
import { motion } from "framer-motion"

type Category = "visuals" | "artifact" | "compose"

function CanvasLoadingFallback() {
  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-lg bg-background/20 backdrop-blur-md flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading 3D Gallery...</p>
      </div>
    </div>
  )
}

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("visuals")
  const [showWarpLoading, setShowWarpLoading] = useState(false)

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowWarpLoading(false)
  //   }, 4200) // Wait for warp animation to complete + flash effect

  //   return () => clearTimeout(timer)
  // }, [])

  return (
    <div className="min-h-screen bg-[#1d2533] text-foreground">
      <WarpLoading isLoading={showWarpLoading} />

      {/* Content is already mounted and rendered behind the loader */}
      <motion.div
        animate={{ opacity: showWarpLoading ? 0.2 : 1 }}
        transition={{ duration: 0.8, delay: showWarpLoading ? 0 : 0.2 }}
        className="pointer-events-none"
        style={{ pointerEvents: showWarpLoading ? "none" : "auto" }}
      >
        <Navigation />
        <main className="mx-auto max-w-6xl px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">Creative Gallery</h1>
            <p className="text-lg text-muted-foreground">Explore my work across multiple creative disciplines</p>
          </motion.div>

          <Suspense fallback={<CanvasLoadingFallback />}>
            <Gallery3DNav onCategoryChange={setSelectedCategory} />
          </Suspense>
          <GalleryContent category={selectedCategory} />
        </main>
      </motion.div>
    </div>
  )
}
