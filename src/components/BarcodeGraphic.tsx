import { useMemo } from "react";
import { barsFromPattern, ean13Pattern } from "../lib/barcode";
import { calculateEanCheckDigit } from "../hooks/useIssnGenerator";

export interface BarcodeGraphicProps {
  readonly payload: string;
  readonly addon: string;
  readonly compact?: boolean;
}

const normalizePayload = (payload: string): string =>
  payload.replace(/\D/g, "").padEnd(12, "0").slice(0, 12);

export const BarcodeGraphic = ({ payload, addon, compact = false }: BarcodeGraphicProps) => {
  const normalized = normalizePayload(payload);
  const check = calculateEanCheckDigit(normalized);
  const fullValue = `${normalized}${check === "-" ? "0" : check}`;
  const pattern = ean13Pattern(fullValue);
  const bars = useMemo(
    () => barsFromPattern(pattern, { moduleWidth: compact ? 2.25 : 2.55, top: 17, height: compact ? 76 : 82 }),
    [compact, pattern],
  );
  const moduleWidth = compact ? 2.25 : 2.55;
  const leftOffset = compact ? 27 : 24;

  return (
    <svg
      className={`barcode-graphic${compact ? " barcode-graphic--compact" : ""}`}
      viewBox="0 0 430 142"
      role="img"
      aria-label={`EAN-13 条码 ${fullValue} 附加码 ${addon || "00"}`}
    >
      <rect className="barcode-graphic__background" width="430" height="142" rx="10" />
      <rect className="barcode-graphic__quiet-zone" x="14" y="13" width="12" height="94" rx="6" />
      <rect className="barcode-graphic__quiet-zone" x="404" y="13" width="12" height="94" rx="6" />
      {bars.map((bar, index) => (
        <rect
          className="barcode-graphic__bar"
          key={`${bar.x}-${index}`}
          x={bar.x + leftOffset}
          y={bar.y}
          width={bar.width}
          height={bar.height}
          rx="0.5"
        />
      ))}
      <text className="barcode-graphic__digit barcode-graphic__digit--lead" x="19" y="124">{fullValue.slice(0, 1)}</text>
      <text className="barcode-graphic__digit" x="49" y="124">{fullValue.slice(1, 7)}</text>
      <text className="barcode-graphic__digit" x="217" y="124">{fullValue.slice(7, 13)}</text>
      <text className="barcode-graphic__digit barcode-graphic__digit--addon" x="320" y="124">› {addon || "00"}</text>
      <text className="barcode-graphic__quiet-label" x="16" y="19">11X</text>
      <text className="barcode-graphic__quiet-label barcode-graphic__quiet-label--right" x="395" y="19">7X</text>
      <text className="barcode-graphic__module-note" x="32" y="138">{Math.round(moduleWidth * 100) / 100}mm module · 600 DPI</text>
    </svg>
  );
};
