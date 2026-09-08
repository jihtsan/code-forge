import { useMemo } from "react";
import { AlertTriangle, Check, Clipboard, Download, FileImage, FileText, ShieldCheck } from "lucide-react";
import type { SymbologyId } from "../data/mockData";
import type { Code11GeneratorResult } from "../hooks/useCode11Generator";
import { calculateEanCheckDigit, type IssnGeneratorResult } from "../hooks/useIssnGenerator";
import type { LinearBarcodeState } from "../hooks/useLinearBarcodeGenerator";
import { isLinearSymbology } from "../data/linearSymbologies";
import { buildCode11Encoding, buildCode11Svg } from "../lib/code11";
import { buildBarcodeSvg } from "../lib/barcode";
import { downloadText, sanitizeFilenamePart, triggerDownload } from "../lib/barcodeExport";
import { buildLinearBarcodeSvg } from "../lib/linearBarcode";
import { BarcodeGraphic } from "./BarcodeGraphic";
import { Code11Graphic } from "./Code11Graphic";
import { LinearBarcodeGraphic } from "./LinearBarcodeGraphic";

export interface BarcodePreviewProps {
  readonly generator: IssnGeneratorResult;
  readonly code11Generator: Code11GeneratorResult;
  readonly linearGenerator?: LinearBarcodeState;
  readonly symbology: SymbologyId;
  readonly darkMode: boolean;
  readonly onNotify: (message: string) => void;
  readonly batchValue?: string;
  readonly batchPosition?: number;
  readonly batchTotal?: number;
  readonly onBatchDownload?: () => void;
}

