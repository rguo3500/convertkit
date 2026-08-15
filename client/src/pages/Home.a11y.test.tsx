// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import Home from "./Home";

afterEach(() => cleanup());

describe("home keyboard accessibility", () => {
  it("keeps the search control and primary shortcuts keyboard reachable", async () => {
    render(<Home />);

    const search = screen.getByRole("textbox", {
      name: "Search converters / 搜索转换工具",
    });
    const browseAll = screen.getByRole("link", {
      name: /Browse all unit converters/i,
    });
    const popularTool = screen.getByRole("link", { name: /Meters to Feet/i });

    expect(search.getAttribute("tabindex")).not.toBe("-1");
    expect(search.className).toContain("focus-visible:outline");
    expect(browseAll.getAttribute("tabindex")).not.toBe("-1");
    expect(browseAll.className).toContain("focus-visible:outline");
    expect(popularTool.getAttribute("tabindex")).not.toBe("-1");

    search.focus();
    expect(document.activeElement).toBe(search);
    browseAll.focus();
    expect(document.activeElement).toBe(browseAll);
    popularTool.focus();
    expect(document.activeElement).toBe(popularTool);
  });
});
