import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { clients } from "@/lib/cms/clients";
import { cn } from "@/lib/utils";

/**
 * The client strip.
 *
 * Rendered twice and moved by exactly half its width, so the loop has no
 * visible seam; the duplicate is hidden from assistive technology. It pauses on
 * hover and on keyboard focus, and stops moving entirely under
 * prefers-reduced-motion, where it becomes an ordinary scrollable row.
 *
 * Each mark sits on a white chip rather than being keyed out of its background,
 * which avoids the grey halo that comes from removing white from a compressed
 * image.
 */
export function ClientLogos({
  title = "Organisations we carry",
  intro,
  className,
}: {
  title?: string;
  intro?: string;
  className?: string;
}) {
  const visible = clients.filter((client) => client.showLogo);
  if (visible.length === 0) return null;

  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {visible.map((client) => (
        <li key={client.slug} className="px-3">
          <span className="grid h-20 w-40 place-items-center rounded-card border border-edge bg-white px-4 shadow-card">
            <Image
              src={client.logo}
              alt={client.name}
              width={client.width}
              height={client.height}
              sizes="160px"
              className="max-h-12 w-auto object-contain"
            />
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <section className={cn("overflow-hidden py-16 lg:py-20", className)}>
      <Container>
        <div className="text-center">
          <p className="eyebrow">Trusted by</p>
          <h2 className="mt-3 text-3xl sm:text-4xl">{title}</h2>
          {intro ? (
            <p className="mx-auto mt-4 max-w-2xl text-fg-muted">{intro}</p>
          ) : null}
        </div>
      </Container>

      <div
        className="ticker mt-10 overflow-hidden"
        role="region"
        aria-label="Organisations we have carried"
      >
        <div className="logo-track">
          {row(false)}
          {row(true)}
        </div>
      </div>

      <Container>
        <p className="mt-8 text-center font-ui text-xs text-fg-faint">
          Logos are the property of their owners and identify organisations we
          have carried. They do not imply endorsement.
        </p>
      </Container>
    </section>
  );
}
