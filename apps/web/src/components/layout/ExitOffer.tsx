"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Tag, X } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/lib/site";

const STORAGE_KEY = "sts-offer-seen";

/** Paths where interrupting someone would be unhelpful. */
const SUPPRESSED = ["/book", "/corporate", "/privacy-policy", "/terms"];

function seenRecently() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (!value) return false;
    const age = Date.now() - Number(value);
    return age < site.offer.repeatAfterDays * 86400000;
  } catch {
    // Private browsing, blocked storage, or a quota error. Treat it as unseen
    // rather than letting a storage failure take the offer down entirely.
    return false;
  }
}

function markSeen() {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    // Nothing to do; the visitor may see it again next time.
  }
}

/**
 * Shows the offer once, as the visitor is leaving.
 *
 * On a desktop that means the pointer leaving through the top of the window.
 * A phone has no equivalent signal, so it waits for real engagement instead:
 * halfway down the page and a while spent there. Either way it appears once
 * per visitor per month, never during a booking, and never for anyone who has
 * asked for reduced motion to be respected in a modal sense by pressing Escape.
 */
export function ExitOffer() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const armedRef = useRef(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const dismiss = useCallback(() => {
    setOpen(false);
    markSeen();
  }, []);

  useEffect(() => {
    if (!site.offer.enabled) return;
    if (SUPPRESSED.some((path) => pathname.startsWith(path))) return;
    if (seenRecently()) return;

    armedRef.current = true;
    let timer: number | undefined;

    const trigger = () => {
      if (!armedRef.current) return;
      armedRef.current = false;
      setOpen(true);
    };

    const onPointerOut = (event: MouseEvent) => {
      if (event.clientY <= 0 && !event.relatedTarget) trigger();
    };

    const onScroll = () => {
      const scrolled =
        window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrolled < 0.5) return;
      if (timer !== undefined) return;
      timer = window.setTimeout(trigger, 12000);
    };

    document.addEventListener("mouseout", onPointerOut);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("mouseout", onPointerOut);
      window.removeEventListener("scroll", onScroll);
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, dismiss]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] grid place-items-center bg-ink/70 p-4 backdrop-blur-sm"
      onClick={dismiss}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="offer-headline"
        onClick={(event) => event.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-card border border-edge bg-panel p-8 shadow-lift"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={dismiss}
          aria-label="Close offer"
          className="absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full border border-edge text-fg-muted transition-colors hover:border-red hover:text-accent"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>

        <span className="grid h-11 w-11 place-items-center rounded-full border border-red/45 text-accent">
          <Tag className="h-5 w-5" aria-hidden />
        </span>

        <h2 id="offer-headline" className="mt-6 text-3xl">
          {site.offer.headline}
        </h2>
        <p className="mt-3 text-fg-muted">{site.offer.body}</p>

        <div className="mt-6 rounded-[0.5rem] border border-dashed border-red/50 bg-red/5 px-5 py-4 text-center">
          <p className="font-ui text-[0.625rem] tracking-[0.14em] text-fg-muted uppercase">
            Your code
          </p>
          <p className="tabular mt-1 text-2xl font-semibold tracking-[0.18em] text-accent">
            {site.offer.code}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <ButtonLink href="/book" size="lg" onClick={dismiss}>
            Book now and use it
          </ButtonLink>
          <button
            type="button"
            onClick={dismiss}
            className="font-ui text-sm text-fg-muted underline underline-offset-4 hover:text-fg"
          >
            No thanks
          </button>
        </div>

        <p className="mt-5 font-ui text-[0.6875rem] leading-relaxed text-fg-faint">
          {site.offer.terms}
        </p>
      </div>
    </div>
  );
}
