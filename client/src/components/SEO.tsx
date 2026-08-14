/* Signal Workshop: SEO metadata follows the same measurable, configuration-first system as conversion tools. */
import { useEffect } from 'react';

type SEOProps = { title: string; description: string; type?: 'WebApplication'|'Article'; breadcrumbs?: {name:string;url:string}[]; faq?: {question:string;answer:string}[] };
const origin = typeof window === 'undefined' ? '' : window.location.origin;

export default function SEO({ title, description, type='WebApplication', breadcrumbs=[], faq=[] }: SEOProps) {
  useEffect(() => {
    document.title = title;
    const canonical = `${window.location.origin}${window.location.pathname}`;
    const set = (name:string, content:string, property=false) => { const attr=property?'property':'name'; let el=document.head.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement|null; if(!el){el=document.createElement('meta');el.setAttribute(attr,name);document.head.appendChild(el);} el.content=content; };
    set('description', description); set('twitter:card','summary_large_image'); set('twitter:title',title); set('twitter:description',description); set('og:title',title,true); set('og:description',description,true); set('og:type',type==='Article'?'article':'website',true); set('og:url',canonical,true);
    let link=document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement|null; if(!link){link=document.createElement('link');link.rel='canonical';document.head.appendChild(link);} link.href=canonical;
    document.querySelectorAll('script[data-convertkit-schema]').forEach(node=>node.remove());
    const schemas:any[] = [{ '@context':'https://schema.org','@type':type,name:title,description,url:canonical,applicationCategory:'UtilitiesApplication',operatingSystem:'Any' }];
    if(breadcrumbs.length) schemas.push({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:breadcrumbs.map((b,i)=>({'@type':'ListItem',position:i+1,name:b.name,item:`${origin}${b.url}`}))});
    if(faq.length) schemas.push({'@context':'https://schema.org','@type':'FAQPage',mainEntity:faq.map(item=>({'@type':'Question',name:item.question,acceptedAnswer:{'@type':'Answer',text:item.answer}}))});
    schemas.forEach(schema=>{const script=document.createElement('script');script.type='application/ld+json';script.dataset.convertkitSchema='true';script.textContent=JSON.stringify(schema);document.head.appendChild(script);});
  },[title,description,type,breadcrumbs,faq]);
  return null;
}
