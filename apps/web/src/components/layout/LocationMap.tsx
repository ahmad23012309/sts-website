import { ExternalLink, MapPin } from "lucide-react";
import { site } from "@/lib/site";

/**
 * The office on a map.
 *
 * Uses Google's keyless embed, so there is no API key to leak, no billing to
 * enable and nothing to break when a key rotates. It is lazy-loaded, because a
 * map in the footer should never delay the page above it.
 */
export function LocationMap() {
  const query = encodeURIComponent(site.contact.mapQuery);
  const directions = site.contact.googleBusinessUrl
    ? site.contact.googleBusinessUrl
    : `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <div className="overflow-hidden rounded-card border border-edge bg-panel">
      <iframe
        title={`Map showing ${site.name}`}
        src={`https://www.google.com/maps?q=${query}&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-64 w-full border-0 grayscale-[35%]"
      />
      <div className="flex flex-wrap items-start justify-between gap-4 p-5">
        <p className="flex items-start gap-3 font-ui text-sm text-fg-muted">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
          <span>
            {site.contact.addressLine}
            <br />
            {site.contact.city}, {site.contact.country}
          </span>
        </p>
        <a
          href={directions}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-ui text-xs font-semibold tracking-wide text-accent uppercase underline decoration-red/40 decoration-2 underline-offset-[6px] hover:decoration-red"
        >
          Get directions
          <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </a>
      </div>
    </div>
  );
}
