"use client";

import { useEffect, useRef, useState } from "react";
import { Rotate3d } from "lucide-react";
import type { SketchfabModel } from "@/lib/cms/types";

/**
 * Embeds a Sketchfab model.
 *
 * By default the player is only mounted after the visitor asks for it, because
 * Sketchfab's viewer pulls several megabytes of script, textures and geometry
 * and loading that on sight would undo the performance work elsewhere. Pass
 * `autoLoad` on the one place where the moving model is the point, and it
 * mounts when the section scrolls into view instead.
 *
 * Attribution is not optional. Nearly every model on Sketchfab is published
 * under a licence requiring the author to be named wherever it appears, so
 * when we do not hold the author's name the player's own information bar is
 * left switched on and Sketchfab credits them for us.
 */
export function SketchfabViewer({
  model,
  poster,
  className,
  frameClassName = "aspect-[4/3] lg:aspect-[16/11]",
  autoLoad = false,
}: {
  model: SketchfabModel;
  poster: React.ReactNode;
  className?: string;
  /**
   * The frame carries its own proportions rather than inheriting them from the
   * poster, which disappears the moment the player mounts.
   */
  frameClassName?: string;
  autoLoad?: boolean;
}) {
  const [active, setActive] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoLoad || active) return;
    const node = frameRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "250px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [autoLoad, active]);

  const params = new URLSearchParams({
    autostart: "1",
    autospin: "0.3",
    preload: "0",
    // Left on so the player names the model and its author.
    ui_infos: "1",
    ui_hint: "0",
    ui_theme: "dark",
  });

  return (
    <div className={className}>
      <div
        ref={frameRef}
        className={`relative w-full overflow-hidden rounded-card border border-edge bg-page-alt ${frameClassName}`}
      >
        {active ? (
          <iframe
            title={`${model.title} — interactive 3D model`}
            src={`https://sketchfab.com/models/${model.uid}/embed?${params.toString()}`}
            allow="autoplay; fullscreen; xr-spatial-tracking"
            allowFullScreen
            loading="lazy"
            className="h-full w-full border-0"
          />
        ) : (
          <>
            <div className="absolute inset-0">{poster}</div>
            <button
              type="button"
              onClick={() => setActive(true)}
              className="absolute inset-0 grid place-items-center bg-ink/35 transition-colors hover:bg-ink/45"
            >
              <span className="inline-flex items-center gap-2.5 rounded-pill bg-red px-6 py-3 font-ui text-sm font-semibold tracking-wide text-white uppercase shadow-lift">
                <Rotate3d className="h-4 w-4" aria-hidden />
                View in 3D
              </span>
            </button>
          </>
        )}
      </div>

      <p className="mt-3 font-ui text-xs text-fg-faint">
        3D model{" "}
        <a
          href={model.modelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-fg-muted"
        >
          {model.title}
        </a>
        {model.authorName ? (
          <>
            {" "}by{" "}
            <a
              href={model.authorUrl ?? model.modelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-fg-muted"
            >
              {model.authorName}
            </a>
          </>
        ) : null}
        {model.license ? <>, licensed under {model.license}</> : null}, via
        Sketchfab. The author is credited in the viewer.
        {model.accuracy === "representative" ? (
          <>
            {" "}
            Shown as a representative model of this body style; the vehicle
            supplied is the one in the photographs.
          </>
        ) : null}
      </p>
    </div>
  );
}
