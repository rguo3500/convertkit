/* Signal Workshop: consent UI is a compact utility panel—clear, reversible, and visually secondary to conversion actions. */
import { useCookieConsent } from "../contexts/CookieConsentContext";

export default function CookieConsentBanner() {
  const {
    choice,
    preferencesOpen,
    acceptOptional,
    rejectOptional,
    openPreferences,
    closePreferences,
  } = useCookieConsent();

  if (choice !== "unknown" && !preferencesOpen) {
    return (
      <button
        type="button"
        onClick={openPreferences}
        className="fixed bottom-4 left-4 z-[60] border border-[#334158] bg-[#111827] px-3 py-2 font-mono text-[10px] uppercase tracking-[.12em] text-[#dce4f3] shadow-lg transition hover:border-[#6f92f2] hover:text-white"
        aria-label="Open cookie preferences"
      >
        Privacy choices
      </button>
    );
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-[#334158] bg-[#111827] text-white shadow-[0_-12px_35px_rgba(17,24,39,.22)]"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="container flex flex-col gap-5 py-5 sm:py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="max-w-3xl">
          <p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#9fb7ff]">
            Privacy choices
          </p>
          <h2 className="mt-2 font-display text-xl font-bold tracking-[-.03em]">
            Keep ConvertKit useful and in your control.
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#b6c1d3]">
            Necessary technologies support the site. Optional measurement and
            future advertising technologies load only after you choose to allow
            them. You can change this choice later from the Privacy choices
            button.
          </p>
          <p className="mt-2 text-xs leading-5 text-[#8e9bb2]">
            Read the{" "}
            <a
              href="/privacy"
              className="text-[#9fb7ff] underline underline-offset-4"
            >
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="/cookie-policy"
              className="text-[#9fb7ff] underline underline-offset-4"
            >
              Cookie Policy
            </a>
            .
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 sm:gap-3">
          <button
            type="button"
            onClick={rejectOptional}
            className="border border-[#52627d] px-4 py-2.5 text-sm font-semibold text-[#dce4f3] transition hover:border-white hover:text-white"
          >
            Reject optional
          </button>
          <button
            type="button"
            onClick={openPreferences}
            className="border border-[#52627d] px-4 py-2.5 text-sm font-semibold text-[#dce4f3] transition hover:border-white hover:text-white"
          >
            Manage choices
          </button>
          <button
            type="button"
            onClick={acceptOptional}
            className="bg-[#356ae6] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4779ed]"
          >
            Allow optional
          </button>
        </div>
      </div>
      {preferencesOpen && (
        <div className="border-t border-[#334158] bg-[#172236]">
          <div className="container py-5 sm:py-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="max-w-2xl text-sm leading-6 text-[#b6c1d3]">
                <h3 className="font-display text-lg font-bold text-white">
                  Manage optional technologies
                </h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="border border-[#334158] p-4">
                    <p className="font-semibold text-white">Necessary</p>
                    <p className="mt-1 text-xs text-[#8e9bb2]">
                      Always active for security, routing, accessibility, and
                      requested functionality.
                    </p>
                  </div>
                  <div className="border border-[#334158] p-4">
                    <p className="font-semibold text-white">
                      Measurement and advertising
                    </p>
                    <p className="mt-1 text-xs text-[#8e9bb2]">
                      Currently off unless you allow optional technologies and
                      the site configuration is ready. AdSense also requires its
                      separate production configuration and consent gate.
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={closePreferences}
                  className="border border-[#52627d] px-4 py-2.5 text-sm font-semibold text-[#dce4f3]"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={rejectOptional}
                  className="border border-[#52627d] px-4 py-2.5 text-sm font-semibold text-[#dce4f3]"
                >
                  Save rejected
                </button>
                <button
                  type="button"
                  onClick={acceptOptional}
                  className="bg-[#356ae6] px-4 py-2.5 text-sm font-semibold text-white"
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
