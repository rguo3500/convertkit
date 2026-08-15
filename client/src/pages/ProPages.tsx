/* Signal Workshop: Swiss workbench layout, crisp borders, cobalt action color, and explicit local-first status. Keep file workflows direct, measurable, and keyboard accessible. */
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'wouter';
import { ArrowRight, Check, Download, FileWarning, Lock, Upload } from 'lucide-react';
import SEO from '../components/SEO';
import { parseCsv } from '../lib/csv';

const MAX_CSV_BYTES = 5 * 1024 * 1024;
const unitOptions=[['kg','Kilograms','lb','Pounds',2.2046226218],['m','Meters','ft','Feet',3.280839895],['c','Celsius','f','Fahrenheit',1]] as const;

type ReadState = 'idle' | 'reading' | 'ready' | 'error';

export function BulkPage(){
  const [csv,setCsv]=useState('value\n10\n25\n100');
  const [pair,setPair]=useState(0);
  const [history,setHistory]=useState<string[]>([]);
  const [readState,setReadState]=useState<ReadState>('idle');
  const [readProgress,setReadProgress]=useState(0);
  const [fileName,setFileName]=useState('');
  const [fileSize,setFileSize]=useState(0);
  const [fileError,setFileError]=useState('');
  useEffect(()=>{try{setHistory(JSON.parse(localStorage.getItem('convertkit-bulk-history')||'[]'))}catch{}},[]);
  const chosen=unitOptions[pair];
  const parsed=useMemo(()=>parseCsv(csv),[csv]);
  const result=useMemo(()=>{
    if(!parsed.headers.length)return '';
    const rows=parsed.rows.map(row=>{const n=Number(row[0]);const value=Number.isFinite(n)?chosen[4]===1?n:n*chosen[4]:'';return `${row.join(',')},${value}`});
    return [`${parsed.headers[0]},${chosen[3]}`,...rows].join('\n')
  },[parsed,chosen]);
  const handleFile=(file?:File)=>{
    if(!file)return;
    setFileError('');
    if(file.size>MAX_CSV_BYTES){
      setReadState('error');
      setReadProgress(0);
      setFileName(file.name);
      setFileSize(file.size);
      setFileError('This file is larger than 5 MB. Choose a smaller CSV to keep processing fast and local.');
      return;
    }
    setFileName(file.name);
    setFileSize(file.size);
    setReadState('reading');
    setReadProgress(0);
    const reader=new FileReader();
    reader.onprogress=event=>{if(event.lengthComputable)setReadProgress(Math.round(event.loaded/event.total*100))};
    reader.onerror=()=>{setReadState('error');setFileError('The file could not be read. Try exporting it as UTF-8 CSV and upload again.')};
    reader.onload=()=>{setCsv(String(reader.result??''));setReadProgress(100);setReadState('ready')};
    reader.readAsText(file);
  };
  const download=()=>{
    if(!result||readState==='reading')return;
    const label=`${chosen[1]} → ${chosen[3]}`;
    const next=[label,...history.filter(item=>item!==label)].slice(0,4);
    setHistory(next);localStorage.setItem('convertkit-bulk-history',JSON.stringify(next));
    const blob=new Blob([result],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='convertkit-bulk-conversion.csv';a.click();URL.revokeObjectURL(a.href)
  };
  const formattedSize=fileSize?`${(fileSize/1024/1024).toFixed(2)} MB`:'No file selected';
  return <main className="container py-14"><SEO title="Bulk CSV Converter | ConvertKit" description="Convert a column of CSV values between supported units locally in your browser." breadcrumbs={[{name:'Home',url:'/'},{name:'Bulk CSV converter',url:'/bulk-converter'}]}/><div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:items-start"><div><p className="signal-rule font-mono text-[10px] uppercase tracking-[.18em] text-[#1d56c9]">Pro preview / batch</p><h1 className="mt-5 font-display text-5xl font-bold tracking-[-.05em]">Convert a whole column<br/><span className="text-[#1d56c9]">in one pass.</span></h1><p className="mt-5 text-lg leading-7 text-[#536276]">Paste a CSV column, choose a conversion pair, and download a new CSV. The first version runs locally and keeps the architecture ready for future uploads.</p><div className="mt-8 border border-[#dbe1eb] bg-[#fffdf6] p-5"><p className="font-mono text-[10px] uppercase tracking-[.15em] text-[#7a560b]">Local processing</p><p className="mt-3 text-sm leading-6 text-[#536276]">Your CSV is not sent to a server. Files up to 5 MB are read locally in your browser.</p></div></div><section className="card-shadow bg-white p-6"><div className="grid gap-5 md:grid-cols-2"><label className="grid gap-2 text-xs font-semibold text-[#536276]">Input CSV<div className="border border-dashed border-[#9aa7ba] bg-[#fbfcfe] p-4"><div className="flex items-center gap-3"><Upload size={17} className="text-[#1d56c9]"/><span className="text-sm font-semibold text-[#172033]">Choose a CSV file</span></div><input aria-label="Input CSV" type="file" accept=".csv,text/csv" className="mt-3 block w-full text-xs" onChange={e=>handleFile(e.target.files?.[0])}/><p className="mt-2 text-[11px] font-normal text-[#647087]">UTF-8 CSV · maximum 5 MB · processed locally</p></div>{readState==='reading'&&<div className="mt-2" role="status" aria-live="polite"><div className="flex justify-between text-[11px] font-normal text-[#536276]"><span>Reading {fileName}</span><span>{readProgress}%</span></div><div className="mt-1 h-2 overflow-hidden bg-[#e8edf5]"><div className="h-full bg-[#1d56c9] transition-[width] duration-150" style={{width:`${readProgress}%`}}/></div></div>}{readState==='ready'&&<p className="mt-2 flex items-center gap-1 text-[11px] font-normal text-[#18866b]" role="status"><Check size={13}/>Loaded {fileName} · {formattedSize}</p>}{readState==='error'&&<p className="mt-2 flex items-start gap-1 text-[11px] font-normal text-[#a34d19]" role="alert"><FileWarning size={13} className="mt-0.5 shrink-0"/>{fileError}</p>}<textarea aria-label="CSV text" value={csv} onChange={e=>{setCsv(e.target.value);setReadState('idle');setFileName('');setFileSize(0);setFileError('')}} className="min-h-[240px] border border-[#dbe1eb] bg-[#fbfcfe] p-4 font-mono text-sm leading-6 outline-none focus:border-[#1d56c9]" /></label><div className="grid gap-2 text-xs font-semibold text-[#536276]">Output CSV<pre className="min-h-[240px] overflow-auto whitespace-pre-wrap border border-[#dbe1eb] bg-[#111827] p-4 font-mono text-sm leading-6 text-[#dbe7ff]" aria-live="polite">{result||'Output will appear here.'}</pre></div></div><label className="mt-5 grid gap-2 text-xs font-semibold text-[#536276]">Conversion pair<select value={pair} onChange={e=>setPair(Number(e.target.value))} className="border border-[#dbe1eb] bg-white px-4 py-3 text-sm outline-none focus:border-[#1d56c9]">{unitOptions.map((u,i)=><option key={u[0]} value={i}>{u[1]} → {u[3]}</option>)}</select></label><button onClick={download} disabled={!result||readState==='reading'||readState==='error'} className="mt-5 flex items-center gap-2 bg-[#1d56c9] px-5 py-3 text-sm font-semibold text-white hover:bg-[#244db7] disabled:cursor-not-allowed disabled:opacity-50"><Download size={15}/> Download CSV</button>{history.length>0&&<div className="mt-6 border-t border-[#dbe1eb] pt-4"><p className="font-mono text-[10px] uppercase tracking-[.15em] text-[#536276]">Recent local runs</p><div className="mt-2 flex flex-wrap gap-2">{history.map(item=><span key={item} className="border border-[#dbe1eb] px-2 py-1 font-mono text-[10px] text-[#536276]">{item}</span>)}</div></div>}</section></div></main>
}

export function PricingPage(){return <main className="container py-14"><SEO title="Pricing | ConvertKit" description="Compare ConvertKit Free tools with future Pro workflows for bulk conversion, history, presets, and API access." breadcrumbs={[{name:'Home',url:'/'},{name:'Pricing',url:'/pricing'}]}/><div className="max-w-2xl"><p className="signal-rule font-mono text-[10px] uppercase tracking-[.16em] text-[#1d56c9]">Plans / 04</p><h1 className="mt-5 font-display text-5xl font-bold tracking-[-.05em]">Simple tools now.<br/><span className="text-[#1d56c9]">More leverage later.</span></h1><p className="mt-5 text-lg leading-7 text-[#536276]">The free toolkit is the foundation. Pro features are reserved for workflows that need history, bulk operations, and API access.</p></div><div className="mt-14 grid gap-5 md:grid-cols-2"><div className="border border-[#dbe1eb] bg-white p-7"><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#1d56c9]">Free / available</p><h2 className="mt-5 font-display text-3xl font-bold">$0</h2><p className="mt-2 text-sm text-[#536276]">For everyday conversion work.</p><div className="mt-7 grid gap-3 text-sm">{['Unlimited basic conversions','Standard unit converters','JSON and format tools','Browser-local processing'].map(x=><p key={x} className="flex items-center gap-2"><Check size={15} className="text-[#18866b]"/>{x}</p>)}</div><Link href="/converters" className="mt-8 inline-flex items-center gap-2 border border-[#dbe1eb] px-4 py-3 text-sm font-semibold">Open free tools <ArrowRight size={15}/></Link></div><div className="border-2 border-[#1d56c9] bg-[#111827] p-7 text-white shadow-[10px_10px_0_#dbe1eb]"><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#9fb7ff]">Pro / planned</p><h2 className="mt-5 font-display text-3xl font-bold">For repeat work.</h2><p className="mt-2 text-sm text-[#aab8cf]">Payment is not enabled in this first release.</p><div className="mt-7 grid gap-3 text-sm text-[#dbe7ff]">{['No ads','Bulk CSV conversion','Conversion history','Custom conversion presets','API access'].map(x=><p key={x} className="flex items-center gap-2"><Lock size={14} className="text-[#e3a83b]"/>{x}</p>)}</div><Link href="/bulk-converter" className="mt-8 inline-flex items-center gap-2 bg-[#1d56c9] px-4 py-3 text-sm font-semibold">Try bulk preview <ArrowRight size={15}/></Link></div></div></main>}
