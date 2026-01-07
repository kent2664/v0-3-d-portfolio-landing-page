"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function GalleryIntro() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="mb-4 text-3xl font-bold tracking-tight lg:text-4xl">Explore My Creative Work</h2>
        <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
          Dive into my collection of visuals, 3D artifacts, and musical compositions. Experience interactive 3D
          navigation and curated content across multiple creative disciplines.
        </p>
        <Link
          href="/gallery"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3 font-medium text-accent-foreground transition-colors hover:bg-accent/90"
        >
          Explore Gallery
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  )
}
