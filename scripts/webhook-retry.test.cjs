const assert = require("node:assert/strict");
const test = require("node:test");
const { deliverWebhook } = require("./webhook-retry.cjs");

test("recovers after transient 5xx failures with exponential backoff", async () => {
  let calls = 0;
  const delays = [];
  const result = await deliverWebhook({
    url: "https://example.test/hook",
    payload: { text: "hello" },
    maxAttempts: 3,
    backoffCapMs: 4000,
    fetchImpl: async () => {
      calls += 1;
      return calls < 3 ? { ok: false, status: 503 } : { ok: true, status: 204 };
    },
    sleep: async ms => delays.push(ms),
  });
  assert.equal(result.delivered, true);
  assert.equal(result.attempts, 3);
  assert.deepEqual(delays, [1000, 2000]);
  assert.deepEqual(result.failures.map(item => item.category), ["HTTP_5XX", "HTTP_5XX"]);
});

test("stops at the configured cap and reports network failures", async () => {
  let calls = 0;
  const delays = [];
  const result = await deliverWebhook({
    url: "https://example.test/hook",
    payload: { text: "hello" },
    maxAttempts: 5,
    backoffCapMs: 2500,
    fetchImpl: async () => {
      calls += 1;
      throw new Error("socket timeout");
    },
    sleep: async ms => delays.push(ms),
  });
  assert.equal(result.delivered, false);
  assert.equal(result.attempts, 5);
  assert.equal(calls, 5);
  assert.equal(result.failureCategory, "NETWORK_OR_TIMEOUT");
  assert.deepEqual(delays, [1000, 2000, 2500, 2500]);
});
