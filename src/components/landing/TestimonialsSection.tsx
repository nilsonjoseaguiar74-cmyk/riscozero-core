import { useQuery } from "@tanstack/react-query";
import { Star } from "lucide-react";
import { Section, SectionHeading } from "@/components/landing/Section";
import { queryKeys, services } from "@/services";

const MAX_RATING = 5;
const STARS = Array.from({ length: MAX_RATING }, (_, index) => index);

export function TestimonialsSection() {
  const { data: testimonials = [] } = useQuery({
    queryKey: queryKeys.testimonials,
    queryFn: () => services.siteContent.getTestimonials(),
  });

  const activeTestimonials = testimonials
    .filter((testimonial) => testimonial.active)
    .toSorted((a, b) => a.order - b.order);

  if (activeTestimonials.length === 0) return null;

  return (
    <Section>
      <SectionHeading
        eyebrow="Depoimentos"
        title="O que nossos associados dizem"
        description="Avaliações compartilhadas por associados sobre o atendimento e a assistência da Risco Zero."
      />
      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {activeTestimonials.map((testimonial) => (
          <article key={testimonial.id} className="card-elevated flex h-full flex-col p-5">
            <div
              className="flex items-center gap-1 text-gold"
              aria-label={`${testimonial.rating} de ${MAX_RATING} estrelas`}
            >
              {STARS.map((star) => (
                <Star
                  key={star}
                  className={star < testimonial.rating ? "size-4 fill-current" : "size-4"}
                  aria-hidden={true}
                />
              ))}
            </div>
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
              “{testimonial.quote}”
            </blockquote>
            <footer className="mt-5 border-t border-border pt-4">
              <p className="font-[650] text-foreground">{testimonial.name}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                Avaliação no {testimonial.source}
              </p>
            </footer>
          </article>
        ))}
      </div>
    </Section>
  );
}
