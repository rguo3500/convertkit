// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import FormatPage from "./FormatPage";
import { BulkPage } from "./ProPages";

const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  URL.createObjectURL = originalCreateObjectURL;
  URL.revokeObjectURL = originalRevokeObjectURL;
});

describe("format tool interactions", () => {
  it("formats JSON as the user types", async () => {
    const user = userEvent.setup();
    render(<FormatPage type="json-formatter" />);
    const input = screen.getByRole("textbox", { name: "Input" });

    await user.clear(input);
    fireEvent.change(input, { target: { value: '{"name":"Ada"}' } });

    expect(screen.getByRole("status").textContent).toContain('"name": "Ada"');
  });

  it("runs URL and Unix timestamp conversions through the shared format engine", async () => {
    const user = userEvent.setup();
    const { unmount } = render(<FormatPage type="url-encoder" />);
    const urlInput = screen.getByRole("textbox", { name: "Input" });
    await user.clear(urlInput);
    await user.type(urlInput, "hello world");
    expect(screen.getByRole("status").textContent).toContain("hello%20world");

    unmount();
    render(<FormatPage type="unix-timestamp-converter" />);
    const timestampInput = screen.getByRole("textbox", { name: "Input" });
    await user.type(timestampInput, "0");
    expect(screen.getByRole("status").textContent).toMatch(/1970/);
  });

  it("rejects CSV files larger than the local processing limit", async () => {
    const user = userEvent.setup();
    render(<BulkPage />);
    const oversized = new File(
      [new Uint8Array(5 * 1024 * 1024 + 1)],
      "large.csv",
      { type: "text/csv" }
    );
    await user.upload(screen.getByLabelText("Input CSV"), oversized);
    expect(screen.getByRole("alert").textContent).toContain("larger than 5 MB");
    expect(screen.getByRole("button", { name: "Download CSV" })).toHaveProperty(
      "disabled",
      true
    );
  });

  it("maps multiple CSV columns and uses custom output names", async () => {
    const user = userEvent.setup();
    render(<BulkPage />);
    const csvInput = screen.getByRole("textbox", { name: "CSV text" });
    await user.clear(csvInput);
    fireEvent.change(csvInput, { target: { value: "meters,kilograms\n2,3" } });
    const secondColumn = screen.getByLabelText("Conversion for kilograms");
    const secondToggle = screen.getByRole("checkbox", { name: "kilograms" });
    await user.click(secondToggle);
    await user.selectOptions(secondColumn, "1");
    const outputName = screen.getByLabelText("Output name for kilograms");
    await user.clear(outputName);
    await user.type(outputName, "pounds converted");
    expect(screen.getByDisplayValue("pounds converted")).toBeTruthy();
    expect(screen.getByText("Output CSV").parentElement?.textContent).toContain(
      "pounds converted"
    );
  });

  it("reports column types and invalid values before download", async () => {
    const user = userEvent.setup();
    render(<BulkPage />);
    const csvInput = screen.getByRole("textbox", { name: "CSV text" });
    await user.clear(csvInput);
    fireEvent.change(csvInput, {
      target: { value: "meters,kilograms\n2,not-a-number\n,4" },
    });
    expect(screen.getByText("Mixed")).toBeTruthy();
    expect(screen.getByText(/1 valid · 1 invalid/)).toBeTruthy();
    expect(screen.getByText(/1 valid · 0 invalid · 1 empty/)).toBeTruthy();
    expect(screen.getByText("1 invalid values will remain blank")).toBeTruthy();
  });

  it("filters and sorts invalid value locations", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    render(<BulkPage />);
    const csvInput = screen.getByRole("textbox", { name: "CSV text" });
    await user.clear(csvInput);
    fireEvent.change(csvInput, {
      target: { value: "meters,kilograms\nbad,zoo\n2,wrong" },
    });
    await user.click(screen.getByRole("checkbox", { name: "kilograms" }));
    await user.click(
      screen.getByRole("button", { name: "Show issues for meters" })
    );
    expect(
      (
        screen.getByRole("combobox", {
          name: "Filter invalid values by column",
        }) as HTMLSelectElement
      ).value
    ).toBe("meters");
    expect(window.location.search).toContain("issuesColumn=meters");
    const columnFilter = screen.getByRole("combobox", {
      name: "Filter invalid values by column",
    });
    await user.selectOptions(columnFilter, "kilograms");
    expect(screen.getByText("Showing 2 of 2 filtered issues.")).toBeTruthy();
    await user.click(
      screen.getByRole("button", { name: "Clear current column filter" })
    );
    expect((columnFilter as HTMLSelectElement).value).toBe("all");
    expect(window.location.search).not.toContain("issuesColumn=");
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Sort invalid values" }),
      "row-desc"
    );
    expect(window.location.search).toContain("issuesSort=row-desc");
    await user.click(screen.getByRole("button", { name: "Copy share link" }));
    expect(writeText).toHaveBeenCalledWith(
      expect.stringContaining("issuesSort=row-desc")
    );
    expect(screen.getByText("Link copied")).toBeTruthy();
    expect(screen.getByText(/issuesSort=row-desc/)).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Locate row 3, column kilograms" })
    ).toBeTruthy();
  });

  it("downloads an invalid value report with row and column details", async () => {
    const user = userEvent.setup();
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});
    URL.createObjectURL = vi.fn(() => "blob:invalid-values");
    URL.revokeObjectURL = vi.fn();
    render(<BulkPage />);
    const csvInput = screen.getByRole("textbox", { name: "CSV text" });
    await user.clear(csvInput);
    fireEvent.change(csvInput, {
      target: { value: "value\nnot-a-number" },
    });
    const reportButton = screen.getByRole("button", {
      name: "Download invalid value report",
    });
    expect(reportButton).not.toHaveProperty("disabled", true);
    await user.click(reportButton);
    expect(clickSpy).toHaveBeenCalled();
    expect(URL.createObjectURL).toHaveBeenCalled();
    await user.click(
      screen.getByRole("button", { name: "Download JSON report" })
    );
    await user.click(
      screen.getByRole("button", { name: "Locate row 2, column value" })
    );
    expect(screen.getByText("Located row 2 in the input.")).toBeTruthy();
  });

  it("imports a CSV file and exposes the converted download action", async () => {
    const user = userEvent.setup();
    const clickSpy = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});
    URL.createObjectURL = vi.fn(() => "blob:convertkit-test");
    URL.revokeObjectURL = vi.fn();
    render(<BulkPage />);

    const file = new File(["value\n2\n3"], "values.csv", { type: "text/csv" });
    const fileInput = screen.getByLabelText("Input CSV") as HTMLInputElement;
    await user.upload(fileInput, file);
    expect(screen.getByText(/4\.409245/)).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Download CSV" }));
    expect(clickSpy).toHaveBeenCalled();
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(screen.getByText("Recent local runs")).toBeTruthy();
  });
});
