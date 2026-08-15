import crypto from "node:crypto";
import fs from "node:fs";

export function validateRumExportIndex(index, signingKey = "") {
  if (index?.schemaVersion !== 1 || index?.integrityVersion !== 1) {
    throw new Error("Unsupported RUM export index schema or integrity version");
  }
  if (!Array.isArray(index.files)) throw new Error("RUM export index files must be an array");

  const payload = { ...index };
  const manifestSha256 = payload.manifestSha256;
  delete payload.manifestSha256;
  delete payload.signatureAlgorithm;
  delete payload.signatureStatus;
  delete payload.signature;
  const canonical = JSON.stringify(payload);
  const expectedManifest = crypto.createHash("sha256").update(canonical).digest("hex");
  if (manifestSha256 !== expectedManifest) throw new Error("RUM export index manifestSha256 mismatch");

  if (signingKey) {
    const expectedSignature = crypto.createHmac("sha256", signingKey).update(canonical).digest("base64url");
    if (index.signatureStatus !== "configured" || index.signature !== expectedSignature) {
      throw new Error("RUM export index HMAC signature mismatch");
    }
    return { manifest: "verified", signature: "verified" };
  }
  return { manifest: "verified", signature: index.signatureStatus === "configured" ? "key_not_provided" : "not_configured" };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const path = process.argv[2] || "artifacts/summary/rum-route-export-index.json";
  if (!fs.existsSync(path)) {
    console.log("RUM export index not present; validation skipped.");
    process.exit(0);
  }
  const result = validateRumExportIndex(JSON.parse(fs.readFileSync(path, "utf8")), process.env.RUM_EXPORT_SIGNING_KEY || "");
  console.log(`RUM export index integrity ${result.manifest}; HMAC ${result.signature}.`);
}
