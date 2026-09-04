import { useEffect, useState } from "react";
import type { CategoryId } from "../data/mockData";
import { portalCopy } from "../data/mockData";
import { useIssnGenerator } from "../hooks/useIssnGenerator";
import { BarcodePreview } from "../components/BarcodePreview";
import { GeneratorPanel } from "../components/GeneratorPanel";
import { HeroIntro } from "../components/HeroIntro";
import { StandardsFooter } from "../components/StandardsFooter";
import { Toast } from "../components/Toast";
import { ToolMatrix } from "../components/ToolMatrix";
import { TopNav } from "../components/TopNav";
import { WorkflowSection } from "../components/WorkflowSection";

export interface PortalPageProps {
  readonly darkMode: boolean;
  readonly onToggleDarkMode: () => void;
}

export const PortalPage = ({ darkMode, onToggleDarkMode }: PortalPageProps) => {
  const generator = useIssnGenerator();
  const [activeCategory, setActiveCategory] = useState<CategoryId>("publishing");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("quick-generator");

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => {
    const sectionIds = ["quick-generator", "symbology-hub", "issn-suite", "batch-api", "compliance-docs"];
    const sections = sectionIds.map((id) => document.getElementById(id)).filter((section): section is HTMLElement => Boolean(section));
    if (sections.length === 0) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-18% 0px -64% 0px", threshold: [0.05, 0.25, 0.55] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const notify = (message: string) => setToast(message);
  const scrollToGenerator = (category?: CategoryId) => {
    if (category) setActiveCategory(category);
    document.getElementById("quick-generator")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="portal-page">
      <TopNav activeSection={activeSection} darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} />
      <main>
        <section className="hero-section">
          <div className="shell hero-section__inner">
            <HeroIntro statusLabel={portalCopy.status} title={portalCopy.title} description={portalCopy.description} />
            <div className="hero-workspace">
              <GeneratorPanel
                generator={generator}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                onAdvanced={() => setAdvancedOpen((open) => !open)}
                onRedraw={() => notify("画布已按最新参数刷新")}
                advancedOpen={advancedOpen}
              />
              <BarcodePreview generator={generator} darkMode={darkMode} onNotify={notify} />
            </div>
          </div>
        </section>
        <WorkflowSection onStepSelect={() => scrollToGenerator()} />
        <ToolMatrix activeCategory={activeCategory} onUseTool={scrollToGenerator} />
      </main>
      <StandardsFooter onNotify={notify} />
      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  );
};
