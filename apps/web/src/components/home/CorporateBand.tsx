import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

const credentials = [
  "Telecom",
  "Banking and finance",
  "FMCG and distribution",
  "Construction and energy",
];

/**
 * Client names and logos are withheld until written permission is on file.
 * Industry-level credentials carry the same reassurance without putting the
 * company in breach of a confidentiality clause.
 */
export function CorporateBand() {
  return (
    <section className="relative overflow-hidden border-y border-line bg-[linear-gradient(135deg,#1c1b20,#121214_60%)] py-20 lg:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_85%_20%,rgba(199,166,104,0.14),transparent_65%)]"
      />
      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow">Corporate fleet</p>
            <h2 className="mt-4 text-4xl sm:text-5xl">
              Fleets that run without your involvement
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-muted">
              Vehicles on contract, drivers vetted and scheduled, maintenance
              handled, replacements guaranteed, and one invoice at the end of the
              month. Procurement gets the paperwork it needs; your staff just get
              a car that turns up.
            </p>

            <ul className="mt-9 flex flex-wrap gap-2.5">
              {credentials.map((industry) => (
                <li
                  key={industry}
                  className="rounded-pill border border-line bg-card px-4 py-2 font-ui text-xs text-muted"
                >
                  {industry}
                </li>
              ))}
            </ul>
            <p className="mt-4 font-ui text-xs text-faint">
              Serving organisations across these sectors. Client names are shared
              on request, with their permission.
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-card border border-gold/30 bg-card/80 p-8 backdrop-blur">
            <p className="font-display text-2xl">Talk to the fleet desk</p>
            <p className="text-muted">
              Send your requirement and we will come back with a contract
              proposal and a rate schedule.
            </p>
            <ButtonLink href="/corporate" size="lg" className="mt-4">
              Request a call back
              <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/corporate" variant="outline" size="lg">
              Corporate services
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
