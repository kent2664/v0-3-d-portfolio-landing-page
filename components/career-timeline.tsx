"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Building2, Users, Briefcase } from "lucide-react"

interface Planet {
  id: number
  title: string
  subtitle?: string
  years: string
  role: string
  focus: string
  achievement: string
  icon: React.ReactNode
  color: string
  size: number
  x: number
  y: number
}

const careerData: Planet[] = [
  {
    id: 1,
    title: "Project Lead Developer",
    subtitle: "at RKKCS Co., Ltd.",
    years: "2021 - 2024",
    role: "Current Role",
    focus: "Cloud-Native Refresh",
    achievement:
      "Drove cloud-native shift, established modern dev workflows, and managed key system features while enhancing internal productivity via custom tools.",
    icon: <Briefcase className="w-6 h-6" />,
    color: "#d5370b",
    size: 110,
    x: -280,
    y: -190, // adjusted y-coordinate for better spacing from ME sun
  },
  {
    id: 2,
    title: "Dev Team Lead & Culture Ambassador",
    subtitle: "at RKKCS Co., Ltd.",
    years: "2018 - 2021",
    role: "Leadership & Process Improvement",
    focus: "Team Development",
    achievement:
      "Led development at a subsidiary to improve culture and processes. Mentored members via workshops and built a GAS-based system to optimize order management.",
    icon: <Users className="w-6 h-6" />,
    color: "#ff6b35",
    size: 90,
    x: 240,
    y: -10, // adjusted y-coordinate
  },
  {
    id: 3,
    title: "Junior Software Developer",
    subtitle: "at RKKCS Co., Ltd.",
    years: "2014 - 2018",
    role: "Foundation & Growth",
    focus: "HR, Payroll & Health Systems",
    achievement:
      "Led development for HR/Payroll systems and ensured vendor quality. Transitioned to a major health management project to design key features and optimize development schedules.",
    icon: <Building2 className="w-6 h-6" />,
    color: "#ffa500",
    size: 80,
    x: -260,
    y: 130, // adjusted y-coordinate
  },
]

export function CareerTimeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }

    const container = containerRef.current
    container?.addEventListener("mousemove", handleMouseMove)
    return () => container?.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section id="career" className="py-20 px-4 relative overflow-hidden border-t border-[#664903]">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 0 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold text-center mb-2 text-balance"
        >
          Career Orbit
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center text-muted-foreground mb-8"
        >
          A timeline of growth and leadership in software development
        </motion.p>

        <div ref={containerRef} className="relative h-screen max-h-[800px] flex items-center justify-center">
          <motion.div
            animate={{
              boxShadow: `0 0 60px rgba(213, 55, 11, 0.6)`,
            }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            className="absolute w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg z-30"
            style={{
              left: "50%",
              top: "50%",
              translateX: "-50%",
              translateY: "calc(-50% - 230px)", // Position at top of timeline
            }}
          >
            ME
          </motion.div>

          {/* Planets arranged vertically */}
          {careerData.map((planet, index) => {
            return (
              <motion.div
                key={planet.id}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1, x: planet.x, y: planet.y }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                }}
                className="absolute"
                style={{
                  left: "50%",
                  top: "50%",
                  translateX: "-50%",
                  translateY: "-50%",
                }}
              >
                {/* Planet */}
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 4 + index * 0.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className="cursor-pointer"
                >
                  <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }} className="relative group">
                    {/* Planet Glow */}
                    <div
                      className="absolute inset-0 rounded-full opacity-30 blur-xl"
                      style={{
                        backgroundColor: planet.color,
                        width: planet.size,
                        height: planet.size,
                        marginLeft: -planet.size / 2,
                        marginTop: -planet.size / 2,
                      }}
                    />

                    {/* Planet Body */}
                    <motion.div
                      className="relative rounded-full flex items-center justify-center text-white shadow-2xl border-2 border-white/30 hover:border-white/60 transition-colors"
                      style={{
                        width: planet.size,
                        height: planet.size,
                        backgroundColor: planet.color,
                      }}
                    >
                      {planet.icon}
                    </motion.div>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                  className="absolute top-full mt-4 left-1/2 -translate-x-1/2 w-[350px] pointer-events-auto"
                >
                  <motion.div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg p-6 shadow-2xl">
                    <h3 className="text-xl font-bold mb-1">{planet.title}</h3>
                    {planet.subtitle && <p className="text-sm text-accent font-semibold mb-2">{planet.subtitle}</p>}
                    <p className="text-sm text-accent mb-3">{planet.years}</p>
                    <p className="text-sm font-semibold mb-2">{planet.focus}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{planet.achievement}</p>
                  </motion.div>
                </motion.div>
              </motion.div>
            )
          })}

          {/* Connection lines between planets */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(213, 55, 11, 0.4)" />
                <stop offset="100%" stopColor="rgba(255, 165, 0, 0.2)" />
              </linearGradient>
            </defs>
            {/* Line from ME sun to first planet */}
            <line
              x1="50%"
              y1={`calc(50% - 230px)`}
              x2={`calc(50% + ${careerData[0].x}px)`}
              y2={`calc(50% + ${careerData[0].y}px)`}
              stroke="url(#connectionGradient)"
              strokeWidth="2"
              strokeDasharray="5,5"
              opacity="0.5"
            />
            {/* Lines between consecutive planets */}
            {careerData.slice(0, -1).map((planet, index) => {
              const nextPlanet = careerData[index + 1]
              return (
                <line
                  key={`line-${planet.id}`}
                  x1={`calc(50% + ${planet.x}px)`}
                  y1={`calc(50% + ${planet.y}px)`}
                  x2={`calc(50% + ${nextPlanet.x}px)`}
                  y2={`calc(50% + ${nextPlanet.y}px)`}
                  stroke="url(#connectionGradient)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  opacity="0.5"
                />
              )
            })}
          </svg>
        </div>
      </div>
    </section>
  )
}
