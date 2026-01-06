const projects = [
  {
    title: "E-Commerce Platform",
    description:
      "Full-stack marketplace with real-time inventory management, payment processing, and seller dashboard.",
    tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
    link: "#",
    year: "2024",
  },
  {
    title: "Task Management App",
    description: "Collaborative task management tool with real-time updates, team workspaces, and advanced filtering.",
    tags: ["Next.js", "TypeScript", "Supabase", "TailwindCSS"],
    link: "#",
    year: "2023",
  },
  {
    title: "Analytics Dashboard",
    description: "Data visualization dashboard with interactive charts, real-time data updates, and custom reports.",
    tags: ["React", "D3.js", "Express", "MongoDB"],
    link: "#",
    year: "2023",
  },
  {
    title: "Design System",
    description: "Comprehensive component library with documentation, supporting 50+ production applications.",
    tags: ["React", "Storybook", "TypeScript", "CSS-in-JS"],
    link: "#",
    year: "2022",
  },
]

export function Projects() {
  return (
    <section id="projects" className="px-6 py-20 border-t border-border">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">Featured Work</h2>
        <h3 className="mb-12 text-3xl font-bold">Selected Projects</h3>

        <div className="space-y-12">
          {projects.map((project, idx) => (
            <a
              key={idx}
              href={project.link}
              className="group block border-b border-border pb-8 transition-all hover:pb-6 last:border-0"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <h4 className="mb-2 text-xl font-bold group-hover:text-accent transition-colors">{project.title}</h4>
                  <p className="mb-4 text-muted-foreground leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="whitespace-nowrap text-sm text-muted-foreground">{project.year}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
