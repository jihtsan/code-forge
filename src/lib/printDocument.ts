import { svgDataUri } from "./barcodeExport";
import { expandPrintLabels, validateLabelSettings, type LabelSettings, type PrintableLabel } from "./labelPrinting";

/** A portable snapshot: no server, module loading, or automatic printing. */
export const buildPrintDocument = (items: readonly PrintableLabel[], settings: LabelSettings): string => {
  const error = validateLabelSettings(settings, items.length);
  if (error) throw new Error(error);
  const labels = expandPrintLabels(items, settings);
  // Embed artwork as image data, never as executable HTML from a payload.
  const pages = labels.map((label) => `<section class="label"><img alt="条码标签" src="${svgDataUri(label.svg)}"></section>`).join("\n");
  return `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>code-forge 标签打印</title>
<style>
@page { size: ${settings.width}mm ${settings.height}mm; margin: 0; }
* { box-sizing: border-box; }
body { margin: 0; background: #eee; color: #111; font-family: system-ui,sans-serif; }
header { max-width: 720px; margin: 24px auto; padding: 16px; line-height: 1.7; }
button { padding: 10px 18px; font: inherit; cursor: pointer; }
.label { width: ${settings.width}mm; height: ${settings.height}mm; padding: ${settings.margin}mm; margin: 16px auto; display: flex; background: white; overflow: hidden; }
.label img { display: block; width: 100%; height: 100%; object-fit: contain; }
@media print {
  body { background: white; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  header { display: none; }
  .label { margin: 0; break-inside: avoid; break-after: page; page-break-after: always; }
  .label:last-child { break-after: auto; page-break-after: auto; }
}
</style></head><body>
<header><h1>标签打印</h1><p>${labels.length} 张 · ${settings.width} × ${settings.height} mm · 四边留白 ${settings.margin} mm</p>
<p>请在 Chrome、Edge 或 Safari 中打开此文件，点击下方按钮或使用浏览器菜单打印。在打印窗口中选择打印机和对应纸张尺寸，缩放设为 100%，关闭页眉页脚，系统份数保持 1。</p>
<button type="button" onclick="document.getElementById('print-status').hidden=false; try { window.print(); } catch { document.getElementById('print-status').textContent='无法调用打印，请使用浏览器菜单打印。'; }">选择打印机并打印</button>
<p id="print-status" role="status" hidden>已请求打印。如果没有弹出窗口，请使用浏览器菜单打印或换用完整浏览器。本文件无法判断是否出纸。</p></header>
${pages}
</body></html>`;
};
