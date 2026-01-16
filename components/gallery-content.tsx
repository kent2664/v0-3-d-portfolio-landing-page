"use client"

import { motion } from "framer-motion"
import { useState, useRef } from "react"
import { X, Play, Pause } from "lucide-react"

type Category = "visuals" | "artifact" | "compose"

interface MediaItem {
  id: number
  type: "image" | "video"
  url: string
  title: string
}

interface ComposeItem {
  id: number
  title: string
  duration: string
  url: string
}

interface GalleryContentProps {
  category: Category
}

export function GalleryContent({ category }: GalleryContentProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)
  const [playingAudio, setPlayingAudio] = useState<number | null>(null)
  const audioRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({})

  const visualsData: MediaItem[] = [
    { id: 1, type: "image", url: "/pic1.jpg", title: "Sunset Vista" },
    { id: 2, type: "image", url: "/pic2.jpg", title: "Spring Contrast" },
    { id: 3, type: "image", url: "/pic3.jpg", title: "Sacred Gurdian" },
    {
      id: 4,
      type: "video",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_p8aL5UrSNi1BGP7UT2MBBFxyLYQd/204V363f4jW7IIUFGCM6ZO/public/video1.mp4",
      title: "Fuyajo",
    },
    { id: 5, type: "image", url: "/pic4.jpg", title: "Hydrangea" },
    { id: 6, type: "image", url: "/pic5.jpg", title: "Hamburger Sunset" },
    { id: 7, type: "image", url: "/pic6.jpg", title: "Evening Flight" },
    { id: 8, type: "image", url: "/pic7.jpg", title: "Modern Architecture" },
    { id: 9, type: "image", url: "/pic8.jpg", title: "Dreaming Castle" },
    { id: 10, type: "image", url: "/pic9.jpg", title: "The Busiest City" },
    { id: 11, type: "image", url: "/pic10.jpg", title: "Ride On!" },
    { id: 12, type: "image", url: "/pic11.jpg", title: "Unbreakable Will" },
    { id: 13, type: "image", url: "/pic12.jpg", title: "Tax Return..." },
    { id: 14, type: "image", url: "/pic13.jpg", title: "The First Avenger" },
    { id: 15, type: "image", url: "/pic14.jpg", title: "Assemble!" },
  ]

  const artifactData: MediaItem[] = [
    {
      id: 1,
      type: "video",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_p8aL5UrSNi1BGP7UT2MBBFxyLYQd/Lhwg_w7ODBJOtgkMj0hptW/public/blenderAquarium.mp4",
      title: "Aquarium",
    },
    {
      id: 2,
      type: "video",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/git-blob/prj_p8aL5UrSNi1BGP7UT2MBBFxyLYQd/iqIcIOdY-DzGMWH6s24Pvg/public/bear0064-0102.mp4",
      title: "Bear",
    },

  ]

  const composeData: ComposeItem[] = []

  const togglePlay = (id: number) => {
    const video = audioRefs.current[id]
    if (!video) return

    if (playingAudio === id) {
      video.pause()
      setPlayingAudio(null)
    } else {
      // Pause any currently playing
      Object.values(audioRefs.current).forEach((v) => v?.pause())
      video.play()
      setPlayingAudio(id)
    }
  }

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
                onClick={() => setSelectedMedia(item)}
              >
                {item.type === "video" ? (
                  <video
                    src={item.url}
                    muted
                    playsInline
                    loop
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                    className="w-full rounded-lg object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <img
                    src={item.url || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full transition-transform group-hover:scale-105"
                  />
                )}
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
                onClick={() => setSelectedMedia(item)}
              >
                {item.type === "video" ? (
                  <video
                    src={item.url}
                    muted
                    playsInline
                    loop
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                    className="h-[300px] w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <img
                    src={item.url || "/placeholder.svg"}
                    alt={item.title}
                    className="h-[300px] w-full object-cover transition-transform group-hover:scale-105"
                  />
                )}
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
                {/* Video element for the composition */}
                <video
                  ref={(el) => {
                    audioRefs.current[item.id] = el
                  }}
                  src={item.url}
                  className="mb-4 w-full rounded"
                  onEnded={() => setPlayingAudio(null)}
                />
                <button
                  onClick={() => togglePlay(item.id)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 font-medium text-accent-foreground transition-colors hover:bg-accent/90"
                >
                  {playingAudio === item.id ? (
                    <>
                      <Pause className="h-4 w-4" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      Play
                    </>
                  )}
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
          {selectedMedia.type === "video" ? (
            <video
              src={selectedMedia.url}
              controls
              autoPlay
              loop
              className="max-h-[90vh] max-w-[90vw] rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img
              src={selectedMedia.url || "/placeholder.svg"}
              alt={selectedMedia.title}
              className="max-h-[90vh] max-w-[90vw] rounded-lg"
            />
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
