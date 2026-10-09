import { isPreviewData } from "@/lib/cms";

/**
 * Makes it unmistakable that the figures on screen are stand-ins. Disappears on
 * its own once NEXT_PUBLIC_DATA_SOURCE is set to "cms", which is why it is a
 * strip of its own rather than an item inside the announcement ticker: a
 * warning that scrolls past is a warning people miss.
 */
export function PreviewDataNotice() {
  if (!isPreviewData) return null;

  return (
    <div className="bg-ink px-4 py-1.5 text-center font-ui text-[0.6875rem] font-semibold tracking-wide text-yellow">
      Preview build — vehicle rates and fuel prices are placeholders, not real
      quotations.
    </div>
  );
}
