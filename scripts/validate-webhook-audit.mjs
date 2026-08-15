import fs from "node:fs";
import { isWebhookAuditRecord } from "./webhook-audit-schema.mjs";

const filePath = process.argv[2] || "artifacts/summary/webhook-audit.json";
if (!fs.existsSync(filePath)) {
  console.log(`Webhook audit not present at ${filePath}; nothing to validate.`);
  process.exit(0);
}

const record = JSON.parse(fs.readFileSync(filePath, "utf8"));
if (!isWebhookAuditRecord(record)) {
  console.error(`Invalid webhook audit schema: ${filePath}`);
  process.exit(1);
}
console.log(`Webhook audit schema valid: ${filePath}`);
