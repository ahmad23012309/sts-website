import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getFaqs } from "@/lib/cms";
import { site } from "@/lib/site";
import { JsonLd, breadcrumbJsonLd, buildMetadata, faqJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Frequently Asked Questions",
  description:
    "How our rates work, what is included, self-drive requirements, fuel policy and how corporate contracts are set up.",
  path: "/faq",
});

export default async function FaqPage() {
  const base = await getFaqs();

  const extra = [
    {
      id: "x-included",
      question: "What is included in the rate?",
      answer: `${site.rentalTerms.included.join(". ")}. Not included: ${site.rentalTerms.excluded.join("; ")}.`,
    },
    {
      id: "x-discount",
      question: "Do longer rentals cost less per day?",
      answer:
        "Yes. The daily rate drops by 10% from seven days, 15% from fourteen and 20% from thirty. The discount applies to the vehicle rate; fuel and driver allowances do not fall with time, so they are charged as normal.",
    },
    {
      id: "x-corporate",
      question: "How does a corporate contract start?",
      answer:
        "Tell us the routes, timings and numbers. We come back with a vehicle mix and a rate schedule you can take to procurement, run a trial on the route where it helps, then set up the contract with a named account manager and monthly invoicing.",
    },
    {
      id: "x-areas",
      question: "Where do you deliver vehicles?",
      answer: `Across Lahore, including ${site.serviceAreas.slice(0, 6).join(", ")} and the airport. Intercity journeys and one-way drops are available nationwide.`,
    },
  ];

  const faqs = [...base, ...extra];

  return (
    <div className="py-14 lg:py-20">
      <Container>
        <SectionHeading
          as="h1"
          eyebrow="Questions"
          title="Everything people ask before booking"
          description="If something is not covered here, call or send a message and we will answer it directly."
        />

        <div className="mt-12 max-w-3xl divide-y divide-edge border-y border-edge">
          {faqs.map((faq) => (
            <details key={faq.id} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-ui text-base font-medium text-fg marker:content-none">
                {faq.question}
                <span
                  aria-hidden
                  className="relative grid h-7 w-7 shrink-0 place-items-center rounded-full border border-edge text-accent transition-colors group-open:border-red"
                >
                  <span className="absolute h-px w-3 bg-current" />
                  <span className="absolute h-3 w-px bg-current transition-transform duration-200 group-open:scale-y-0" />
                </span>
              </summary>
              <p className="mt-4 text-fg-muted">{faq.answer}</p>
            </details>
          ))}
        </div>

        <p className="mt-10 text-fg-muted">
          Still unsure?{" "}
          <Link
            href="/contact"
            className="text-accent underline decoration-red/40 decoration-2 underline-offset-[5px] hover:decoration-red"
          >
            Ask us directly
          </Link>
          .
        </p>
      </Container>

      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ])}
      />
    </div>
  );
}
