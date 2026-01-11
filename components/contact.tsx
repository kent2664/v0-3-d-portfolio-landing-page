import { Download } from "lucide-react"

export function Contact() {
  return (
    <section id="contact" className="px-6 py-20 border-t border-[#664903]">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">Get In Touch</h2>
        <h3 className="mb-8 text-3xl font-bold">Let's Work Together</h3>

        <p className="mb-12 text-lg text-muted-foreground leading-relaxed max-w-2xl">
          I'm always interested in hearing about new projects and opportunities. Whether you have a question or just
          want to say hi, feel free to reach out!
        </p>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href="mailto:hello@example.com"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-medium text-accent-foreground transition-colors hover:bg-accent/90"
            >
              Send Email
            </a>
            <a
              href=""
              download="KentaYusa_Resume.pdf"
              className="inline-flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-6 py-3 font-medium text-accent transition-colors hover:bg-accent/20 hover:border-accent/50"
            >
              <Download className="h-4 w-4" />
              Download Resume
            </a>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="text-muted-foreground transition-colors hover:text-foreground" aria-label="GitHub">
              GitHub
            </a>
            <a href="#" className="text-muted-foreground transition-colors hover:text-foreground" aria-label="LinkedIn">
              LinkedIn
            </a>
            <a href="#" className="text-muted-foreground transition-colors hover:text-foreground" aria-label="Twitter">
              Twitter
            </a>
          </div>
        </div>

        <div className="mt-20 border-t border-[#664903] pt-8 text-center text-sm text-muted-foreground">
          <p>© 2026 Kenta Yusa. All rights reserved.</p>
        </div>
      </div>
    </section>
  )
}
