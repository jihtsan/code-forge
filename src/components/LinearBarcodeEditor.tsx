import { AlertTriangle, CheckCircle2, CircleHelp, Eye, LockKeyhole } from "lucide-react";
import type { LinearBarcodeState } from "../hooks/useLinearBarcodeGenerator";

export interface LinearBarcodeEditorProps {
  readonly state: LinearBarcodeState;
}

export const LinearBarcodeEditor = ({ state }: LinearBarcodeEditorProps) => {
  const { definition, validation } = state;
  const dataInputId = `input-${definition.id}-data`;
  const checkInputId = `input-${definition.id}-check`;
  const textInputId = `input-${definition.id}-text`;
  const statusId = `${definition.id}-data-status`;
  const statusIcon = validation.valid ? <CheckCircle2 size={13} aria-hidden="true" /> : <AlertTriangle size={13} aria-hidden="true" />;

  return (
    <div className={`linear-editor linear-editor--${definition.tone}`}>
      <div className="linear-editor__payload field field--wide">
        <label htmlFor={dataInputId}>
          <span>1. 条码数据（{definition.shortTitle}）</span>
          <span className="field__hint field__hint--teal">{definition.detailValue} · 最多 {definition.maxLength} 位</span>
        </label>
        <div className="field__input-wrap">
          <input
            id={dataInputId}
            className="field__input code-text linear-editor__payload-input"
            inputMode={definition.inputKind === "digits" ? "numeric" : "text"}
            maxLength={definition.maxLength}
            spellCheck={false}
            value={state.data}
            onChange={(event) => state.setData(event.target.value)}
            aria-describedby={statusId}
            aria-invalid={!validation.valid}
          />
          {validation.valid ? (
            <span className="field__valid" id={statusId}>
              {statusIcon}
              {state.data.length}/{definition.maxLength} 规范
            </span>
          ) : (
            <span className="linear-editor__validation-error" id={statusId}>
              {statusIcon}
              {validation.message}
            </span>
          )}
        </div>
        <div className="linear-editor__helper">
          <CircleHelp size={12} aria-hidden="true" />
          <span>{definition.inputHint}</span>
        </div>
      </div>

      <div className="linear-editor__controls">
        <div className="field">
          <label htmlFor={checkInputId}>
            <span>2. 校验策略</span>
            <span className="field__hint field__hint--blue">{definition.checksumLabel}</span>
          </label>
          {definition.supportsCheckToggle ? (
            <label className="linear-editor__toggle" htmlFor={checkInputId}>
              <input
                id={checkInputId}
                type="checkbox"
                checked={state.includeCheck}
                onChange={(event) => state.setIncludeCheck(event.target.checked)}
              />
              <span>{state.includeCheck ? "已附加校验位" : "不附加校验位"}</span>
            </label>
          ) : (
            <div className="field__locked linear-editor__locked" id={checkInputId}>
              <span className="code-text">{definition.checksum === "none" ? "OFF" : "AUTO"}</span>
              <LockKeyhole size={13} aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="field">
          <label htmlFor={textInputId}>
            <span>3. HRI 文本</span>
            <span className="field__hint">人眼可读</span>
          </label>
          <label className="linear-editor__toggle" htmlFor={textInputId}>
            <input
              id={textInputId}
              type="checkbox"
              checked={state.showText}
              onChange={(event) => state.setShowText(event.target.checked)}
            />
            <span><Eye size={13} aria-hidden="true" /> 显示数据</span>
          </label>
        </div>

        <div className="field">
          <label htmlFor={`${definition.id}-encoding`}>
            <span>4. 编码规则</span>
            <span className="field__hint field__hint--teal">本地引擎</span>
          </label>
          <div className="field__locked linear-editor__locked" id={`${definition.id}-encoding`}>
            <span className="code-text">{definition.standard}</span>
            <span className="field__micro">BWIPP</span>
          </div>
        </div>
      </div>

      <div className="linear-editor__spec-strip" aria-label={`${definition.title} 参数`}>
        <span><small>字符集</small><strong>{definition.detailValue}</strong></span>
        <span><small>长度</small><strong>{definition.id === "flattermarken" ? "9 位固定" : "可变"}</strong></span>
        <span><small>模宽 / 比率</small><strong>{definition.ratio}</strong></span>
        <span><small>校验状态</small><strong className={definition.checksum === "none" || (definition.supportsCheckToggle && !state.includeCheck) ? "status-text status-text--amber" : "status-text status-text--green"}>
          {definition.checksum === "none" ? "无校验" : definition.supportsCheckToggle ? (state.includeCheck ? "已附加" : "未附加") : "自动"}
        </strong></span>
      </div>
    </div>
  );
};
