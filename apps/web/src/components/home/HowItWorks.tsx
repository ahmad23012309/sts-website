import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const steps = [
  {
    title: "Choose a vehicle",
    body: "Filter the fleet by type, seats, transmission or budget, and open the vehicle for its full specification.",
  },
  {
    title: "Get the fare",
    body: "Enter the route and dates. The estimate appears immediately, broken down line by line.",
  },
  {
    title: "Confirm the booking",
    body: "Book on the page, on the dedicated booking screen or over WhatsApp. We confirm availability and collection.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionHeading eyebrow="How it works" title="Three steps, no phone tag" />

        <ol className="mt-14 grid gap-5 lg:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="relative rounded-card border border-line bg-card p-8"
            >
              <span className="font-display text-5xl text-line-strong">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-2xl">{step.title}</h3>
              <p className="mt-3 text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
