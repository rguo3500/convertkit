/* Signal Workshop: advertising is an opt-in layer; disabled ads leave no empty geometry and never load third-party scripts. */
import { useEffect, useId } from "react";

type AdSenseSlotProps = {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
};

const adsenseEnabled = import.meta.env.VITE_ADSENSE_ENABLED === "true";
const consentReady = import.meta.env.VITE_ADSENSE_CONSENT_READY === "true";
const clientId = import.meta.env.VITE_ADSENSE_CLIENT?.trim() ?? "";

export default function AdSenseSlot({
  slot,
  format = "auto",
  className = "",
}: AdSenseSlotProps) {
  const elementId = useId().replaceAll(":", "");
  const enabled =
    adsenseEnabled && consentReady && Boolean(clientId) && Boolean(slot);

  useEffect(() => {
    if (!enabled) return;
    const existing = document.querySelector<HTMLScriptElement>(
      "script[data-convertkit-adsense]"
    );
    if (existing) return;
    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(clientId)}`;
    script.dataset.convertkitAdsense = "true";
    document.head.appendChild(script);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <aside
      id={elementId}
      className={`adsense-slot ${className}`}
      aria-label="Advertisement"
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