export const BarcodePreview = ({
  generator,
  code11Generator,
  linearGenerator,
  symbology,
  darkMode,
  onNotify,
  batchValue,
  batchPosition,
  batchTotal,
  onBatchDownload,
}: BarcodePreviewProps) => {
  const isCode11 = symbology === "code11";
  const isLinear = isLinearSymbology(symbology);
  const linearDefinition = isLinear && linearGenerator ? linearGenerator.definition : undefined;
  const effectiveCode11Data = isCode11 ? batchValue ?? code11Generator.data : code11Generator.data;
  const effectiveLinearData = isLinear ? batchValue ?? linearGenerator?.data ?? "" : linearGenerator?.data ?? "";
  const isBatchIssn = !isCode11 && !isLinear && batchValue !== undefined;
  const batchIssnBody = isBatchIssn ? batchValue.replace(/\D/g, "").slice(0, 7) : generator.body;
  const batchIssnPayload = `977${batchIssnBody.padEnd(7, "0").slice(0, 7)}${generator.variant.padEnd(2, "0").slice(0, 2)}`;
  const effectiveIssnPayload = isBatchIssn ? batchIssnPayload : generator.payload;
  const effectiveIssnCheck = isBatchIssn ? calculateEanCheckDigit(effectiveIssnPayload) : generator.checkDigit;
  const effectiveCode11Encoding = buildCode11Encoding(effectiveCode11Data, code11Generator.checksumMode);
  const effectiveCode11Mode = effectiveCode11Encoding.mode;
  const render = useMemo(() => {
    if (isCode11) {
      return { svg: buildCode11Svg({
        data: effectiveCode11Data,
        checksumMode: code11Generator.checksumMode,
        showCheckDigits: code11Generator.showCheckDigits,
        dark: darkMode,
      }), error: null };
    }
    if (isLinear && linearGenerator) {
      return buildLinearBarcodeSvg({
        id: linearGenerator.id,
        data: effectiveLinearData,
        includeCheck: linearGenerator.includeCheck,
        showText: linearGenerator.showText,
        dark: darkMode,
      });
    }
    return { svg: buildBarcodeSvg({ payload: effectiveIssnPayload, addon: generator.addon, dark: darkMode }), error: null };
  }, [code11Generator.checksumMode, code11Generator.showCheckDigits, darkMode, effectiveCode11Data, effectiveIssnPayload, effectiveLinearData, generator.addon, isCode11, isLinear, linearGenerator?.id, linearGenerator?.includeCheck, linearGenerator?.showText]);
  const svg = render.svg ?? "";
  const fullValue = `${effectiveIssnPayload}${effectiveIssnCheck}`;
  const code11DisplayValue = code11Generator.showCheckDigits ? effectiveCode11Encoding.encodedData : effectiveCode11Encoding.data;
  const linearDisplayValue = linearGenerator?.showText ? effectiveLinearData : "";
  const displayValue = isCode11 ? code11DisplayValue : isLinear ? linearDisplayValue : fullValue;
  const filenameValue = sanitizeFilenamePart(batchValue ?? displayValue);

  const downloadUnavailable = () => {
    onNotify(render.error ?? "暂无可导出的有效条码");
  };

  const exportSvg = () => {
    if (!svg) {
      downloadUnavailable();
      return;
    }
    const filename = `code-forge-${symbology}-${filenameValue}.svg`;
    downloadText(svg, filename, "image/svg+xml");
    onNotify("SVG 已导出");
  };

  const exportPng = () => {
    if (!svg) {
      downloadUnavailable();
      return;
    }
    const image = new Image();
    const sourceUrl = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
    image.onload = () => {
      const viewBox = svg.match(/viewBox=["']\s*([\d.+-]+)[ ,]+([\d.+-]+)[ ,]+([\d.+-]+)[ ,]+([\d.+-]+)\s*["']/i);
      const sourceWidth = viewBox ? Number(viewBox[3]) : image.naturalWidth || 1;
      const sourceHeight = viewBox ? Number(viewBox[4]) : image.naturalHeight || 1;
      const canvas = document.createElement("canvas");
      canvas.width = 1600;
      canvas.height = Math.max(1, Math.round(canvas.width * (sourceHeight / sourceWidth)));
      const context = canvas.getContext("2d");
      URL.revokeObjectURL(sourceUrl);
      if (!context) {
        onNotify("PNG 导出失败，请重试");
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob) {
          onNotify("PNG 导出失败，请重试");
          return;
        }
        const url = URL.createObjectURL(blob);
        triggerDownload(url, `code-forge-${symbology}-${filenameValue}.png`);
        onNotify("高清 PNG 已导出");
      }, "image/png");
    };
    image.onerror = () => {
      URL.revokeObjectURL(sourceUrl);
      onNotify("PNG 导出失败，请重试");
    };
    image.src = sourceUrl;
  };

  const copySvg = async () => {
    if (!svg) {
      downloadUnavailable();
      return;
    }
    try {
      await navigator.clipboard.writeText(svg);
      onNotify("SVG 源码已复制");
    } catch {
      onNotify("当前浏览器不允许访问剪贴板");
    }
  };

  const title = isCode11
    ? "Code-11 线性渲染引擎"
    : linearDefinition
      ? `${linearDefinition.title} 线性渲染引擎`
      : "高保真矢量渲染引擎（600 DPI）";
  const baseToplineMeta = isCode11
    ? "字符 0–9 / - · X=0.191mm"
    : linearDefinition
      ? `${linearDefinition.standard} · ${linearDefinition.ratio}`
      : "比例 100% · X=0.33mm";
  const toplineMeta = batchPosition && batchTotal
    ? `批量 ${batchPosition}/${batchTotal} · ${baseToplineMeta}`
    : baseToplineMeta;
  const renderHasData = Boolean(render.svg);
  const checkIsOff = linearDefinition
    ? linearDefinition.checksum === "none" || Boolean(linearDefinition.supportsCheckToggle && !linearGenerator?.includeCheck)
    : false;
  const linearCheckLabel = linearDefinition
    ? linearDefinition.checksum === "none"
      ? "NO CHECK DIGITS"
      : linearDefinition.supportsCheckToggle
        ? linearGenerator?.includeCheck ? "CHECK ON" : "CHECK OFF"
        : "CHECK AUTO"
    : "";

  return (
    <section className="preview-column" aria-labelledby="preview-title">
      <div className={`preview-card panel-surface${isCode11 ? " preview-card--code11" : linearDefinition ? ` preview-card--linear preview-card--${linearDefinition.tone}` : ""}`}>
        <div className="preview-card__topline">
          <div className="engine-badge">
            <ShieldCheck size={14} aria-hidden="true" />
            <span id="preview-title">{title}</span>
          </div>
          <span className="muted-code">{toplineMeta}</span>
        </div>

        <div className={`label-sheet${isCode11 ? " label-sheet--code11" : linearDefinition ? " label-sheet--linear" : ""}`}>
          <div className="label-sheet__header">
            <span>{isCode11 ? "USS CODE 11 SPECIMEN" : linearDefinition ? `${linearDefinition.title.toUpperCase()} SPECIMEN` : "ISO 15420 SPECIMEN [ISSN-P2]"}</span>
            {isCode11 ? (
              <span className={`pass-badge${!renderHasData || effectiveCode11Mode === "none" ? " pass-badge--warn" : ""}`}>
                {!renderHasData || effectiveCode11Mode === "none" ? <AlertTriangle size={10} aria-hidden="true" /> : <Check size={10} aria-hidden="true" />}
                {!renderHasData ? "DATA ERROR" : effectiveCode11Mode === "none" ? "CHECK OFF" : `CHECK ${effectiveCode11Encoding.checkDigits} PASS`}
              </span>
            ) : linearDefinition ? (
              <span className={`pass-badge${!renderHasData || checkIsOff ? " pass-badge--warn" : ""}`}>
                {!renderHasData || checkIsOff ? <AlertTriangle size={10} aria-hidden="true" /> : <Check size={10} aria-hidden="true" />}
                {!renderHasData ? "DATA ERROR" : checkIsOff ? linearCheckLabel : "CHECK AUTO PASS"}
              </span>
            ) : (
              <span className="pass-badge"><Check size={10} aria-hidden="true" /> 11X QUIET ZONE PASS</span>
            )}
          </div>
          <div className="label-sheet__graphic">
            {isCode11 ? (
              <Code11Graphic
                data={effectiveCode11Data}
                checksumMode={code11Generator.checksumMode}
                showCheckDigits={code11Generator.showCheckDigits}
              />
            ) : linearDefinition && linearGenerator ? (
              <LinearBarcodeGraphic state={linearGenerator} darkMode={darkMode} data={effectiveLinearData} />
            ) : (
              <BarcodeGraphic payload={effectiveIssnPayload} addon={generator.addon} />
            )}
          </div>
          <div className="label-sheet__footer">
            {isCode11 ? (
              <>
                <span>HRI: {code11DisplayValue || "等待输入"}</span>
                <strong>
                  {effectiveCode11Mode === "none"
                    ? "NO CHECK DIGITS"
                    : `${effectiveCode11Encoding.checkDigits.length > 1 ? "C/K" : "C"}: ${effectiveCode11Encoding.checkDigits}`}
                </strong>
              </>
            ) : linearDefinition && linearGenerator ? (
              <>
                <span>HRI: {linearGenerator.showText ? (effectiveLinearData || "等待输入") : "已隐藏"}</span>
                <strong>{renderHasData ? linearCheckLabel : "等待有效数据"}</strong>
              </>
            ) : (
              <>
                <span>HRI: {fullValue.slice(0, 1)} {fullValue.slice(1, 7)} {fullValue.slice(7)} {generator.addon || "00"}</span>
                <strong>NOMINAL: 52.4 × 26.2 mm</strong>
              </>
            )}
          </div>
        </div>

        <div className={`preview-actions${batchTotal && batchTotal > 1 ? " preview-actions--batch" : ""}`}>
          <button className="button button--primary" type="button" onClick={exportSvg}>
            <Download size={14} aria-hidden="true" />
            导出 SVG
          </button>
          <button className="button button--quiet" type="button" onClick={exportPng}>
            <FileImage size={14} aria-hidden="true" />
            高清 PNG
          </button>
          <button className="button button--quiet" type="button" onClick={() => onNotify("PDF/X-1a 排版导出将在工作台中生成")}>
            <FileText size={14} aria-hidden="true" />
            PDF/X-1a
          </button>
          {batchTotal && batchTotal > 1 && onBatchDownload && (
            <button className="button button--quiet preview-actions__batch" type="button" onClick={onBatchDownload}>
              <Download size={14} aria-hidden="true" />
              批量下载 ZIP（{batchTotal}）
            </button>
          )}
        </div>
        <button className="copy-svg" type="button" onClick={copySvg}>
          <Clipboard size={13} aria-hidden="true" />
          复制 SVG 源码
        </button>
      </div>
    </section>
  );
};
