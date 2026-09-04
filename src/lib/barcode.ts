export interface BarcodeBar {
  readonly x: number;
  readonly width: number;
  readonly height: number;
  readonly y: number;
}

const L_CODES = [
  "0001101",
  "0011001",
  "0010011",
  "0111101",
  "0100011",
  "0110001",
  "0101111",
  "0111011",
  "0110111",
  "0001011",
] as const;

const G_CODES = [
  "0100111",
  "0110011",
  "0011011",
  "0100001",
  "0011101",
  "0111001",
  "0000101",
  "0010001",
  "0001001",
  "0010111",
] as const;

const R_CODES = [
  "1110010",
  "1100110",
  "1101100",
  "1000010",
  "1011100",
  "1001110",
  "1010000",
  "1000100",
  "1001000",
  "1110100",
] as const;

const PARITY_PATTERNS = [
  "LLLLLL",
  "LLGLGG",
  "LLGGLG",
  "LLGGGL",
  "LGLLGG",
  "LGGLLG",
  "LGGGLL",
  "LGLGLG",
  "LGLGGL",
  "LGGLGL",
] as const;

export const ean13Pattern = (value: string): string => {
  if (value.length !== 13 || /\D/.test(value)) return "";
  const first = Number(value[0]);
  const parity = PARITY_PATTERNS[first];
  const left = value
    .slice(1, 7)
    .split("")
    .map((digit, index) => {
      const code = parity[index];
      return code === "G" ? G_CODES[Number(digit)] : L_CODES[Number(digit)];
    })
    .join("");
  const right = value
    .slice(7)
    .split("")
    .map((digit) => R_CODES[Number(digit)])
    .join("");
  return `101${left}01010${right}101`;
};

export const barsFromPattern = (
  pattern: string,
  options: { readonly moduleWidth?: number; readonly top?: number; readonly height?: number } = {},
): BarcodeBar[] => {
  const moduleWidth = options.moduleWidth ?? 2.55;
  const top = options.top ?? 19;
  const height = options.height ?? 86;
  const bars: BarcodeBar[] = [];
  let cursor = 0;

  for (const bit of pattern) {
    if (bit === "1") {
      bars.push({ x: cursor, width: moduleWidth, height, y: top });
    }
    cursor += moduleWidth;
  }

  return bars;
};

export interface BarcodeSvgOptions {
  readonly payload: string;
  readonly addon: string;
  readonly dark?: boolean;
}

export const buildBarcodeSvg = ({
  payload,
  addon,
  dark = false,
}: BarcodeSvgOptions): string => {
  const value = `${payload}${payload.length === 12 ? "0" : ""}`.slice(0, 12);
  const check = value.length === 12 ? calculateCheck(value) : "0";
  const full = `${value}${check}`;
  const pattern = ean13Pattern(full);
  const moduleWidth = 2.55;
  const bars = barsFromPattern(pattern, { moduleWidth, top: 20, height: 82 });
  const width = 430;
  const ink = dark ? "#f8fafc" : "#1d1d1f";
  const barMarkup = bars
    .map(
      (bar) =>
        `<rect x="${(bar.x + 24).toFixed(2)}" y="${bar.y}" width="${bar.width.toFixed(2)}" height="${bar.height}" rx="0.5" fill="${ink}"/>`,
    )
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 142" role="img" aria-label="EAN-13 barcode ${full}"><rect width="100%" height="100%" fill="${dark ? "#171c25" : "#ffffff"}"/><rect x="15" y="15" width="12" height="95" rx="6" fill="${dark ? "#163b48" : "#eafaf1"}"/><rect x="403" y="15" width="12" height="95" rx="6" fill="${dark ? "#163b48" : "#eafaf1"}"/>${barMarkup}<text x="20" y="124" font-family="JetBrains Mono, monospace" font-size="11" fill="${dark ? "#b8c0cf" : "#86868b"}">${full.slice(0, 1)}</text><text x="48" y="124" font-family="JetBrains Mono, monospace" font-size="11" fill="${ink}">${full.slice(1, 7)}</text><text x="216" y="124" font-family="JetBrains Mono, monospace" font-size="11" fill="${ink}">${full.slice(7, 13)}</text><text x="320" y="124" font-family="JetBrains Mono, monospace" font-size="11" fill="${ink}">› ${addon || "00"}</text></svg>`;
};

const calculateCheck = (payload: string): string => {
  const sum = payload.split("").reduce((total, character, index) => {
    const digit = Number(character);
    return total + (index % 2 === 0 ? digit : digit * 3);
  }, 0);
  return String((10 - (sum % 10)) % 10);
};
