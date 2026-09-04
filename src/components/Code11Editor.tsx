import { CheckCircle2, CircleHelp, Eye, LockKeyhole } from "lucide-react";
import type { Code11GeneratorResult } from "../hooks/useCode11Generator";

export interface Code11EditorProps {
  readonly generator: Code11GeneratorResult;
}

const checksumOptions = [
  { value: "none", label: "不添加（TEC-IT 默认）" },
  { value: "auto", label: "自动（C / C+K）" },
  { value: "c", label: "仅 C 校验位" },
  { value: "ck", label: "C + K 双校验位" },
] as const;

export const Code11Editor = ({ generator }: Code11EditorProps) => {
  const checkStatus = generator.resolvedChecksumMode === "none" ? "未附加" : generator.checkDigits || "等待";
  const hasDoubleCheck = generator.resolvedChecksumMode === "ck";

  return (
    <div className="code11-editor">
      <div className="code11-editor__payload field field--wide">
        <label htmlFor="input-code11-data">
          <span>1. 条码数据（Code-11）</span>
          <span className="field__hint field__hint--teal">0–9 与连字符 · 最多 80 位</span>
        </label>
        <div className="field__input-wrap">
          <input
            id="input-code11-data"
            className="field__input code-text code11-editor__payload-input"
            inputMode="text"
            maxLength={80}
            spellCheck={false}
            value={generator.data}
            onChange={(event) => generator.setData(event.target.value)}
            aria-describedby="code11-data-status"
            aria-invalid={!generator.isValid}
          />
          <span className={`field__valid${generator.isValid ? "" : " field__valid--warning"}`} id="code11-data-status">
            <CheckCircle2 size={13} aria-hidden="true" />
            {generator.data.length}/80 {generator.isValid ? "规范" : "请输入"}
          </span>
        </div>
        <div className="code11-editor__helper">
          <CircleHelp size={12} aria-hidden="true" />
          <span>支持数字和 `-`，输入会即时规范化并更新右侧条纹。</span>
        </div>
      </div>

      <div className="code11-editor__fields">
        <div className="field">
          <label htmlFor="code11-checksum-mode">
            <span>2. 校验策略</span>
            <span className="field__hint field__hint--blue">模 11</span>
          </label>
          <select
            id="code11-checksum-mode"
            className="field__input code11-editor__select"
            value={generator.checksumMode}
            onChange={(event) => generator.setChecksumMode(event.target.value as Code11GeneratorResult["checksumMode"])}
          >
            {checksumOptions.map((option) => (
              <option value={option.value} key={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="code11-show-checks">
            <span>3. HRI 文本</span>
            <span className="field__hint">人眼可读</span>
          </label>
          <label className="code11-toggle" htmlFor="code11-show-checks">
            <input
              id="code11-show-checks"
              type="checkbox"
              checked={generator.showCheckDigits}
              onChange={(event) => generator.setShowCheckDigits(event.target.checked)}
            />
            <span><Eye size={13} aria-hidden="true" /> 显示 C / K</span>
          </label>
        </div>

        <div className="field">
          <label htmlFor="code11-c-check">
            <span>4. C 校验位</span>
            <span className="field__hint field__hint--blue">自动推导</span>
          </label>
          <div className="field__locked field__locked--accent" id="code11-c-check">
            <span className="code-text">{generator.cCheckDigit}</span>
            <LockKeyhole size={13} aria-hidden="true" />
          </div>
        </div>

        <div className="field">
          <label htmlFor="code11-k-check">
            <span>5. K 校验位</span>
            <span className="field__hint field__hint--blue">双校验时启用</span>
          </label>
          <div className={`field__locked field__locked--accent${hasDoubleCheck ? "" : " field__locked--muted"}`} id="code11-k-check">
            <span className="code-text">{generator.kCheckDigit}</span>
            <span className="field__micro">{hasDoubleCheck ? "启用" : "待启用"}</span>
          </div>
        </div>
      </div>

      <div className="code11-spec-strip" aria-label="Code-11 参数">
        <span><small>字符集</small><strong>0–9 / -</strong></span>
        <span><small>模宽 X</small><strong>0.191 mm</strong></span>
        <span><small>打印比率</small><strong>1:2.24</strong></span>
        <span><small>校验状态</small><strong className={generator.resolvedChecksumMode === "none" ? "status-text status-text--amber" : "status-text status-text--green"}>{checkStatus}</strong></span>
      </div>
    </div>
  );
};
