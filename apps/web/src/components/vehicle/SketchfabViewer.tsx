"use client";

import { useState } from "react";
import { Rotate3d } from "lucide-react";
import type { SketchfabModel } from "@/lib/cms/types";

/**
 * Embeds a Sketchfab model.
 *
 * The player is only mounted after the visitor asks for it. Sketchfab's viewer
 * pulls several megabytes of script, textures and geometry, and loading that on
 * sight would undo the performance work everywhere else on the page. Until then
 * the vehicle photograph stands in, which is what most visitors want anyway.
 *
 * The credit line is not decoration: nearly every model on Sketchfab is
 * published under a licence that requires the author to be named wherever the
 * model is shown, so it is rendered from the same record as the model itself
 * and cannot be forgotten.
 */
export function SketchfabViewer({
  model,
  poster,
  className,
}: {
  model: SketchfabModel;
  poster: React.ReactNode;
  className?: string;
}) {
  const [active, setActive] = useState(false);

  const params = new URLSearchParams({
    autostart: "1",
    autospin: "0.3",
    preload: "0",
    ui_infos: "0",
    ui_watermark: "0",
    ui_hint: "0",
    ui_theme: "dark",
    transparent: "0",
  });

  return (
    <div className={className}>
      <div className="relative h-full w-full overflow-hidden rounded-card border border-edge bg-page-alt">
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
            {poster}
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
        </a>{" "}
        by{" "}
        <a
          href={model.authorUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-fg-muted"
        >
          {model.authorName}
        </a>
        , licensed under {model.license}, via Sketchfab.
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
