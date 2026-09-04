export const CODE11_CHARACTERS = "0123456789-" as const;

export type Code11ChecksumMode = "none" | "auto" | "c" | "ck";
export type ResolvedCode11ChecksumMode = "none" | "c" | "ck";

export interface Code11Checks {
  readonly c: string;
  readonly k: string;
}

export interface Code11Encoding {
  readonly data: string;
  readonly checkDigits: string;
  readonly encodedData: string;
  readonly pattern: string;
  readonly mode: ResolvedCode11ChecksumMode;
}

// Code 11 uses six alternating bar/space widths per character. A wide
// element is represented by 3 modules and a narrow element by 1 module.
const CODE11_ENCODINGS = [
  "111131",
  "311131",
  "131131",
  "331111",
  "113131",
  "313111",
  "133111",
  "111331",
  "311311",
  "311111",
  "113111",
  "113311",
] as const;

const START_STOP_ENCODING = CODE11_ENCODINGS[11];

export const normalizeCode11Data = (value: string, maxLength = 80): string =>
  value.replace(/[^0-9-]/g, "").slice(0, maxLength);

const characterValue = (character: string): number => {
  if (character === "-") return 10;
  return Number(character);
};

const valueCharacter = (value: number): string => CODE11_CHARACTERS[value] ?? "-";

export const resolveCode11ChecksumMode = (
  mode: Code11ChecksumMode,
  dataLength: number,
): ResolvedCode11ChecksumMode => {
  if (dataLength === 0) return "none";
  if (mode === "auto") return dataLength >= 10 ? "ck" : "c";
  return mode;
};

export const calculateCode11Checks = (data: string): Code11Checks => {
  const values = [...normalizeCode11Data(data)].map(characterValue);
  if (values.length === 0) return { c: "-", k: "-" };

  // The C digit weights the data from right to left with 1..10. K uses the
  // Code 11 convention of cycling 1..9 across the data, then adds C.
  const cValue = values.reduce(
    (sum, value, index) => sum + (((values.length - index - 1) % 10) + 1) * value,
    0,
  ) % 11;
  const kValue = (
    values.reduce(
      (sum, value, index) => sum + (((values.length - index) % 9) + 1) * value,
      0,
    ) + cValue
  ) % 11;

  return { c: valueCharacter(cValue), k: valueCharacter(kValue) };
};

export const buildCode11Encoding = (
  data: string,
  checksumMode: Code11ChecksumMode = "none",
): Code11Encoding => {
  const normalizedData = normalizeCode11Data(data);
  const mode = resolveCode11ChecksumMode(checksumMode, normalizedData.length);
  const checks = calculateCode11Checks(normalizedData);
  const checkDigits = mode === "ck" ? `${checks.c}${checks.k}` : mode === "c" ? checks.c : "";
  const encodedData = `${normalizedData}${checkDigits}`;
  const pattern = `${START_STOP_ENCODING}${[...encodedData]
    .map((character) => CODE11_ENCODINGS[characterValue(character)])
    .join("")}${START_STOP_ENCODING}`;

  return { data: normalizedData, checkDigits, encodedData, pattern, mode };
};

export interface Code11Bar {
  readonly x: number;
  readonly width: number;
}

export const code11BarsFromPattern = (pattern: string, moduleWidth = 2.25): Code11Bar[] => {
  const bars: Code11Bar[] = [];
  let cursor = 0;
  let isBar = true;

  for (const widthToken of pattern) {
    const width = Number(widthToken) * moduleWidth;
    if (isBar) bars.push({ x: cursor, width });
    cursor += width;
    isBar = !isBar;
  }

  return bars;
};

export const code11PatternWidth = (pattern: string, moduleWidth = 2.25): number =>
  [...pattern].reduce((width, token) => width + Number(token) * moduleWidth, 0);

export interface Code11SvgOptions {
  readonly data: string;
  readonly checksumMode?: Code11ChecksumMode;
  readonly showCheckDigits?: boolean;
  readonly dark?: boolean;
}

export const buildCode11Svg = ({
  data,
  checksumMode = "none",
  showCheckDigits = false,
  dark = false,
}: Code11SvgOptions): string => {
  const encoding = buildCode11Encoding(data, checksumMode);
  const moduleWidth = 2.25;
  const quietZone = 24;
  const patternWidth = code11PatternWidth(encoding.pattern, moduleWidth);
  const width = Math.ceil(patternWidth + quietZone * 2);
  const height = 158;
  const bars = code11BarsFromPattern(encoding.pattern, moduleWidth);
  const ink = dark ? "#f8fafc" : "#1d1d1f";
  const surface = dark ? "#171c25" : "#ffffff";
  const quiet = dark ? "#163b48" : "#eafaf1";
  const hri = showCheckDigits ? encoding.encodedData : encoding.data;
  const displayText = hri || "等待输入";
  const barMarkup = bars
    .map(
      (bar) =>
        `<rect x="${(quietZone + bar.x).toFixed(2)}" y="28" width="${bar.width.toFixed(2)}" height="86" rx="0.4" fill="${ink}"/>`,
    )
    .join("");
  const checkLabel = encoding.checkDigits
    ? `CHECK ${encoding.checkDigits}`
    : "CHECK OFF";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Code 11 barcode ${displayText}"><rect width="100%" height="100%" rx="10" fill="${surface}"/><rect x="10" y="22" width="8" height="99" rx="4" fill="${quiet}"/><rect x="${width - 18}" y="22" width="8" height="99" rx="4" fill="${quiet}"/>${barMarkup}<text x="${quietZone}" y="18" font-family="SF Mono, monospace" font-size="7" font-weight="700" fill="${dark ? "#68dfc6" : "#248a3d"}" letter-spacing=".8">START</text><text x="${width - quietZone}" y="18" text-anchor="end" font-family="SF Mono, monospace" font-size="7" font-weight="700" fill="${dark ? "#68dfc6" : "#248a3d"}" letter-spacing=".8">STOP</text><text x="${width / 2}" y="135" text-anchor="middle" font-family="SF Mono, monospace" font-size="13" font-weight="700" letter-spacing="1.2" fill="${ink}">${displayText}</text><text x="${quietZone}" y="150" font-family="SF Mono, monospace" font-size="7" fill="${dark ? "#b8c0cf" : "#86868b"}">X=0.191mm · ${checkLabel}</text><text x="${width - quietZone}" y="150" text-anchor="end" font-family="SF Mono, monospace" font-size="7" fill="${dark ? "#b8c0cf" : "#86868b"}">${encoding.data.length} DATA CHARS</text></svg>`;
};
