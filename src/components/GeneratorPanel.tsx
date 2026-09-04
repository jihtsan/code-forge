import { CheckCircle2, LockKeyhole, PenLine, RotateCcw, Settings2, WandSparkles } from "lucide-react";
import type { CategoryId } from "../data/mockData";
import { categories } from "../data/mockData";
import type { IssnGeneratorResult } from "../hooks/useIssnGenerator";

export interface GeneratorPanelProps {
  readonly generator: IssnGeneratorResult;
  readonly activeCategory: CategoryId;
  readonly onCategoryChange: (category: CategoryId) => void;
  readonly onRedraw: () => void;
  readonly onAdvanced: () => void;
  readonly advancedOpen: boolean;
}

export const GeneratorPanel = ({
  generator,
  activeCategory,
  onCategoryChange,
  onRedraw,
  onAdvanced,
  advancedOpen,
}: GeneratorPanelProps) => (
  <section className="generator-panel panel-surface" id="quick-generator" aria-labelledby="generator-title">
    <div className="generator-panel__header">
      <div className="section-kicker section-kicker--dark">
        <WandSparkles size={17} aria-hidden="true" />
        <h2 id="generator-title">即时条码速成小工具</h2>
      </div>
      <div className="sample-control">
        <span className="muted-code">常用测试样本:</span>
        <button className="sample-chip" type="button" onClick={generator.reset}>
          <RotateCcw size={12} aria-hidden="true" />
          977123456789812
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

    <div className="stream-bar">
      <div className="stream-bar__value">
        <span className="muted-code">实时合成码流:</span>
        <span className="stream-code">{generator.stream}</span>
      </div>
      <div className="stream-bar__meta">
        <span>校验和: <strong className="status-text status-text--green">{generator.isValid ? "OK" : "WAIT"}</strong></span>
        <span>奇偶配对: <strong className="status-text status-text--blue">G-G (Mod4)</strong></span>
      </div>
    </div>

    {advancedOpen && (
      <div className="advanced-panel" role="status">
        <span className="advanced-panel__dot" />
        <span>BWR 补偿 0.10mm · 静区 11X · 输出 600 DPI</span>
      </div>
    )}

    <div className="generator-panel__footer">
      <div className="compliance-inline">
        <span className="status-dot status-dot--green" />
        <span>符合 ISO 3297:2022 与 GS1 条码标准</span>
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
