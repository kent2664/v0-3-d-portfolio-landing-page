import { Hero } from "@/components/hero"
import { Projects } from "@/components/projects"
import { Skills } from "@/components/skills"
import { Contact } from "@/components/contact"
import { Navigation } from "@/components/navigation"
import { ThreeDBackground } from "@/components/3d-background"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
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
