import { BadgeCheck, CalendarCheck, Headphones, ReceiptText, ShieldCheck, Wrench } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const reasons = [
  {
    Icon: ReceiptText,
    title: "Pricing you can check",
    body: "Every quote is itemised: vehicle, fuel, driver, tolls. Nothing is folded into a round number you cannot question.",
  },
  {
    Icon: CalendarCheck,
    title: "Real availability",
    body: "The calendar on each vehicle reflects what is actually free, so a confirmed booking stays confirmed.",
  },
  {
    Icon: Wrench,
    title: "Maintained fleet",
    body: "Scheduled servicing on every vehicle, with records kept against each registration.",
  },
  {
    Icon: BadgeCheck,
    title: "Vetted drivers",
    body: "Drivers are documented, trained and assigned, not sourced on the day.",
  },
  {
    Icon: ShieldCheck,
    title: "Insured vehicles",
    body: "Cover details are published rather than described vaguely at handover.",
  },
  {
    Icon: Headphones,
    title: "Reachable support",
    body: "Phone and WhatsApp during the rental, not only while you are booking.",
  },
];

export function WhyUs() {
  return (
    <section className="border-y border-line bg-surface py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Why Sidhu Travel Services"
          title="The things that actually decide a rental"
          align="center"
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, index) => (
            <Reveal key={reason.title} delay={(index % 3) * 70}>
              <div className="h-full rounded-card border border-line bg-card p-7 transition-colors duration-300 hover:border-red/35">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-red/45 text-red-bright">
                  <reason.Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-6 text-xl">{reason.title}</h3>
                <p className="mt-3 text-[0.95rem] text-muted">{reason.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
