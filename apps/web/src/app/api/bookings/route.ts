import { NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validation/forms";
import { pruneRateLimitBuckets, rateLimit } from "@/lib/rateLimit";
import {
  DeliveryNotConfiguredError,
  deliverSubmission,
} from "@/lib/integrations/delivery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  pruneRateLimitBuckets();

  const limit = rateLimit({
    key: `booking:${clientIp(request)}`,
    limit: 8,
    windowMs: 15 * 60 * 1000,
  });

  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please check the details and try again." },
      { status: 422 },
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ message: "Request received." }, { status: 202 });
  }

  const { website: _ignored, ...payload } = parsed.data;

  // A drop-off before the pick-up is the one cross-field rule worth enforcing
  // here rather than in the schema, so the message can be specific.
  if (payload.dropoffDate < payload.pickupDate) {
    return NextResponse.json(
      { message: "The drop-off date cannot be before the pick-up date." },
      { status: 422 },
    );
  }

  try {
    await deliverSubmission({
      kind: "booking",
      receivedAt: new Date().toISOString(),
      payload,
    });
  } catch (error) {
    if (error instanceof DeliveryNotConfiguredError) {
      return NextResponse.json(
        {
          message:
            "Online booking is not connected yet. Please call or message us on WhatsApp and we will take the details.",
        },
        { status: 503 },
      );
    }

    console.error("Booking delivery failed");
    return NextResponse.json(
      { message: "Could not send the request. Please call us instead." },
      { status: 502 },
    );
  }

  return NextResponse.json(
    { message: "Request received. We will confirm availability and call you." },
    { status: 201 },
  );
}
