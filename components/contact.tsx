"use client"

import { Download } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

export function Contact() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" })

  return (
    <section id="contact" className="px-6 py-20 border-t border-[#664903]" ref={sectionRef}>
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">Get In Touch</h2>
        <h3 className="mb-8 text-3xl font-bold">Let's Work Together</h3>

        <p className="mb-12 text-lg text-muted-foreground leading-relaxed max-w-2xl">
          I'm always interested in hearing about new projects and opportunities. Whether you have a question or just
          want to say hi, feel free to reach out!
        </p>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-4 sm:flex-row">
            <motion.a
              href="mailto:onz0shi2664@gmail.com"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-medium text-accent-foreground transition-colors hover:bg-accent/90 relative overflow-hidden"
              target="_blank"
              animate={
                isInView
                  ? {
                      boxShadow: [
                        "0 0 0px rgba(213, 55, 11, 0), inset 0 0 0px rgba(255, 255, 255, 0)",
                        "0 0 35px rgba(213, 55, 11, 0.85), inset 0 0 20px rgba(255, 120, 70, 0.4)",
                        "0 0 0px rgba(213, 55, 11, 0), inset 0 0 0px rgba(255, 255, 255, 0)",
                      ],
                    }
                  : {}
              }
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <motion.span
                className="absolute inset-0 rounded-lg"
                animate={
                  isInView
                    ? {
                        background: [
                          "radial-gradient(circle at 50% 50%, rgba(213, 55, 11, 0.5) 0%, transparent 60%)",
                          "radial-gradient(circle at 50% 50%, rgba(255, 120, 70, 0.7) 0%, transparent 70%)",
                          "radial-gradient(circle at 50% 50%, rgba(213, 55, 11, 0.5) 0%, transparent 60%)",
                        ],
                      }
                    : {}
                }
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <span className="relative z-10">Send Email</span>
            </motion.a>
            <motion.a
              href="https://drive.google.com/file/d/1DFb8hga8HNodI8-EHrZtWLei3rTMIAU1/view?usp=sharing"
              download="KentaYusa_Resume.pdf"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-6 py-3 font-medium text-accent transition-all hover:bg-accent/20 hover:border-accent/50 shadow-sm"
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(213, 55, 11, 0.3)" }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                whileHover={{ rotate: 20, y: 2 }}
              >
                <Download className="h-4 w-4" />
              </motion.div>
              Download Resume
            </motion.a>
          </div>

          <div className="flex items-center gap-6">
            <motion.a
              href="https://github.com/kent2664"
              className="text-muted-foreground transition-all hover:text-accent"
              aria-label="GitHub"
              target="_blank"
              whileHover={{ scale: 1.15, x: 3 }}
              whileTap={{ scale: 0.95 }}
            >
              GitHub
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/kenta-yusa2664/"
              className="text-muted-foreground transition-all hover:text-accent"
              aria-label="LinkedIn"
              target="_blank"
              whileHover={{ scale: 1.15, x: 3 }}
              whileTap={{ scale: 0.95 }}
            >
              LinkedIn
            </motion.a>
          </div>
        </div>

        <div className="mt-20 border-t border-[#664903] pt-8 text-center text-sm text-muted-foreground">
          <p>© 2026 Kenta Yusa. All rights reserved.</p>
        </div>
      </div>
    </section>
  )
}
