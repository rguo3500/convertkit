/* Signal Workshop: optional measurement follows the same explicit consent gate as advertising. */
import { useEffect } from "react";
import { useCookieConsent } from "../contexts/CookieConsentContext";

export default function OptionalAnalytics() {
  const { choice } = useCookieConsent();
  const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT?.trim() ?? "";
  const websiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID?.trim() ?? "";

  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>(
      "script[data-convertkit-analytics]"
    );
    if (choice !== "granted" || !endpoint || !websiteId) {
      existing?.remove();
      return;
    }
    if (existing) return;
    const script = document.createElement("script");
    script.defer = true;
    script.src = `${endpoint.replace(/\/$/, "")}/umami`;
    script.dataset.websiteId = websiteId;
    script.dataset.autoTrack = "true";
    script.dataset.convertkitAnalytics = "true";
    document.head.appendChild(script);
    return () => script.remove();
  }, [choice, endpoint, websiteId]);

  return null;
}
