import Link from "next/link";
import {
  BadgeCheck,
  CalendarClock,
  FileText,
  Repeat,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { CallbackForm } from "@/components/corporate/CallbackForm";
import { VehicleCard } from "@/components/vehicle/VehicleCard";
import { ClientLogos } from "@/components/home/ClientLogos";
import { getVehicles } from "@/lib/cms";
import { categoryLabels } from "@/lib/vehicleDisplay";
import { site } from "@/lib/site";
import { JsonLd, breadcrumbJsonLd, buildMetadata, faqJsonLd } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Corporate Staff Transport and Contract Fleet Hire",
  description:
    "Coasters, vans and buses on contract for staff transport, with vetted drivers, scheduled maintenance, a replacement vehicle guarantee and monthly invoicing. Request a call back from our fleet desk.",
  path: "/corporate",
});

const commitments = [
  {
    Icon: BadgeCheck,
    title: "Drivers we know",
    body: "Documented, trained and assigned to your route, not sourced on the morning. The same faces turn up, which is what makes staff trust the service.",
  },
  {
    Icon: Wrench,
    title: "Maintenance on a schedule",
    body: "Servicing is planned against each registration rather than left until something fails, and the record follows the vehicle.",
  },
  {
    Icon: Repeat,
    title: "A replacement when it matters",
    body: "If a vehicle is off the road, another one covers the route. A contract is only worth what it does on the bad day.",
  },
  {
    Icon: FileText,
    title: "One invoice a month",
    body: "A single monthly bill against your purchase order, with the trips itemised, so procurement has what it needs without chasing us.",
  },
  {
    Icon: CalendarClock,
    title: "Fixed routes and timings",
    body: "Pick-up points and timings agreed once and held to, with changes handled through a named contact rather than a call centre.",
  },
  {
    Icon: ShieldCheck,
    title: "A named account manager",
    body: "One person who knows your contract, reachable directly. Escalation should not mean starting the story again.",
  },
];

const steps = [
  {
    title: "Tell us the requirement",
    body: "Routes, timings, how many staff and from where. A short call is usually enough to size it.",
  },
  {
    title: "We propose a fleet and a rate",
    body: "Vehicle mix, driver cover and a rate schedule, written down so it can go to procurement as it stands.",
  },
  {
    title: "Trial the route",
    body: "Where it helps, we run the route for a short period before the contract starts, so nobody signs on a guess.",
  },
  {
    title: "Contract and invoicing",
    body: "Agreed terms, a named account manager, and a single monthly invoice from then on.",
  },
];

const industries = [
  "Telecom",
  "Banking and finance",
  "FMCG and distribution",
  "Construction and energy",
  "Education",
  "Healthcare",
];

const faqs = [
  {
    question: "What is the smallest contract you take?",
    answer:
      "One vehicle. Plenty of our contracts started with a single coaster on one route and grew from there.",
  },
  {
    question: "Do you provide drivers, or do we?",
    answer:
      "We provide them. Drivers are documented, trained and assigned to your route, and the same drivers run it so your staff know who is collecting them.",
  },
  {
    question: "What happens if a vehicle breaks down on a working day?",
    answer:
      "A replacement covers the route. That guarantee is part of the contract rather than a favour, because a staff route that fails once costs you more than the rental.",
  },
  {
    question: "How is a corporate account billed?",
    answer:
      "A single monthly invoice against your purchase order, with trips itemised. Credit terms are agreed when the contract is set up.",
  },
  {
    question: "Can we see the vehicles before committing?",
    answer:
      "Yes. We would rather you inspected them, and where it helps we will run the route for a short trial period before the contract starts.",
  },
];

