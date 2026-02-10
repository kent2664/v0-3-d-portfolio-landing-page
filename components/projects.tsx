"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

const projects = [
  {
    title: "Online Course-hub Platform",
    description:
      "A sample front-end course-hub app with a dummy back-end, built using an agile workflow.",
    tags: ["React", "Node.js", "Javascript","Tailwind"],
    link: "https://github.com/kent2664/course-hub-react-app",
    year: "2025",
    image: "/course-hub_Image.png",
  },
  {
    title: "Expense-tracker",
    description: "A simple expense tracker built with Vanilla JavaScript.",
    tags: ["Javascript", "Html/CSS", "Agile"],
    link: "https://github.com/kent2664/expense-tracker",
    year: "2025",
    image: "/expense-image.png",
  },
  {
    title: "Terrible Website ",
    description: "A website intentionally designed to frustrate its users.",
    tags: ["Html", "Javascript","tailwind"],
    link: "https://github.com/kent2664/terrible-website-contest",
    year: "2025",
    image: "/terrible-website.png",
  },
  {
    title: "Python practices",
    description: "A Collection of Python & Django Projects: From Fundamentals to Web Applications.",
    tags: ["Python", "Django","tailwind"],
    link: "https://github.com/kent2664/practice-python",
    year: "2025",
    image: "/design-system-components.png",
  },
]

export function Projects() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set())

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return

      const container = scrollContainerRef.current
      const cards = container.querySelectorAll("[data-card-index]")
      const newVisibleIndices = new Set<number>()

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        const isVisible = rect.left < containerRect.right && rect.right > containerRect.left
        
        if (isVisible) {
          const index = parseInt(card.getAttribute("data-card-index") || "0")
          newVisibleIndices.add(index)
        }
      })

      setVisibleIndices(newVisibleIndices)
    }

    const container = scrollContainerRef.current
    container?.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check

    return () => container?.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section id="projects" className="px-6 py-20 border-t border-[#664903]">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
          className="mb-12"
        >
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">Featured Work</h2>
          <h3 className="text-3xl md:text-4xl font-bold">Selected Projects</h3>
        </motion.div>

        {/* Desktop: Horizontal Scroll Marquee */}
        <div
          ref={scrollContainerRef}
          className="hidden md:flex overflow-x-auto gap-6 pb-4 scroll-smooth snap-x snap-mandatory"
          style={{ scrollBehavior: "smooth" }}
        >
          {projects.map((project, idx) => (
            <motion.a
              key={idx}
              href={project.link}
              data-card-index={idx}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative flex-shrink-0 w-96 snap-start"
              target="_blank"
              initial={{ opacity: 0, x: 50 }}
              animate={visibleIndices.has(idx) ? { opacity: 1, x: 0 } : { opacity: 0.5, x: 50 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Glow effect on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br from-accent/30 via-accent/10 to-transparent rounded-xl blur-2xl transition-all duration-500 ${
                  hoveredIndex === idx ? "opacity-100 scale-110" : "opacity-0 scale-95"
                }`}
              />

              {/* Card with enhanced glassmorphism */}
              <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl overflow-hidden transition-all duration-500 transform hover:scale-110 hover:border-accent/40 h-full shadow-2xl hover:shadow-accent/20">
                <div className="relative h-56 w-full overflow-hidden bg-background/20">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-125"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold group-hover:text-accent transition-colors duration-300">{project.title}</h4>
                    </div>
                    <div className="whitespace-nowrap text-xs font-medium text-accent/75 group-hover:text-accent transition-colors">{project.year}</div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{project.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-block rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent border border-accent/30 group-hover:border-accent/60 group-hover:bg-accent/25 transition-all duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Mobile: Vertical Stack */}
        <div className="md:hidden space-y-6">
          {projects.map((project, idx) => (
            <motion.a
              key={idx}
              href={project.link}
              className="group relative block"
              target="_blank"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Card */}
              <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:border-accent/30">
                <div className="relative h-40 w-full overflow-hidden bg-background/20">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-base font-bold group-hover:text-accent transition-colors">{project.title}</h4>
                    <div className="whitespace-nowrap text-xs font-medium text-accent opacity-75">{project.year}</div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{project.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-block rounded-full bg-accent/10 px-2 py-1 text-xs font-medium text-accent border border-accent/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}
