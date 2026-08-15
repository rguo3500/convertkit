import { describe, expect, it } from 'vitest';
import { parseCsv, serializeCsv } from './csv';

describe('CSV boundary cases', () => {
  it('returns an empty shape for empty or newline-only input', () => {
    expect(parseCsv('')).toEqual({ headers: [], rows: [] });
    expect(parseCsv('\n\n')).toEqual({ headers: [], rows: [] });
  });

  it('removes a BOM and preserves quoted commas, quotes, and newlines', () => {
    const parsed = parseCsv('\uFEFFname,note\nAda,"hello, ""world"""\nGrace,"line one\nline two"');
    expect(parsed.headers).toEqual(['name', 'note']);
    expect(parsed.rows[0]).toEqual(['Ada', 'hello, "world"']);
    expect(parsed.rows[1]).toEqual(['Grace', 'line one\nline two']);
  });

  it('serializes large values and special characters safely', () => {
    const longValue = 'x'.repeat(100_000);
    const csv = serializeCsv(['value', 'note'], [[longValue, 'a,b\nc"d']]);
    expect(csv.startsWith(`value,note\n${longValue},`)).toBe(true);
    expect(csv).toContain('"a,b\nc""d"');
  });
});
