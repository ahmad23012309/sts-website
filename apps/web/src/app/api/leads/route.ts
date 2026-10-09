import { NextResponse } from "next/server";
import { corporateLeadSchema } from "@/lib/validation/forms";
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
    key: `lead:${clientIp(request)}`,
    limit: 5,
    windowMs: 30 * 60 * 1000,
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

  const parsed = corporateLeadSchema.safeParse(json);
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

  try {
    // Corporate enquiries travel as their own kind so they can be routed to a
    // separate pipeline rather than queued behind retail bookings.
    await deliverSubmission({
      kind: "corporate-lead",
      receivedAt: new Date().toISOString(),
      payload,
    });
  } catch (error) {
    if (error instanceof DeliveryNotConfiguredError) {
      return NextResponse.json(
        {
          message:
            "Our enquiry system is not connected yet. Please call or email us and we will respond the same day.",
        },
        { status: 503 },
      );
    }

    console.error("Corporate lead delivery failed");
    return NextResponse.json(
      { message: "Could not send your enquiry. Please call us instead." },
      { status: 502 },
    );
  }

  return NextResponse.json(
    { message: "Enquiry received. Our fleet desk will call you back." },
    { status: 201 },
  );
}
