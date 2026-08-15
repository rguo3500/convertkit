/* Signal Workshop: CSV helpers are deterministic, local, and safe for quoted fields. */
export function parseCsv(text: string) {
  const source = text.replace(/^\uFEFF/, '');
  if (!source.trim()) return { headers: [], rows: [] as string[][] };

  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (char === '"') {
      if (quoted && source[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === ',' && !quoted) {
      row.push(cell);
      cell = '';
    } else if ((char === '\n' || char === '\r') && !quoted) {
      if (char === '\r' && source[index + 1] === '\n') index += 1;
      row.push(cell);
      if (row.some(value => value !== '')) rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }

  row.push(cell);
  if (row.some(value => value !== '')) rows.push(row);
  if (!rows.length) return { headers: [], rows: [] as string[][] };
  return { headers: rows[0], rows: rows.slice(1) };
}

export function serializeCsv(headers: string[], rows: string[][]) {
  const escape = (value: string) => /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
  return [headers.map(escape).join(','), ...rows.map(row => row.map(escape).join(','))].join('\n');
}
