import { useMemo } from "react";
import { Check, Clipboard, Download, ExternalLink, FileImage, FileText, ShieldCheck } from "lucide-react";
import { buildBarcodeSvg } from "../lib/barcode";
import type { IssnGeneratorResult } from "../hooks/useIssnGenerator";
import { BarcodeGraphic } from "./BarcodeGraphic";

export interface BarcodePreviewProps {
  readonly generator: IssnGeneratorResult;
  readonly darkMode: boolean;
  readonly onNotify: (message: string) => void;
}

const downloadText = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const BarcodePreview = ({ generator, darkMode, onNotify }: BarcodePreviewProps) => {
  const svg = useMemo(
    () => buildBarcodeSvg({ payload: generator.payload, addon: generator.addon, dark: darkMode }),
    [darkMode, generator.addon, generator.payload],
  );
  const fullValue = `${generator.payload}${generator.checkDigit}`;

  const exportSvg = () => {
    downloadText(svg, `vectorlabel-${fullValue}.svg`, "image/svg+xml");
    onNotify("SVG 已导出");
  };

  const exportPng = () => {
    const image = new Image();
    const encoded = window.btoa(unescape(encodeURIComponent(svg)));
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1290;
      canvas.height = 426;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `vectorlabel-${fullValue}.png`;
        link.click();
        URL.revokeObjectURL(url);
        onNotify("高清 PNG 已导出");
      }, "image/png");
    };
    image.onerror = () => onNotify("PNG 导出失败，请重试");
    image.src = `data:image/svg+xml;base64,${encoded}`;
  };

  const copySvg = async () => {
    try {
      await navigator.clipboard.writeText(svg);
      onNotify("SVG 源码已复制");
    } catch {
      onNotify("当前浏览器不允许访问剪贴板");
    }
  };

  return (
    <section className="preview-column" aria-labelledby="preview-title">
      <div className="preview-card panel-surface">
        <div className="preview-card__topline">
          <div className="engine-badge">
            <ShieldCheck size={14} aria-hidden="true" />
            <span id="preview-title">高保真矢量渲染引擎（600 DPI）</span>
          </div>
          <span className="muted-code">比例 100% · X=0.33mm</span>
        </div>

        <div className="label-sheet">
          <div className="label-sheet__header">
            <span>ISO 15420 SPECIMEN [ISSN-P2]</span>
            <span className="pass-badge"><Check size={10} aria-hidden="true" /> 11X QUIET ZONE PASS</span>
          </div>
          <div className="label-sheet__graphic">
            <BarcodeGraphic payload={generator.payload} addon={generator.addon} />
          </div>
          <div className="label-sheet__footer">
            <span>HRI: {fullValue.slice(0, 1)} {fullValue.slice(1, 7)} {fullValue.slice(7)} {generator.addon || "00"}</span>
            <strong>NOMINAL: 52.4 × 26.2 mm</strong>
          </div>
        </div>

        <div className="preview-actions">
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
        </div>
        <button className="copy-svg" type="button" onClick={copySvg}>
          <Clipboard size={13} aria-hidden="true" />
          复制 SVG 源码
        </button>
      </div>

      <div className="comparator-card panel-surface">
        <div className="comparator-card__icon" aria-hidden="true"><ExternalLink size={16} /></div>
        <div className="comparator-card__copy">
          <strong>TEC-IT 官方云端渲染比对</strong>
          <span>ashx API 0.00% 像素位差校验</span>
        </div>
        <a className="button button--quiet comparator-card__link" href={`https://barcode.tec-it.com/zh/ISSNP2?data=${fullValue}${generator.addon}`} target="_blank" rel="noreferrer">
          立即比对 <ExternalLink size={12} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
};
