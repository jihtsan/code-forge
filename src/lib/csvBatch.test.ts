import { describe, expect, it } from "vitest";
import { parseBarcodeCsv } from "./csvBatch";

describe("parseBarcodeCsv", () => {
  it("uses a recognized barcode header", () => {
    const result = parseBarcodeCsv("name,barcode\nFirst,ABC-001\nSecond,ABC-002");

    expect(result.values).toEqual(["ABC-001", "ABC-002"]);
    expect(result.columnLabel).toBe("barcode");
    expect(result.usedHeader).toBe(true);
  });

  it("supports Chinese headers and quoted cells", () => {
    const result = parseBarcodeCsv('备注,条码数据\n"上海,一期",9771234567\n二期,9771234568');

    expect(result.values).toEqual(["9771234567", "9771234568"]);
    expect(result.errors).toEqual([]);
  });

  it("falls back to the first column for headerless files", () => {
    const result = parseBarcodeCsv("ABC-001,First\nABC-002,Second");

    expect(result.values).toEqual(["ABC-001", "ABC-002"]);
    expect(result.columnLabel).toBe("第 1 列");
    expect(result.usedHeader).toBe(false);
  });

  it("caps the imported values and reports truncation", () => {
    const result = parseBarcodeCsv("data\n001\n002\n003", 2);

    expect(result.values).toEqual(["001", "002"]);
    expect(result.truncatedCount).toBe(1);
  });

  it("reports malformed quoted CSV", () => {
    const result = parseBarcodeCsv('data\n"unterminated');

    expect(result.errors.length).toBeGreaterThan(0);
  });
});
