import { AlertTriangle, CheckCircle2, Download, ListPlus, MoreHorizontal, Play, Rows3 } from "lucide-react";
import { useMemo } from "react";
import type { BatchBarcodeState } from "../hooks/useBatchBarcodeGenerator";
import { downloadSvg, sanitizeFilenamePart, svgDataUri } from "../lib/barcodeExport";

export interface BatchBarcodeRender {
  readonly svg: string | null;
  readonly error: string | null;
}

interface RenderedBatchItem {
  readonly index: number;
  readonly value: string;
  readonly render: BatchBarcodeRender;
}

export interface BatchBarcodePanelProps {
  readonly id: string;
  readonly title: string;
  readonly sourceValue: string;
  readonly state: BatchBarcodeState;
  readonly renderItem: (value: string) => BatchBarcodeRender;
  readonly onNotify: (message: string) => void;
  readonly onBatchDownload: () => void;
}

const visibleItemCount = 5;

export const BatchBarcodePanel = ({
  id,
  title,
  sourceValue,
  state,
  renderItem,
  onNotify,
  onBatchDownload,
}: BatchBarcodePanelProps) => {
  const renderedItems = useMemo<readonly RenderedBatchItem[]>(
    () => state.items.map((item) => ({ ...item, render: renderItem(item.value) })),
    [renderItem, state.items],
  );
  const visibleItems = renderedItems.slice(0, visibleItemCount);
  const overflowItems = renderedItems.slice(visibleItemCount);
  const sourcePreview = sourceValue || "未填写";

  const downloadItem = (item: RenderedBatchItem) => {
    if (!item.render.svg) {
      onNotify(item.render.error ?? `第 ${item.index + 1} 条数据无效`);
      return;
    }
    downloadSvg(
      item.render.svg,
      `vectorlabel-batch-${id}-${String(item.index + 1).padStart(2, "0")}-${sanitizeFilenamePart(item.value)}.svg`,
    );
    onNotify(`第 ${item.index + 1} 条 SVG 已导出`);
  };

  const renderRow = (item: RenderedBatchItem) => {
    const isSelected = item.index === state.selectedIndex;
    return (
      <div className={`batch-row${isSelected ? " is-selected" : ""}`} key={`${item.index}-${item.value}`}>
        <button
          className="batch-row__select"
          type="button"
          onClick={() => state.setSelectedIndex(item.index)}
          aria-current={isSelected ? "true" : undefined}
          title={`预览第 ${item.index + 1} 条`}
        >
          <span className="batch-row__index">{String(item.index + 1).padStart(2, "0")}</span>
          {item.render.svg ? (
            <img className="batch-row__thumb" src={svgDataUri(item.render.svg)} alt="" aria-hidden="true" />
          ) : (
            <span className="batch-row__thumb batch-row__thumb--empty" aria-hidden="true"><AlertTriangle size={14} /></span>
          )}
          <span className="batch-row__copy">
            <strong>{item.value || "空数据"}</strong>
            <small className={item.render.svg ? "batch-row__status batch-row__status--valid" : "batch-row__status batch-row__status--invalid"}>
              {item.render.svg ? <CheckCircle2 size={11} aria-hidden="true" /> : <AlertTriangle size={11} aria-hidden="true" />}
              {item.render.svg ? "可导出" : item.render.error ?? "数据无效"}
            </small>
          </span>
        </button>
        <button
          className="batch-row__download"
          type="button"
          onClick={() => downloadItem(item)}
          disabled={!item.render.svg}
          title={`下载第 ${item.index + 1} 条 SVG`}
          aria-label={`下载第 ${item.index + 1} 条 SVG`}
        >
          <Download size={14} aria-hidden="true" />
        </button>
      </div>
    );
  };

  return (
    <section className="batch-editor" aria-labelledby={`${id}-batch-title`}>
      <div className="batch-editor__header">
        <div className="batch-editor__title">
          <ListPlus size={15} aria-hidden="true" />
          <strong id={`${id}-batch-title`}>批量生成</strong>
          <span>{title}</span>
        </div>
        <span className="batch-editor__count">{state.items.length ? `${state.items.length} 条` : "未生成"}</span>
      </div>

      <div className="batch-editor__controls">
        <div className="batch-mode" role="group" aria-label="批量方式">
          <button
            className={state.mode === "increment" ? "is-active" : ""}
            type="button"
            aria-pressed={state.mode === "increment"}
            onClick={() => state.setMode("increment")}
          >
            <Rows3 size={12} aria-hidden="true" />
            递增
          </button>
          <button
            className={state.mode === "manual" ? "is-active" : ""}
            type="button"
            aria-pressed={state.mode === "manual"}
            onClick={() => state.setMode("manual")}
          >
            逐行
          </button>
        </div>

        {state.mode === "increment" ? (
          <>
            <label className="batch-number-field" htmlFor={`${id}-batch-count`}>
              <span>数量</span>
              <input
                id={`${id}-batch-count`}
                type="number"
                min={2}
                max={50}
                value={state.count}
                onChange={(event) => state.setCount(Number(event.target.value))}
              />
            </label>
            <label className="batch-number-field" htmlFor={`${id}-batch-step`}>
              <span>步长</span>
              <input
                id={`${id}-batch-step`}
                type="number"
                min={1}
                max={999999}
                value={state.step}
                onChange={(event) => state.setStep(Number(event.target.value))}
              />
            </label>
          </>
        ) : (
          <label className="batch-manual-field" htmlFor={`${id}-batch-lines`}>
            <span>每行一个值</span>
            <textarea
              id={`${id}-batch-lines`}
              rows={2}
              value={state.manualText}
              onChange={(event) => state.setManualText(event.target.value)}
              placeholder="每行一个条码数据"
              spellCheck={false}
            />
          </label>
        )}

        <button className="button button--primary batch-editor__generate" type="button" onClick={state.generate}>
          <Play size={13} aria-hidden="true" />
          生成批量
        </button>
      </div>

      <div className="batch-editor__source">
        <span>起始值</span>
        <code title={sourcePreview}>{sourcePreview}</code>
        {state.mode === "increment" && <small>递增末尾数字</small>}
      </div>

      {state.isStale && (
        <div className="batch-editor__notice" role="status">
          <AlertTriangle size={12} aria-hidden="true" />
          批量参数已更新，请重新生成
        </div>
      )}

      <div className="batch-results" aria-live="polite">
        <div className="batch-results__header">
          <div className="batch-results__header-copy">
            <span>批量结果</span>
            <small>前 5 条可直接预览</small>
          </div>
          {state.items.length > 1 && (
            <button
              className="batch-results__download"
              type="button"
              onClick={onBatchDownload}
              title="将全部有效条码打包下载为 ZIP"
            >
              <Download size={12} aria-hidden="true" />
              下载 ZIP
            </button>
          )}
        </div>
        {visibleItems.length > 0 ? (
          <div className="batch-list">{visibleItems.map(renderRow)}</div>
        ) : (
          <div className="batch-empty">
            <ListPlus size={17} aria-hidden="true" />
            <span>设置数量或逐行输入后生成</span>
          </div>
        )}
        {overflowItems.length > 0 && (
          <details className="batch-overflow">
            <summary>
              <MoreHorizontal size={15} aria-hidden="true" />
              还有 {overflowItems.length} 条
            </summary>
            <div className="batch-overflow__list">{overflowItems.map(renderRow)}</div>
          </details>
        )}
      </div>
    </section>
  );
};
