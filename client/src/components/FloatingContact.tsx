// Signal Workshop: compact graphite operator signal with cobalt actions, mono metadata, and direct contact paths.
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Mail, MapPin, UserRound, X } from "lucide-react";
import { Link } from "wouter";
import { useCookieConsent } from "../contexts/CookieConsentContext";

const operator = {
  name: "shenlan",
  email: "rguo3500@gmail.com",
  region: "中国",
  address: "河南省平顶山市光明路北段",
};

export default function FloatingContact() {
  const { choice, preferencesOpen } = useCookieConsent();
  const [open, setOpen] = useState(false);
  const bannerIsVisible = choice === "unknown" || preferencesOpen;
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!panelRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  return (
    <div
      ref={panelRef}
      className={`fixed right-5 z-50 flex flex-col items-end gap-3 sm:right-6 ${bannerIsVisible ? "bottom-[22rem] sm:bottom-40" : "bottom-5 sm:bottom-6"}`}
    >
      {open && (
        <section
          className="floating-contact-panel w-[min(22rem,calc(100vw-2rem))] border border-[#334158] bg-[#111827]/[.98] p-5 text-white shadow-[0_18px_50px_rgba(17,24,39,.32)] backdrop-blur-xl"
          id="floating-contact-panel"
          aria-label="ConvertKit contact details"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[.18em] text-[#9fb7ff]">
                Contact / Signal 03
              </p>
              <h2 className="mt-2 font-display text-xl font-bold tracking-[-.03em]">
                Talk to shenlan.
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="grid h-8 w-8 shrink-0 place-items-center border border-[#3d4e6c] text-[#aebbd0] transition hover:border-white hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6f92f2]"
              aria-label="Close contact details"
            >
              <X size={15} />
            </button>
          </div>

          <div className="mt-5 space-y-3 border-t border-[#2b3b59] pt-4 text-sm text-[#c6d0e1]">
            <div className="flex gap-3">
              <UserRound size={15} className="mt-1 shrink-0 text-[#6f92f2]" />
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[.14em] text-[#71819b]">
                  Operator
                </p>
                <p className="mt-1 font-semibold text-white">{operator.name}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <MapPin size={15} className="mt-1 shrink-0 text-[#6f92f2]" />
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[.14em] text-[#71819b]">
                  Region / address
                </p>
                <p className="mt-1 leading-5">
                  {operator.region} · {operator.address}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <a
              href={`mailto:${operator.email}?subject=${encodeURIComponent("ConvertKit inquiry")}`}
              className="inline-flex min-h-10 items-center justify-center gap-2 border-2 border-[#356ae6] bg-[#356ae6] px-3 font-mono text-[10px] font-bold uppercase tracking-[.08em] text-white transition hover:-translate-y-0.5 hover:bg-[#2858c9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9fb7ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111827]"
            >
              <Mail size={14} />
              Email
            </a>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-10 items-center justify-center gap-2 border border-[#50627f] px-3 font-mono text-[10px] font-bold uppercase tracking-[.08em] text-[#dce4f3] transition hover:-translate-y-0.5 hover:border-[#9fb7ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9fb7ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111827]"
            >
              Contact page
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </section>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(current => !current)}
        className="floating-contact-trigger inline-flex min-h-12 items-center gap-2 border border-[#50627f] bg-[#111827]/[.96] px-3.5 font-mono text-[10px] font-bold uppercase tracking-[.1em] text-[#dce4f3] shadow-[0_12px_30px_rgba(17,24,39,.24)] backdrop-blur transition hover:-translate-y-0.5 hover:border-[#9fb7ff] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9fb7ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f7fb]"
        aria-label="联系我们，查看运营者信息并发送邮件"
        aria-expanded={open}
        aria-controls="floating-contact-panel"
      >
        <Mail size={15} className="text-[#9fb7ff]" />
        <span className="hidden sm:inline">联系我们</span>
        <span className="sm:hidden">联系</span>
        <ArrowUpRight size={13} className="text-[#6f92f2]" />
      </button>
    </div>
  );
}
