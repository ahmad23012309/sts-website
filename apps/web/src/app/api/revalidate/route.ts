import { createHmac, timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Clears the content cache when the backend says something changed.
 *
 * Without this, an edit in WordPress takes up to the adapter's revalidate
 * window to appear. With it, saving a vehicle or a fuel rate drops the cache
 * immediately, which is the "one click and it is live" the business asked for.
 *
 * The request is signed the same way bookings travelling the other way are:
 * HMAC-SHA256 over "<timestamp>.<body>" with a shared secret, compared in
 * constant time, and rejected outside a five-minute window so a captured
 * request cannot be replayed. An unsigned or stale request revalidates nothing.
 */

const REPLAY_WINDOW_SECONDS = 300;

export async function POST(request: Request): Promise<NextResponse> {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret) {
    // Nothing to verify against, so nothing is trusted.
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const timestamp = request.headers.get("x-sts-timestamp");
  const signature = request.headers.get("x-sts-signature");

  if (!timestamp || !signature) {
    return NextResponse.json({ error: "Unsigned request" }, { status: 401 });
  }

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > REPLAY_WINDOW_SECONDS) {
    return NextResponse.json({ error: "Stale request" }, { status: 401 });
  }

  const body = await request.text();
  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${body}`)
    .digest("hex");

  const given = Buffer.from(signature, "utf8");
  const want = Buffer.from(expected, "utf8");

  if (given.length !== want.length || !timingSafeEqual(given, want)) {
    return NextResponse.json({ error: "Bad signature" }, { status: 401 });
  }

  // "max" expires the entry outright rather than letting it be served stale.
  revalidateTag("cms", "max");

  return NextResponse.json({ revalidated: true });
}
