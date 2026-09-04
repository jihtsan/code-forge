import { CheckCircle2 } from "lucide-react";

export interface HeroIntroProps {
  readonly statusLabel: string;
  readonly title: string;
  readonly description: string;
}

export const HeroIntro = ({ statusLabel, title, description }: HeroIntroProps) => (
  <div className="hero-intro">
    <span className="compliance-pill">
      <span className="status-dot status-dot--green" />
      <CheckCircle2 size={12} aria-hidden="true" />
      {statusLabel}
    </span>
    <h1>{title}</h1>
    <p>{description}</p>
  </div>
);
