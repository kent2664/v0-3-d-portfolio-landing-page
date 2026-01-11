"use client"

import { useState } from "react"
import Image from "next/image"

const projects = [
  {
    title: "Online Course-hub Platform",
    description:
      "Full-stack marketplace with real-time inventory management, payment processing, and seller dashboard.",
    tags: ["React", "Node.js", "Javascript","Tailwind"],
    link: "https://github.com/kent2664/course-hub-react-app",
    year: "2025",
    image: "/ecommerce-dashboard.png",
  },
  {
    title: "Task Management App",
    description: "Collaborative task management tool with real-time updates, team workspaces, and advanced filtering.",
    tags: ["Next.js", "TypeScript", "Supabase", "TailwindCSS"],
    link: "#",
    year: "2023",
    image: "/task-management-app.png",
  },
  {
    title: "Analytics Dashboard",
    description: "Data visualization dashboard with interactive charts, real-time data updates, and custom reports.",
    tags: ["React", "D3.js", "Express", "MongoDB"],
    link: "#",
    year: "2023",
    image: "/analytics-dashboard-charts.png",
  },
  {
    title: "Terrible Website contest",
    description: "Comprehensive component library with documentation, supporting 50+ production applications.",
    tags: ["Html", "Javascript","tailwind"],
    link: "https://github.com/kent2664/terrible-website-contest",
    year: "2025",
    image: "/terrible-website.png",
  },
]

export function Projects() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="projects" className="px-6 py-20 border-t border-[#664903]">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">Featured Work</h2>
        <h3 className="mb-12 text-3xl font-bold">Selected Projects</h3>

        <div className="grid grid-cols-1 gap-6">
          {projects.map((project, idx) => (
            <a
              key={idx}
              href={project.link}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group relative"
              target="_blank"
            >
              {/* Glow effect on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-lg blur-xl transition-opacity duration-300 ${
                  hoveredIndex === idx ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Card */}
              <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:border-accent/30">
                <div className="relative h-48 w-full overflow-hidden bg-background/20">
                  <Image
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-lg font-bold group-hover:text-accent transition-colors">{project.title}</h4>
                    </div>
                    <div className="whitespace-nowrap text-xs font-medium text-accent opacity-75">{project.year}</div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent border border-accent/20 group-hover:border-accent/40 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
