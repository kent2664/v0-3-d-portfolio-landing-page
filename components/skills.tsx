const skillCategories = [
  {
    title: "Frontend",
    skills: ["React", "TypeScript", "TailwindCSS", "Vue.js"],
  },
  {
    title: "Backend",
    skills: ["Node.js","Oracle/PostgreSQL/MySQL", "Java",  "PHP","Python"],
  },
  {
    title: "Tools & Platforms",
    skills: ["Git", "Docker", "AWS", "Vercel", "GitHub", "Oracle Cloud Infrastructure"],
  },
]

export function Skills() {
  return (
    <section id="skills" className="px-6 py-20 border-t border-b border-[#664903]">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">Skills & Tools</h2>
        <h3 className="mb-12 text-3xl font-bold">Technologies I Work With</h3>

        <div className="grid gap-12 md:grid-cols-3">
          {skillCategories.map((category) => (
            <div key={category.title}>
              <h4 className="mb-6 font-semibold text-lg">{category.title}</h4>
              <ul className="space-y-3">
                {category.skills.map((skill) => (
                  <li
                    key={skill}
                    className="flex items-center gap-3 text-muted-foreground group hover:text-foreground transition-colors cursor-default"
                  >
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
