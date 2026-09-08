import { useCallback, useEffect, useState } from "react";
import type { CategoryId, SymbologyId } from "../data/mockData";
import { isLinearSymbology } from "../data/linearSymbologies";
import { buildLinearBarcodeSvg, normalizeLinearData } from "../lib/linearBarcode";
import { buildBarcodeSvg } from "../lib/barcode";
import { buildCode11Svg, normalizeCode11Data } from "../lib/code11";
import { downloadZip, sanitizeFilenamePart } from "../lib/barcodeExport";
import { portalCopy } from "../data/mockData";
import type { BatchBarcodeRender } from "../components/BatchBarcodePanel";
import { useBatchBarcodeGenerator } from "../hooks/useBatchBarcodeGenerator";
import { useCode11Generator } from "../hooks/useCode11Generator";
import { useIssnGenerator } from "../hooks/useIssnGenerator";
import { useLinearBarcodeGenerator } from "../hooks/useLinearBarcodeGenerator";
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
  const code11Generator = useCode11Generator();
  const linearBarcodeGenerator = useLinearBarcodeGenerator();
  const [activeCategory, setActiveCategory] = useState<CategoryId>("publishing");
  const [activeSymbology, setActiveSymbology] = useState<SymbologyId>("issn-p2");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("quick-generator");
  const linearGenerator = isLinearSymbology(activeSymbology)
    ? linearBarcodeGenerator.getState(activeSymbology)
    : undefined;
  const batchSourceValue = activeSymbology === "issn-p2"
    ? generator.body
    : activeSymbology === "code11"
      ? code11Generator.data
      : linearGenerator?.data ?? "";
  const normalizeBatchValue = useCallback((value: string): string => {
    if (activeSymbology === "issn-p2") return value.replace(/\D/g, "").slice(0, 7);
    if (activeSymbology === "code11") return normalizeCode11Data(value);
    return isLinearSymbology(activeSymbology) ? normalizeLinearData(activeSymbology, value) : value;
  }, [activeSymbology]);
  const batch = useBatchBarcodeGenerator({
    sourceKey: activeSymbology,
    sourceValue: batchSourceValue,
    normalize: normalizeBatchValue,
  });

  const batchTitle = activeSymbology === "issn-p2"
    ? "ISSN-P2"
    : activeSymbology === "code11"
      ? "Code-11"
      : linearGenerator?.definition.title ?? "线性条码";
  const linearId = linearGenerator?.id;
  const linearIncludeCheck = linearGenerator?.includeCheck ?? false;
  const linearShowText = linearGenerator?.showText ?? true;

  const renderBatchItem = useCallback((value: string): BatchBarcodeRender => {
    if (activeSymbology === "code11") {
      const normalized = normalizeCode11Data(value);
      if (!normalized) return { svg: null, error: "请输入条码数据" };
      return {
        svg: buildCode11Svg({
          data: normalized,
          checksumMode: code11Generator.checksumMode,
          showCheckDigits: code11Generator.showCheckDigits,
          dark: darkMode,
        }),
        error: null,
      };
    }

    if (isLinearSymbology(activeSymbology) && linearId) {
      return buildLinearBarcodeSvg({
        id: activeSymbology,
        data: value,
        includeCheck: linearIncludeCheck,
        showText: linearShowText,
        dark: darkMode,
      });
    }

    const body = value.replace(/\D/g, "").slice(0, 7);
    if (body.length !== 7 || generator.variant.length !== 2 || generator.addon.length !== 2) {
      return { svg: null, error: "ISSN 字段未完成" };
    }
    return {
      svg: buildBarcodeSvg({
        payload: `977${body}${generator.variant}`,
        addon: generator.addon,
        dark: darkMode,
      }),
      error: null,
    };
  }, [activeSymbology, code11Generator.checksumMode, code11Generator.showCheckDigits, darkMode, generator.addon, generator.variant, linearId, linearIncludeCheck, linearShowText]);

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

  const downloadBatch = () => {
    if (!batch.enabled || batch.items.length === 0) {
      notify("请先生成批量条码");
      return;
    }

    const renderedItems = batch.items.map((item) => ({ item, render: renderBatchItem(item.value) }));
    const validItems = renderedItems.filter((entry): entry is typeof entry & { render: { svg: string; error: null } } => Boolean(entry.render.svg));
    if (validItems.length === 0) {
      notify("没有可导出的有效条码");
      return;
    }

    try {
      downloadZip(
        validItems.map(({ item, render }) => ({
          filename: `vectorlabel-batch-${activeSymbology}-${String(item.index + 1).padStart(2, "0")}-${sanitizeFilenamePart(item.value)}.svg`,
          content: render.svg,
        })),
        `vectorlabel-batch-${activeSymbology}-${validItems.length}`,
      );
    } catch (error) {
      console.error("批量 ZIP 导出失败", error);
      notify("批量 ZIP 导出失败，请重试");
      return;
    }

    const skippedCount = renderedItems.length - validItems.length;
    notify(skippedCount > 0
      ? `已打包 ${validItems.length} 条 SVG，跳过 ${skippedCount} 条无效数据`
      : `已打包 ${validItems.length} 条 SVG`);
  };
  const scrollToGenerator = (category?: CategoryId, symbology?: SymbologyId) => {
    if (category) setActiveCategory(category);
    if (symbology) setActiveSymbology(symbology);
    document.getElementById("quick-generator")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const changeSymbology = (symbology: SymbologyId) => {
    setActiveSymbology(symbology);
    setActiveCategory(symbology === "issn-p2" ? "publishing" : "logistics");
  };

  const changeCategory = (category: CategoryId) => {
    setActiveCategory(category);
    if (category === "publishing") {
      setActiveSymbology("issn-p2");
    } else if (category === "logistics" && !isLinearSymbology(activeSymbology)) {
      setActiveSymbology("code128");
    }
  };

  const changeBatchMode = (enabled: boolean) => {
    if (enabled && !batch.enabled) batch.generate();
    batch.setEnabled(enabled);
  };

  const resetCurrent = () => {
    if (activeSymbology === "code11") {
      code11Generator.reset();
    } else if (isLinearSymbology(activeSymbology) && linearGenerator) {
      linearGenerator.reset();
    } else {
      generator.reset();
    }
    batch.reset();
    notify("已重置当前码制");
  };

  const selectedBatchItem = batch.enabled ? batch.items[batch.selectedIndex] : undefined;

  return (
    <div className="portal-page">
      <TopNav activeSection={activeSection} darkMode={darkMode} onToggleDarkMode={onToggleDarkMode} />
      <main>
        <section className="hero-section">
          <div className="shell hero-section__inner">
            <HeroIntro statusLabel={portalCopy.status} title={portalCopy.title} description={portalCopy.description} />
            <div className={`hero-workspace${batch.enabled ? " hero-workspace--batch" : ""}`}>
              <GeneratorPanel
                generator={generator}
                code11Generator={code11Generator}
                linearGenerator={linearGenerator}
                batch={batch}
                batchSourceValue={batchSourceValue}
                batchTitle={batchTitle}
                renderBatchItem={renderBatchItem}
                symbology={activeSymbology}
                activeCategory={activeCategory}
                onSymbologyChange={changeSymbology}
                onCategoryChange={changeCategory}
                onAdvanced={() => setAdvancedOpen((open) => !open)}
                onRedraw={() => notify("画布已按最新参数刷新")}
                onBatchModeChange={changeBatchMode}
                onReset={resetCurrent}
                onNotify={notify}
                onBatchDownload={downloadBatch}
                advancedOpen={advancedOpen}
              />
              <BarcodePreview
                generator={generator}
                code11Generator={code11Generator}
                linearGenerator={linearGenerator}
                symbology={activeSymbology}
                darkMode={darkMode}
                onNotify={notify}
                batchValue={selectedBatchItem?.value}
                batchPosition={selectedBatchItem ? selectedBatchItem.index + 1 : undefined}
                batchTotal={batch.enabled ? batch.items.length || undefined : undefined}
                onBatchDownload={downloadBatch}
              />
            </div>
          </div>
        </section>
        <WorkflowSection onStepSelect={() => scrollToGenerator()} />
        <ToolMatrix activeCategory={activeCategory} activeSymbology={activeSymbology} onUseTool={scrollToGenerator} />
      </main>
      <StandardsFooter />
      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  );
};
