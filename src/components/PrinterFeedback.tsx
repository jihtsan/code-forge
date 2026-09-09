import { useState, type FormEvent } from "react";
import { ExternalLink, MessageSquare } from "lucide-react";

export const PrinterFeedback = () => {
  const [feedbackUrl, setFeedbackUrl] = useState<string | null>(null);
  const prepareFeedback = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const value = (key: string) => String(data.get(key) ?? "").trim();
    const fields = [
      ["反馈类型", "kind"], ["品牌", "brand"], ["完整型号", "model"],
      ["操作系统", "system"], ["系统版本", "version"], ["连接方式", "connection"],
      ["系统其他软件能否打印", "systemPrint"], ["打印头 DPI", "dpi"], ["补充说明", "details"],
    ];
    const body = fields.map(([label, key]) => `### ${label}\n${value(key) || "未填写"}`).join("\n\n");
    const query = new URLSearchParams({ title: `[打印机${value("kind")}] ${value("brand")} ${value("model")}`, body });
    setFeedbackUrl(`https://github.com/jihtsan/code-forge/issues/new?${query}`);
  };

  return (
    <details className="printer-feedback">
      <summary><MessageSquare size={16} aria-hidden="true" />申请适配 / 报告打印问题</summary>
      <p>找不到设备或打印效果不对？告诉我们具体型号。反馈将在 GitHub 打开，需登录并由你确认提交；内容公开可见，请勿填写条码业务数据。</p>
      <form onSubmit={prepareFeedback} onChange={() => setFeedbackUrl(null)}>
        <div className="print-fields">
          <label>反馈类型<select name="kind" aria-label="反馈类型"><option>适配申请</option><option>问题报告</option></select></label>
          <label>操作系统<select name="system" aria-label="操作系统"><option>Windows</option><option>macOS</option><option>其他</option></select></label>
          <label>品牌<input name="brand" required maxLength={40} placeholder="例如 Zebra / 斑马" /></label>
          <label>完整型号<input name="model" required maxLength={60} placeholder="见机身铭牌" /></label>
          <label>系统版本<input name="version" required maxLength={40} placeholder="例如 Windows 11 / macOS 15" /></label>
          <label>连接方式<select name="connection" aria-label="连接方式"><option>局域网 / 网线</option><option>Wi-Fi</option><option>USB</option><option>蓝牙</option><option>不确定</option></select></label>
          <label>其他软件能否打印<select name="systemPrint" aria-label="其他软件能否打印"><option>未测试</option><option>可以</option><option>不可以</option></select></label>
          <label>打印头 DPI<select name="dpi" aria-label="打印头 DPI"><option>不确定</option><option>203</option><option>300</option><option>600</option><option>其他</option></select></label>
        </div>
        <label>补充说明（选填）<textarea name="details" maxLength={400} rows={3} placeholder="标签尺寸、纸张类型，或找不到设备 / 无法出纸 / 偏移 / 跳纸 / 条码无法扫描等问题" /></label>
        <button type="submit" className="button button--quiet">生成反馈草稿</button>
        {feedbackUrl && <a className="button button--primary" href={feedbackUrl} target="_blank" rel="noopener noreferrer">前往 GitHub 确认提交<ExternalLink size={14} aria-hidden="true" /></a>}
      </form>
    </details>
  );
};
