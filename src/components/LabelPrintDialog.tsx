import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { createPortal, flushSync } from "react-dom";
import { AlertTriangle, Printer, X } from "lucide-react";
import {
  DEFAULT_LABEL_SETTINGS, expandPrintLabels, isPrintShortcut, validateLabelSettings,
  type LabelSettings, type PrintableLabel,
} from "../lib/labelPrinting";
import { PrinterFeedback } from "./PrinterFeedback";
import "../printing.css";
import { downloadText } from "../lib/barcodeExport";
import { buildPrintDocument } from "../lib/printDocument";

interface LabelPrintDialogProps {
  readonly open: boolean;
  readonly onOpen: () => void;
  readonly onClose: () => void;
  readonly current: PrintableLabel | null;
  readonly currentError: string | null;
  readonly batch: readonly PrintableLabel[];
  readonly batchTotal: number;
  readonly batchStale: boolean;
}

export const LabelPrintDialog = ({ open, onOpen, onClose, current, currentError, batch, batchTotal, batchStale }: LabelPrintDialogProps) => {
  const dialog = useRef<HTMLDialogElement>(null);
  const recovery = useRef<HTMLDivElement>(null);
  const [printMessage, setPrintMessage] = useState<string | null>(null);
  const [recoveryMessage, setRecoveryMessage] = useState<string | null>(null);
  const [scope, setScope] = useState("current");
  const [settings, setSettings] = useState<LabelSettings>(DEFAULT_LABEL_SETTINGS);
  const [preset, setPreset] = useState("60x40");
  const useBatch = scope === "batch" && batchTotal > 0;
  const items = useMemo(() => useBatch ? batch : current ? [current] : [], [useBatch, batch, current]);
  const error = validateLabelSettings(settings, items.length);
  const labels = useMemo(() => expandPrintLabels(items, settings), [items, settings]);
  const skipped = useBatch ? batchTotal - batch.length : 0;
  const layoutValid = !validateLabelSettings({ ...settings, copies: 1 }, 1);
  const layout = layoutValid ? settings : DEFAULT_LABEL_SETTINGS;
  const paperStyle: CSSProperties = {
    width: `${layout.width}mm`, height: `${layout.height}mm`, padding: `${layout.margin}mm`,
  };

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (!event.defaultPrevented && !event.isComposing && isPrintShortcut(event)) {
        event.preventDefault();
        if (!event.repeat) onOpen();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onOpen]);

  useEffect(() => {
    document.body.classList.add("label-print-enabled");
    return () => document.body.classList.remove("label-print-enabled");
  }, []);

  useEffect(() => {
    if (open && !dialog.current?.open) dialog.current?.showModal();
    if (!open && dialog.current?.open) dialog.current.close();
  }, [open]);

  const updateSetting = (key: keyof LabelSettings, value: string) => {
    if (key === "width" || key === "height") setPreset("custom");
    setSettings((previous) => ({ ...previous, [key]: value === "" ? Number.NaN : Number(value) }));
  };

  const print = () => {
    if (error) return;
    // Some embedded browsers expose print() but silently ignore it. Keep the
    // dialog and feedback visible; a void return is not proof of a print UI.
    flushSync(() => setPrintMessage("已请求系统打印。如果没有弹出打印机选择窗口，当前内置浏览器可能不支持打印，请使用下面的方式继续。"));
    recovery.current?.scrollIntoView({ block: "nearest" });
    try {
      // Stay in the user's click handler. Print CSS hides this dialog while
      // the separate label output remains printable.
      window.print();
    } catch {
      setPrintMessage("当前浏览器无法调用系统打印。请在 Chrome、Edge 或 Safari 中打开页面或打印文件后重试。");
    }
  };

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setRecoveryMessage("地址已复制，请粘贴到 Chrome、Edge 或 Safari。当前条码和设置不会随地址传递；如需保留，请下载打印文件。");
    } catch {
      setRecoveryMessage("无法自动复制，请手动复制下方地址，在 Chrome、Edge 或 Safari 中打开。");
    }
  };

  const downloadPrintFile = () => {
    try {
      downloadText(buildPrintDocument(items, settings), "code-forge-labels.html", "text/html;charset=utf-8");
      setRecoveryMessage("已发起下载 code-forge-labels.html，其中保留了当前标签和打印设置。请在完整浏览器中打开文件，然后选择打印机；如未下载，请检查浏览器的下载提示。");
    } catch {
      setRecoveryMessage("无法生成打印文件，请检查条码和打印设置后重试。");
    }
  };

  return <>
    <dialog ref={dialog} className="label-print-dialog" aria-labelledby="label-print-title" aria-describedby="label-print-description" onCancel={onClose} onClose={() => {
      // A queued close event may arrive after a rapid shortcut reopens it.
      if (!dialog.current?.open) onClose();
    }}>
      <header className="print-dialog-header">
        <div><span className="eyebrow">LABEL PRINTING</span><h2 id="label-print-title"><Printer size={22} aria-hidden="true" />打印标签</h2></div>
        <button type="button" className="icon-button" onClick={onClose} aria-label="关闭打印设置"><X size={18} /></button>
      </header>
      <p id="label-print-description" className="print-description">支持 Windows / macOS 系统打印。下一步在浏览器打印窗口选择已添加的打印机。</p>
      <div className="print-dialog-grid">
        <div className="print-settings">
          <label>打印范围<select aria-label="打印范围" value={useBatch ? "batch" : "current"} onChange={(event) => setScope(event.target.value)}>
            <option value="current">当前条码</option>
            {batchTotal > 0 && <option value="batch">全部有效条码（{batch.length} / {batchTotal}）</option>}
          </select></label>
          <label>标签尺寸<select aria-label="标签尺寸预设" value={preset} onChange={(event) => {
            setPreset(event.target.value);
            if (event.target.value === "custom") return;
            const [width, height] = event.target.value.split("x").map(Number);
            setSettings((previous) => ({ ...previous, width, height }));
          }}><option value="60x40">60 × 40 mm</option><option value="50x30">50 × 30 mm</option><option value="40x30">40 × 30 mm</option><option value="100x150">100 × 150 mm</option><option value="custom">自定义（在下方输入）</option></select></label>
          <div className="print-fields">
            {([
              ["width", "宽度（mm）", 20, 210, 0.1], ["height", "高度（mm）", 15, 297, 0.1],
              ["margin", "四边留白（mm）", 0, 100, 0.1], ["copies", "每条份数", 1, 100, 1],
            ] as const).map(([key, title, min, max, step]) => <label key={key}>{title}<input type="number" min={min} max={max} step={step} value={Number.isFinite(settings[key]) ? settings[key] : ""} onChange={(event) => updateSetting(key, event.target.value)} /></label>)}
          </div>
          <p className="print-note">一张标签对应一页，条码等比适配内容区域并保留静区。首次建议先打印 1 张，检查尺寸与扫码结果。</p>
          {batchStale && batchTotal > 0 && <p className="print-warning">当前打印使用已生成的批次。输入已修改，如需新数据，请关闭面板并重新生成批量条码。</p>}
          {skipped > 0 && <p className="print-warning" role="status">将跳过 {skipped} 条无效数据，只打印 {batch.length} 条有效条码。</p>}
          {error && <p className="print-error" role="alert"><AlertTriangle size={16} aria-hidden="true" />{!items.length && !useBatch ? currentError || error : error}</p>}
        </div>
        <div className="print-preview-panel">
          <div className="print-preview-heading"><strong>标签预览</strong><span>{labels.length} 张 · {items.length} 条</span></div>
          <div className="print-preview-paper" style={{ aspectRatio: `${layout.width} / ${layout.height}`, padding: `${layout.margin / layout.width * 100}%` }}>
            {items[0] ? <div className="print-artwork" dangerouslySetInnerHTML={{ __html: items[0].svg }} /> : <span>等待有效条码</span>}
          </div>
          <p className="print-note">{useBatch ? "预览批次中的第一条。" : "预览当前条码。"} 屏幕显示不代表实际物理尺寸；纸张以左侧毫米设置为准。</p>
        </div>
      </div>
      <div className="print-system-help"><strong>系统打印设置</strong><p>选择与标签相同的纸张尺寸，缩放设为 100% / 实际大小，关闭页眉页脚，并将系统份数设为 1（本面板已展开份数）。纸张间隙、黑标和定位请在驱动中设置。</p><p>没有找到打印机？先在 Windows / macOS 系统设置中添加设备，必要时安装厂商驱动。此版本不提供局域网扫描或静默打印；也可关闭面板导出 SVG / PNG，使用厂商软件打印。</p></div>
      <PrinterFeedback />
      {printMessage && <div className="print-recovery" ref={recovery}>
        <p role="status">{printMessage}</p>
        <div className="print-recovery-actions">
          <button type="button" className="button button--quiet" onClick={copyAddress}>复制页面地址</button>
          <button type="button" className="button button--quiet" disabled={Boolean(error)} onClick={downloadPrintFile}>下载打印文件</button>
        </div>
        <label>在完整浏览器中打开<input readOnly value={window.location.href} onFocus={(event) => event.target.select()} /></label>
        {recoveryMessage && <p role="status">{recoveryMessage}</p>}
        <p>打印文件保留当前标签、尺寸和份数。页面无法确认是否已出纸，请检查打印机后再决定是否重试。</p>
      </div>}
      <footer className="print-dialog-footer"><span>尚无型号完成实机验证</span><button type="button" className="button button--primary" disabled={Boolean(error)} onClick={print}><Printer size={16} aria-hidden="true" />继续系统打印{labels.length > 0 ? `（${labels.length} 张）` : ""}</button></footer>
    </dialog>
    {createPortal(<div id="label-print-output" aria-hidden="true">
      <style media="print">{`@page { size: ${layout.width}mm ${layout.height}mm; margin: 0; }`}</style>
      {labels.length > 0 ? labels.map((item, index) => <div className="printed-label" key={index} style={paperStyle}><div className="print-artwork" dangerouslySetInnerHTML={{ __html: item.svg }} /></div>) : <p>没有可打印的标签。请返回页面检查条码数据和打印设置。</p>}
    </div>, document.body)}
  </>;
};
