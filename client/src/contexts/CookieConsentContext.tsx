/* Signal Workshop: consent is explicit, reversible, and privacy-safe by default; optional services never load before a positive choice. */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CookieConsentChoice = "unknown" | "granted" | "denied";

const STORAGE_KEY = "convertkit_cookie_consent_v1";

type CookieConsentContextValue = {
  choice: CookieConsentChoice;
  preferencesOpen: boolean;
  acceptOptional: () => void;
  rejectOptional: () => void;
  openPreferences: () => void;
  closePreferences: () => void;
  withdrawOptional: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(
  null
);

function readChoice(): CookieConsentChoice {
  if (typeof window === "undefined") return "unknown";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === "granted" || saved === "denied" ? saved : "unknown";
}

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [choice, setChoice] = useState<CookieConsentChoice>("unknown");
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => setChoice(readChoice()), []);

  const persist = (next: Exclude<CookieConsentChoice, "unknown">) => {
    setChoice(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    setPreferencesOpen(false);
  };

  const value = useMemo<CookieConsentContextValue>(
    () => ({
      choice,
      preferencesOpen,
      acceptOptional: () => persist("granted"),
      rejectOptional: () => persist("denied"),
      openPreferences: () => setPreferencesOpen(true),
      closePreferences: () => setPreferencesOpen(false),
      withdrawOptional: () => persist("denied"),
    }),
    [choice, preferencesOpen]
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context)
    throw new Error(
      "useCookieConsent must be used inside CookieConsentProvider"
    );
  return context;
}

export function useOptionalCookieConsent() {
  return useContext(CookieConsentContext);
}
