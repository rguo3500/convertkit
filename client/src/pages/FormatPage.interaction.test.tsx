// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import FormatPage from './FormatPage';
import { BulkPage } from './ProPages';

const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  URL.createObjectURL = originalCreateObjectURL;
  URL.revokeObjectURL = originalRevokeObjectURL;
});

describe('format tool interactions', () => {
  it('formats JSON as the user types', async () => {
    const user = userEvent.setup();
    render(<FormatPage type="json-formatter" />);
    const input = screen.getByRole('textbox', { name: 'Input' });

    await user.clear(input);
    fireEvent.change(input, { target: { value: '{"name":"Ada"}' } });

    expect(screen.getByRole('status').textContent).toContain('"name": "Ada"');
  });

  it('runs URL and Unix timestamp conversions through the shared format engine', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<FormatPage type="url-encoder" />);
    const urlInput = screen.getByRole('textbox', { name: 'Input' });
    await user.clear(urlInput);
    await user.type(urlInput, 'hello world');
    expect(screen.getByRole('status').textContent).toContain('hello%20world');

    unmount();
    render(<FormatPage type="unix-timestamp-converter" />);
    const timestampInput = screen.getByRole('textbox', { name: 'Input' });
    await user.type(timestampInput, '0');
    expect(screen.getByRole('status').textContent).toMatch(/1970/);
  });

  it('imports a CSV file and exposes the converted download action', async () => {
    const user = userEvent.setup();
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    URL.createObjectURL = vi.fn(() => 'blob:convertkit-test');
    URL.revokeObjectURL = vi.fn();
    render(<BulkPage />);

    const file = new File(['value\n2\n3'], 'values.csv', { type: 'text/csv' });
    const fileInput = screen.getByLabelText('Input CSV') as HTMLInputElement;
    await user.upload(fileInput, file);
    expect(screen.getByText(/4\.409245/)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Download CSV' }));
    expect(clickSpy).toHaveBeenCalled();
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(screen.getByText('Recent local runs')).toBeTruthy();
  });
});
