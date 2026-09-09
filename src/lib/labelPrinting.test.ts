import { describe, expect, it } from "vitest";
import { linearSymbologies } from "../data/linearSymbologies";
import { buildLinearBarcodeSvg } from "./linearBarcode";
import {
  buildPrintBarcode, DEFAULT_LABEL_SETTINGS, expandPrintLabels, isPrintShortcut,
  validateLabelSettings, type PrintBarcodeOptions,
} from "./labelPrinting";

const options: PrintBarcodeOptions = {
  symbology: "issn-p2", value: "1234567", variant: "89", addon: "12",
  checksumMode: "ck", showCheckDigits: true, includeCheck: true, showText: true,
};

describe("print artwork", () => {
  it("encodes the ISSN supplement as bars, not just readable text", () => {
    const first = buildPrintBarcode(options).svg!;
    const second = buildPrintBarcode({ ...options, addon: "13" }).svg!;
    const barPaths = (svg: string) => svg.match(/<path stroke[^>]+>/g);
    expect(barPaths(first)?.length).toBeGreaterThan(0);
    expect(barPaths(first)).not.toEqual(barPaths(second));
    expect(first).not.toMatch(/START|STOP|QUIET ZONE|#eafaf1/);
  });

  it.each(["", "123", "12345678", "<script>"])("rejects incomplete or invalid ISSN data: %s", (value) => {
    expect(buildPrintBarcode({ ...options, value }).svg).toBeNull();
  });

  it("does not silently pad incomplete ISSN variant or supplement", () => {
    expect(buildPrintBarcode({ ...options, variant: "1" }).svg).toBeNull();
    expect(buildPrintBarcode({ ...options, addon: "" }).svg).toBeNull();
  });

  it.each(linearSymbologies)("renders $id sample as black and white printable vectors", (definition) => {
    const result = buildPrintBarcode({ ...options, symbology: definition.id, value: definition.sample });
    expect(result.error).toBeNull();
    expect(result.svg).toContain("<svg");
    const colors = [...result.svg!.matchAll(/#[0-9a-f]{6}/gi)].map((match) => match[0].toLowerCase());
    expect(colors).toContain("#000000");
    expect(colors.every((color) => color === "#000000" || color === "#ffffff")).toBe(true);
  });

  it("overrides dark mode for print without changing themed exports", () => {
    const input = { id: "code128" as const, data: "ABC-001", includeCheck: false, showText: true, dark: true };
    expect(buildLinearBarcodeSvg(input).svg).toContain("#f8fafc");
    expect(buildLinearBarcodeSvg({ ...input, print: true }).svg).not.toContain("#f8fafc");
  });

  it("rejects invalid Code-11 rather than printing an empty start/stop pattern", () => {
    expect(buildPrintBarcode({ ...options, symbology: "code11", value: "" }).svg).toBeNull();
    expect(buildPrintBarcode({ ...options, symbology: "code11", value: "abc" }).svg).toBeNull();
  });
});

describe("label jobs", () => {
  it.each([
    { width: Number.NaN }, { height: Infinity }, { width: 19 }, { height: 298 },
    { margin: -1 }, { margin: 16 }, { copies: 0 }, { copies: 1.5 }, { copies: 101 },
  ])("rejects unsafe page settings: %j", (override) => {
    expect(validateLabelSettings({ ...DEFAULT_LABEL_SETTINGS, ...override }, 1)).not.toBeNull();
  });

  it("allows the batch limit but rejects excess labels and empty jobs", () => {
    expect(validateLabelSettings({ ...DEFAULT_LABEL_SETTINGS, copies: 10 }, 50)).toBeNull();
    expect(validateLabelSettings({ ...DEFAULT_LABEL_SETTINGS, copies: 11 }, 50)).toContain("500");
    expect(validateLabelSettings(DEFAULT_LABEL_SETTINGS, 0)).not.toBeNull();
  });

  it("expands each barcode's copies in order and never expands invalid jobs", () => {
    const a = { value: "A", svg: "<svg/>" };
    const b = { value: "B", svg: "<svg/>" };
    expect(expandPrintLabels([a, b], { ...DEFAULT_LABEL_SETTINGS, copies: 2 }).map((item) => item.value)).toEqual(["A", "A", "B", "B"]);
    expect(expandPrintLabels([a], { ...DEFAULT_LABEL_SETTINGS, copies: 100000 })).toEqual([]);
  });
});

describe("print shortcuts", () => {
  const key = { key: "p", ctrlKey: false, metaKey: false, shiftKey: false, altKey: false };
  it("supports Windows and Mac while preserving alternate shortcuts", () => {
    expect(isPrintShortcut({ ...key, ctrlKey: true })).toBe(true);
    expect(isPrintShortcut({ ...key, metaKey: true, key: "P" })).toBe(true);
    expect(isPrintShortcut(key)).toBe(false);
    expect(isPrintShortcut({ ...key, ctrlKey: true, shiftKey: true })).toBe(false);
    expect(isPrintShortcut({ ...key, metaKey: true, altKey: true })).toBe(false);
  });
});
