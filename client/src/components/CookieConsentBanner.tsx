/* Signal Workshop: graphite consent console, cobalt action signal, compact Swiss hierarchy, motion that yields to reduced-motion preferences. */
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Check,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useCookieConsent } from "../contexts/CookieConsentContext";

type ChoiceAction = "accept" | "reject";

export default function CookieConsentBanner() {
  const {
    choice,
    preferencesOpen,
    acceptOptional,
    rejectOptional,
    openPreferences,
    closePreferences,
  } = useCookieConsent();
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    setIsLeaving(false);
  }, [choice, preferencesOpen]);

  const saveChoice = (action: ChoiceAction) => {
    setIsLeaving(true);
    window.setTimeout(() => {
      if (action === "accept") acceptOptional();
      else rejectOptional();
    }, 220);
  };

  if (choice !== "unknown" && !preferencesOpen) {
    return (
      <button
        type="button"
        onClick={openPreferences}
        className="consent-preferences-trigger fixed bottom-4 left-4 z-[60] inline-flex items-center gap-2 border border-[#334158] bg-[#111827]/95 px-3.5 py-2.5 font-mono text-[10px] uppercase tracking-[.12em] text-[#dce4f3] shadow-[0_12px_30px_rgba(17,24,39,.18)] backdrop-blur transition hover:-translate-y-0.5 hover:border-[#6f92f2] hover:text-white"
        aria-label="Open cookie preferences"
      >
        <ShieldCheck size={13} className="text-[#9fb7ff]" />
        Privacy choices
        <ArrowUpRight size={12} className="text-[#6f92f2]" />
      </button>
    );
  }

  return (
    <div
      className={`consent-banner pointer-events-none fixed inset-x-0 bottom-0 z-[60] border-t border-[#3c5279] bg-[#111827]/[.98] text-white shadow-[0_-18px_50px_rgba(17,24,39,.32)] backdrop-blur-xl ${isLeaving ? "consent-banner-exit" : "consent-banner-enter"}`}
      role="dialog"
      aria-label="Cookie consent"
      aria-describedby="cookie-consent-description"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#5f8dff] to-transparent opacity-80" />
      <div className="container pointer-events-none py-4 sm:py-5 lg:py-6">
        <div className="pointer-events-none flex flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10">
          <div className="min-w-0">
            <div className="flex items-start gap-3">
              <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center border border-[#3b5687] bg-[#1b2a46] text-[#9fb7ff] shadow-[3px_3px_0_#0b1220]">
                <ShieldCheck size={16} strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#9fb7ff]">
                    Privacy choices
                  </p>
                  <span className="font-mono text-[9px] uppercase tracking-[.14em] text-[#61708a]">
                    Signal / 02
                  </span>
                </div>
                <h2 className="mt-1.5 font-display text-xl font-bold tracking-[-.035em] text-white sm:text-2xl">
                  Keep ConvertKit useful and in your control.
                </h2>
              </div>
            </div>
            <p
              id="cookie-consent-description"
              className="mt-3 max-w-3xl pl-11 text-[13px] leading-6 text-[#b8c4d8] sm:text-sm"
            >
              Necessary technologies keep the tools running. Optional
              measurement and future advertising wait for your clear choice, and
              you can change it later.
            </p>
            <p className="mt-2 pl-11 text-xs leading-5 text-[#8190a8]">
              Read the{" "}
              <a
                href="/privacy"
                className="pointer-events-auto font-medium text-[#a9beff] underline decoration-[#526fae] underline-offset-4 transition-colors hover:text-white"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="/cookie-policy"
                className="pointer-events-auto font-medium text-[#a9beff] underline decoration-[#526fae] underline-offset-4 transition-colors hover:text-white"
              >
                Cookie Policy
              </a>
              .
            </p>
          </div>

          <div className="pointer-events-auto flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
            <button
              type="button"
              onClick={() => saveChoice("reject")}
              className="consent-action consent-action-secondary"
            >
              Reject optional
            </button>
            <button
              type="button"
              onClick={openPreferences}
              className="consent-action consent-action-secondary inline-flex items-center justify-center gap-2"
            >
              <SlidersHorizontal size={14} />
              Manage choices
            </button>
            <button
              type="button"
              onClick={() => saveChoice("accept")}
              className="consent-action consent-action-primary"
            >
              Allow optional
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {preferencesOpen && (
        <div className="consent-preferences-panel pointer-events-none border-t border-[#2b3b59] bg-[#172236]">
          <div className="container pointer-events-none py-5 sm:py-6">
            <div className="pointer-events-none flex flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-10">
              <div className="max-w-3xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#6f92f2]">
                      Optional technologies
                    </p>
                    <h3 className="mt-1 font-display text-lg font-bold tracking-[-.025em] text-white sm:text-xl">
                      Choose what runs beyond the essentials.
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={closePreferences}
                    className="pointer-events-auto grid h-9 w-9 shrink-0 place-items-center border border-[#3d4e6c] text-[#aebbd0] transition hover:border-white hover:text-white sm:hidden"
                    aria-label="Close cookie preferences"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="consent-choice-card">
                    <div className="flex items-center gap-2 text-white">
                      <span className="grid h-6 w-6 place-items-center bg-[#274a9d] text-[#dce6ff]">
                        <Check size={13} />
                      </span>
                      <p className="font-semibold">Necessary</p>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-[#8e9db4]">
                      Always active for security, routing, accessibility, and
                      requested functionality.
                    </p>
                  </div>
                  <div className="consent-choice-card consent-choice-card-optional">
                    <div className="flex items-center gap-2 text-white">
                      <span className="grid h-6 w-6 place-items-center border border-[#4a5f84] text-[#9fb7ff]">
                        <SlidersHorizontal size={12} />
                      </span>
                      <p className="font-semibold">
                        Measurement and advertising
                      </p>
                    </div>
                    <p className="mt-2 text-xs leading-5 text-[#8e9db4]">
                      Off unless you allow optional technologies and the
                      production configuration is ready.
                    </p>
                  </div>
                </div>
              </div>
              <div className="pointer-events-auto flex flex-col gap-2 sm:flex-row lg:pb-1">
                <button
                  type="button"
                  onClick={closePreferences}
                  className="consent-action consent-action-secondary hidden sm:inline-flex"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => saveChoice("reject")}
                  className="consent-action consent-action-secondary"
                >
                  Save rejected
                </button>
                <button
                  type="button"
                  onClick={() => saveChoice("accept")}
                  className="consent-action consent-action-primary"
                >
                  Save allowed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
