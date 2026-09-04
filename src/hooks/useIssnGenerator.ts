import { useMemo, useState } from "react";

export interface IssnGeneratorState {
  readonly body: string;
  readonly variant: string;
  readonly addon: string;
}

export interface IssnGeneratorResult extends IssnGeneratorState {
  readonly payload: string;
  readonly checkDigit: string;
  readonly stream: string;
  readonly isValid: boolean;
  readonly setBody: (value: string) => void;
  readonly setVariant: (value: string) => void;
  readonly setAddon: (value: string) => void;
  readonly reset: () => void;
}

const INITIAL_STATE: IssnGeneratorState = {
  body: "1234567",
  variant: "89",
  addon: "12",
};

const onlyDigits = (value: string, maxLength: number): string =>
  value.replace(/\D/g, "").slice(0, maxLength);

export const calculateEanCheckDigit = (payload: string): string => {
  if (payload.length !== 12 || /\D/.test(payload)) return "-";

  const sum = payload.split("").reduce((total, character, index) => {
    const digit = Number(character);
    return total + (index % 2 === 0 ? digit : digit * 3);
  }, 0);

  return String((10 - (sum % 10)) % 10);
};

export const useIssnGenerator = (): IssnGeneratorResult => {
  const [state, setState] = useState<IssnGeneratorState>(INITIAL_STATE);
  const normalizedBody = state.body.padEnd(7, "0").slice(0, 7);
  const normalizedVariant = state.variant.padEnd(2, "0").slice(0, 2);
  const normalizedAddon = state.addon.padEnd(2, "0").slice(0, 2);
  const payload = `977${normalizedBody}${normalizedVariant}`;
  const checkDigit = calculateEanCheckDigit(payload);

  return useMemo(
    () => ({
      ...state,
      payload,
      checkDigit,
      stream: `${payload}${checkDigit} ${normalizedAddon}`,
      isValid:
        state.body.length === 7 &&
        state.variant.length === 2 &&
        state.addon.length === 2,
      setBody: (value: string) =>
        setState((current) => ({ ...current, body: onlyDigits(value, 7) })),
      setVariant: (value: string) =>
        setState((current) => ({ ...current, variant: onlyDigits(value, 2) })),
      setAddon: (value: string) =>
        setState((current) => ({ ...current, addon: onlyDigits(value, 2) })),
      reset: () => setState(INITIAL_STATE),
    }),
    [checkDigit, normalizedAddon, payload, state],
  );
};
