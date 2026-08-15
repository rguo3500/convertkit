function classifyWebhookError(error) {
  const message = error instanceof Error ? error.message : String(error || "unknown error");
  return /^HTTP 4/.test(message) ? "HTTP_4XX" : /^HTTP 5/.test(message) ? "HTTP_5XX" : "NETWORK_OR_TIMEOUT";
}

async function deliverWebhook({ url, payload, fetchImpl = fetch, sleep = ms => new Promise(resolve => setTimeout(resolve, ms)), maxAttempts = 3, backoffCapMs = 4000 }) {
  const attempts = Math.min(Math.max(Number.parseInt(String(maxAttempts), 10) || 3, 1), 5);
  const cap = Math.min(Math.max(Number.parseInt(String(backoffCapMs), 10) || 4000, 250), 10000);
  const failures = [];
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetchImpl(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return { delivered: true, attempts: attempt + 1, failures, maxAttempts: attempts, backoffCapMs: cap };
    } catch (error) {
      const message = error instanceof Error ? error.message : "unknown error";
      const category = classifyWebhookError(error);
      failures.push({ attempt: attempt + 1, category, message });
      if (attempt === attempts - 1) {
        return { delivered: false, attempts: attempt + 1, failures, failureCategory: category, maxAttempts: attempts, backoffCapMs: cap };
      }
      await sleep(Math.min(2 ** attempt * 1000, cap));
    }
  }
  throw new Error("Webhook retry loop terminated unexpectedly");
}

module.exports = { classifyWebhookError, deliverWebhook };
