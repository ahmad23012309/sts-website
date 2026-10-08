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
    <section
      data-surface="dark"
      className="relative overflow-hidden bg-[linear-gradient(135deg,#0c2559_0%,#101726_55%,#0d0e12_100%)] py-20 text-fg lg:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(65%_55%_at_88%_18%,rgba(206,29,23,0.22),transparent_65%)]"
      />
      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow">Corporate fleet</p>
            <h2 className="mt-4 text-4xl sm:text-5xl">
              Fleets that run without your involvement
            </h2>
            <p className="mt-6 max-w-2xl text-lg text-fg-muted">
              Vehicles on contract, drivers vetted and scheduled, maintenance
              handled, replacements guaranteed, and one invoice at the end of the
              month. Procurement gets the paperwork it needs; your staff just get
              a car that turns up.
            </p>

            <ul className="mt-9 flex flex-wrap gap-2.5">
              {credentials.map((industry) => (
                <li
                  key={industry}
                  className="rounded-pill border border-edge-strong/70 bg-panel/70 px-4 py-2 font-ui text-xs text-fg-muted backdrop-blur"
                >
                  {industry}
                </li>
              ))}
            </ul>
            <p className="mt-4 font-ui text-xs text-fg-faint">
              Serving organisations across these sectors. Client names are shared
              on request, with their permission.
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-card border border-red/40 bg-panel/80 p-8 backdrop-blur">
            <p className="font-display text-2xl">Talk to the fleet desk</p>
            <p className="text-fg-muted">
              Send your requirement and we will come back with a contract
              proposal and a rate schedule.
            </p>
            <ButtonLink href="/corporate" variant="accent" size="lg" className="mt-4">
              Request a call back
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
