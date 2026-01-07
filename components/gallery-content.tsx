"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { X, Play } from "lucide-react"

type Category = "visuals" | "artifact" | "compose"

interface GalleryContentProps {
  category: Category
}

export function GalleryContent({ category }: GalleryContentProps) {
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null)

  const visualsData = [
    { id: 1, type: "image", url: "/vast-mountain-valley.png", title: "Sunset Vista" },
    { id: 2, type: "image", url: "/portrait-photography.png", title: "Urban Portrait" },
    { id: 3, type: "image", url: "/nature-photography-collection.png", title: "Mountain Peak" },
    { id: 4, type: "video", url: "/video-thumbnail.png", title: "City Lights" },
    { id: 5, type: "image", url: "/abstract-composition.png", title: "Abstract Forms" },
    { id: 6, type: "image", url: "/modern-city-architecture.png", title: "Modern Architecture" },
  ]

  const artifactData = [
    { id: 1, url: "/3d-render-abstract.jpg", title: "Geometric Dreams" },
    { id: 2, url: "/3d-animation-scene.png", title: "Fluid Dynamics" },
    { id: 3, url: "/3d-sculpture.jpg", title: "Digital Sculpture" },
    { id: 4, url: "/3d-environment.jpg", title: "Virtual Environment" },
  ]

  const composeData = [
    { id: 1, title: "Midnight Melody", duration: "3:45", waveform: "/waveform-abstract.png" },
    { id: 2, title: "Urban Symphony", duration: "4:20", waveform: "/waveform-abstract.png" },
    { id: 3, title: "Digital Dreamscape", duration: "5:10", waveform: "/waveform-abstract.png" },
    { id: 4, title: "Ambient Waves", duration: "6:30", waveform: "/waveform-abstract.png" },
  ]

  return (
    <motion.div
      key={category}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-12"
    >
      {category === "visuals" && (
        <div>
          <h2 className="mb-6 text-2xl font-bold">Visual Gallery</h2>
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {visualsData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group relative mb-4 cursor-pointer break-inside-avoid overflow-hidden rounded-lg"
                onClick={() => setSelectedMedia(item.url)}
              >
                <img
                  src={item.url || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  {item.type === "video" && <Play className="h-12 w-12 text-white" />}
                  <p className="absolute bottom-4 left-4 text-sm font-medium text-white">{item.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {category === "artifact" && (
        <div>
          <h2 className="mb-6 text-2xl font-bold">3D Artifacts</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {artifactData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative min-w-[400px] cursor-pointer overflow-hidden rounded-lg"
                onClick={() => setSelectedMedia(item.url)}
              >
                <img
                  src={item.url || "/placeholder.svg"}
                  alt={item.title}
                  className="h-[300px] w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Play className="h-12 w-12 text-white" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="font-medium text-white">{item.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {category === "compose" && (
        <div>
          <h2 className="mb-6 text-2xl font-bold">Original Compositions</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {composeData.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group rounded-lg border border-border bg-card p-6 transition-colors hover:border-accent"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold">{item.title}</h3>
                  <span className="text-sm text-muted-foreground">{item.duration}</span>
                </div>
                <img src={item.waveform || "/placeholder.svg"} alt="Waveform" className="mb-4 w-full rounded" />
                <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 font-medium text-accent-foreground transition-colors hover:bg-accent/90">
                  <Play className="h-4 w-4" />
                  Play
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedMedia && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <button
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
            onClick={() => setSelectedMedia(null)}
          >
            <X className="h-6 w-6 text-white" />
          </button>
          <img
            src={selectedMedia || "/placeholder.svg"}
            alt="Full size"
            className="max-h-[90vh] max-w-[90vw] rounded-lg"
          />
        </motion.div>
      )}
    </motion.div>
  )
}
