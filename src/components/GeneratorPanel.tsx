import { CheckCircle2, Layers3, LockKeyhole, PenLine, RotateCcw, Settings2, WandSparkles } from "lucide-react";
import type { CategoryId, SymbologyId } from "../data/mockData";
import { categories } from "../data/mockData";
import { isLinearSymbology, linearSymbologies } from "../data/linearSymbologies";
import type { BatchBarcodeRender } from "./BatchBarcodePanel";
import { BatchBarcodePanel } from "./BatchBarcodePanel";
import type { Code11GeneratorResult } from "../hooks/useCode11Generator";
import type { IssnGeneratorResult } from "../hooks/useIssnGenerator";
import type { BatchBarcodeState } from "../hooks/useBatchBarcodeGenerator";
import type { LinearBarcodeState } from "../hooks/useLinearBarcodeGenerator";
import { Code11Editor } from "./Code11Editor";
import { LinearBarcodeEditor } from "./LinearBarcodeEditor";

export interface GeneratorPanelProps {
  readonly generator: IssnGeneratorResult;
  readonly code11Generator: Code11GeneratorResult;
  readonly linearGenerator?: LinearBarcodeState;
  readonly batch: BatchBarcodeState;
  readonly batchSourceValue: string;
  readonly batchTitle: string;
  readonly renderBatchItem: (value: string) => BatchBarcodeRender;
  readonly symbology: SymbologyId;
  readonly activeCategory: CategoryId;
  readonly onSymbologyChange: (symbology: SymbologyId) => void;
  readonly onCategoryChange: (category: CategoryId) => void;
  readonly onRedraw: () => void;
  readonly onAdvanced: () => void;
  readonly onBatchModeChange: (enabled: boolean) => void;
  readonly onReset: () => void;
  readonly onNotify: (message: string) => void;
  readonly onBatchDownload: () => void;
  readonly advancedOpen: boolean;
}

