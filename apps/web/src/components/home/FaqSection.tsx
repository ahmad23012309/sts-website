import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getFaqs } from "@/lib/cms";

export async function FaqSection() {
  const faqs = await getFaqs();

  return (
    <section className="border-t border-line py-20 lg:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <SectionHeading
            eyebrow="Questions"
            title="Before you book"
            description="If something is not covered here, call or send a message and we will answer it directly."
          />

          <div className="divide-y divide-line border-y border-line">
            {faqs.map((faq) => (
              <details key={faq.id} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-ui text-base font-medium text-text marker:content-none">
                  {faq.question}
                  <span
                    aria-hidden
                    className="relative grid h-7 w-7 shrink-0 place-items-center rounded-full border border-line text-gold transition-colors group-open:border-gold"
                  >
                    <span className="absolute h-px w-3 bg-current" />
                    <span className="absolute h-3 w-px bg-current transition-transform duration-200 group-open:scale-y-0" />
                  </span>
                </summary>
                <p className="mt-4 max-w-2xl text-muted">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
