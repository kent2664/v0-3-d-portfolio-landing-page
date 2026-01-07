"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Navigation() {
  const [activeSection, setActiveSection] = useState("about")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const sections = [
    { id: "about", label: "ABOUT" },
    { id: "projects", label: "PROJECTS" },
    { id: "skills", label: "SKILLS" },
    { id: "contact", label: "CONTACT" },
  ]

  const scrollToSection = (id: string) => {
    setActiveSection(id)
    setMobileMenuOpen(false)
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-muted bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-4xl px-6 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight hover:text-accent transition-colors">
            Kenta Yusa
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {pathname === "/" ? (
              <>
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
                <Link
                  href="/gallery"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  GALLERY
                </Link>
              </>
            ) : (
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                BACK
              </Link>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex flex-col gap-1.5 relative w-6 h-6 focus:outline-none"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 bg-accent transition-all duration-300 transform origin-center ${
                mobileMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-accent transition-all duration-300 ${
                mobileMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-accent transition-all duration-300 transform origin-center ${
                mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>

        {mobileMenuOpen && pathname === "/" && (
          <div className="md:hidden mt-4 pt-4 border-t border-muted space-y-3 animate-in fade-in slide-in-from-top-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`block w-full text-left text-sm font-medium py-2 px-0 transition-colors ${
                  activeSection === section.id ? "text-accent" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {section.label}
              </button>
            ))}
            <Link
              href="/gallery"
              className="block text-sm font-medium py-2 px-0 text-muted-foreground hover:text-foreground transition-colors"
            >
              GALLERY
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
