import { useMemo, useState } from "react";
import {
  buildCode11Encoding,
  calculateCode11Checks,
  normalizeCode11Data,
  type Code11ChecksumMode,
} from "../lib/code11";

export interface Code11GeneratorState {
  readonly data: string;
  readonly checksumMode: Code11ChecksumMode;
  readonly showCheckDigits: boolean;
}

export interface Code11GeneratorResult extends Code11GeneratorState {
  readonly cCheckDigit: string;
  readonly kCheckDigit: string;
  readonly checkDigits: string;
  readonly resolvedChecksumMode: "none" | "c" | "ck";
  readonly encodedData: string;
  readonly stream: string;
  readonly isValid: boolean;
  readonly setData: (value: string) => void;
  readonly setChecksumMode: (value: Code11ChecksumMode) => void;
  readonly setShowCheckDigits: (value: boolean) => void;
  readonly reset: () => void;
}

const INITIAL_STATE: Code11GeneratorState = {
  data: "0123-4567",
  checksumMode: "none",
  showCheckDigits: false,
};

export const useCode11Generator = (): Code11GeneratorResult => {
  const [state, setState] = useState<Code11GeneratorState>(INITIAL_STATE);
  const normalizedData = normalizeCode11Data(state.data);
  const encoding = buildCode11Encoding(normalizedData, state.checksumMode);
  const checks = calculateCode11Checks(normalizedData);

  return useMemo(
    () => ({
      ...state,
      data: normalizedData,
      checkDigits: encoding.checkDigits,
      resolvedChecksumMode: encoding.mode,
      encodedData: encoding.encodedData,
      stream: `*${encoding.encodedData}*`,
      isValid: normalizedData.length > 0,
      setData: (value: string) =>
        setState((current) => ({ ...current, data: normalizeCode11Data(value) })),
      setChecksumMode: (value: Code11ChecksumMode) =>
        setState((current) => ({ ...current, checksumMode: value })),
      setShowCheckDigits: (value: boolean) =>
        setState((current) => ({ ...current, showCheckDigits: value })),
      reset: () => setState(INITIAL_STATE),
      cCheckDigit: checks.c,
      kCheckDigit: checks.k,
    }),
    [checks.c, checks.k, encoding.checkDigits, encoding.encodedData, normalizedData, state],
  );
};
