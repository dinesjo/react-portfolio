export const CHAT_RATE_LIMIT_WINDOW_MS = 5 * 60 * 1_000;
export const CHAT_RATE_LIMIT_REQUESTS = 12;
export const CHAT_RATE_LIMIT_MAX_BUCKETS = 10_000;

function positiveInteger(value, name) {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new RangeError(`${name} must be a positive safe integer`);
  }
  return value;
}

function requestAddress(request) {
  const address = request?.socket?.remoteAddress;
  return typeof address === "string" && address.trim() ? address : "unknown";
}

/**
 * Fixed-window limiter keyed only by the server-observed socket address.
 * Forwarded headers are intentionally outside this trust boundary.
 */
export function createRateLimiter({
  windowMs = CHAT_RATE_LIMIT_WINDOW_MS,
  requestLimit = CHAT_RATE_LIMIT_REQUESTS,
  maxBuckets = CHAT_RATE_LIMIT_MAX_BUCKETS,
  now = Date.now,
} = {}) {
  const resolvedWindowMs = positiveInteger(windowMs, "windowMs");
  const resolvedRequestLimit = positiveInteger(requestLimit, "requestLimit");
  const resolvedMaxBuckets = positiveInteger(maxBuckets, "maxBuckets");
  if (typeof now !== "function") throw new TypeError("now must be a function");

  const buckets = new Map();

  function pruneExpired(currentTime) {
    // Buckets keep their fixed-window start time and Map insertion order, so
    // expired entries form a prefix. This makes pruning amortized O(1).
    for (const [address, bucket] of buckets) {
      if (currentTime - bucket.startedAt < resolvedWindowMs) break;
      buckets.delete(address);
    }
  }

  function retryAfterSeconds(bucket, currentTime) {
    return Math.max(
      1,
      Math.ceil((resolvedWindowMs - (currentTime - bucket.startedAt)) / 1_000),
    );
  }

  function consume(request) {
    const currentTime = now();
    if (!Number.isFinite(currentTime)) {
      throw new TypeError("now must return a finite timestamp");
    }

    pruneExpired(currentTime);
    const address = requestAddress(request);
    const current = buckets.get(address);

    if (current) {
      current.count += 1;
      return current.count <= resolvedRequestLimit
        ? { allowed: true, retryAfter: 0 }
        : {
            allowed: false,
            retryAfter: retryAfterSeconds(current, currentTime),
          };
    }

    if (buckets.size >= resolvedMaxBuckets) {
      const oldestBucket = buckets.values().next().value;
      return {
        allowed: false,
        retryAfter: retryAfterSeconds(oldestBucket, currentTime),
      };
    }

    buckets.set(address, { startedAt: currentTime, count: 1 });
    return { allowed: true, retryAfter: 0 };
  }

  return Object.freeze({
    consume,
    get bucketCount() {
      return buckets.size;
    },
  });
}
