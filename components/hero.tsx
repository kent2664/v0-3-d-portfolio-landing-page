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
        <div className="flex items-center justify-center gap-4 flex-wrap">
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
        </div>

        <div className="mt-20 space-y-6 pt-12">
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              I'm a passionate full-stack developer with 10+ years of experience building scalable web applications. I
              love the intersection of design and engineering, creating experiences that are both beautiful and
              functional.
            </p>
          </div>

          {/* Experience Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {/* Development Lead Experience Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-6 hover:border-accent/30 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <span className="text-lg">👨‍💼</span>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-foreground mb-2">Development Lead</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Led cross-functional teams in building scalable web applications. Mentored junior developers and
                      established best practices for code quality and performance.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Internal Business Tools Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-6 hover:border-accent/30 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <span className="text-lg">⚙️</span>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-foreground mb-2">Internal Tools Developer</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Developed a task management tool to automate repetitive monthly tasks, significantly streamlining the order processing workflow.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Passionate tech stack Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative backdrop-blur-md bg-white/5 border border-white/10 rounded-lg p-6 hover:border-accent/30 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                    <span className="text-lg">🔥</span>
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-foreground mb-2">Passionate Pathfinder</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Not only am I dedicated to my professional responsibilities, but I also actively explore new technologies outside of work, striving to remain a lifelong creative.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
