import { describe, expect, it } from 'vitest';
import { base64Decode, base64Encode, csvToJson, executeFormat, jsonToCsv, jsonToXml } from './format';

describe('format transformations', () => {
  it('formats, minifies, and validates JSON', () => {
    const input='{"name":"ConvertKit","active":true}';
    expect(executeFormat('json-formatter', input)).toContain('\n  "name"');
    expect(executeFormat('json-minifier', '{ "name": "ConvertKit" }')).toBe('{"name":"ConvertKit"}');
    expect(executeFormat('json-validator', input)).toBe('Valid JSON');
    expect(executeFormat('json-validator', '{broken')).toContain('Invalid JSON');
  });
  it('converts JSON and CSV while preserving quoted values', () => {
    const csv=jsonToCsv([{name:'ConvertKit',note:'local, fast'}]);
    expect(csv).toBe('name,note\nConvertKit,"local, fast"');
    expect(csvToJson(csv)).toEqual([{name:'ConvertKit',note:'local, fast'}]);
  });
  it('escapes JSON into XML', () => {
    expect(jsonToXml({name:'A&B'},'item')).toBe('<item><name>A&amp;B</name></item>');
  });
  it('round-trips UTF-8 Base64 and URL values', () => {
    const source='中文 / ConvertKit';
    expect(base64Decode(base64Encode(source))).toBe(source);
    expect(executeFormat('url-decoder', executeFormat('url-encoder', source))).toBe(source);
  });
  it('handles Unix timestamps in seconds and milliseconds', () => {
    expect(executeFormat('unix-timestamp-converter','0')).toBe('1970-01-01T00:00:00.000Z');
    expect(executeFormat('unix-timestamp-converter','not-a-time')).toBe('Invalid timestamp');
  });
});
