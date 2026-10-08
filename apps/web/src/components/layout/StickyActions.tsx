"use client";

import { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { WhatsappIcon } from "@/components/icons/BrandIcons";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/utils";

/**
 * Floating call and WhatsApp controls. They appear after the visitor has
 * scrolled past the hero so they never cover the first screen.
 */
export function StickyActions() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed right-4 bottom-4 z-40 flex flex-col gap-3 transition-all duration-300 sm:right-6 sm:bottom-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <a
        href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
        className="grid h-13 w-13 place-items-center rounded-full border border-red/50 bg-card text-red-bright shadow-lift transition-colors hover:border-red hover:bg-elevated"
        aria-label="Call us"
      >
        <Phone className="h-5 w-5" aria-hidden />
      </a>
      <a
        href={whatsappLink(
          site.contact.whatsapp,
          `Hello ${site.name}, I would like to enquire about a rental.`,
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="grid h-13 w-13 place-items-center rounded-full bg-whatsapp text-ink shadow-lift transition-[filter] hover:brightness-110"
        aria-label="Chat on WhatsApp"
      >
        <WhatsappIcon className="h-5 w-5" />
      </a>
    </div>
  );
}
