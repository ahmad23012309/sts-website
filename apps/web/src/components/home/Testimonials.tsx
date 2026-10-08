import { Quote, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getTestimonials } from "@/lib/cms";

/**
 * Renders nothing until genuine testimonials exist. Inventing them would mean
 * publishing false Review structured data, which carries a Google manual action
 * against the whole domain.
 */
export async function Testimonials() {
  const testimonials = await getTestimonials();
  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Customer reviews"
          title="What our customers say"
          align="center"
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {testimonials.slice(0, 6).map((testimonial) => (
            <figure
              key={testimonial.id}
              className="flex h-full flex-col rounded-card border border-line bg-card p-7"
            >
              <Quote className="h-6 w-6 text-red-bright" aria-hidden />
              <blockquote className="mt-5 flex-1 text-[0.95rem] text-muted">
                {testimonial.body}
              </blockquote>
              <div
                className="mt-6 flex items-center gap-1"
                aria-label={`${testimonial.rating} out of 5`}
              >
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    aria-hidden
                    className={
                      index < testimonial.rating
                        ? "h-4 w-4 fill-yellow text-yellow"
                        : "h-4 w-4 text-line-strong"
                    }
                  />
                ))}
              </div>
              <figcaption className="mt-4 border-t border-line pt-4">
                <span className="block font-ui text-sm font-semibold text-text">
                  {testimonial.authorName}
                </span>
                {testimonial.company ? (
                  <span className="mt-0.5 block font-ui text-xs text-faint">
                    {testimonial.company}
                  </span>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
