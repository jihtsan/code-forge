import Papa from "papaparse";

const BARCODE_HEADER_NAMES = new Set([
  "barcode",
  "barcodedata",
  "barcodevalue",
  "code",
  "data",
  "value",
  "bianma",
  "tiaoma",
  "tiaomashuju",
  "tiaomazhi",
  "编码",
  "条码",
  "条码数据",
  "条码值",
  "码值",
]);

export interface ParsedBarcodeCsv {
  readonly values: readonly string[];
  readonly columnLabel: string;
  readonly usedHeader: boolean;
  readonly truncatedCount: number;
  readonly errors: readonly string[];
}

const normalizeHeader = (value: string): string =>
  value
    .replace(/^\uFEFF/, "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");

const formatParseError = (error: Papa.ParseError): string => {
  const errorRow = error.row;
  const row = typeof errorRow === "number" && Number.isInteger(errorRow) ? `第 ${errorRow + 1} 行：` : "";
  return `${row}${error.message}`;
};

export const parseBarcodeCsv = (source: string, maxItems = 50): ParsedBarcodeCsv => {
  const parsed = Papa.parse<string[]>(source, {
    skipEmptyLines: "greedy",
  });
  const rows = parsed.data.map((row) => row.map((cell) => String(cell ?? "").trim()));
  const headers = rows[0] ?? [];
  const detectedColumn = headers.findIndex((header) => BARCODE_HEADER_NAMES.has(normalizeHeader(header)));
  const usedHeader = detectedColumn >= 0;
  const columnIndex = usedHeader ? detectedColumn : 0;
  const dataRows = usedHeader ? rows.slice(1) : rows;
  const allValues = dataRows
    .map((row) => row[columnIndex] ?? "")
    .map((value) => value.trim())
    .filter(Boolean);
  const safeLimit = Number.isFinite(maxItems) ? Math.max(1, Math.floor(maxItems)) : 50;
  const errors = parsed.errors
    .filter((error) => error.code !== "UndetectableDelimiter")
    .map(formatParseError);

  return {
    values: allValues.slice(0, safeLimit),
    columnLabel: usedHeader ? headers[columnIndex] : "第 1 列",
    usedHeader,
    truncatedCount: Math.max(0, allValues.length - safeLimit),
    errors,
  };
};
