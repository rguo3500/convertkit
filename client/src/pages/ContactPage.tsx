import { Link } from "wouter";

const operator = {
  name: "shenlan",
  email: "rguo3500@gmail.com",
  region: "中国",
  address: "河南省平顶山市光明路北段",
};

function ContactCard({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-[#d8e0ed] bg-white p-6 shadow-[6px_6px_0_#dfe7f3] sm:p-7">
      <p className="signal-rule font-mono text-[10px] uppercase tracking-[.18em] text-[#1d56c9]">
        {label}
      </p>
      <h2 className="mt-4 font-display text-2xl font-bold tracking-[-.03em] text-[#172033]">
        {title}
      </h2>
      <div className="mt-4 text-[15px] leading-7 text-[#536276]">
        {children}
      </div>
    </section>
  );
}

export default function ContactPage() {
  const privacySubject = encodeURIComponent("ConvertKit privacy request");
  const generalSubject = encodeURIComponent("ConvertKit support");

  return (
    <main className="container py-12 sm:py-16">
      <div className="max-w-3xl">
        <p className="signal-rule font-mono text-[10px] uppercase tracking-[.18em] text-[#1d56c9]">
          Company / Contact
        </p>
        <h1 className="mt-5 font-display text-4xl font-bold leading-[1.03] tracking-[-.05em] text-[#172033] sm:text-6xl">
          Contact ConvertKit.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#536276]">
          Use the appropriate channel below for privacy requests, advertising
          questions, corrections, or general support. This page is the contact
          channel referenced by our legal pages.
        </p>
        <p className="mt-5 font-mono text-[10px] uppercase tracking-[.14em] text-[#7a8799]">
          Operator record / updated August 17, 2026
        </p>
      </div>

      <div className="mt-12 grid gap-7 lg:grid-cols-2">
        <ContactCard label="01 / Privacy" title="Privacy and data requests">
          <p>
            For access, correction, deletion, objection, portability, consent
            withdrawal, or child-privacy requests, email the privacy channel.
            Include enough context for us to locate and respond to the request,
            but do not send passwords, payment details, or unnecessary sensitive
            information.
          </p>
          <a
            href={`mailto:${operator.email}?subject=${privacySubject}`}
            className="mt-5 inline-flex min-h-11 items-center border-2 border-[#1d56c9] bg-[#1d56c9] px-4 font-mono text-xs font-bold uppercase tracking-[.08em] text-white transition hover:-translate-y-0.5 hover:bg-[#1646a8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d56c9] focus-visible:ring-offset-2"
          >
            Email privacy team
          </a>
        </ContactCard>

        <ContactCard label="02 / Support" title="General support">
          <p>
            Report a broken converter, an accessibility issue, incorrect
            documentation, or another product problem through the general
            support channel.
          </p>
          <a
            href={`mailto:${operator.email}?subject=${generalSubject}`}
            className="mt-5 inline-flex min-h-11 items-center border-2 border-[#172033] bg-[#172033] px-4 font-mono text-xs font-bold uppercase tracking-[.08em] text-white transition hover:-translate-y-0.5 hover:bg-[#26334a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1d56c9] focus-visible:ring-offset-2"
          >
            Email support
          </a>
        </ContactCard>
      </div>

      <section className="mt-10 border-l-2 border-[#1d56c9] bg-[#f5f7fb] p-6 text-[15px] leading-7 text-[#536276] sm:p-7">
        <p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#1d56c9]">
          Operator / 03
        </p>
        <h2 className="mt-3 font-display text-2xl font-bold tracking-[-.03em] text-[#172033]">
          Who operates this service
        </h2>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[.14em] text-[#7a8799]">
              Legal name
            </dt>
            <dd className="mt-1 font-semibold text-[#172033]">
              {operator.name}
            </dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-[.14em] text-[#7a8799]">
              Region
            </dt>
            <dd className="mt-1 font-semibold text-[#172033]">
              {operator.region}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-mono text-[10px] uppercase tracking-[.14em] text-[#7a8799]">
              Mailing address
            </dt>
            <dd className="mt-1 font-semibold text-[#172033]">
              {operator.address}
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-mono text-[10px] uppercase tracking-[.14em] text-[#7a8799]">
              Privacy email
            </dt>
            <dd className="mt-1 font-semibold text-[#172033]">
              {operator.email}
            </dd>
          </div>
        </dl>
        <p className="mt-6 text-xs leading-6 text-[#7a8799]">
          ConvertKit currently does not intentionally serve Google AdSense ads.
          Advertising and consent disclosures will be updated again before any
          advertising configuration is enabled.
        </p>
      </section>

      <p className="mt-10 text-sm text-[#536276]">
        Read the{" "}
        <Link
          href="/privacy"
          className="font-semibold text-[#1d56c9] underline underline-offset-4"
        >
          Privacy Policy
        </Link>
        ,{" "}
        <Link
          href="/cookie-policy"
          className="font-semibold text-[#1d56c9] underline underline-offset-4"
        >
          Cookie Policy
        </Link>
        , or{" "}
        <Link
          href="/terms"
          className="font-semibold text-[#1d56c9] underline underline-offset-4"
        >
          Terms of Use
        </Link>{" "}
        before contacting us.
      </p>
    </main>
  );
}
