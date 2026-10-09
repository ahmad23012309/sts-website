import { AlertTriangle } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/lib/site";

/**
 * Shared shell for the policy pages.
 *
 * While the policies are unreviewed the page says so at the top. A draft
 * published quietly as if it were final is the failure mode these pages exist
 * to prevent, and the notice costs one boolean to remove.
 */
export function LegalPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  const updated = new Date(site.legal.lastUpdated).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="py-14 lg:py-20">
      <Container>
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} description={intro} />

        <p className="mt-6 font-ui text-xs text-fg-faint">
          Last updated {updated}
        </p>

        {!site.legal.reviewed ? (
          <div className="mt-8 flex gap-3 rounded-card border border-yellow-dark/40 bg-yellow/10 p-5">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-dark" aria-hidden />
            <p className="font-ui text-sm text-fg-muted">
              <span className="font-semibold text-fg">Draft under review.</span>{" "}
              This policy has been prepared from standard practice in the
              Pakistani rental market and is awaiting confirmation. Where it
              differs from the rental agreement you sign, the signed agreement
              governs.
            </p>
          </div>
        ) : null}

        <article className="legal-body mt-12 max-w-3xl">{children}</article>

        <p className="mt-14 max-w-3xl font-ui text-xs text-fg-faint">
          Questions about any of this? Call {site.contact.phone} or email{" "}
          <a
            href={`mailto:${site.contact.email}`}
            className="underline underline-offset-2 hover:text-fg-muted"
          >
            {site.contact.email}
          </a>
          .
        </p>
      </Container>
    </div>
  );
}
