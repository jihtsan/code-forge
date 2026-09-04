import { AlertTriangle, Barcode } from "lucide-react";
import { useMemo } from "react";
import type { LinearBarcodeState } from "../hooks/useLinearBarcodeGenerator";
import { buildLinearBarcodeSvg } from "../lib/linearBarcode";

export interface LinearBarcodeGraphicProps {
  readonly state: LinearBarcodeState;
  readonly darkMode: boolean;
  readonly data?: string;
}

export const LinearBarcodeGraphic = ({ state, darkMode, data }: LinearBarcodeGraphicProps) => {
  const effectiveData = data ?? state.data;
  const render = useMemo(
    () => buildLinearBarcodeSvg({
      id: state.id,
      data: effectiveData,
      includeCheck: state.includeCheck,
      showText: state.showText,
      dark: darkMode,
    }),
    [darkMode, effectiveData, state.id, state.includeCheck, state.showText],
  );

  if (!render.svg) {
    return (
      <div className="linear-barcode-graphic linear-barcode-graphic--empty" role="status">
        <Barcode size={28} aria-hidden="true" />
        <strong><AlertTriangle size={13} aria-hidden="true" /> 等待有效数据</strong>
        <span>{render.error}</span>
      </div>
    );
  }

  return (
    <div
      className="linear-barcode-graphic"
      role="img"
      aria-label={`${state.definition.title} 条码 ${effectiveData}`}
      dangerouslySetInnerHTML={{ __html: render.svg }}
    />
  );
};
