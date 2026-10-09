"use client";

import { useEffect, useRef, useState } from "react";
import { useLacksIntersectionObserver } from "@/lib/hooks/browser";
import { cn } from "@/lib/utils";

/**
 * Fades content in the first time it enters the viewport. Uses an
 * IntersectionObserver rather than an animation library so the homepage carries
 * no extra JavaScript for what is a cosmetic effect.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const cannotObserve = useLacksIntersectionObserver();
  const shown = seen || cannotObserve;

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setSeen(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn("reveal", shown && "reveal-in", className)}
    >
      {children}
    </div>
  );
}
