import assert from "node:assert/strict";
import test from "node:test";

import {
  CHAT_RATE_LIMIT_REQUESTS,
  CHAT_RATE_LIMIT_WINDOW_MS,
  createRateLimiter,
} from "./rate-limit.js";

function request(remoteAddress, forwardedFor) {
  return {
    headers: forwardedFor ? { "x-forwarded-for": forwardedFor } : {},
    socket: { remoteAddress },
  };
}

test("allows twelve requests per socket address and rejects the thirteenth", () => {
  let currentTime = 10_000;
  const limiter = createRateLimiter({ now: () => currentTime });
  const client = request("203.0.113.10");

  for (let index = 0; index < CHAT_RATE_LIMIT_REQUESTS; index += 1) {
    assert.deepEqual(limiter.consume(client), { allowed: true, retryAfter: 0 });
  }

  assert.deepEqual(limiter.consume(client), {
    allowed: false,
    retryAfter: CHAT_RATE_LIMIT_WINDOW_MS / 1_000,
  });

  currentTime += 1_001;
  assert.equal(limiter.consume(client).allowed, false);
});

test("ignores spoofed forwarded addresses", () => {
  const limiter = createRateLimiter({ now: () => 20_000 });

  for (let index = 0; index < CHAT_RATE_LIMIT_REQUESTS; index += 1) {
    const result = limiter.consume(
      request("203.0.113.20", `198.51.100.${index}`),
    );
    assert.equal(result.allowed, true);
  }

  assert.equal(
    limiter.consume(request("203.0.113.20", "192.0.2.250")).allowed,
    false,
  );
  assert.equal(limiter.bucketCount, 1);
});

test("prunes expired buckets and starts a fresh window", () => {
  let currentTime = 30_000;
  const limiter = createRateLimiter({ now: () => currentTime });

  limiter.consume(request("203.0.113.30"));
  limiter.consume(request("203.0.113.31"));
  assert.equal(limiter.bucketCount, 2);

  currentTime += CHAT_RATE_LIMIT_WINDOW_MS;
  assert.deepEqual(limiter.consume(request("203.0.113.30")), {
    allowed: true,
    retryAfter: 0,
  });
  assert.equal(limiter.bucketCount, 1);
});

test("hard-caps live buckets without evicting active clients", () => {
  let currentTime = 40_000;
  const limiter = createRateLimiter({
    maxBuckets: 2,
    now: () => currentTime,
  });

  assert.equal(limiter.consume(request("203.0.113.40")).allowed, true);
  assert.equal(limiter.consume(request("203.0.113.41")).allowed, true);
  assert.equal(limiter.consume(request("203.0.113.42")).allowed, false);
  assert.equal(limiter.bucketCount, 2);
  assert.equal(limiter.consume(request("203.0.113.40")).allowed, true);

  currentTime += CHAT_RATE_LIMIT_WINDOW_MS;
  assert.equal(limiter.consume(request("203.0.113.42")).allowed, true);
  assert.equal(limiter.bucketCount, 1);
});
