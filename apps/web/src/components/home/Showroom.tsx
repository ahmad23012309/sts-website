"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { CarViewer, type PaintOption } from "@/components/three/CarViewer";
import { cn } from "@/lib/utils";

const paints: PaintOption[] = [
  { name: "Brand Red", hex: "#CE1D17" },
  { name: "Pearl White", hex: "#EDEFF2" },
  { name: "Graphite", hex: "#44484F" },
  { name: "Midnight Navy", hex: "#16306B" },
  { name: "Signal Yellow", hex: "#FFC72C" },
  { name: "Attitude Black", hex: "#16171A" },
];

export function Showroom() {
  const [paint, setPaint] = useState<PaintOption>(paints[0]!);

  return (
    <section className="overflow-hidden border-y border-edge bg-page-alt py-20 lg:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div>
            <SectionHeading
              eyebrow="3D showroom"
              title="Walk around it before you book"
              description="Turn the car, change the paint, see the proportions. The same viewer sits on every vehicle page, so you know what is arriving at your door."
            />

            <div className="mt-9">
              <p className="font-ui text-[0.6875rem] font-semibold tracking-[0.14em] text-fg-muted uppercase">
                Paint — {paint.name}
              </p>
              <ul className="mt-4 flex flex-wrap gap-3">
                {paints.map((option) => {
                  const active = option.hex === paint.hex;
                  return (
                    <li key={option.hex}>
                      <button
                        type="button"
                        onClick={() => setPaint(option)}
                        aria-pressed={active}
                        title={option.name}
                        className={cn(
                          "h-10 w-10 rounded-full border-2 transition-transform duration-200 hover:scale-110",
                          active
                            ? "border-red scale-110"
                            : "border-edge-strong",
                        )}
                        style={{ backgroundColor: option.hex }}
                      >
                        <span className="sr-only">{option.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <p className="mt-7 text-fg-muted">
              Drag to rotate. Colours shown are indicative of the finishes we
              stock; the exact shade available is confirmed when you book.
            </p>

            <ButtonLink href="/fleet" size="lg" className="mt-8">
              Browse the fleet
            </ButtonLink>
          </div>

          <div className="relative aspect-[4/3] w-full rounded-card border border-edge bg-[radial-gradient(70%_60%_at_50%_15%,#ffffff_0%,#e9edf3_70%,#dde3ec_100%)] shadow-card lg:aspect-[16/11]">
            <CarViewer paint={paint} className="absolute inset-0" />
          </div>
        </div>
      </Container>
    </section>
  );
}
