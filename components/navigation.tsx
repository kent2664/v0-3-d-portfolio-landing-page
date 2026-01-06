"use client"

import { useState } from "react"

export function Navigation() {
  const [activeSection, setActiveSection] = useState("about")

  const sections = [
    { id: "about", label: "ABOUT" },
    { id: "projects", label: "PROJECTS" },
    { id: "skills", label: "SKILLS" },
    { id: "contact", label: "CONTACT" },
  ]

  const scrollToSection = (id: string) => {
    setActiveSection(id)
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-muted bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-4xl px-6 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">Kenta Yusa</h1>
          <div className="flex items-center gap-8">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`text-sm font-medium transition-colors ${
                  activeSection === section.id
                    ? "border-b-2 border-accent text-accent"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
