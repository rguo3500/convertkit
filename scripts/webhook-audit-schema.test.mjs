import test from "node:test";
import assert from "node:assert/strict";
import { isWebhookAuditRecord } from "./webhook-audit-schema.mjs";

const validRecord = {
  schemaVersion: 1,
  runId: "123",
  recordedAt: "2026-08-15T00:00:00.000Z",
  failureTrend: {
    windowRuns: 2,
    buckets: {
      "00:00-01:00": { total: 3, lastSeen: "2026-08-14T00:00:00.000Z" },
      "01:00-02:00": { total: 0, lastSeen: null },
    },
  },
};

test("accepts a valid webhook audit failureTrend record", () => {
  assert.equal(isWebhookAuditRecord(validRecord), true);
});

test("rejects missing failureTrend", () => {
  const record = { ...validRecord, failureTrend: undefined };
  assert.equal(isWebhookAuditRecord(record), false);
});

test("rejects an out-of-range run window", () => {
  const record = { ...validRecord, failureTrend: { ...validRecord.failureTrend, windowRuns: 11 } };
  assert.equal(isWebhookAuditRecord(record), false);
});

test("rejects negative bucket totals", () => {
  const record = {
    ...validRecord,
    failureTrend: {
      ...validRecord.failureTrend,
      buckets: { "00:00-01:00": { total: -1, lastSeen: null } },
    },
  };
  assert.equal(isWebhookAuditRecord(record), false);
});
