/* Signal Workshop: the app shell is a measured instrument frame with a persistent escape route. */
import { useState } from 'react';
import { Link, Route, Switch, useLocation } from 'wouter';
import { ArrowRight, Menu, X, Search, Github, Sun, Moon } from 'lucide-react';
import Home from './pages/Home';
import ConverterPage from './pages/ConverterPage';
import FormatPage from './pages/FormatPage';

const navItems = [
  ['/converters', 'Unit converters'],
  ['/format-converters', 'Format tools'],
  ['/blog', 'Guides'],
  ['/pricing', 'Pricing'],
];

function Header() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  return <header className="sticky top-0 z-50 border-b border-[#283449] bg-[#111827]/95 text-white backdrop-blur">
    <div className="container flex h-[72px] items-center justify-between gap-6">
      <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
        <img src="/manus-storage/convertkit-mark_d7d5ec7b.png" alt="ConvertKit mark" className="h-9 w-9 object-contain shadow-[4px_4px_0_#0c1220]" />
        <span><span className="font-display text-[19px] font-bold tracking-[-.04em]">ConvertKit</span><span className="ml-2 hidden font-mono text-[9px] uppercase tracking-[.18em] text-[#8e9bb2] sm:inline">Tools / 01</span></span>
      </Link>
      <nav className="hidden items-center gap-7 text-[13px] font-medium text-[#b9c3d5] md:flex">
        {navItems.map(([href, label]) => <Link key={href} href={href} className="transition-colors hover:text-white">{label}</Link>)}
      </nav>
      <div className="flex items-center gap-2">
        <button aria-label="Toggle theme" onClick={() => setDark(!dark)} className="hidden h-9 w-9 place-items-center border border-[#334158] text-[#b9c3d5] transition hover:border-[#678cf1] hover:text-white sm:grid">{dark ? <Sun size={16}/> : <Moon size={16}/>}</button>
        <Link href="/converters" className="hidden items-center gap-2 bg-[#356ae6] px-4 py-2.5 text-[12px] font-semibold text-white transition hover:bg-[#4779ed] sm:flex">Open converter <ArrowRight size={14}/></Link>
        <button aria-label="Open navigation" onClick={() => setOpen(!open)} className="grid h-9 w-9 place-items-center border border-[#334158] md:hidden">{open ? <X size={17}/> : <Menu size={17}/>}</button>
      </div>
    </div>
    {open && <div className="border-t border-[#283449] bg-[#111827] px-6 py-5 md:hidden"><nav className="grid gap-4 text-sm text-[#c8d1df]">{navItems.map(([href,label]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}</nav></div>}
  </header>;
}

function Footer() { return <footer className="mt-24 border-t border-[#283449] bg-[#111827] py-12 text-[#a6b1c3]"><div className="container grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]"><div><div className="mb-4 flex items-center gap-3 text-white"><img src="/manus-storage/convertkit-mark_d7d5ec7b.png" alt="ConvertKit mark" className="h-8 w-8 object-contain" /><span className="font-display text-lg font-bold">ConvertKit</span></div><p className="max-w-xs text-sm leading-6">Free, precise conversion tools for numbers, data, and formats. Local-first by default.</p><p className="mt-6 font-mono text-[10px] uppercase tracking-[.16em] text-[#65738a]">© 2026 ConvertKit Tools</p></div><div><p className="mb-4 font-mono text-[10px] uppercase tracking-[.16em] text-[#65738a]">Explore</p><div className="grid gap-3 text-sm"><Link href="/converters">Unit converters</Link><Link href="/format-converters">Format tools</Link><Link href="/blog">Guides</Link></div></div><div><p className="mb-4 font-mono text-[10px] uppercase tracking-[.16em] text-[#65738a]">Company</p><div className="grid gap-3 text-sm"><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/pricing">Pricing</Link></div></div><div><p className="mb-4 font-mono text-[10px] uppercase tracking-[.16em] text-[#65738a]">Legal</p><div className="grid gap-3 text-sm"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/cookie-policy">Cookies</Link></div></div></div></footer> }

function Placeholder({ title, eyebrow = 'ConvertKit' }: { title: string; eyebrow?: string }) { return <main className="container py-20"><p className="font-mono text-[11px] uppercase tracking-[.18em] text-[#356ae6]">{eyebrow}</p><h1 className="mt-4 font-display text-4xl font-bold tracking-[-.04em] text-[#172033]">{title}</h1><p className="mt-5 max-w-xl text-[#647087]">This section is structured and ready for the next expansion of the ConvertKit toolkit.</p></main> }

function CategoryRoute(props: any) { return <ConverterPage category={props.params?.category ?? props.category}/> }
function FormatRoute(props: any) { return <FormatPage type={props.params?.type ?? props.type}/> }
export default function App() { return <><Header/><Switch><Route path="/" component={Home}/><Route path="/converters" component={() => <ConverterPage category="all"/>}/><Route path="/converters/:category" component={CategoryRoute}/><Route path="/format-converters" component={() => <FormatPage type="index"/>}/><Route path="/:type(json-formatter|json-validator|json-minifier|json-to-csv|csv-to-json|json-to-xml|xml-to-json|base64-encoder|base64-decoder|url-encoder|url-decoder|unix-timestamp-converter)" component={FormatRoute}/><Route path="/meters-to-feet" component={() => <ConverterPage slug="meters-to-feet"/>}/><Route path="/feet-to-meters" component={() => <ConverterPage slug="feet-to-meters"/>}/><Route path="/kg-to-lbs" component={() => <ConverterPage slug="kg-to-lbs"/>}/><Route path="/celsius-to-fahrenheit" component={() => <ConverterPage slug="celsius-to-fahrenheit"/>}/><Route path="/liters-to-gallons" component={() => <ConverterPage slug="liters-to-gallons"/>}/><Route path="/blog" component={() => <Placeholder title="Conversion guides" eyebrow="Field notes"/>}/><Route path="/pricing" component={() => <Placeholder title="Simple pricing, clear tools" eyebrow="Plans"/>}/><Route path="/about" component={() => <Placeholder title="Built for useful answers"/>}/><Route path="/contact" component={() => <Placeholder title="Talk to the team"/>}/><Route path="/privacy" component={() => <Placeholder title="Privacy first" eyebrow="Legal"/>}/><Route path="/terms" component={() => <Placeholder title="Terms of use" eyebrow="Legal"/>}/><Route path="/cookie-policy" component={() => <Placeholder title="Cookie policy" eyebrow="Legal"/>}/><Route component={() => <Placeholder title="Page not found" eyebrow="404"/>}/></Switch><Footer/></> }
