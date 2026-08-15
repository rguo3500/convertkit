export function isWebhookAuditRecord(value) {
  if (!value || typeof value !== "object") return false;
  if (value.schemaVersion !== 1) return false;
  if (typeof value.runId !== "string" || typeof value.recordedAt !== "string") return false;
  if (!value.failureTrend || typeof value.failureTrend !== "object") return false;
  if (!Number.isInteger(value.failureTrend.windowRuns) || value.failureTrend.windowRuns < 0 || value.failureTrend.windowRuns > 10) return false;
  if (!value.failureTrend.buckets || typeof value.failureTrend.buckets !== "object") return false;
  return Object.values(value.failureTrend.buckets).every(bucket => (
    bucket && Number.isInteger(bucket.total) && bucket.total >= 0 &&
    (bucket.lastSeen === null || typeof bucket.lastSeen === "string")
  ));
}
