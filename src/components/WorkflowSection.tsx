import { ArrowRight } from "lucide-react";
import { workflowSteps } from "../data/mockData";

export interface WorkflowSectionProps {
  readonly onStepSelect?: (stepNumber: string) => void;
}

export const WorkflowSection = ({ onStepSelect }: WorkflowSectionProps) => (
  <section className="workflow-section section-band" aria-labelledby="workflow-title">
    <div className="shell">
      <div className="section-heading section-heading--center">
        <span className="eyebrow">Minimalist 3-Step Flow</span>
        <h2 id="workflow-title">三步极简流程，打造出版与工业印刷级标准标签</h2>
        <p>摆脱繁杂的图形软件手画条码，由行业规则引擎自动把关校验与印刷公差。</p>
      </div>
      <div className="workflow-grid">
        {workflowSteps.map((step) => {
          const Icon = step.icon;
          return (
            <button
              className="workflow-card"
              type="button"
              key={step.number}
              onClick={() => onStepSelect?.(step.number)}
            >
              <span className={`workflow-card__number workflow-card__number--${step.number === "02" ? "green" : "blue"}`}>
                {step.number}
              </span>
              <span className="workflow-card__title">
                <span>{step.title}</span>
                <Icon size={16} aria-hidden="true" />
              </span>
              <span className="workflow-card__description">{step.description}</span>
              <span className="workflow-card__tags">
                {step.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </span>
              <ArrowRight className="workflow-card__arrow" size={15} aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </div>
  </section>
);
