// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { converters } from '../lib/conversion';
import { Tool } from './ConverterPage';

afterEach(cleanup);


describe('unit converter workbench interactions', () => {
  it('updates the result from typed input', async () => {
    const user = userEvent.setup();
    render(<Tool converter={converters[0]} />);
    const input = screen.getByRole('textbox', { name: 'Input value' });

    await user.clear(input);
    await user.type(input, '2');

    expect(screen.getByText(/6\.56168/)).toBeTruthy();
  });

  it('swaps units and resets the input', async () => {
    const user = userEvent.setup();
    render(<Tool converter={converters[0]} />);
    const input = screen.getByRole('textbox', { name: 'Input value' });

    await user.clear(input);
    await user.type(input, '2');
    await user.click(screen.getByRole('button', { name: 'Swap units' }));
    expect((input as HTMLInputElement).value).toMatch(/6\.56168/);

    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect((input as HTMLInputElement).value).toBe('');
  });

  it('copies a calculated result', async () => {
    const user = userEvent.setup();
    render(<Tool converter={converters[0]} />);
    await user.click(screen.getByRole('button', { name: 'Copy result' }));

    expect(screen.getByRole('button', { name: 'Copied' })).toBeTruthy();
  });
});
