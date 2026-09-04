import { useCallback, useState } from "react";
import {
  linearSymbologies,
  linearSymbologyById,
  type LinearSymbologyDefinition,
  type LinearSymbologyId,
} from "../data/linearSymbologies";
import { normalizeLinearData, validateLinearData, type LinearBarcodeValidation } from "../lib/linearBarcode";

export interface LinearBarcodeState {
  readonly id: LinearSymbologyId;
  readonly definition: LinearSymbologyDefinition;
  readonly data: string;
  readonly includeCheck: boolean;
  readonly showText: boolean;
  readonly validation: LinearBarcodeValidation;
  readonly setData: (value: string) => void;
  readonly setIncludeCheck: (value: boolean) => void;
  readonly setShowText: (value: boolean) => void;
  readonly reset: () => void;
}

interface StoredLinearBarcodeState {
  readonly data: string;
  readonly includeCheck: boolean;
  readonly showText: boolean;
}

export interface LinearBarcodeGenerator {
  readonly getState: (id: LinearSymbologyId) => LinearBarcodeState;
}

const initialStateFor = (id: LinearSymbologyId): StoredLinearBarcodeState => {
  const definition = linearSymbologyById[id];
  return {
    data: definition.sample,
    includeCheck: false,
    showText: true,
  };
};

const initialStates = (): Record<LinearSymbologyId, StoredLinearBarcodeState> =>
  Object.fromEntries(linearSymbologies.map((definition) => [definition.id, initialStateFor(definition.id)])) as Record<
    LinearSymbologyId,
    StoredLinearBarcodeState
  >;

export const useLinearBarcodeGenerator = (): LinearBarcodeGenerator => {
  const [states, setStates] = useState<Record<LinearSymbologyId, StoredLinearBarcodeState>>(initialStates);

  const updateState = useCallback(
    (id: LinearSymbologyId, update: Partial<StoredLinearBarcodeState>) => {
      setStates((current) => ({
        ...current,
        [id]: { ...current[id], ...update },
      }));
    },
    [],
  );

  const getState = useCallback(
    (id: LinearSymbologyId): LinearBarcodeState => {
      const stored = states[id];
      const definition = linearSymbologyById[id];
      const validation = validateLinearData(id, stored.data, stored.includeCheck);

      return {
        id,
        definition,
        data: validation.normalized,
        includeCheck: stored.includeCheck,
        showText: stored.showText,
        validation,
        setData: (value: string) => updateState(id, { data: normalizeLinearData(id, value) }),
        setIncludeCheck: (value: boolean) => updateState(id, { includeCheck: value }),
        setShowText: (value: boolean) => updateState(id, { showText: value }),
        reset: () => updateState(id, initialStateFor(id)),
      };
    },
    [states, updateState],
  );

  return { getState };
};
