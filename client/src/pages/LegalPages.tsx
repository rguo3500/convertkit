/* Signal Workshop: legal pages use a calm document frame, explicit disclosure hierarchy, and no ad-like visual distractions. */
import { Link } from "wouter";

const updated = "August 17, 2026";

const operator = {
  name: "郭伟",
  email: "rguo3500@gmail.com",
  region: "中国",
  address: "河南省平顶山市光明路北段",
};

function LegalLayout({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <main className="container py-12 sm:py-16">
      <div className="max-w-3xl">
        <p className="signal-rule font-mono text-[10px] uppercase tracking-[.18em] text-[#1d56c9]">
          {eyebrow}
        </p>
        <h1 className="mt-5 font-display text-4xl font-bold leading-[1.03] tracking-[-.05em] text-[#172033] sm:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[#536276]">
          {intro}
        </p>
        <p className="mt-5 font-mono text-[10px] uppercase tracking-[.14em] text-[#7a8799]">
          Last updated: {updated}
        </p>
      </div>
      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_220px]">
        <article className="legal-copy max-w-3xl text-[15px] leading-7 text-[#536276]">
          {children}
        </article>
        <aside className="h-fit border-l-2 border-[#1d56c9] bg-[#f5f7fb] p-5 text-sm leading-6 text-[#536276]">
          <p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#1d56c9]">
            Need help?
          </p>
          <p className="mt-3">
            For privacy questions or corrections, use our{" "}
            <Link
              href="/contact"
              className="font-semibold text-[#1d56c9] underline decoration-[#9fb7ff] underline-offset-4"
            >
              Contact page
            </Link>
            .
          </p>
          <p className="mt-4 text-xs text-[#7a8799]">
            This page describes the current ConvertKit implementation. We will
            update it before enabling new advertising or tracking services.
          </p>
        </aside>
      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="signal-rule font-display text-2xl font-bold tracking-[-.03em] text-[#172033]">
        {title}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function PrivacyPage() {
  return (
    <LegalLayout
      eyebrow="Legal / Privacy"
      title="Privacy Policy"
      intro="ConvertKit is designed to make everyday conversions useful without requiring an account or uploading ordinary conversion inputs. This policy explains what the current website processes, what it does not, and what will change before advertising services are enabled."
    >
      <Section title="1. Who operates this service">
        <p>
          The ConvertKit website and browser-local unit and format conversion
          tools are operated by{" "}
          <strong className="text-[#172033]">{operator.name}</strong>, located
          in {operator.region}. For privacy questions, data requests, or reports
          about this policy, email{" "}
          <Link
            href="/contact"
            className="font-semibold text-[#1d56c9] underline underline-offset-4"
          >
            Contact page
          </Link>{" "}
          or write to{" "}
          <a
            href={`mailto:${operator.email}`}
            className="font-semibold text-[#1d56c9] underline underline-offset-4"
          >
            {operator.email}
          </a>
          . The operator's mailing address is {operator.address}.
        </p>
      </Section>
      <Section title="2. Information processed by ConvertKit">
        <p>
          <strong className="text-[#172033]">Conversion inputs.</strong>{" "}
          Ordinary unit conversions and format transformations are designed to
          run in your browser. ConvertKit does not need an account or a server
          upload for those operations. Do not enter information that you are not
          permitted to process in a public browser session.
        </p>
        <p>
          <strong className="text-[#172033]">Technical information.</strong>{" "}
          Like most websites, hosting, CDN, security, and reliability systems
          may process request information such as IP address, browser type,
          device information, requested URL, time, status code, and security
          events. These records are used to deliver the site, prevent abuse,
          diagnose failures, and keep the service reliable.
        </p>
        <p>
          <strong className="text-[#172033]">Messages.</strong> If you contact
          ConvertKit, the information you choose to include is used to respond
          to your request, investigate a report, and maintain a record of the
          exchange where reasonably necessary.
        </p>
        <p>
          <strong className="text-[#172033]">Analytics.</strong> The current
          site may use privacy-conscious measurement supplied by the hosting or
          analytics configuration. Analytics should be treated as a separate
          optional service and must be reflected in the cookie and consent
          settings actually deployed.
        </p>
      </Section>
      <Section title="3. How information is used">
        <p>
          Information may be used to provide and secure the tools, respond to
          support requests, understand errors and performance, prevent abuse,
          comply with legal obligations, and improve the website. ConvertKit
          does not sell conversion inputs as a product.
        </p>
      </Section>
      <Section title="4. Cookies and advertising disclosure">
        <p>
          The current ConvertKit implementation does not intentionally serve
          Google AdSense ads. Before Google AdSense or another advertising
          service is enabled, this policy, the Cookie Policy, the consent flow,
          and the actual script configuration must be updated together.
        </p>
        <p>
          If advertising is enabled, Google and selected advertising technology
          providers may use cookies, local storage, or similar technologies to
          deliver, measure, limit, and personalize ads where permitted. The live
          policy will identify the actual Google products and selected
          providers, explain personalized versus non-personalized ads, link to
          their privacy information, and provide a way to manage advertising
          choices.
        </p>
        <p>
          We will not ask users to click ads, will not describe ads as
          conversion controls, and will not use advertising placement that could
          be mistaken for navigation, a result, a download, or a copy button.
        </p>
      </Section>
      <Section title="5. Consent and privacy choices">
        <p>
          Where consent is required, including for relevant users in the
          European Economic Area, the United Kingdom, and Switzerland,
          ConvertKit will use a consent mechanism that explains the relevant
          purposes and providers before optional advertising or tracking is
          enabled. Users must be able to refuse optional processing and later
          revisit or withdraw their choices.
        </p>
        <p>
          Because advertising is not currently enabled, this page does not
          pretend that an advertising consent signal is already being collected.
          The operator currently intends to serve users globally, including the
          EEA, the United Kingdom, and Switzerland, and may use personalized ads
          in the future. Before that happens, a Google Privacy & Messaging setup
          or an appropriate Google-certified CMP must be live, the provider list
          must be accurate, and the consent signals must be tested.
        </p>
      </Section>
      <Section title="6. Sharing and service providers">
        <p>
          ConvertKit may use infrastructure and service providers for hosting,
          CDN delivery, security, analytics, error monitoring, communication,
          and—if later enabled—advertising. Providers receive only the
          information needed for their documented service role. The production
          provider list must be kept synchronized with the Cookie Policy and the
          site's consent configuration.
        </p>
      </Section>
      <Section title="7. Retention and security">
        <p>
          Retention depends on the purpose and type of information. Technical
          security records may be retained for a limited operational period;
          support messages may be retained while a request is being handled and
          for a reasonable period afterward. ConvertKit uses reasonable
          technical and organizational safeguards, but no internet service can
          promise absolute security.
        </p>
      </Section>
      <Section title="8. Your choices and rights">
        <p>
          Depending on where you live, you may have rights to request access,
          correction, deletion, restriction, objection, portability, or
          withdrawal of consent. Use the Contact page to make a request.
          ConvertKit may need enough information to verify and respond to a
          request, and applicable law may limit some requests.
        </p>
      </Section>
      <Section title="9. Children">
        <p>
          ConvertKit is a general-purpose utility and is not directed to
          children. We do not knowingly request or intentionally collect
          personal information from children. If you believe a child has
          provided personal information, contact us so that we can review and
          remove it where appropriate.
        </p>
      </Section>
      <Section title="10. International processing">
        <p>
          Hosting, security, analytics, communication, and future advertising
          providers may process information in countries other than your own.
          Before enabling a new provider, ConvertKit should review the
          provider's contractual and transfer safeguards and update this policy
          where required.
        </p>
      </Section>
      <Section title="11. Changes to this policy">
        <p>
          We may update this policy when the service, providers, advertising
          configuration, or legal requirements change. The Last updated date
          will change with material revisions. If a change materially affects
          optional processing, the consent experience will be updated where
          required.
        </p>
      </Section>
    </LegalLayout>
  );
}

export function CookiePolicyPage() {
  return (
    <LegalLayout
      eyebrow="Legal / Cookies"
      title="Cookie Policy"
      intro="This page explains the categories of cookies and similar technologies that may be used by ConvertKit. The list must be kept synchronized with the scripts and providers actually deployed on the production domain."
    >
      <Section title="1. Current status">
        <p>
          This Cookie Policy applies to the service operated by{" "}
          <strong className="text-[#172033]">{operator.name}</strong> in{" "}
          {operator.region}. Privacy questions can be sent to{" "}
          <a
            href={`mailto:${operator.email}`}
            className="font-semibold text-[#1d56c9] underline underline-offset-4"
          >
            {operator.email}
          </a>
          . ConvertKit currently focuses on browser-local conversion and does
          not intentionally serve Google AdSense ads. No advertising cookie
          should be enabled merely because this policy exists. If analytics,
          advertising, or a consent platform is added, the production
          implementation and this page must be updated before the new service is
          enabled.
        </p>
      </Section>
      <Section title="2. Categories">
        <p>
          <strong className="text-[#172033]">
            Strictly necessary technologies
          </strong>{" "}
          support security, routing, accessibility, session stability, and
          requested functionality. They are not used to build an advertising
          profile.
        </p>
        <p>
          <strong className="text-[#172033]">Measurement technologies</strong>{" "}
          may help understand aggregated visits, performance, and errors. Where
          consent is legally required, these technologies should load only after
          the relevant choice.
        </p>
        <p>
          <strong className="text-[#172033]">Advertising technologies</strong>{" "}
          may be used only after the advertising configuration, provider list,
          purposes, retention, and consent behavior have been reviewed. If
          Google AdSense is enabled, the live page will identify Google and
          selected advertising technology providers and link to their
          information. The planned global/EEA advertising rollout must not begin
          until the applicable Google Privacy & Messaging or certified CMP
          configuration and consent signals are live.
        </p>
      </Section>
      <Section title="3. Managing choices">
        <p>
          Browser settings can block or delete cookies, but blocking necessary
          technologies may affect site behavior. Where optional measurement or
          advertising is enabled, ConvertKit will provide a consent and
          preference mechanism that lets users refuse optional processing and
          later revisit their choice.
        </p>
      </Section>
      <Section title="4. Third-party providers">
        <p>
          The current advertising provider list is empty because Google AdSense
          is not intentionally served at the time of this update. The production
          provider list must be updated before activation to include the live
          hosting, analytics, consent, and advertising providers rather than a
          generic list copied from a template. Provider privacy notices should
          be linked from the consent interface or this page.
        </p>
      </Section>
      <Section title="5. Updates">
        <p>
          This page will be updated when a new category, provider, purpose, or
          retention period is introduced. The Privacy Policy describes the
          broader data practices, while this page focuses on cookies and similar
          technologies.
        </p>
      </Section>
    </LegalLayout>
  );
}

export function TermsPage() {
  return (
    <LegalLayout
      eyebrow="Legal / Terms"
      title="Terms of Use"
      intro="These terms describe the general conditions for using ConvertKit's browser-local conversion tools. They should be reviewed against the operator's legal details and applicable jurisdiction before publication as final terms."
    >
      <Section title="1. Using ConvertKit">
        <p>
          You may use the public tools for lawful, personal, educational, or
          business purposes. You are responsible for checking the output before
          relying on it, especially where precision, safety, financial,
          engineering, medical, or legal consequences are involved.
        </p>
      </Section>
      <Section title="2. Local processing and limitations">
        <p>
          Many conversions are performed in the browser and do not require an
          account or upload. Browser behavior, unsupported input, file size,
          character encoding, and rounding can affect results. ConvertKit does
          not guarantee that every result is suitable for a particular
          professional decision.
        </p>
      </Section>
      <Section title="3. Prohibited use">
        <p>
          You must not interfere with the site, bypass security controls, submit
          malware, abuse automated requests, infringe rights, attempt to
          manipulate advertising metrics, or use the service for unlawful
          activity.
        </p>
      </Section>
      <Section title="4. Availability and changes">
        <p>
          These terms apply to the service operated by {operator.name}.
          ConvertKit may change, suspend, or discontinue a tool, page, or
          feature to maintain security, reliability, or compliance. We may
          correct errors and update formulas or documentation when necessary.
        </p>
      </Section>
      <Section title="5. Intellectual property">
        <p>
          The ConvertKit name, visual identity, software, documentation, and
          original content belong to their respective rights holders. You may
          use the tools and link to public pages, but may not copy or resell the
          service in a way that misleads users about its operator.
        </p>
      </Section>
      <Section title="6. Disclaimer and liability">
        <p>
          The tools are provided on an as-available basis for general
          information. To the extent allowed by applicable law, ConvertKit
          disclaims warranties that cannot legally be excluded and is not
          responsible for decisions made solely from an unverified conversion
          result.
        </p>
      </Section>
      <Section title="7. Contact and updates">
        <p>
          Questions about these terms can be sent through the{" "}
          <Link
            href="/contact"
            className="font-semibold text-[#1d56c9] underline underline-offset-4"
          >
            Contact page
          </Link>{" "}
          or by emailing{" "}
          <a
            href={`mailto:${operator.email}`}
            className="font-semibold text-[#1d56c9] underline underline-offset-4"
          >
            {operator.email}
          </a>
          . The operator's mailing address is {operator.address}. Material
          changes will be reflected by updating the Last updated date on this
          page.
        </p>
      </Section>
    </LegalLayout>
  );
}
