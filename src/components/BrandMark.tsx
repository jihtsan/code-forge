import { ScanLine } from "lucide-react";
import { brand } from "../data/mockData";

export interface BrandMarkProps {
  readonly compact?: boolean;
}

export const BrandMark = ({ compact = false }: BrandMarkProps) => (
  <span className={`brand-mark${compact ? " brand-mark--compact" : ""}`}>
    <span className="brand-mark__icon" aria-hidden="true">
      <ScanLine size={compact ? 15 : 18} strokeWidth={2.4} />
    </span>
    {!compact && (
      <span className="brand-mark__copy">
        <span className="brand-mark__name-row">
          <span className="brand-mark__name">{brand.name}</span>
          <span className="brand-mark__badge">{brand.badge}</span>
        </span>
        <span className="brand-mark__tagline">{brand.tagline}</span>
      </span>
    )}
  </span>
);
