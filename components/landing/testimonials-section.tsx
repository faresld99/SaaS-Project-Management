const testimonials = [
  {
    quote: "ProjectFlow transformed how our team works. We shipped 40% faster in just the first month.",
    author: "Sarah Chen",
    role: "Engineering Manager",
    company: "TechCorp",
  },
  {
    quote:
      "The best project management tool we've used. Simple enough for everyone, powerful enough for complex projects.",
    author: "Michael Roberts",
    role: "Product Lead",
    company: "StartupXYZ",
  },
  {
    quote: "Finally, a tool that doesn't get in the way. Our designers and developers love it equally.",
    author: "Emma Wilson",
    role: "Design Director",
    company: "Creative Agency",
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="border-t border-border bg-muted/30 py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight md:text-4xl">Loved by teams everywhere</h2>
          <p className="text-pretty text-lg text-muted-foreground">See what teams are saying about ProjectFlow.</p>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div key={testimonial.author} className="rounded-xl border border-border bg-card p-6">
              <blockquote className="mb-6 text-pretty">&ldquo;{testimonial.quote}&rdquo;</blockquote>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <span className="text-sm font-medium">
                    {testimonial.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-medium">{testimonial.author}</div>
                  <div className="text-xs text-muted-foreground">
                    {testimonial.role}, {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