export default async function CorporatePage() {
  const vehicles = await getVehicles();
  const corporateFleet = vehicles.filter(
    (vehicle) => vehicle.availableForCorporate,
  );
  const groupTransport = corporateFleet.filter((vehicle) =>
    ["coaster", "van", "bus"].includes(vehicle.category),
  );
  const groupUnits = groupTransport.reduce(
    (sum, vehicle) => sum + vehicle.unitsInFleet,
    0,
  );
  const featured = groupTransport.slice(0, 3);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-edge py-16 lg:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_80%_-10%,rgba(18,55,133,0.12),transparent_60%),radial-gradient(45%_40%_at_0%_0%,rgba(206,29,23,0.07),transparent_70%)]"
        />
        <Container className="relative">
          <div className="grid items-start gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div>
              <p className="eyebrow">Corporate fleet</p>
              <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl">
                Staff transport that runs
                <br />
                <span className="text-accent">without your involvement</span>
              </h1>
              <p className="mt-6 max-w-xl text-lg text-fg-muted">
                {groupUnits} of our vehicles are coasters, vans and intercity
                coaches. Moving people to work, to sites and to events is not a
                sideline for us; it is the larger half of the business.
              </p>

              <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-edge pt-8">
                <div>
                  <dt className="sr-only">Group transport vehicles</dt>
                  <dd>
                    <span className="block font-display text-4xl text-fg">
                      {groupUnits}
                    </span>
                    <span className="mt-1.5 block font-ui text-[0.6875rem] tracking-[0.1em] text-fg-muted uppercase">
                      Group transport vehicles
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="sr-only">Years in service</dt>
                  <dd>
                    <span className="block font-display text-4xl text-fg">
                      {site.claims.yearsInService}
                    </span>
                    <span className="mt-1.5 block font-ui text-[0.6875rem] tracking-[0.1em] text-fg-muted uppercase">
                      Years in service
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="sr-only">On-time record</dt>
                  <dd>
                    <span className="block font-display text-4xl text-fg">
                      {site.claims.onTimeRate}
                    </span>
                    <span className="mt-1.5 block font-ui text-[0.6875rem] tracking-[0.1em] text-fg-muted uppercase">
                      On-time record
                    </span>
                  </dd>
                </div>
              </dl>

              <div className="mt-9 flex flex-wrap gap-3">
                <ButtonLink href="#callback" size="lg">
                  Request a call back
                </ButtonLink>
                <ButtonLink
                  href={`mailto:${site.contact.emailCorporate}`}
                  variant="outline"
                  size="lg"
                >
                  Email the fleet desk
                </ButtonLink>
              </div>
            </div>

            <div id="callback" className="scroll-mt-28 rounded-card border border-edge bg-panel p-7 shadow-card sm:p-8">
              <p className="eyebrow">Fleet desk</p>
              <h2 className="mt-3 text-2xl">Tell us the requirement</h2>
              <p className="mt-2.5 mb-6 text-fg-muted">
                We come back with a vehicle mix and a rate schedule you can take
                straight to procurement.
              </p>
              <CallbackForm />
            </div>
          </div>
        </Container>
      </section>

      <ClientLogos
        title="Organisations we already carry"
        intro="Staff routes, site movements and event transport run for these organisations. We are glad to arrange a reference in your own sector."
        className="border-b border-edge bg-page-alt"
      />

      <section className="py-18 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="What a contract covers"
            title="The parts that decide whether it works"
            description="A staff route is judged on the mornings it would have failed. These are the commitments that decide those mornings."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {commitments.map((item) => (
              <div
                key={item.title}
                className="rounded-card border border-edge bg-panel p-7 transition-colors duration-300 hover:border-red/35"
              >
                <span className="grid h-11 w-11 place-items-center rounded-full border border-red/45 text-accent">
                  <item.Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-6 text-xl">{item.title}</h3>
                <p className="mt-3 text-[0.95rem] text-fg-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-edge bg-page-alt py-18 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="The fleet on contract"
            title="Vehicles built for moving people"
            description={`${corporateFleet.length} of our ${vehicles.length} models are available on contract, from 22-seat coasters down to executive saloons.`}
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2.5">
            {(["coaster", "van", "bus", "suv", "luxury", "sedan"] as const).map(
              (category) => (
                <Link
                  key={category}
                  href={`/fleet/category/${category}`}
                  className="rounded-pill border border-edge bg-panel px-4 py-2 font-ui text-xs text-fg-muted transition-colors hover:border-red hover:text-accent"
                >
                  {categoryLabels[category]}
                </Link>
              ),
            )}
          </div>
        </Container>
      </section>

      <section className="py-18 lg:py-24">
        <Container>
          <SectionHeading
            eyebrow="How it starts"
            title="From first call to first morning"
          />
          <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-card border border-edge bg-panel p-7"
              >
                <span className="font-display text-4xl text-edge-strong">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-xl">{step.title}</h3>
                <p className="mt-3 text-[0.95rem] text-fg-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section
        data-surface="dark"
        className="relative overflow-hidden bg-[linear-gradient(135deg,#0c2559_0%,#101726_55%,#0d0e12_100%)] py-18 text-fg lg:py-24"
      >
        <Container className="relative">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="eyebrow">Who we carry</p>
              <h2 className="mt-4 text-4xl">Organisations we work with</h2>
              <p className="mt-5 max-w-2xl text-lg text-fg-muted">
                Our contracts carry confidentiality terms, so we do not publish
                client names. We are glad to put you in touch with a reference
                in your own sector, with their permission.
              </p>
              <ul className="mt-8 flex flex-wrap gap-2.5">
                {industries.map((industry) => (
                  <li
                    key={industry}
                    className="rounded-pill border border-edge-strong/70 bg-panel/70 px-4 py-2 font-ui text-xs text-fg-muted backdrop-blur"
                  >
                    {industry}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-center gap-3 rounded-card border border-red/30 bg-panel/80 p-8 backdrop-blur">
              <p className="font-display text-2xl">Ask for a reference</p>
              <p className="text-fg-muted">
                Tell us your sector and we will arrange an introduction to a
                client already running with us.
              </p>
              <ButtonLink href="#callback" variant="accent" size="lg" className="mt-4">
                Request a call back
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-18 lg:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <SectionHeading
              eyebrow="Questions"
              title="Before you brief us"
              description="Anything not covered here, ask the fleet desk directly."
            />
            <div className="divide-y divide-edge border-y border-edge">
              {faqs.map((faq) => (
                <details key={faq.question} className="group py-5">
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
                  <p className="mt-4 max-w-2xl text-fg-muted">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Corporate", path: "/corporate" },
        ])}
      />
    </div>
  );
}
