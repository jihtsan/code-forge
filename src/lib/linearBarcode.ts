import bwipjs from "@bwip-js/browser";
import {
  linearSymbologyById,
  type LinearSymbologyDefinition,
  type LinearSymbologyId,
} from "../data/linearSymbologies";

export interface LinearBarcodeValidation {
  readonly normalized: string;
  readonly valid: boolean;
  readonly message: string;
}

export interface LinearBarcodeRender {
  readonly svg: string | null;
  readonly error: string | null;
}

const ASCII_MIN = 32;
const ASCII_MAX = 126;
const CODE39_CHARACTERS = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%".split(""));
const CODE93_CHARACTERS = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-. $/+%".split(""));

const definitionFor = (id: LinearSymbologyId): LinearSymbologyDefinition => linearSymbologyById[id];

const printableAscii = (value: string): string =>
  Array.from(value)
    .filter((character) => {
      const code = character.charCodeAt(0);
      return code >= ASCII_MIN && code <= ASCII_MAX;
    })
    .join("");

const digitsOnly = (value: string): string => value.replace(/\D/g, "");

const code39Only = (value: string): string =>
  Array.from(value.toUpperCase())
    .filter((character) => CODE39_CHARACTERS.has(character))
    .join("");

const code93Only = (value: string): string =>
  Array.from(value.toUpperCase())
    .filter((character) => CODE93_CHARACTERS.has(character))
    .join("");

const errorMessage = (error: unknown): string => {
  const message = error instanceof Error ? error.message : String(error);
  return message.replace(/^Error:\s*/, "");
};

const encoderErrorMessage = (id: LinearSymbologyId, error: unknown): string => {
  const message = errorMessage(error).replace(/^bwipp\.[^:]+#\d+:\s*/i, "");
  return id === "gs1-128" ? `GS1-128 数据无效：${message}` : message;
};

const validateWithEncoder = (
  id: LinearSymbologyId,
  normalized: string,
  includeCheck: boolean,
): string | null => {
  const definition = definitionFor(id);
  const options: Parameters<typeof bwipjs.toSVG>[0] = {
    bcid: definition.bcid,
    text: normalized,
    scale: 1,
    height: definition.height,
    includetext: false,
  };

  if (definition.parse) options.parse = true;
  if (definition.supportsCheckToggle) {
    options.includecheck = includeCheck;
    options.includecheckintext = includeCheck;
  }

  try {
    bwipjs.toSVG(options);
    return null;
  } catch (error) {
    return encoderErrorMessage(id, error);
  }
};

export const normalizeLinearData = (id: LinearSymbologyId, value: string): string => {
  const definition = definitionFor(id);
  if (id === "code11") {
    return value.replace(/[^0-9-]/g, "").slice(0, definition.maxLength);
  }

  let normalized: string;

  switch (definition.inputKind) {
    case "digits":
      normalized = digitsOnly(value);
      break;
    case "code39":
      normalized = code39Only(value);
      break;
    case "code39-full-ascii":
    case "ascii":
    case "gs1":
      normalized = printableAscii(value);
      break;
    case "code93":
      normalized = code93Only(value);
      break;
    default:
      normalized = printableAscii(value);
  }

  return Array.from(normalized).slice(0, definition.maxLength).join("");
};

export const validateLinearData = (
  id: LinearSymbologyId,
  value: string,
  includeCheck = false,
): LinearBarcodeValidation => {
  const normalized = normalizeLinearData(id, value);

  if (!normalized) {
    return { normalized, valid: false, message: "请输入条码数据" };
  }

  switch (id) {
    case "code25il":
      if (normalized.length % 2 !== 0) {
        return { normalized, valid: false, message: "Code-2of5 Interleaved 需要偶数位数字" };
      }
      break;
    case "flattermarken":
      if (normalized.length !== 9) {
        return { normalized, valid: false, message: "Flattermarken 需要恰好 9 位数字" };
      }
      break;
    case "pharmacode-one-track": {
      const valueNumber = Number(normalized);
      if (valueNumber < 3 || valueNumber > 131070) {
        return { normalized, valid: false, message: "Pharmacode One-Track 范围为 3–131070" };
      }
      break;
    }
    case "pharmacode-two-track": {
      const valueNumber = Number(normalized);
      if (valueNumber < 4 || valueNumber > 64570080) {
        return { normalized, valid: false, message: "Pharmacode Two-Track 范围为 4–64570080" };
      }
      break;
    }
    case "gs1-128":
      if (!/^\(\d{2,4}\)/.test(normalized)) {
        return { normalized, valid: false, message: "GS1-128 数据需要从括号 AI 开始，例如 (01)…" };
      }
      break;
    default:
      break;
  }

  const encoderError = validateWithEncoder(id, normalized, includeCheck);
  if (encoderError) {
    return { normalized, valid: false, message: encoderError };
  }

  return { normalized, valid: true, message: "规范" };
};

export const buildLinearBarcodeSvg = ({
  id,
  data,
  includeCheck,
  showText,
  dark = false,
  print = false,
}: {
  readonly id: LinearSymbologyId;
  readonly data: string;
  readonly includeCheck: boolean;
  readonly showText: boolean;
  readonly dark?: boolean;
  readonly print?: boolean;
}): LinearBarcodeRender => {
  const definition = definitionFor(id);
  const validation = validateLinearData(id, data, includeCheck);

  if (!validation.valid) {
    return { svg: null, error: validation.message };
  }

  try {
    const options: Parameters<typeof bwipjs.toSVG>[0] = {
      bcid: definition.bcid,
      text: validation.normalized,
      scale: 2,
      height: definition.height,
      padding: 8,
      ...(print ? { paddingwidth: 12, paddingheight: 4 } : {}),
      includetext: showText,
      textxalign: "center",
      textsize: 10,
      barcolor: print ? "000000" : dark ? "f8fafc" : "1d1d1f",
      backgroundcolor: !print && dark ? "171c25" : "ffffff",
      textcolor: print ? "000000" : dark ? "f8fafc" : "1d1d1f",
    };

    if (definition.parse) options.parse = true;
    if (definition.supportsCheckToggle) {
      options.includecheck = includeCheck;
      options.includecheckintext = includeCheck;
    }

    return { svg: bwipjs.toSVG(options), error: null };
  } catch (error) {
    return { svg: null, error: errorMessage(error) };
  }
};
