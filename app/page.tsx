"use client"

import { useEffect, useState } from "react"
import { Hero } from "@/components/hero"
import { Projects } from "@/components/projects"
import { Skills } from "@/components/skills"
import { Contact } from "@/components/contact"
import { Navigation } from "@/components/navigation"
import { ThreeDBackground } from "@/components/3d-background"
import { Loader } from "@/components/loader"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="min-h-screen text-foreground">
      <ThreeDBackground />
      <Navigation />
      <main className="mx-auto max-w-4xl">
        <Hero />
        <Projects />
        <Skills />
        <Contact />
      </main>
    </div>
  )
}
