"use client"


export function Hero() {
  return (
    <section id="about" className="relative flex min-h-screen items-center justify-center px-6 py-20">

      <div className="max-w-2xl text-center relative z-10">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">Welcome</p>
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-balance lg:text-6xl">
          Full Stack Developer & Creative Thinker
        </h1>
        <p className="mb-8 text-xl text-muted-foreground leading-relaxed">
          I build beautiful, performant web applications that solve real problems. Specialized in React, Node.js, and
          modern web technologies.
        </p>
        <div className="flex items-center justify-center gap-4">
          <a
            href="#projects"
            className="rounded-lg bg-accent px-8 py-3 font-medium text-accent-foreground transition-colors hover:bg-accent/90"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="rounded-lg border border-muted px-8 py-3 font-medium transition-colors hover:bg-muted"
          >
            Get In Touch
          </a>
        </div>

        {/* Brief about section */}
        <div className="mt-20 space-y-6 border-t border-border pt-12 text-left">
          <p className="text-muted-foreground leading-relaxed">
            I'm a passionate full-stack developer with 6+ years of experience building scalable web applications. I love
            the intersection of design and engineering, creating experiences that are both beautiful and functional.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Currently, I'm focused on modern JavaScript frameworks, cloud architecture, and mentoring junior developers.
            When I'm not coding, you'll find me exploring new technologies or contributing to open-source projects.
          </p>
        </div>
      </div>
    </section>
  )
}
