import assert from "node:assert/strict";
import crypto from "node:crypto";
import test from "node:test";
import { validateRumExportIndex } from "./validate-rum-export-index.mjs";

function signedIndex(key = "test-secret") {
  const payload = {
    schemaVersion: 1,
    integrityVersion: 1,
    generatedAt: "2026-08-15T00:00:00.000Z",
    runTimestamp: "2026-08-15T00:00:00.000Z",
    commitSha: "abc1234",
    preset: "7d",
    windowStart: "2026-08-08",
    windowEnd: "2026-08-15",
    files: [{ name: "rum.csv", rows: 2, bytes: 12, sha256: "abc" }],
  };
  const canonical = JSON.stringify(payload);
  return {
    ...payload,
    manifestSha256: crypto.createHash("sha256").update(canonical).digest("hex"),
    signatureAlgorithm: "HMAC-SHA256",
    signatureStatus: "configured",
    signature: crypto.createHmac("sha256", key).update(canonical).digest("base64url"),
  };
}

test("verifies manifest and HMAC signature", () => {
  assert.deepEqual(validateRumExportIndex(signedIndex(), "test-secret"), { manifest: "verified", signature: "verified" });
});

test("detects tampering before signature verification", () => {
  const index = signedIndex();
  index.files[0].bytes = 13;
  assert.throws(() => validateRumExportIndex(index, "test-secret"), /manifestSha256 mismatch/);
});

test("accepts unsigned index only when signature is explicitly not configured", () => {
  const index = signedIndex();
  delete index.signature;
  index.signature = null;
  index.signatureStatus = "not_configured";
  assert.deepEqual(validateRumExportIndex(index), { manifest: "verified", signature: "not_configured" });
});

test("rejects a configured signature with the wrong key", () => {
  assert.throws(() => validateRumExportIndex(signedIndex(), "wrong-key"), /HMAC signature mismatch/);
});
