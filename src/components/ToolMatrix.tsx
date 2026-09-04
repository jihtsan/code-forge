import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { toolCards } from "../data/mockData";
import type { CategoryId } from "../data/mockData";

export interface ToolMatrixProps {
  readonly activeCategory: CategoryId;
  readonly onUseTool: (category: CategoryId) => void;
}

export const ToolMatrix = ({ activeCategory, onUseTool }: ToolMatrixProps) => (
  <section className="tool-matrix section-band section-band--white" id="symbology-hub" aria-labelledby="tool-matrix-title">
    <div className="shell">
      <div className="section-heading section-heading--split">
        <div>
          <span className="eyebrow">Symbology Hub &amp; Specialized Suites</span>
          <h2 id="tool-matrix-title">模块化工具矩阵 · 针对各行业专属调优</h2>
          <p>集成出版印务、仓储集装箱标、数字名片与批量引擎六大核心功能模块。</p>
        </div>
        <span className="count-chip">共收录 28+ 项条码与二维矩阵</span>
      </div>

      <div className="tool-grid">
        {toolCards.map((card) => {
          const Icon = card.icon;
          const isCurrent = card.category === activeCategory;
          const isExternal = card.id === "tec-it";
          return (
            <article className={`tool-card tool-card--${card.tone}${isCurrent ? " is-current" : ""}`} key={card.id} id={card.id}>
              <div>
                <div className="tool-card__heading">
                  <div className="tool-card__title">
                    <Icon size={17} aria-hidden="true" />
                    <h3>{card.title}</h3>
                  </div>
                  <span className="tool-card__eyebrow">{card.eyebrow}</span>
                </div>
                <p className="tool-card__description">{card.description}</p>
                <dl className="tool-card__details">
                  <div><dt>{card.detailLabel}:</dt><dd>{card.detailValue}</dd></div>
                  <div><dt>标准依据:</dt><dd className="status-text status-text--green">{card.standard}</dd></div>
                </dl>
              </div>
              <div className="tool-card__footer">
                <span>{card.footer}</span>
                {isExternal ? (
                  <a className="tool-card__action" href="https://barcode.tec-it.com/zh/ISSNP2?data=977123456789812" target="_blank" rel="noreferrer">
                    {card.action} <ExternalLink size={13} aria-hidden="true" />
                  </a>
                ) : (
                  <Link className="tool-card__action" to="/#quick-generator" onClick={() => onUseTool(card.category)}>
                    {card.action} <ArrowRight size={13} aria-hidden="true" />
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  </section>
);
