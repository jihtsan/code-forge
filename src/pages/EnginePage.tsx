import { useMemo, useState } from "react";
import {
  Activity,
  ChevronDown,
  CircleHelp,
  Code2,
  Eye,
  Grid3X3,
  Link2,
  Maximize2,
  Moon,
  Play,
  RotateCcw,
  Settings2,
  SlidersHorizontal,
  Sun,
  TerminalSquare,
  ZoomIn,
} from "lucide-react";
import { Link } from "react-router-dom";
import { brand, engineTabs, pipelineNodes } from "../data/mockData";
import { BrandMark } from "../components/BrandMark";

export interface EnginePageProps {
  readonly darkMode: boolean;
  readonly onToggleDarkMode: () => void;
}

export const EnginePage = ({ darkMode, onToggleDarkMode }: EnginePageProps) => {
  const [activeTab, setActiveTab] = useState(engineTabs[0].id);
  const [showGrid, setShowGrid] = useState(true);
  const [showRulers, setShowRulers] = useState(true);
  const [isRunning, setIsRunning] = useState(true);
  const [zoom, setZoom] = useState(100);

  const activeTabLabel = useMemo(
    () => engineTabs.find((tab) => tab.id === activeTab)?.label ?? engineTabs[0].label,
    [activeTab],
  );

  return (
    <div className="engine-page">
      <header className="engine-topbar">
        <div className="engine-topbar__brand">
          <Link to="/" aria-label="返回 VectorLabel 首页"><BrandMark compact /></Link>
          <span className="engine-topbar__divider" />
          <div>
            <strong>{brand.name} 编码工作台</strong>
            <span>ISSN-P2 / EAN-13 pipeline inspector</span>
          </div>
        </div>
        <div className="engine-topbar__actions">
          <span className="engine-live"><span className="status-dot status-dot--green" /> ENGINE ONLINE</span>
          <button className="icon-button icon-button--dark" type="button" onClick={onToggleDarkMode} title={darkMode ? "切换浅色主题" : "切换深色主题"} aria-label={darkMode ? "切换浅色主题" : "切换深色主题"}>
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link className="engine-home-link" to="/"><Code2 size={15} /> 门户首页</Link>
        </div>
      </header>

      <div className="engine-layout">
        <aside className="engine-sidebar">
          <div className="engine-sidebar__heading">
            <span className="eyebrow">WORKSPACE</span>
            <button className="icon-button icon-button--dark" type="button" title="工作台设置" aria-label="工作台设置"><Settings2 size={15} /></button>
          </div>
          <div className="engine-project-select">
            <span className="engine-project-select__icon"><TerminalSquare size={15} /></span>
            <span><strong>issn-p2-default</strong><small>local pipeline</small></span>
            <ChevronDown size={14} />
          </div>
          <div className="engine-sidebar__section">
            <span className="engine-sidebar__label">INPUT PAYLOAD</span>
            <div className="engine-code-field">977123456789812</div>
            <div className="engine-meta-row"><span>15 chars</span><span className="status-text status-text--green">VALID</span></div>
          </div>
          <div className="engine-sidebar__section">
            <span className="engine-sidebar__label">RUN CONFIG</span>
            <label className="engine-check"><input type="checkbox" defaultChecked /> <span>Strict ISO mode</span></label>
            <label className="engine-check"><input type="checkbox" defaultChecked /> <span>Emit HRI glyphs</span></label>
            <label className="engine-check"><input type="checkbox" /> <span>Debug timings</span></label>
          </div>
          <div className="engine-sidebar__section engine-sidebar__section--bottom">
            <div className="engine-stat"><span>LAST RUN</span><strong>0.84 ms</strong></div>
            <div className="engine-stat"><span>OUTPUT</span><strong>SVG / 600 DPI</strong></div>
          </div>
        </aside>

        <main className={`engine-canvas${showGrid ? " engine-canvas--grid" : ""}${showRulers ? " engine-canvas--rulers" : ""}`}>
          <div className="engine-tabs" role="tablist" aria-label="工作台视图">
            {engineTabs.map((tab) => (
              <button className={`engine-tab${activeTab === tab.id ? " is-active" : ""}`} key={tab.id} type="button" role="tab" aria-selected={activeTab === tab.id} onClick={() => setActiveTab(tab.id)}>
                {tab.label}<span>{tab.status}</span>
              </button>
            ))}
          </div>
          <div className="engine-toolbar" aria-label="画布工具">
            <button className={`icon-button icon-button--canvas${showGrid ? " is-active" : ""}`} type="button" onClick={() => setShowGrid((value) => !value)} title="切换网格" aria-label="切换网格"><Grid3X3 size={15} /></button>
            <button className={`icon-button icon-button--canvas${showRulers ? " is-active" : ""}`} type="button" onClick={() => setShowRulers((value) => !value)} title="切换标尺" aria-label="切换标尺"><SlidersHorizontal size={15} /></button>
            <span className="engine-toolbar__divider" />
            <button className="icon-button icon-button--canvas" type="button" onClick={() => setZoom((value) => Math.min(140, value + 10))} title="放大" aria-label="放大"><ZoomIn size={15} /></button>
            <span className="engine-zoom">{zoom}%</span>
            <button className="icon-button icon-button--canvas" type="button" onClick={() => setZoom(100)} title="重置缩放" aria-label="重置缩放"><RotateCcw size={14} /></button>
            <button className="icon-button icon-button--canvas" type="button" title="适应画布" aria-label="适应画布"><Maximize2 size={14} /></button>
          </div>

          <div className="engine-canvas__content">
            <div className="canvas-caption"><span>PIPELINE / {activeTabLabel.toUpperCase()}</span><span>ZOOM {zoom}% · 1280 × 720</span></div>
            <div className="pipeline-board" style={{ transform: `scale(${zoom / 100})` }}>
              {pipelineNodes.map((node, index) => {
                const Icon = node.icon;
                return (
                  <div className="pipeline-node-wrap" key={node.step}>
                    <article className={`pipeline-node${index === 3 ? " pipeline-node--active" : ""}`}>
                      <div className="pipeline-node__topline"><span className="pipeline-node__step">{node.step}</span><span className="pipeline-node__timing">{node.timing}</span></div>
                      <div className="pipeline-node__title"><Icon size={15} /> {node.title}</div>
                      <p>{node.detail}</p>
                      <div className="pipeline-node__status"><span className="status-dot status-dot--green" /> PASS <Link2 size={12} /></div>
                    </article>
                    {index < pipelineNodes.length - 1 && <span className="pipeline-connector" aria-hidden="true" />}
                  </div>
                );
              })}
            </div>
            <div className="canvas-inspector">
              <div><span className="eyebrow">SELECTED NODE</span><strong>04 / CHECKDIGIT</strong></div>
              <div className="canvas-inspector__metrics"><span>Mod10 <b>8</b></span><span>Mod11 <b>X</b></span><span>ISO 3297 <b>PASS</b></span></div>
            </div>
          </div>
          <div className="engine-statusbar"><span><Activity size={14} /> {isRunning ? "Watching pipeline events" : "Pipeline paused"}</span><span>Memory 18.2 MB · CPU 0.4%</span></div>
        </main>

        <aside className="engine-inspector">
          <div className="engine-inspector__header"><span className="eyebrow">INSPECTOR</span><CircleHelp size={15} /></div>
          <div className="inspector-card inspector-card--selected">
            <div className="inspector-card__label"><span className="status-dot status-dot--blue" /> SELECTED / 04</div>
            <h2>CHECKDIGIT</h2>
            <p>实时校验位推导与标准一致性检查。</p>
            <dl className="inspector-list"><div><dt>EAN-13</dt><dd>Mod10</dd></div><div><dt>ISSN</dt><dd>Mod11</dd></div><div><dt>result</dt><dd className="status-text status-text--green">PASS</dd></div></dl>
          </div>
          <div className="inspector-card">
            <div className="inspector-card__label">TRACE OUTPUT</div>
            <pre>{`payload: 977123456789\ncheck:   8\naddon:   +2 12\nparity:  G-G`}</pre>
          </div>
          <button className={`engine-run-button${isRunning ? " is-running" : ""}`} type="button" onClick={() => setIsRunning((value) => !value)}>
            <Play size={15} fill="currentColor" /> {isRunning ? "暂停监听" : "运行流水线"}
          </button>
          <div className="inspector-help"><Eye size={14} /><span>选择节点查看校验细节与原始输出。</span></div>
        </aside>
      </div>
    </div>
  );
};
