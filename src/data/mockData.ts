import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  CloudCog,
  Database,
  FileSpreadsheet,
  Link2,
  Package,
  QrCode,
  Truck,
} from "lucide-react";
import {
  linearSymbologies,
  type LinearSymbologyId,
  type SymbologyId,
} from "./linearSymbologies";

export type CategoryId = "publishing" | "logistics" | "interactive";
export type { LinearSymbologyId, SymbologyId } from "./linearSymbologies";

export interface CategoryOption {
  readonly id: CategoryId;
  readonly label: string;
  readonly shortLabel: string;
  readonly icon: LucideIcon;
}

export interface WorkflowStep {
  readonly number: string;
  readonly title: string;
  readonly description: string;
  readonly tags: readonly string[];
  readonly icon: LucideIcon;
}

export interface ToolCardData {
  readonly id: string;
  readonly title: string;
  readonly eyebrow: string;
  readonly description: string;
  readonly detailLabel: string;
  readonly detailValue: string;
  readonly standard: string;
  readonly footer: string;
  readonly action: string;
  readonly icon: LucideIcon;
  readonly tone: "blue" | "green" | "teal";
  readonly category: CategoryId;
  readonly symbology?: SymbologyId;
}

export interface StandardBadge {
  readonly label: string;
  readonly tone: "blue" | "green";
}

export interface PipelineNodeData {
  readonly step: string;
  readonly title: string;
  readonly detail: string;
  readonly timing: string;
  readonly icon: LucideIcon;
}

export interface NavigationItem {
  readonly label: string;
  readonly href: string;
}

export interface FooterLink {
  readonly label: string;
  readonly href: string;
  readonly meta?: string;
}

export interface EngineTab {
  readonly id: string;
  readonly label: string;
  readonly status: string;
}

export const navigationItems: readonly NavigationItem[] = [
  { label: "在线生成器", href: "/#quick-generator" },
  { label: "码制工具箱", href: "/#symbology-hub" },
  { label: "期刊出版套件", href: "/#issn-suite" },
  { label: "格式与规范", href: "/#compliance-docs" },
];

export const footerCheatSheet: readonly FooterLink[] = [
  { label: "ISSN-P2（977 + 2位期刊号）", href: "/#quick-generator", meta: "ISO 3297" },
  { label: "ISBN-13+5（978 图书定价）", href: "/#quick-generator", meta: "ISO 2108" },
  { label: "GS1-128 / ITF-14 运输标", href: "/#quick-generator", meta: "ISO 15417" },
  { label: "QR Code Model 2（Digital Link）", href: "/#quick-generator", meta: "ISO 18004" },
];

export const engineTabs: readonly EngineTab[] = [
  { id: "pipeline", label: "编码流水线", status: "RUNNING" },
  { id: "payload", label: "载荷检查", status: "PASS" },
  { id: "output", label: "输出预览", status: "READY" },
];

export const brand = {
  name: "VectorLabel",
  badge: "Portal",
  tagline: "条码与智能标签云门户",
} as const;

export const portalCopy = {
  status: "符合 ISO/IEC 15420 · ISO 3297 · GS1 通用规范",
  title: "新一代矢量条码与出版物流标签工具站",
  description:
    "面向图书期刊出版、国际现代物流与智能零售的零安装在线矢量标签门户。毫秒级校验位推导、严格静区与条宽缩减（BWR）印刷补偿，一键免授权导出工业级 SVG 与封底排版文件。",
} as const;

export const categories: readonly CategoryOption[] = [
  {
    id: "publishing",
    label: "期刊出版",
    shortLabel: "ISSN / ISBN",
    icon: BookOpen,
  },
  {
    id: "logistics",
    label: "物流零售",
    shortLabel: "EAN / GS1",
    icon: Truck,
  },
  {
    id: "interactive",
    label: "智慧交互",
    shortLabel: "QR / Link",
    icon: QrCode,
  },
];

export const workflowSteps: readonly WorkflowStep[] = [
  {
    number: "01",
    title: "选择码制与行业规范",
    description:
      "内置 EAN-13、ISSN-P2 期刊专用码、ISBN+5 书码、GS1-128 箱标和 ECC200 矩阵，自动匹配对应国际标准。",
    tags: ["ISO 15420", "ISO 3297", "GS1 GenSpec"],
    icon: Boxes,
  },
  {
    number: "02",
    title: "智能校验与载荷解析",
    description:
      "按字段解耦输入，内置 Mod 10 / Mod 11 自动运算与奇偶校验保护，从源头减少排版打样问题。",
    tags: ["Mod 10 AutoFix", "ISSN Mod 11"],
    icon: Database,
  },
  {
    number: "03",
    title: "工业级高保真导出",
    description:
      "一键导出原生精确贝塞尔曲线的 SVG，或直套 A6 期刊封底出版套件，支持 BWR 印刷补偿。",
    tags: ["纯矢量 Path", "A6 封底套件", "BWR 补偿"],
    icon: ArrowRight,
  },
];

const linearToolCards: readonly ToolCardData[] = linearSymbologies.map((symbology) => ({
  id: symbology.id,
  title: symbology.title,
  eyebrow: symbology.eyebrow,
  description: symbology.description,
  detailLabel: symbology.detailLabel,
  detailValue: symbology.detailValue,
  standard: symbology.standard,
  footer: symbology.footer,
  action: symbology.action,
  icon: symbology.icon,
  tone: symbology.tone,
  category: symbology.category,
  symbology: symbology.id,
}));

