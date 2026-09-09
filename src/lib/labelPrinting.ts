import bwipjs from "@bwip-js/browser";
import { isLinearSymbology } from "../data/linearSymbologies";
import type { SymbologyId } from "../data/mockData";
import { buildCode11Encoding, code11BarsFromPattern, code11PatternWidth, type Code11ChecksumMode } from "./code11";
import { buildLinearBarcodeSvg, type LinearBarcodeRender } from "./linearBarcode";

export interface PrintBarcodeOptions {
  readonly symbology: SymbologyId;
  readonly value: string;
  readonly variant: string;
  readonly addon: string;
  readonly checksumMode: Code11ChecksumMode;
  readonly showCheckDigits: boolean;
  readonly includeCheck: boolean;
  readonly showText: boolean;
}

/** Print artwork has no theme colors, specimen decorations or diagnostic text. */
export const buildPrintBarcode = (options: PrintBarcodeOptions): LinearBarcodeRender => {
  const { symbology, value } = options;
  if (!value) return { svg: null, error: "请输入条码数据" };
  if (symbology === "code11") {
    if (!/^[0-9-]{1,80}$/.test(value)) return { svg: null, error: "Code-11 数据无效" };
    const encoding = buildCode11Encoding(value, options.checksumMode);
    const width = code11PatternWidth(encoding.pattern) + 54;
    const bars = code11BarsFromPattern(encoding.pattern).map((bar) =>
      `<rect x="${bar.x + 27}" y="8" width="${bar.width}" height="86"/>`,
    ).join("");
    const text = options.showCheckDigits ? encoding.encodedData : encoding.data;
    return {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 120"><rect width="100%" height="100%" fill="#ffffff"/><g fill="#000000">${bars}<text x="${width / 2}" y="111" text-anchor="middle" font-family="monospace" font-size="13">${text}</text></g></svg>`,
      error: null,
    };
  }
  if (isLinearSymbology(symbology)) {
    return buildLinearBarcodeSvg({
      id: symbology, data: value, includeCheck: options.includeCheck,
      showText: options.showText, print: true,
    });
  }
  if (!/^\d{7}$/.test(value) || !/^\d{2}$/.test(options.variant) || !/^\d{2}$/.test(options.addon)) {
    return { svg: null, error: "请填写完整的 ISSN 主体、变体和附加码" };
  }
  try {
    // EAN-13 accepts a 12-digit payload and computes its check digit. The
    // space-separated supplement encodes the actual two-digit add-on bars.
    return {
      svg: bwipjs.toSVG({
        bcid: "ean13", text: `977${value}${options.variant} ${options.addon}`,
        scale: 2, height: 22, includetext: true, paddingwidth: 12, paddingheight: 4,
        barcolor: "000000", textcolor: "000000", backgroundcolor: "ffffff",
      }),
      error: null,
    };
  } catch {
    return { svg: null, error: "ISSN 条码无法生成，请检查输入" };
  }
};

export interface LabelSettings {
  readonly width: number;
  readonly height: number;
  readonly margin: number;
  readonly copies: number;
}

export const DEFAULT_LABEL_SETTINGS: LabelSettings = { width: 60, height: 40, margin: 2, copies: 1 };
export const MAX_PRINT_LABELS = 500;

export const validateLabelSettings = (settings: LabelSettings, itemCount: number): string | null => {
  if (![settings.width, settings.height, settings.margin, settings.copies].every(Number.isFinite)) {
    return "请填写完整的打印设置";
  }
  if (settings.width < 20 || settings.width > 210 || settings.height < 15 || settings.height > 297) {
    return "标签宽度需为 20–210 mm，高度需为 15–297 mm";
  }
  if (settings.margin < 0 || settings.width - settings.margin * 2 < 10 || settings.height - settings.margin * 2 < 10) {
    return "边距不能为负，且需保留至少 10 × 10 mm 的内容区域";
  }
  if (!Number.isInteger(settings.copies) || settings.copies < 1 || settings.copies > 100) {
    return "每条份数需为 1–100 的整数";
  }
  if (itemCount === 0) return "没有可打印的有效条码";
  if (itemCount * settings.copies > MAX_PRINT_LABELS) return `每次最多打印 ${MAX_PRINT_LABELS} 张标签，请减少份数或分批打印`;
  return null;
};

export interface PrintableLabel {
  readonly value: string;
  readonly svg: string;
}

export const expandPrintLabels = (items: readonly PrintableLabel[], settings: LabelSettings): readonly PrintableLabel[] => {
  if (validateLabelSettings(settings, items.length)) return [];
  return items.flatMap((item) => Array.from({ length: settings.copies }, () => item));
};

export const isPrintShortcut = (event: Pick<KeyboardEvent, "key" | "ctrlKey" | "metaKey" | "altKey" | "shiftKey">): boolean =>
  (event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === "p";
