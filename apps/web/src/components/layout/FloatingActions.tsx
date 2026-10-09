"use client";

import { useEffect, useState } from "react";
import { ChevronUp, Headset, Mail, SquarePen } from "lucide-react";
import { WhatsappIcon } from "@/components/icons/BrandIcons";
import { site } from "@/lib/site";
import { cn, whatsappLink } from "@/lib/utils";

interface Action {
  key: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  external?: boolean;
  /** Secondary actions are hidden on small screens to keep the rail short. */
  secondary?: boolean;
  className?: string;
}

/**
 * The contact rail: a single capsule pinned to the bottom right, with the ways
 * of reaching us stacked inside it, and a separate return-to-top control below.
 *
 * Every action here works today. Nothing in the rail points at a page that has
 * not been built, because a dead control in a persistent element is worse than
 * no control.
 */
export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tel = `tel:${site.contact.phone.replace(/\s/g, "")}`;

  const actions: Action[] = [
    {
      key: "whatsapp",
      label: "Chat on WhatsApp",
      href: whatsappLink(
        site.contact.whatsapp,
        `Hello ${site.name}, I would like to enquire about a vehicle.`,
      ),
      icon: <WhatsappIcon className="h-5 w-5" />,
      external: true,
      className: "bg-whatsapp text-ink hover:brightness-110",
    },
    {
      key: "call",
      label: `Call ${site.contact.phone}`,
      href: tel,
      icon: <Headset className="h-5 w-5" aria-hidden />,
    },
    {
      key: "email",
      label: "Send an email",
      href: `mailto:${site.contact.email}`,
      icon: <Mail className="h-5 w-5" aria-hidden />,
      secondary: true,
    },
    {
      key: "enquiry",
      label: "Request a call back",
      href: "/contact",
      icon: <SquarePen className="h-5 w-5" aria-hidden />,
      secondary: true,
    },
  ];

  return (
    <div className="fixed right-3 bottom-4 z-40 flex flex-col items-center gap-3 sm:right-5 sm:bottom-6">
      <div className="flex flex-col items-center gap-2 rounded-pill bg-navy p-2 shadow-lift">
        {actions.map((action) => (
          <RailAction key={action.key} action={action} />
        ))}
      </div>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={cn(
          "grid h-12 w-12 place-items-center rounded-full bg-navy text-white shadow-lift transition-all duration-300 hover:bg-navy-deep",
          showTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-2 opacity-0",
        )}
      >
        <ChevronUp className="h-5 w-5" aria-hidden />
      </button>
    </div>
  );
}

function RailAction({ action }: { action: Action }) {
  return (
    <a
      href={action.href}
      target={action.external ? "_blank" : undefined}
      rel={action.external ? "noopener noreferrer" : undefined}
      aria-label={action.label}
      className={cn(
        "group relative grid h-11 w-11 place-items-center rounded-full text-white transition-colors",
        action.className ?? "hover:bg-white/15",
        action.secondary && "hidden sm:grid",
      )}
    >
      {action.icon}
      <span
        aria-hidden
        className="pointer-events-none absolute right-[calc(100%+0.75rem)] rounded-[0.375rem] bg-ink px-3 py-1.5 font-ui text-xs whitespace-nowrap text-white opacity-0 shadow-lift transition-opacity duration-200 group-hover:opacity-100"
      >
        {action.label}
      </span>
    </a>
  );
}
