import { isPreviewData } from "@/lib/cms";

/**
 * Makes it unmistakable that the figures on screen are stand-ins. Disappears on
 * its own once NEXT_PUBLIC_DATA_SOURCE is set to "cms".
 */
export function PreviewDataNotice() {
  if (!isPreviewData) return null;

  return (
    <div className="bg-yellow px-4 py-2 text-center font-ui text-xs font-semibold tracking-wide text-ink">
      Preview build — vehicles, rates and fuel prices on this site are
      placeholders and are not real quotations.
    </div>
  );
}