export const GeneratorPanel = ({
  generator,
  code11Generator,
  linearGenerator,
  batch,
  batchSourceValue,
  batchTitle,
  renderBatchItem,
  symbology,
  activeCategory,
  onSymbologyChange,
  onCategoryChange,
  onRedraw,
  onAdvanced,
  onBatchModeChange,
  onReset,
  onNotify,
  onBatchDownload,
  advancedOpen,
}: GeneratorPanelProps) => {
  const isCode11 = symbology === "code11";
  const isLinear = isLinearSymbology(symbology) && !isCode11;

  return (
    <section className={`generator-panel panel-surface${isCode11 ? " generator-panel--code11" : ""}`} id="quick-generator" aria-labelledby="generator-title">
      <div className="generator-panel__header">
        <div className="section-kicker section-kicker--dark">
          <WandSparkles size={17} aria-hidden="true" />
          <h2 id="generator-title">即时条码速成小工具</h2>
        </div>
        <div className="generator-panel__header-actions">
          <div className="mode-switch" role="group" aria-label="生成模式">
            <button
              className={!batch.enabled ? "is-active" : ""}
              type="button"
              aria-pressed={!batch.enabled}
              onClick={() => onBatchModeChange(false)}
            >
              单个
            </button>
            <button
              className={batch.enabled ? "is-active" : ""}
              type="button"
              aria-pressed={batch.enabled}
              onClick={() => onBatchModeChange(true)}
            >
              <Layers3 size={12} aria-hidden="true" />
              批量
            </button>
          </div>
          <button
            className="reset-button"
            type="button"
            onClick={onReset}
            title="重置当前码制"
          >
            <RotateCcw size={12} aria-hidden="true" />
            重置
          </button>
        </div>
      </div>

      <div className="segmented-control" role="tablist" aria-label="工具分类">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          return (
            <button
              className={`segment${isActive ? " is-active" : ""}`}
              key={category.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onCategoryChange(category.id)}
            >
              <Icon size={15} aria-hidden="true" />
              <span>{category.label}</span>
              <span className="segment__short">({category.shortLabel})</span>
            </button>
          );
        })}
      </div>

      <div className="symbology-row" aria-label="当前码制">
        <span className="muted-code">当前码制</span>
        <select
          className="symbology-picker"
          value={symbology}
          onChange={(event) => onSymbologyChange(event.target.value as SymbologyId)}
          aria-label="选择条码码制"
        >
          <option value="issn-p2">ISSN-P2 · 期刊出版</option>
          <optgroup label="线性工业码制（12 种）">
            {linearSymbologies.map((definition) => (
              <option value={definition.id} key={definition.id}>{definition.title}</option>
            ))}
          </optgroup>
        </select>
        <span className={`symbology-row__context${isCode11 || isLinear ? " symbology-row__context--teal" : ""}`}>
          {isCode11 ? "线性 · 工业序列" : isLinear ? linearGenerator?.definition.eyebrow : "期刊 · EAN-13 扩展"}
        </span>
      </div>

      {isCode11 ? (
        <Code11Editor generator={code11Generator} />
      ) : isLinear && linearGenerator ? (
        <LinearBarcodeEditor state={linearGenerator} />
      ) : (
        <div className="generator-fields">
          <div className="field field--prefix">
            <label htmlFor="issn-prefix">
              <span>1. GS1 前缀</span>
              <span className="field__hint field__hint--blue">连续出版物</span>
            </label>
            <div className="field__locked" id="issn-prefix">
              <span className="code-text">977</span>
              <LockKeyhole size={14} aria-hidden="true" />
            </div>
          </div>
          <div className="field field--body">
            <label htmlFor="input-issn-body">
              <span>2. ISSN 刊号主体（7位数字）</span>
              <span className="field__hint field__hint--green">源刊号: ISSN 1234-567X</span>
            </label>
            <div className="field__input-wrap">
              <input
                id="input-issn-body"
                className="field__input code-text"
                inputMode="numeric"
                maxLength={7}
                value={generator.body}
                onChange={(event) => generator.setBody(event.target.value)}
                aria-describedby="body-status"
              />
              <span className="field__valid" id="body-status">
                <CheckCircle2 size={13} aria-hidden="true" />
                {generator.body.length}/7 规范
              </span>
            </div>
          </div>
          <div className="field">
            <label htmlFor="input-issn-variant">
              <span>3. 变体序列号</span>
              <span className="field__hint">定价/版本</span>
            </label>
            <input
              id="input-issn-variant"
              className="field__input code-text"
              inputMode="numeric"
              maxLength={2}
              value={generator.variant}
              onChange={(event) => generator.setVariant(event.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="mod10-value">
              <span>4. 校验位 Mod10</span>
              <span className="field__hint field__hint--blue">自动推导</span>
            </label>
            <div className="field__locked field__locked--accent" id="mod10-value">
              <span className="code-text">{generator.checkDigit}</span>
              <span className="field__micro">AutoFix 启用</span>
            </div>
          </div>
          <div className="field">
            <label htmlFor="input-issn-addon">
              <span>5. 附加码（+2 期号）</span>
              <span className="field__hint field__hint--blue">双月/月刊</span>
            </label>
            <input
              id="input-issn-addon"
              className="field__input field__input--blue code-text"
              inputMode="numeric"
              maxLength={2}
              value={generator.addon}
              onChange={(event) => generator.setAddon(event.target.value)}
            />
          </div>
        </div>
      )}

      {batch.enabled && (
        <BatchBarcodePanel
          id={symbology}
          title={batchTitle}
          sourceValue={batchSourceValue}
          state={batch}
          renderItem={renderBatchItem}
          onNotify={onNotify}
          onBatchDownload={onBatchDownload}
        />
      )}

      <div className={`stream-bar${isCode11 ? " stream-bar--code11" : ""}`}>
        <div className="stream-bar__value">
          <span className="muted-code">{isCode11 || isLinear ? "实时码流:" : "实时合成码流:"}</span>
          <span className="stream-code">
            {isCode11 ? code11Generator.stream : isLinear ? `*${linearGenerator?.data ?? ""}*` : generator.stream}
          </span>
        </div>
        <div className="stream-bar__meta">
          {isCode11 ? (
            <>
              <span>字符: <strong className="status-text status-text--blue">{code11Generator.data.length}</strong></span>
              <span>校验: <strong className={`status-text ${code11Generator.resolvedChecksumMode === "none" ? "status-text--amber" : "status-text--green"}`}>{code11Generator.resolvedChecksumMode === "none" ? "OFF" : code11Generator.checkDigits}</strong></span>
            </>
          ) : isLinear ? (
            <>
              <span>字符: <strong className={`status-text ${linearGenerator?.validation.valid ? "status-text--blue" : "status-text--amber"}`}>{linearGenerator?.data.length ?? 0}</strong></span>
              <span>校验: <strong className={`status-text ${linearGenerator?.definition.checksum === "none" || (linearGenerator?.definition.supportsCheckToggle && !linearGenerator.includeCheck) ? "status-text--amber" : "status-text--green"}`}>{linearGenerator?.definition.checksum === "none" ? "OFF" : linearGenerator?.definition.supportsCheckToggle ? (linearGenerator.includeCheck ? "ON" : "OFF") : "AUTO"}</strong></span>
            </>
          ) : (
            <>
              <span>校验和: <strong className="status-text status-text--green">{generator.isValid ? "OK" : "WAIT"}</strong></span>
              <span>奇偶配对: <strong className="status-text status-text--blue">G-G (Mod4)</strong></span>
            </>
          )}
        </div>
      </div>

      {advancedOpen && (
        <div className={`advanced-panel${isCode11 ? " advanced-panel--code11" : ""}`} role="status">
          <span className="advanced-panel__dot" />
          <span>{isCode11 ? "BWR 补偿 0.10mm · 静区 10X · 输出 600 DPI" : "BWR 补偿 0.10mm · 静区 11X · 输出 600 DPI"}</span>
        </div>
      )}

      <div className="generator-panel__footer">
        <div className="compliance-inline">
          <span className={`status-dot ${isCode11 ? "status-dot--teal" : "status-dot--green"}`} />
          <span>{isCode11 ? "USS Code 11 · 模 11 校验规范" : isLinear ? `${linearGenerator?.definition.standard} · 本地编码核心` : "符合 ISO 3297:2022 与 GS1 条码标准"}</span>
        </div>
        <div className="generator-panel__actions">
          <button className="button button--quiet" type="button" onClick={onAdvanced} aria-expanded={advancedOpen}>
            <Settings2 size={14} aria-hidden="true" />
            高级印刷补偿参数
          </button>
          <button className="button button--primary" type="button" onClick={onRedraw}>
            <PenLine size={14} aria-hidden="true" />
            重绘并刷新画布
          </button>
        </div>
      </div>
    </section>
  );
};
