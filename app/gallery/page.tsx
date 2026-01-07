"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Gallery3DNav } from "@/components/gallery-3d-nav"
import { GalleryContent } from "@/components/gallery-content"
import { motion } from "framer-motion"

type Category = "visuals" | "artifact" | "compose"

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("visuals")

  return (
    <div className="min-h-screen text-foreground">
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

        <Gallery3DNav onCategoryChange={setSelectedCategory} />
        <GalleryContent category={selectedCategory} />
      </main>
    </div>
  )
}
