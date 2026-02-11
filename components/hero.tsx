"use client"

import { motion } from "framer-motion"
import { useRef, useCallback } from "react"

export function Hero() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current
    if (!container) return
    // Only hijack scroll if the container can scroll horizontally
    const { scrollWidth, clientWidth } = container
    if (scrollWidth <= clientWidth) return
    e.preventDefault()
    container.scrollLeft += e.deltaY
  }, [])

  return (
    <section id="about" className="relative flex min-h-screen items-center justify-center px-6 py-20">
      <div className="w-full text-center relative z-10">
        <motion.p
          className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome
        </motion.p>
        <motion.h1
          className="mb-6 text-5xl font-bold tracking-tighter text-balance lg:text-7xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Full Stack Developer & Creative Thinker
        </motion.h1>
        <motion.p
          className="mb-8 text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          I build beautiful, performant web applications that solve real problems. Specialized in React, Node.js, and
          modern web technologies.
        </motion.p>
        <motion.div
          className="flex items-center justify-center gap-4 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a
            href="#projects"
            className="rounded-lg bg-accent px-8 py-3 font-medium text-accent-foreground transition-colors hover:bg-accent/90"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="rounded-lg border-2 border-accent/40 bg-accent/5 px-8 py-3 font-medium text-foreground transition-all hover:bg-accent/10 hover:border-accent/60"
          >
            Get In Touch
          </a>
        </motion.div>

        <div className="mt-20 space-y-6 pt-12">
          <div className="space-y-4 max-w-2xl mx-auto">
            <p className="text-muted-foreground leading-relaxed">
              I'm a passionate full-stack developer with 10+ years of experience building scalable web applications. I
              love the intersection of design and engineering, creating experiences that are both beautiful and
              functional.
            </p>
          </div>

          {/* Experience Cards - Horizontal Scroll with Gradient Mask */}
          <div
            className="relative group/container"
            style={{
              maskImage: "linear-gradient(to right, black 85%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to right, black 85%, transparent 100%)",
            }}
          >
            <motion.div
              ref={scrollContainerRef}
              onWheel={handleWheel}
              data-scroll-hide
              className="flex flex-row gap-4 mt-8 overflow-x-auto pb-4"
              style={{
                scrollBehavior: "smooth",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
              whileHover={{ x: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <style>{`
                [data-scroll-hide]::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              {/* Development Lead Experience Card */}
              <motion.div
                className="relative group flex-shrink-0 w-80 h-48"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0, ease: "easeOut" }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative backdrop-blur-lg bg-white/5 border border-white/10 rounded-lg p-6 hover:border-accent/30 transition-all duration-300 h-full flex flex-col">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <span className="text-lg">👨‍💼</span>
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-foreground mb-2 tracking-tight">Development Lead</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Led cross-functional teams in building scalable web applications. Mentored junior developers and
                        established best practices for code quality and performance.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Internal Business Tools Card */}
              <motion.div
                className="relative group flex-shrink-0 w-80 h-48"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative backdrop-blur-lg bg-white/5 border border-white/10 rounded-lg p-6 hover:border-accent/30 transition-all duration-300 h-full flex flex-col">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <span className="text-lg">⚙️</span>
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-foreground mb-2 tracking-tight">Internal Tools Developer</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Developed a task management tool to automate repetitive monthly tasks, significantly streamlining the order processing workflow.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Passionate tech stack Card */}
              <motion.div
                className="relative group flex-shrink-0 w-80 h-48"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative backdrop-blur-lg bg-white/5 border border-white/10 rounded-lg p-6 hover:border-accent/30 transition-all duration-300 h-full flex flex-col">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <span className="text-lg">🔥</span>
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-foreground mb-2 tracking-tight">Passionate Pathfinder</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Not only am I dedicated to my professional responsibilities, but I also actively explore new technologies outside of work, striving to remain a lifelong creative.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* NEW: Creativity & Logic Card */}
              <motion.div
                className="relative group flex-shrink-0 w-80 h-48"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative backdrop-blur-lg bg-white/5 border border-white/10 rounded-lg p-6 hover:border-accent/30 transition-all duration-300 h-full flex flex-col">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <span className="text-lg">🎨</span>
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-bold text-foreground mb-2 tracking-tight">Creativity & Logic</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Combining a calm, analytical programming approach with an artistic design sense. Bridging the gap between clean code and visual excellence.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
