import { useCallback, useEffect, useRef, useState } from "react";

export type BatchGenerationMode = "increment" | "manual";

export interface BatchBarcodeItem {
  readonly index: number;
  readonly value: string;
}

export interface UseBatchBarcodeGeneratorOptions {
  readonly sourceKey: string;
  readonly sourceValue: string;
  readonly normalize: (value: string) => string;
}

export interface BatchBarcodeState {
  readonly enabled: boolean;
  readonly mode: BatchGenerationMode;
  readonly count: number;
  readonly step: number;
  readonly manualText: string;
  readonly items: readonly BatchBarcodeItem[];
  readonly selectedIndex: number;
  readonly isStale: boolean;
  readonly setEnabled: (value: boolean) => void;
  readonly setMode: (value: BatchGenerationMode) => void;
  readonly setCount: (value: number) => void;
  readonly setStep: (value: number) => void;
  readonly setManualText: (value: string) => void;
  readonly setSelectedIndex: (value: number) => void;
  readonly generate: () => void;
  readonly reset: () => void;
}

export const MAX_BATCH_ITEMS = 50;

const clampInteger = (value: number, minimum: number, maximum: number): number => {
  if (!Number.isFinite(value)) return minimum;
  return Math.min(maximum, Math.max(minimum, Math.round(value)));
};

const padSequence = (value: bigint): string => value.toString().padStart(3, "0");

const generationSignature = (
  sourceValue: string,
  mode: BatchGenerationMode,
  count: number,
  step: number,
  manualText: string,
): string => [sourceValue, mode, count, step, manualText].join("\u0000");

/** Increment a trailing numeric identifier while preserving leading zeros until it grows. */
export const incrementBarcodeValue = (value: string, step: number, offset: number): string => {
  const trailingDigits = value.match(/(\d+)$/);
  const increment = BigInt(step) * BigInt(offset);

  if (trailingDigits) {
    const digits = trailingDigits[1];
    const width = digits.length;
    const next = BigInt(digits) + increment;
    return `${value.slice(0, -width)}${next.toString().padStart(width, "0")}`;
  }

  return value ? `${value}-${padSequence(increment + 1n)}` : padSequence(increment + 1n);
};

const normalizeManualItems = (
  text: string,
  normalize: (value: string) => string,
): readonly BatchBarcodeItem[] =>
  text
    .split(/\r?\n/)
    .map((line) => normalize(line.trim()))
    .filter(Boolean)
    .slice(0, MAX_BATCH_ITEMS)
    .map((value, index) => ({ index, value }));

const createIncrementItems = (
  sourceValue: string,
  count: number,
  step: number,
  normalize: (value: string) => string,
): readonly BatchBarcodeItem[] => {
  const normalizedSource = normalize(sourceValue);
  return Array.from({ length: count }, (_, index) => ({
    index,
    value: normalize(incrementBarcodeValue(normalizedSource, step, index)),
  })).filter((item) => item.value);
};

const createBatchItems = ({
  sourceValue,
  mode,
  count,
  step,
  manualText,
  normalize,
}: {
  readonly sourceValue: string;
  readonly mode: BatchGenerationMode;
  readonly count: number;
  readonly step: number;
  readonly manualText: string;
  readonly normalize: (value: string) => string;
}): readonly BatchBarcodeItem[] => mode === "manual"
  ? normalizeManualItems(manualText, normalize)
  : createIncrementItems(sourceValue, count, step, normalize);

export const useBatchBarcodeGenerator = ({
  sourceKey,
  sourceValue,
  normalize,
}: UseBatchBarcodeGeneratorOptions): BatchBarcodeState => {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<BatchGenerationMode>("increment");
  const [count, setCountState] = useState(10);
  const [step, setStepState] = useState(1);
  const [manualText, setManualTextState] = useState(sourceValue);
  const [items, setItems] = useState<readonly BatchBarcodeItem[]>([]);
  const [selectedIndex, setSelectedIndexState] = useState(0);
  const [generatedSignature, setGeneratedSignature] = useState(() => generationSignature(sourceValue, mode, count, step, sourceValue));
  const sourceKeyRef = useRef(sourceKey);
  const sourceValueRef = useRef(sourceValue);

  useEffect(() => {
    if (sourceKeyRef.current === sourceKey) return;
    sourceKeyRef.current = sourceKey;
    const nextManualText = sourceValue;
    const nextItems = enabled
      ? createBatchItems({
          sourceValue,
          mode,
          count,
          step,
          manualText: nextManualText,
          normalize,
        })
      : [];
    setItems(nextItems);
    setSelectedIndexState(0);
    setManualTextState(nextManualText);
    setGeneratedSignature(generationSignature(sourceValue, mode, count, step, nextManualText));
  }, [count, enabled, mode, normalize, sourceKey, sourceValue, step]);

  useEffect(() => {
    if (sourceValueRef.current !== sourceValue && !enabled) {
      setManualTextState(sourceValue);
    }
    sourceValueRef.current = sourceValue;
  }, [enabled, sourceValue]);

  const generate = useCallback(() => {
    const nextItems = createBatchItems({ sourceValue, mode, count, step, manualText, normalize });

    setItems(nextItems);
    setSelectedIndexState(0);
    setGeneratedSignature(generationSignature(sourceValue, mode, count, step, manualText));
  }, [count, manualText, mode, normalize, sourceValue, step]);

  const reset = useCallback(() => {
    setEnabled(false);
    setMode("increment");
    setCountState(10);
    setStepState(1);
    setManualTextState(sourceValue);
    setItems([]);
    setSelectedIndexState(0);
    setGeneratedSignature(generationSignature(sourceValue, "increment", 10, 1, sourceValue));
  }, [sourceValue]);

  const setCount = useCallback((value: number) => {
    setCountState(clampInteger(value, 2, MAX_BATCH_ITEMS));
  }, []);

  const setStep = useCallback((value: number) => {
    setStepState(clampInteger(value, 1, 999999));
  }, []);

  const setSelectedIndex = useCallback((value: number) => {
    setSelectedIndexState((current) => {
      if (items.length === 0) return 0;
      const next = Math.min(items.length - 1, Math.max(0, Math.round(value)));
      return Number.isFinite(next) ? next : current;
    });
  }, [items.length]);

  return {
    enabled,
    mode,
    count,
    step,
    manualText,
    items,
    selectedIndex,
    isStale: items.length > 0 && generatedSignature !== generationSignature(sourceValue, mode, count, step, manualText),
    setEnabled,
    setMode,
    setCount,
    setStep,
    setManualText: setManualTextState,
    setSelectedIndex,
    generate,
    reset,
  };
};
