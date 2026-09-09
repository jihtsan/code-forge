import { describe, expect, it } from "vitest";
import { buildPrintDocument } from "./printDocument";
import { DEFAULT_LABEL_SETTINGS } from "./labelPrinting";

describe("portable print documents", () => {
  const a = { value: "A", svg: '<svg xmlns="http://www.w3.org/2000/svg"><text>A &amp; B</text></svg>' };
  const b = { value: "B", svg: '<svg xmlns="http://www.w3.org/2000/svg"><text>B</text></svg>' };

  it("preserves page dimensions, margins, order and expanded copies", () => {
    const html = buildPrintDocument([a, b], { width: 50, height: 30, margin: 1.5, copies: 2 });
    expect(html).toContain("size: 50mm 30mm");
    expect(html).toContain("padding: 1.5mm");
    const images = [...html.matchAll(/src="data:image\/svg\+xml;charset=utf-8,([^"]+)"/g)];
    expect(images.map((match) => decodeURIComponent(match[1]))).toEqual([a.svg, a.svg, b.svg, b.svg]);
    expect(html).toContain("系统份数保持 1");
  });

  it("does not interpolate payloads as executable document HTML", () => {
    const svg = '<svg><text>"</text></svg><script>alert(1)</script>';
    const html = buildPrintDocument([{ value: '<script>evil</script>', svg }], DEFAULT_LABEL_SETTINGS);
    expect(html).not.toContain("<script>");
    expect(html).not.toContain(svg);
    expect(html).not.toContain('onload=');
  });

  it("rejects empty jobs and invalid sizes instead of producing misleading output", () => {
    expect(() => buildPrintDocument([], DEFAULT_LABEL_SETTINGS)).toThrow();
    expect(() => buildPrintDocument([a], { ...DEFAULT_LABEL_SETTINGS, width: NaN })).toThrow();
    expect(() => buildPrintDocument([a], { ...DEFAULT_LABEL_SETTINGS, copies: 1000 })).toThrow();
  });

  it("is self-contained and prints only on an explicit user action", () => {
    const html = buildPrintDocument([a], DEFAULT_LABEL_SETTINGS);
    expect(html).not.toMatch(/<script|<link|src="https?:|type="module"/);
    expect(html).toContain('onclick=');
    expect(html).toContain("header { display: none; }");
    expect(html).toContain(".label:last-child { break-after: auto;");
  });
});