export const toolCards: readonly ToolCardData[] = [
  {
    id: "issn-suite",
    title: "ISSN-P2 期刊出版码",
    eyebrow: "专有出版规范",
    description:
      "977 专属前缀锁定，自动将 8 位 ISSN 原号转译为 EAN-13 模10 校验位，并挂载 2 位期刊期号附加码。",
    detailLabel: "支持版型",
    detailValue: "A6 封底 / 骑马钉封四",
    standard: "ISO 3297:2022",
    footer: "含读者互动双码并排",
    action: "立即生成",
    icon: BookOpen,
    tone: "blue",
    category: "publishing",
  },
  {
    id: "isbn-suite",
    title: "ISBN-13+5 图书出版码",
    eyebrow: "图书专著",
    description:
      "兼容 978 / 979 前缀的全球标准图书条码，支持挂载 5 位国际价格附加码并自动格式化短横线。",
    detailLabel: "附加码格式",
    detailValue: "EAN-5（币种 / 定价编码）",
    standard: "ISO 2108",
    footer: "定价附加码自动对齐",
    action: "立即生成",
    icon: BookOpen,
    tone: "blue",
    category: "publishing",
  },
  {
    id: "gs1-suite",
    title: "GS1-128 国际物流箱标",
    eyebrow: "仓储托盘",
    description:
      "集成 SSCC-18 集装箱序号与托盘运单标准，自动添加 FNC1 控制符与 AI 应用标识符。",
    detailLabel: "典型标识符",
    detailValue: "AI(00) SSCC / AI(01) GTIN",
    standard: "ISO/IEC 15417",
    footer: "支持 ITF-14 瓦楞纸箱",
    action: "立即生成",
    icon: Truck,
    tone: "blue",
    category: "logistics",
  },
  ...linearToolCards,
  {
    id: "digital-link",
    title: "GS1 Digital Link 智能码",
    eyebrow: "下一代零售",
    description:
      "将传统一维商品条码升级为带 Web 链接的 QR 矩阵，扫描直达商品溯源、电子说明书或订阅主页。",
    detailLabel: "矩阵格式",
    detailValue: "QR Code 2005 / DataMatrix",
    standard: "GS1 Digital Link v1.2",
    footer: "2027 零售全面换码过渡",
    action: "立即生成",
    icon: Link2,
    tone: "teal",
    category: "interactive",
  },
  {
    id: "tec-it",
    title: "TEC-IT 参数直通比对器",
    eyebrow: "双源核验",
    description:
      "映射并比对奥地利 TEC-IT 官方远端渲染服务，检查条宽公差与字符排版真实性。",
    detailLabel: "比对容差",
    detailValue: "0 偏差严格位流匹配",
    standard: "TEC-IT TBarCode Engine",
    footer: "官方 ASHX 协议兼容",
    action: "启动核验",
    icon: CloudCog,
    tone: "green",
    category: "interactive",
  },
  {
    id: "batch-api",
    title: "批量流水号与 CSV 导入",
    eyebrow: "生产套印",
    description:
      "支持固定步长生成序列号、逐行粘贴或导入 CSV；前 5 条即时预览，并可将有效条码打包为 ZIP。",
    detailLabel: "单批上限",
    detailValue: "50 枚 / 批次（浏览器内生成）",
    standard: "SVG / PNG / ZIP",
    footer: "数据仅在浏览器内处理",
    action: "批量体验",
    icon: FileSpreadsheet,
    tone: "blue",
    category: "logistics",
  },
];

export const standards: readonly StandardBadge[] = [
  { label: "ISO/IEC 15420:2009", tone: "blue" },
  { label: "ISO 3297:2022（ISSN）", tone: "blue" },
  { label: "GS1 General Specs v23", tone: "blue" },
  { label: "TEC-IT Compatible", tone: "green" },
];

export const pipelineNodes: readonly PipelineNodeData[] = [
  {
    step: "01",
    title: "DATA SOURCE",
    detail: "977123456789812",
    timing: "RAW 0.1ms",
    icon: Database,
  },
  {
    step: "02",
    title: "NORMALIZE",
    detail: "Trim + RegexFilter · 15 Digits Safe",
    timing: "0.08ms",
    icon: Package,
  },
  {
    step: "03",
    title: "PARSE ISSN PREFIX",
    detail: "977 · BODY 1234567 · VARIANT 89 · ADDON +2 12",
    timing: "0.14ms",
    icon: BookOpen,
  },
  {
    step: "04",
    title: "CHECKDIGIT",
    detail: "EAN-13 Mod10: 8 · ISSN Mod11: X · ISO 3297 Conform",
    timing: "0.11ms",
    icon: Database,
  },
  {
    step: "05",
    title: "ENCODE MAIN",
    detail: "95 Modules · L/G/R Guard 101 / 01010",
    timing: "0.2ms",
    icon: Boxes,
  },
  {
    step: "06",
    title: "ENCODE +2",
    detail: "1011 Delineator · Parity: G-G",
    timing: "0.09ms",
    icon: QrCode,
  },
  {
    step: "07",
    title: "VECTOR SVG",
    detail: "Path + HRI Glyph · 600 DPI Calib",
    timing: "0.12ms",
    icon: FileSpreadsheet,
  },
];
