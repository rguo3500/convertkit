import { readFile } from "node:fs/promises";

const app = await readFile("client/src/App.tsx", "utf8");
const legal = await readFile("client/src/pages/LegalPages.tsx", "utf8");
const contact = await readFile("client/src/pages/ContactPage.tsx", "utf8");

const requiredRoutes = [
  ['path="/privacy" component={PrivacyPage}', "Privacy route"],
  ['path="/terms" component={TermsPage}', "Terms route"],
  ['path="/cookie-policy" component={CookiePolicyPage}', "Cookie Policy route"],
  ['path="/contact" component={ContactPage}', "Contact route"],
];

const failures = [];
for (const [needle, label] of requiredRoutes) {
  if (!app.includes(needle))
    failures.push(`${label} is not connected to its real page component`);
}
if (
  legal.includes("This section is structured and ready for the next expansion")
) {
  failures.push("LegalPages.tsx still contains the legacy Placeholder copy");
}
for (const marker of ["Privacy Policy", "Cookie Policy", "Terms of Use"]) {
  if (!legal.includes(marker))
    failures.push(`LegalPages.tsx is missing: ${marker}`);
}
for (const [source, label] of [
  [legal, "LegalPages.tsx"],
  [contact, "ContactPage.tsx"],
]) {
  for (const marker of [
    "shenlan",
    "rguo3500@gmail.com",
    "河南省平顶山市光明路北段",
  ]) {
    if (!source.includes(marker))
      failures.push(`${label} is missing operator marker: ${marker}`);
  }
}
if (
  contact.includes(
    "This section is structured and ready for the next expansion"
  )
) {
  failures.push("ContactPage.tsx still contains the legacy Placeholder copy");
}

if (failures.length) {
  console.error(failures.map(item => `FAIL: ${item}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log("Legal page routes and copy validation passed.");
}
