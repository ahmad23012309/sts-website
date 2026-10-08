import { NextResponse } from "next/server";
import { quickBookingSchema } from "@/lib/validation/forms";
import { rateLimit, pruneRateLimitBuckets } from "@/lib/rateLimit";
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
    key: `quick-booking:${clientIp(request)}`,
    limit: 5,
    windowMs: 10 * 60 * 1000,
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

  const parsed = quickBookingSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please check the details and try again." },
      { status: 422 },
    );
  }

  // A filled honeypot means an automated submission. Accept it silently so the
  // sender learns nothing, and discard it.
  if (parsed.data.website) {
    return NextResponse.json({ message: "Request received." }, { status: 202 });
  }

  const { website: _ignored, ...payload } = parsed.data;

  try {
    await deliverSubmission({
      kind: "quick-booking",
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

    console.error("Quick booking delivery failed");
    return NextResponse.json(
      { message: "Could not send your request. Please call us instead." },
      { status: 502 },
    );
  }

  return NextResponse.json(
    { message: "Request received. We will call you shortly." },
    { status: 201 },
  );
}
