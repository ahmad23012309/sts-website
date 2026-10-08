import { createHmac, timingSafeEqual } from "node:crypto";

export type SubmissionKind = "quick-booking" | "booking" | "corporate-lead";

export interface Submission {
  kind: SubmissionKind;
  receivedAt: string;
  payload: Record<string, unknown>;
}

export class DeliveryNotConfiguredError extends Error {
  constructor() {
    super("No delivery destination is configured for form submissions.");
    this.name = "DeliveryNotConfiguredError";
  }
}

/**
 * Sends a submission on to the backend.
 *
 * The destination is the WordPress endpoint today and the management software
 * later; both receive the same signed payload, which is why the contract lives
 * here rather than in each route. Nothing is written to disk or logged in full,
 * because these payloads carry personal data.
 */
export async function deliverSubmission(submission: Submission): Promise<void> {
  const endpoint = process.env.SUBMISSION_WEBHOOK_URL;
  const secret = process.env.SUBMISSION_WEBHOOK_SECRET;

  if (!endpoint || !secret) {
    throw new DeliveryNotConfiguredError();
  }

  const body = JSON.stringify(submission);
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = createHmac("sha256", secret)
    .update(`${timestamp}.${body}`)
    .digest("hex");

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-STS-Timestamp": timestamp,
      "X-STS-Signature": signature,
    },
    body,
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error(`Delivery endpoint responded with ${response.status}`);
  }
}

/** Constant-time comparison for signatures arriving from the backend. */
export function signaturesMatch(a: string, b: string): boolean {
  const bufferA = Buffer.from(a, "utf8");
  const bufferB = Buffer.from(b, "utf8");
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}
