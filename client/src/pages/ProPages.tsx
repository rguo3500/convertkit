/* Signal Workshop: Swiss workbench layout, crisp borders, cobalt action color, and explicit local-first status. Keep file workflows direct, measurable, and keyboard accessible. */
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  Check,
  Download,
  FileWarning,
  Lock,
  Upload,
} from "lucide-react";
import SEO from "../components/SEO";
import { parseCsv, serializeCsv } from "../lib/csv";

const MAX_CSV_BYTES = 5 * 1024 * 1024;
const unitOptions = [
  ["kg", "Kilograms", "lb", "Pounds", 2.2046226218],
  ["m", "Meters", "ft", "Feet", 3.280839895],
  ["c", "Celsius", "f", "Fahrenheit", 1],
] as const;
type ReadState = "idle" | "reading" | "ready" | "error";
type ColumnMapping = { enabled: boolean; pair: number; outputName: string };
type InvalidSort = "row-asc" | "row-desc" | "value-asc" | "value-desc";

export function BulkPage() {
  const [csv, setCsv] = useState("value\n10\n25\n100");
  const [pair, setPair] = useState(0);
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [readState, setReadState] = useState<ReadState>("idle");
  const [readProgress, setReadProgress] = useState(0);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [fileError, setFileError] = useState("");
  const [locatedRow, setLocatedRow] = useState<number | null>(null);
  const [invalidColumn, setInvalidColumn] = useState(() => {
    if (typeof window === "undefined") return "all";
    return (
      new URLSearchParams(window.location.search).get("issuesColumn") || "all"
    );
  });
  const [shareCopyState, setShareCopyState] = useState<
    "idle" | "copied" | "error"
  >("idle");
  const [shareLinkPreview, setShareLinkPreview] = useState("");
  const [invalidSort, setInvalidSort] = useState<InvalidSort>(() => {
    if (typeof window === "undefined") return "row-asc";
    const value = new URLSearchParams(window.location.search).get("issuesSort");
    return value === "row-desc" ||
      value === "value-asc" ||
      value === "value-desc"
      ? value
      : "row-asc";
  });
  const csvInputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    try {
      setHistory(
        JSON.parse(localStorage.getItem("convertkit-bulk-history") || "[]")
      );
    } catch {}
  }, []);
  const parsed = useMemo(() => parseCsv(csv), [csv]);
  useEffect(() => {
    setMappings(current =>
      parsed.headers.map(
        (header, index) =>
          current[index] ?? {
            enabled: index === 0,
            pair,
            outputName: `${header} (${unitOptions[pair][3]})`,
          }
      )
    );
  }, [parsed.headers, pair]);
  const columnStats = useMemo(
    () =>
      parsed.headers.map((header, index) => {
        const values = parsed.rows.map(row => (row[index] ?? "").trim());
        const nonEmpty = values.filter(Boolean);
        const valid = nonEmpty.filter(value =>
          Number.isFinite(Number(value))
        ).length;
        const invalid = nonEmpty.length - valid;
        const empty = values.length - nonEmpty.length;
        const type =
          valid > 0 && invalid === 0 ? "Numeric" : valid > 0 ? "Mixed" : "Text";
        return { header, valid, invalid, empty, type };
      }),
    [parsed]
  );
  const activeMappings = useMemo(
    () =>
      mappings
        .map((mapping, index) => ({ ...mapping, index }))
        .filter(mapping => mapping.enabled && parsed.headers[mapping.index]),
    [mappings, parsed.headers]
  );
  const totalInvalid = columnStats.reduce(
    (sum, stats) => sum + stats.invalid,
    0
  );
  const invalidValues = useMemo(
    () =>
      activeMappings.flatMap(mapping =>
        parsed.rows.flatMap((row, rowIndex) => {
          const rawValue = row[mapping.index] ?? "";
          if (!rawValue.trim() || Number.isFinite(Number(rawValue))) return [];
          const selected = unitOptions[mapping.pair];
          return [
            {
              rowNumber: rowIndex + 2,
              column: parsed.headers[mapping.index],
              rawValue,
              conversion: `${selected[1]} → ${selected[3]}`,
              outputColumn:
                mapping.outputName.trim() ||
                `${parsed.headers[mapping.index]} (${selected[3]})`,
            },
          ];
        })
      ),
    [activeMappings, parsed]
  );
  const invalidColumns = useMemo(
    () => Array.from(new Set(invalidValues.map(item => item.column))),
    [invalidValues]
  );
  useEffect(() => {
    if (invalidColumn !== "all" && !invalidColumns.includes(invalidColumn)) {
      setInvalidColumn("all");
    }
  }, [invalidColumn, invalidColumns]);
  useEffect(() => {
    const url = new URL(window.location.href);
    if (invalidColumn === "all") url.searchParams.delete("issuesColumn");
    else url.searchParams.set("issuesColumn", invalidColumn);
    if (invalidSort === "row-asc") url.searchParams.delete("issuesSort");
    else url.searchParams.set("issuesSort", invalidSort);
    window.history.replaceState(
      null,
      "",
      `${url.pathname}${url.search}${url.hash}`
    );
  }, [invalidColumn, invalidSort]);
  const closeSharePreview = () => {
    setShareCopyState("idle");
    setShareLinkPreview("");
  };
  const copyShareLink = async () => {
    try {
      const shareUrl = window.location.href;
      await navigator.clipboard.writeText(shareUrl);
      setShareLinkPreview(shareUrl);
      setShareCopyState("copied");
    } catch {
      setShareCopyState("error");
    }
  };
  useEffect(() => {
    if (shareCopyState !== "copied") return;
    const timer = window.setTimeout(() => {
      setShareCopyState("idle");
      setShareLinkPreview("");
    }, 5000);
    return () => window.clearTimeout(timer);
  }, [shareCopyState]);
  const visibleInvalidValues = useMemo(() => {
    const filtered =
      invalidColumn === "all"
        ? [...invalidValues]
        : invalidValues.filter(item => item.column === invalidColumn);
    return filtered.sort((a, b) => {
      if (invalidSort === "row-asc") return a.rowNumber - b.rowNumber;
      if (invalidSort === "row-desc") return b.rowNumber - a.rowNumber;
      const comparison = a.rawValue.localeCompare(b.rawValue, undefined, {
        numeric: true,
      });
      return invalidSort === "value-asc" ? comparison : -comparison;
    });
  }, [invalidColumn, invalidSort, invalidValues]);
  const invalidReport = useMemo(
    () =>
      serializeCsv(
        ["row", "column", "raw_value", "conversion", "output_column"],
        invalidValues.map(item => [
          String(item.rowNumber),
          item.column,
          item.rawValue,
          item.conversion,
          item.outputColumn,
        ])
      ),
    [invalidValues]
  );
  const invalidReportJson = useMemo(
    () => JSON.stringify(invalidValues, null, 2),
    [invalidValues]
  );
  const result = useMemo(() => {
    if (!parsed.headers.length) return "";
    const outputHeaders = [
      ...parsed.headers,
      ...activeMappings.map(
        mapping =>
          mapping.outputName.trim() ||
          `${parsed.headers[mapping.index]} (${unitOptions[mapping.pair][3]})`
      ),
    ];
    const rows = parsed.rows.map(row => {
      const converted = activeMappings.map(mapping => {
        const n = Number(row[mapping.index] ?? "");
        const selected = unitOptions[mapping.pair];
        return Number.isFinite(n)
          ? selected[4] === 1
            ? n
            : n * selected[4]
          : "";
      });
      return [
        ...parsed.headers.map((_, index) => row[index] ?? ""),
        ...converted.map(String),
      ];
    });
    return serializeCsv(outputHeaders, rows);
  }, [parsed, activeMappings]);
  const updateMapping = (index: number, patch: Partial<ColumnMapping>) =>
    setMappings(current =>
      current.map((mapping, mappingIndex) =>
        mappingIndex === index ? { ...mapping, ...patch } : mapping
      )
    );
  const handleFile = (file?: File) => {
    if (!file) return;
    setFileError("");
    if (file.size > MAX_CSV_BYTES) {
      setReadState("error");
      setReadProgress(0);
      setFileName(file.name);
      setFileSize(file.size);
      setFileError(
        "This file is larger than 5 MB. Choose a smaller CSV to keep processing fast and local."
      );
      return;
    }
    setFileName(file.name);
    setFileSize(file.size);
    setReadState("reading");
    setReadProgress(0);
    const reader = new FileReader();
    reader.onprogress = event => {
      if (event.lengthComputable)
        setReadProgress(Math.round((event.loaded / event.total) * 100));
    };
    reader.onerror = () => {
      setReadState("error");
      setFileError(
        "The file could not be read. Try exporting it as UTF-8 CSV and upload again."
      );
    };
    reader.onload = () => {
      setCsv(String(reader.result ?? ""));
      setReadProgress(100);
      setReadState("ready");
    };
    reader.readAsText(file);
  };
  const handleCsvChange = (value: string) => {
    setCsv(value);
    setReadState("idle");
    setFileName("");
    setFileSize(0);
    setFileError("");
  };
  const locateInvalidValue = (item: (typeof invalidValues)[number]) => {
    const lines = csv.split(/\r?\n/);
    const lineStart = lines
      .slice(0, item.rowNumber - 1)
      .reduce((total, line) => total + line.length + 1, 0);
    const valueOffset = lines[item.rowNumber - 1]?.indexOf(item.rawValue) ?? 0;
    const start = Math.max(0, lineStart + valueOffset);
    csvInputRef.current?.focus();
    csvInputRef.current?.setSelectionRange(start, start + item.rawValue.length);
    setLocatedRow(item.rowNumber);
  };
  const downloadBlob = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const downloadInvalidReport = () => {
    if (
      !invalidValues.length ||
      readState === "reading" ||
      readState === "error"
    )
      return;
    downloadBlob(invalidReport, "convertkit-invalid-values.csv");
  };
  const download = () => {
    if (!result || readState === "reading" || readState === "error") return;
    const label = activeMappings.length
      ? activeMappings
          .map(
            mapping =>
              `${parsed.headers[mapping.index]} → ${mapping.outputName || unitOptions[mapping.pair][3]}`
          )
          .join(", ")
      : "No mapped columns";
    const next = [label, ...history.filter(item => item !== label)].slice(0, 4);
    setHistory(next);
    localStorage.setItem("convertkit-bulk-history", JSON.stringify(next));
    const blob = new Blob([result], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "convertkit-bulk-conversion.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const formattedSize = fileSize
    ? `${(fileSize / 1024 / 1024).toFixed(2)} MB`
    : "No file selected";
  return (
    <main className="container py-14">
      <SEO
        title="Bulk CSV Converter | ConvertKit"
        description="Convert multiple CSV columns between supported units locally in your browser with custom output columns."
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Bulk CSV converter", url: "/bulk-converter" },
        ]}
      />
      <div className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:items-start">
        <div>
          <p className="signal-rule font-mono text-[10px] uppercase tracking-[.18em] text-[#1d56c9]">
            Pro preview / batch
          </p>
          <h1 className="mt-5 font-display text-5xl font-bold tracking-[-.05em]">
            Convert whole columns
            <br />
            <span className="text-[#1d56c9]">in one pass.</span>
          </h1>
          <p className="mt-5 text-lg leading-7 text-[#536276]">
            Paste a CSV, choose which columns to convert, name the output
            columns, and download a new file. Everything runs locally in your
            browser.
          </p>
          <div className="mt-8 border border-[#dbe1eb] bg-[#fffdf6] p-5">
            <p className="font-mono text-[10px] uppercase tracking-[.15em] text-[#7a560b]">
              Local processing
            </p>
            <p className="mt-3 text-sm leading-6 text-[#536276]">
              Your CSV is not sent to a server. Files up to 5 MB are read
              locally in your browser.
            </p>
          </div>
        </div>
        <section className="card-shadow bg-white p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-xs font-semibold text-[#536276]">
              Input CSV
              <div className="border border-dashed border-[#9aa7ba] bg-[#fbfcfe] p-4">
                <div className="flex items-center gap-3">
                  <Upload size={17} className="text-[#1d56c9]" />
                  <span className="text-sm font-semibold text-[#172033]">
                    Choose a CSV file
                  </span>
                </div>
                <input
                  aria-label="Input CSV"
                  type="file"
                  accept=".csv,text/csv"
                  className="mt-3 block w-full text-xs"
                  onChange={e => handleFile(e.target.files?.[0])}
                />
                <p className="mt-2 text-[11px] font-normal text-[#647087]">
                  UTF-8 CSV · maximum 5 MB · processed locally
                </p>
              </div>
              {readState === "reading" && (
                <div className="mt-2" role="status" aria-live="polite">
                  <div className="flex justify-between text-[11px] font-normal text-[#536276]">
                    <span>Reading {fileName}</span>
                    <span>{readProgress}%</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden bg-[#e8edf5]">
                    <div
                      className="h-full bg-[#1d56c9] transition-[width] duration-150"
                      style={{ width: `${readProgress}%` }}
                    />
                  </div>
                </div>
              )}
              {readState === "ready" && (
                <p
                  className="mt-2 flex items-center gap-1 text-[11px] font-normal text-[#18866b]"
                  role="status"
                >
                  <Check size={13} />
                  Loaded {fileName} · {formattedSize}
                </p>
              )}
              {readState === "error" && (
                <p
                  className="mt-2 flex items-start gap-1 text-[11px] font-normal text-[#a34d19]"
                  role="alert"
                >
                  <FileWarning size={13} className="mt-0.5 shrink-0" />
                  {fileError}
                </p>
              )}
              <textarea
                aria-label="CSV text"
                ref={csvInputRef}
                value={csv}
                onChange={e => handleCsvChange(e.target.value)}
                className="min-h-[240px] border border-[#dbe1eb] bg-[#fbfcfe] p-4 font-mono text-sm leading-6 outline-none focus:border-[#1d56c9]"
              />
            </label>
            <div className="grid gap-2 text-xs font-semibold text-[#536276]">
              Output CSV
              <pre
                className="min-h-[240px] overflow-auto whitespace-pre-wrap border border-[#dbe1eb] bg-[#111827] p-4 font-mono text-sm leading-6 text-[#dbe7ff]"
                aria-live="polite"
              >
                {result || "Output will appear here."}
              </pre>
            </div>
          </div>
          <div className="mt-6 border-t border-[#dbe1eb] pt-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[.15em] text-[#536276]">
                  Column mapping
                </p>
                <p className="mt-1 text-xs font-normal text-[#647087]">
                  Keep original columns and append only the conversions you
                  enable.
                </p>
              </div>
              <span className="font-mono text-[10px] text-[#1d56c9]">
                {activeMappings.length} mapped
              </span>
            </div>
            <div className="mt-4 grid gap-3">
              {parsed.headers.map((header, index) => {
                const mapping = mappings[index] ?? {
                  enabled: index === 0,
                  pair,
                  outputName: `${header} (${unitOptions[pair][3]})`,
                };
                const stats = columnStats[index];
                return (
                  <div
                    key={`${header}-${index}`}
                    className="grid gap-3 border border-[#dbe1eb] bg-[#fbfcfe] p-3 sm:grid-cols-[auto_1fr_1fr_auto]"
                  >
                    <label className="flex items-center gap-2 text-xs font-semibold text-[#172033]">
                      <input
                        type="checkbox"
                        checked={mapping.enabled}
                        onChange={e =>
                          updateMapping(index, { enabled: e.target.checked })
                        }
                      />
                      <span>{header || `Column ${index + 1}`}</span>
                    </label>
                    <select
                      aria-label={`Conversion for ${header || `column ${index + 1}`}`}
                      value={mapping.pair}
                      onChange={e =>
                        updateMapping(index, {
                          pair: Number(e.target.value),
                          outputName: `${header} (${unitOptions[Number(e.target.value)][3]})`,
                        })
                      }
                      className="border border-[#dbe1eb] bg-white px-3 py-2 text-xs outline-none focus:border-[#1d56c9]"
                    >
                      {unitOptions.map((unit, unitIndex) => (
                        <option key={unit[0]} value={unitIndex}>
                          {unit[1]} → {unit[3]}
                        </option>
                      ))}
                    </select>
                    <input
                      aria-label={`Output name for ${header || `column ${index + 1}`}`}
                      value={mapping.outputName}
                      onChange={e =>
                        updateMapping(index, { outputName: e.target.value })
                      }
                      className="border border-[#dbe1eb] bg-white px-3 py-2 text-xs outline-none focus:border-[#1d56c9]"
                      placeholder="Custom output column name"
                    />
                    <div className="flex items-center justify-between gap-3 border-t border-[#dbe1eb] pt-2 text-[10px] font-normal text-[#647087] sm:block sm:border-t-0 sm:border-l sm:pl-3 sm:pt-0">
                      <span className="font-mono uppercase tracking-[.12em] text-[#1d56c9]">
                        {stats.type}
                      </span>
                      <span className="sm:mt-1 sm:block">
                        {stats.valid} valid · {stats.invalid} invalid
                        {stats.empty ? ` · ${stats.empty} empty` : ""}
                      </span>
                      <button
                        type="button"
                        disabled={
                          stats.invalid === 0 ||
                          !activeMappings.some(
                            mapping => mapping.index === index
                          )
                        }
                        onClick={() => setInvalidColumn(header)}
                        className="mt-2 border border-[#dbe1eb] px-2 py-1 text-[10px] font-semibold text-[#536276] hover:border-[#1d56c9] hover:text-[#1d56c9] disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={`Show issues for ${header || `column ${index + 1}`}`}
                      >
                        Show issues
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div
            className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#dbe1eb] pt-4 text-xs text-[#536276]"
            role="status"
            aria-live="polite"
          >
            <span>
              {parsed.rows.length} data rows · {parsed.headers.length} columns ·{" "}
              {activeMappings.length} mapped
            </span>
            <span
              className={
                totalInvalid ? "font-semibold text-[#a34d19]" : "text-[#18866b]"
              }
            >
              {totalInvalid
                ? `${totalInvalid} invalid values will remain blank`
                : "All mapped values are numeric"}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            <button
              onClick={downloadInvalidReport}
              disabled={
                !invalidValues.length ||
                readState === "reading" ||
                readState === "error"
              }
              className="flex items-center gap-2 border border-[#a34d19] px-5 py-3 text-sm font-semibold text-[#a34d19] hover:bg-[#fff7ed] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FileWarning size={15} /> Download invalid value report
            </button>
            <button
              onClick={() =>
                downloadBlob(
                  invalidReportJson,
                  "convertkit-invalid-values.json"
                )
              }
              disabled={
                !invalidValues.length ||
                readState === "reading" ||
                readState === "error"
              }
              className="flex items-center gap-2 border border-[#dbe1eb] px-5 py-3 text-sm font-semibold text-[#172033] hover:border-[#1d56c9] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Download JSON report
            </button>
          </div>
          {invalidValues.length > 0 && (
            <div
              className="mt-4 border border-[#f0c6a8] bg-[#fffaf5] p-3"
              aria-label="Invalid value locations"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-[10px] uppercase tracking-[.14em] text-[#a34d19]">
                  Invalid value locations
                </p>
                <span className="text-[10px] font-normal text-[#647087]">
                  Select a row to locate its original value
                </span>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <label className="grid gap-1 text-[10px] font-semibold text-[#536276]">
                  Filter by column
                  <select
                    aria-label="Filter invalid values by column"
                    value={invalidColumn}
                    onChange={event => setInvalidColumn(event.target.value)}
                    className="border border-[#f0c6a8] bg-white px-2 py-2 text-xs font-normal outline-none focus:border-[#a34d19]"
                  >
                    <option value="all">All columns</option>
                    {invalidColumns.map(column => (
                      <option key={column} value={column}>
                        {column}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1 text-[10px] font-semibold text-[#536276]">
                  Sort issues
                  <select
                    aria-label="Sort invalid values"
                    value={invalidSort}
                    onChange={event =>
                      setInvalidSort(event.target.value as InvalidSort)
                    }
                    className="border border-[#f0c6a8] bg-white px-2 py-2 text-xs font-normal outline-none focus:border-[#a34d19]"
                  >
                    <option value="row-asc">Row: ascending</option>
                    <option value="row-desc">Row: descending</option>
                    <option value="value-asc">Value: A–Z</option>
                    <option value="value-desc">Value: Z–A</option>
                  </select>
                </label>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInvalidColumn("all")}
                  disabled={invalidColumn === "all"}
                  className="border border-[#dbe1eb] px-3 py-2 text-[10px] font-semibold text-[#536276] hover:border-[#1d56c9] hover:text-[#1d56c9] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Clear current column filter
                </button>
                <button
                  type="button"
                  onClick={copyShareLink}
                  className="border border-[#dbe1eb] px-3 py-2 text-[10px] font-semibold text-[#536276] hover:border-[#1d56c9] hover:text-[#1d56c9]"
                >
                  Copy share link
                </button>
                <span className="text-[10px] text-[#647087]" aria-live="polite">
                  {shareCopyState === "copied"
                    ? "Link copied"
                    : shareCopyState === "error"
                      ? "Copy unavailable"
                      : ""}
                </span>
                {shareCopyState === "copied" && shareLinkPreview && (
                  <>
                    <code
                      className="block max-w-full truncate text-[10px] text-[#1d56c9]"
                      title={shareLinkPreview}
                    >
                      {shareLinkPreview}
                    </code>
                    <button
                      type="button"
                      onClick={closeSharePreview}
                      className="text-[10px] font-semibold text-[#647087] underline underline-offset-2 hover:text-[#1d56c9]"
                    >
                      Close preview
                    </button>
                  </>
                )}
              </div>
              <p className="mt-2 text-[10px] text-[#647087]">
                Showing {Math.min(visibleInvalidValues.length, 20)} of{" "}
                {visibleInvalidValues.length} filtered issues.
              </p>
              <div className="mt-2 grid gap-1">
                {visibleInvalidValues.slice(0, 20).map(item => (
                  <button
                    key={`${item.rowNumber}-${item.column}`}
                    type="button"
                    onClick={() => locateInvalidValue(item)}
                    className="flex items-center justify-between gap-3 border-b border-[#f0c6a8] py-2 text-left text-xs text-[#536276] hover:text-[#a34d19]"
                    aria-label={`Locate row ${item.rowNumber}, column ${item.column}`}
                  >
                    <span>
                      Row {item.rowNumber} · {item.column}
                    </span>
                    <span className="max-w-[12rem] truncate font-mono text-[10px]">
                      {item.rawValue}
                    </span>
                  </button>
                ))}
              </div>
              {visibleInvalidValues.length > 20 && (
                <p className="mt-2 text-[10px] text-[#647087]">
                  Showing the first 20 of {visibleInvalidValues.length} filtered
                  issues; download the report for the full list.
                </p>
              )}
              {locatedRow !== null && (
                <p
                  className="mt-2 text-[10px] font-semibold text-[#a34d19]"
                  role="status"
                >
                  Located row {locatedRow} in the input.
                </p>
              )}
            </div>
          )}
          <button
            onClick={download}
            disabled={
              !result ||
              !activeMappings.length ||
              readState === "reading" ||
              readState === "error"
            }
            className="mt-5 flex items-center gap-2 bg-[#1d56c9] px-5 py-3 text-sm font-semibold text-white hover:bg-[#244db7] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={15} /> Download CSV
          </button>
          {history.length > 0 && (
            <div className="mt-6 border-t border-[#dbe1eb] pt-4">
              <p className="font-mono text-[10px] uppercase tracking-[.15em] text-[#536276]">
                Recent local runs
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {history.map(item => (
                  <span
                    key={item}
                    className="border border-[#dbe1eb] px-2 py-1 font-mono text-[10px] text-[#536276]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export function PricingPage() {
  return (
    <main className="container py-14">
      <SEO
        title="Pricing | ConvertKit"
        description="Compare ConvertKit Free tools with future Pro workflows for bulk conversion, history, presets, and API access."
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Pricing", url: "/pricing" },
        ]}
      />
      <div className="max-w-2xl">
        <p className="signal-rule font-mono text-[10px] uppercase tracking-[.16em] text-[#1d56c9]">
          Plans / 04
        </p>
        <h1 className="mt-5 font-display text-5xl font-bold tracking-[-.05em]">
          Simple tools now.
          <br />
          <span className="text-[#1d56c9]">More leverage later.</span>
        </h1>
        <p className="mt-5 text-lg leading-7 text-[#536276]">
          The free toolkit is the foundation. Pro features are reserved for
          workflows that need history, bulk operations, and API access.
        </p>
      </div>
      <div className="mt-14 grid gap-5 md:grid-cols-2">
        <div className="border border-[#dbe1eb] bg-white p-7">
          <p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#1d56c9]">
            Free / available
          </p>
          <h2 className="mt-5 font-display text-3xl font-bold">$0</h2>
          <p className="mt-2 text-sm text-[#536276]">
            For everyday conversion work.
          </p>
          <div className="mt-7 grid gap-3 text-sm">
            {[
              "Unlimited basic conversions",
              "Standard unit converters",
              "JSON and format tools",
              "Browser-local processing",
            ].map(x => (
              <p key={x} className="flex items-center gap-2">
                <Check size={15} className="text-[#18866b]" />
                {x}
              </p>
            ))}
          </div>
          <Link
            href="/converters"
            className="mt-8 inline-flex items-center gap-2 border border-[#dbe1eb] px-4 py-3 text-sm font-semibold"
          >
            Open free tools <ArrowRight size={15} />
          </Link>
        </div>
        <div className="border-2 border-[#1d56c9] bg-[#111827] p-7 text-white shadow-[10px_10px_0_#dbe1eb]">
          <p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#9fb7ff]">
            Pro / planned
          </p>
          <h2 className="mt-5 font-display text-3xl font-bold">
            For repeat work.
          </h2>
          <p className="mt-2 text-sm text-[#aab8cf]">
            Payment is not enabled in this first release.
          </p>
          <div className="mt-7 grid gap-3 text-sm text-[#dbe7ff]">
            {[
              "No ads",
              "Bulk CSV conversion",
              "Conversion history",
              "Custom conversion presets",
              "API access",
            ].map(x => (
              <p key={x} className="flex items-center gap-2">
                <Lock size={14} className="text-[#e3a83b]" />
                {x}
              </p>
            ))}
          </div>
          <Link
            href="/bulk-converter"
            className="mt-8 inline-flex items-center gap-2 bg-[#1d56c9] px-4 py-3 text-sm font-semibold"
          >
            Try bulk preview <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </main>
  );
}
