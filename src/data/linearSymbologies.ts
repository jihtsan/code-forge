import type { LucideIcon } from "lucide-react";
import {
  Barcode,
  Binary,
  Brackets,
  CircuitBoard,
  Columns3,
  Hash,
  Layers3,
  ScanLine,
  Sigma,
  Split,
  TerminalSquare,
  Boxes,
} from "lucide-react";

export type LinearSymbologyId =
  | "code128"
  | "code11"
  | "code25il"
  | "code39"
  | "code39-full-ascii"
  | "code93"
  | "flattermarken"
  | "gs1-128"
  | "msi"
  | "pharmacode-one-track"
  | "pharmacode-two-track"
  | "telepen-alpha";

export type SymbologyId = "issn-p2" | LinearSymbologyId;

export type LinearInputKind =
  | "ascii"
  | "code39"
  | "code39-full-ascii"
  | "code93"
  | "digits"
  | "gs1";

export type LinearChecksumKind = "automatic" | "optional" | "none";

export interface LinearSymbologyDefinition {
  readonly id: LinearSymbologyId;
  readonly bcid: string;
  readonly tecItSlug: string;
  readonly title: string;
  readonly shortTitle: string;
  readonly eyebrow: string;
  readonly description: string;
  readonly detailLabel: string;
  readonly detailValue: string;
  readonly standard: string;
  readonly footer: string;
  readonly action: string;
  readonly icon: LucideIcon;
  readonly tone: "blue" | "green" | "teal";
  readonly category: "logistics";
  readonly sample: string;
  readonly inputKind: LinearInputKind;
  readonly maxLength: number;
  readonly inputHint: string;
  readonly checksum: LinearChecksumKind;
  readonly checksumLabel: string;
  readonly ratio: string;
  readonly height: number;
  readonly supportsCheckToggle?: boolean;
  readonly parse?: boolean;
}

/**
 * The linear catalog is the single source of truth for the selector, cards,
 * validation copy, and the BWIPP renderer options.
 */
export const linearSymbologies = [
  {
    id: "code128",
    bcid: "code128",
    tecItSlug: "Code128",
    title: "Code-128",
    shortTitle: "Code-128",
    eyebrow: "高密度通用",
    description: "覆盖完整 ASCII 的通用高密度线性码，自动选择 A / B / C 子集，适合物流标签与设备编号。",
    detailLabel: "字符集",
    detailValue: "ASCII 0–127",
    standard: "ISO/IEC 15417",
    footer: "自动选择 A / B / C 子集",
    action: "打开编辑器",
    icon: Barcode,
    tone: "blue",
    category: "logistics",
    sample: "ABC-abc-1234",
    inputKind: "ascii",
    maxLength: 120,
    inputHint: "支持可打印 ASCII；编码器会自动压缩数字段。",
    checksum: "automatic",
    checksumLabel: "自动 · 1 位",
    ratio: "1:2.5",
    height: 12,
  },
  {
    id: "code11",
    bcid: "code11",
    tecItSlug: "Code11",
    title: "Code-11",
    shortTitle: "Code-11",
    eyebrow: "通信设备序列",
    description: "面向远程通信元件与装备序列号，支持数字和连字符，按长度启用 C / K 模 11 校验。",
    detailLabel: "字符集",
    detailValue: "0–9 · -",
    standard: "USS Code 11",
    footer: "C / K 校验位可选",
    action: "打开编辑器",
    icon: ScanLine,
    tone: "teal",
    category: "logistics",
    sample: "0123-4567",
    inputKind: "digits",
    maxLength: 80,
    inputHint: "支持数字和连字符，输入会即时规范化。",
    checksum: "automatic",
    checksumLabel: "C / K · 模 11",
    ratio: "1:2.24",
    height: 12,
  },
  {
    id: "code25il",
    bcid: "interleaved2of5",
    tecItSlug: "Code25IL",
    title: "Code-2of5 Interleaved",
    shortTitle: "2of5 Interleaved",
    eyebrow: "偶数位物流码",
    description: "高密度纯数字交错码，以成对数字编码，常用于仓储箱标、托盘和物流分拣。",
    detailLabel: "字符集",
    detailValue: "数字 · 偶数位",
    standard: "ISO/IEC 16390",
    footer: "数字成对交错编码",
    action: "打开编辑器",
    icon: Columns3,
    tone: "blue",
    category: "logistics",
    sample: "12345678",
    inputKind: "digits",
    maxLength: 80,
    inputHint: "仅数字；标准载荷需要偶数位。",
    checksum: "optional",
    checksumLabel: "可选 · Mod 10",
    ratio: "1:2.25–1:3.5",
    height: 12,
    supportsCheckToggle: true,
  },
  {
    id: "code39",
    bcid: "code39",
    tecItSlug: "Code39",
    title: "Code-39",
    shortTitle: "Code-39",
    eyebrow: "工业标签经典",
    description: "以星号起止的稳健工业码，支持大写字母、数字和常用特殊字符，便于人工核对。",
    detailLabel: "字符集",
    detailValue: "A–Z · 0–9 · -.$/+% 空格",
    standard: "ISO/IEC 16388",
    footer: "大写工业字符集",
    action: "打开编辑器",
    icon: Brackets,
    tone: "green",
    category: "logistics",
    sample: "ABC-123",
    inputKind: "code39",
    maxLength: 80,
    inputHint: "输入会转为大写；不支持的字符会被过滤。",
    checksum: "optional",
    checksumLabel: "可选 · Mod 43",
    ratio: "1:2–1:3",
    height: 12,
    supportsCheckToggle: true,
  },
  {
    id: "code39-full-ascii",
    bcid: "code39ext",
    tecItSlug: "Code39FullASCII",
    title: "Code-39 全 ASCII 码",
    shortTitle: "Code-39 Full ASCII",
    eyebrow: "扩展工业字符",
    description: "通过组合转义字符覆盖完整 ASCII，兼容需要大小写和控制符映射的旧式工业系统。",
    detailLabel: "字符集",
    detailValue: "ASCII 0–127",
    standard: "USS Code 39 Full ASCII",
    footer: "组合字符扩展编码",
    action: "打开编辑器",
    icon: Binary,
    tone: "green",
    category: "logistics",
    sample: "ABC-abc-1234",
    inputKind: "code39-full-ascii",
    maxLength: 80,
    inputHint: "支持 ASCII 字符；扩展字符会自动转换为组合序列。",
    checksum: "optional",
    checksumLabel: "可选 · Mod 43",
    ratio: "1:2–1:3",
    height: 12,
    supportsCheckToggle: true,
  },
  {
    id: "code93",
    bcid: "code93",
    tecItSlug: "Code93",
    title: "Code-93",
    shortTitle: "Code-93",
    eyebrow: "双校验高密度",
    description: "比 Code-39 更紧凑的工业码，内置 C / K 两个 Mod 47 校验字符提升传输可靠性。",
    detailLabel: "字符集",
    detailValue: "A–Z · 0–9 · -.$/+% 空格",
    standard: "USS Code 93",
    footer: "C / K 双校验自动附加",
    action: "打开编辑器",
    icon: Sigma,
    tone: "teal",
    category: "logistics",
    sample: "ABC-123",
    inputKind: "code93",
    maxLength: 80,
    inputHint: "支持大写工业字符；C / K 校验由编码器自动生成。",
    checksum: "automatic",
    checksumLabel: "自动 · C / K",
    ratio: "1:2–1:3",
    height: 12,
  },
  {
    id: "flattermarken",
    bcid: "flattermarken",
    tecItSlug: "Flattermarken",
    title: "Flattermarken",
    shortTitle: "Flattermarken",
    eyebrow: "印刷定位标记",
    description: "九位数字定位码，用于书刊装订和印刷流程中的位置识别与折页对位。",
    detailLabel: "长度",
    detailValue: "9 位数字",
    standard: "Flattermarken",
    footer: "无校验位 · 位置识别",
    action: "打开编辑器",
    icon: Hash,
    tone: "blue",
    category: "logistics",
    sample: "123456789",
    inputKind: "digits",
    maxLength: 9,
    inputHint: "请输入恰好 9 位数字。",
    checksum: "none",
    checksumLabel: "无校验位",
    ratio: "固定定位标记",
    height: 8,
  },
  {
    id: "gs1-128",
    bcid: "gs1-128",
    tecItSlug: "GS1-128",
    title: "GS1-128 (UCC/EAN-128)",
    shortTitle: "GS1-128",
    eyebrow: "AI 应用标识符",
    description: "以括号 AI 编排批号、效期、序列号等业务字段，自动处理 FNC1 与 GS1 校验规则。",
    detailLabel: "数据格式",
    detailValue: "AI(01) · AI(17) · AI(10)…",
    standard: "GS1 General Specs",
    footer: "AI / FNC1 结构化载荷",
    action: "打开编辑器",
    icon: Boxes,
    tone: "blue",
    category: "logistics",
    sample: "(01)09506000134352(17)250101(10)ABC",
    inputKind: "gs1",
    maxLength: 120,
    inputHint: "用括号输入 AI；相邻括号会自动插入 FNC1 分隔符。",
    checksum: "automatic",
    checksumLabel: "自动 · GS1",
    ratio: "1:2–1:3",
    height: 12,
    parse: true,
  },
  {
    id: "msi",
    bcid: "msi",
    tecItSlug: "MSI",
    title: "MSI",
    shortTitle: "MSI",
    eyebrow: "库存数字码",
    description: "纯数字库存条码，支持 Mod 10、双 Mod 10 等变体，常见于仓储和图书馆系统。",
    detailLabel: "字符集",
    detailValue: "0–9",
    standard: "MSI Modified Plessey",
    footer: "Mod 10 校验可选",
    action: "打开编辑器",
    icon: CircuitBoard,
    tone: "teal",
    category: "logistics",
    sample: "123456",
    inputKind: "digits",
    maxLength: 80,
    inputHint: "仅数字；可按需附加 Mod 10 校验位。",
    checksum: "optional",
    checksumLabel: "可选 · Mod 10",
    ratio: "1:2.5",
    height: 12,
    supportsCheckToggle: true,
  },
  {
    id: "pharmacode-one-track",
    bcid: "pharmacode",
    tecItSlug: "OneTrackPharmacode",
    title: "Pharmacode One-Track",
    shortTitle: "Pharmacode 1-track",
    eyebrow: "药品包装识别",
    description: "用粗细条组合表示单一数值，适用于药品包装和小标签上的高速机械识读。",
    detailLabel: "数值范围",
    detailValue: "3–131070",
    standard: "Pharmacode",
    footer: "无校验 · 二进制数值",
    action: "打开编辑器",
    icon: Layers3,
    tone: "green",
    category: "logistics",
    sample: "12345",
    inputKind: "digits",
    maxLength: 6,
    inputHint: "请输入 3–131070 的整数。",
    checksum: "none",
    checksumLabel: "无校验位",
    ratio: "1:2–1:3",
    height: 12,
  },
  {
    id: "pharmacode-two-track",
    bcid: "pharmacode2",
    tecItSlug: "TwoTrackPharmacode",
    title: "Pharmacode Two-Track",
    shortTitle: "Pharmacode 2-track",
    eyebrow: "双轨药品码",
    description: "上下双轨编码扩大数值容量，适用于药品包装上的紧凑型直接部件标识。",
    detailLabel: "数值范围",
    detailValue: "4–64570080",
    standard: "Pharmacode 2-track",
    footer: "双轨 · 无校验位",
    action: "打开编辑器",
    icon: Split,
    tone: "green",
    category: "logistics",
    sample: "12345",
    inputKind: "digits",
    maxLength: 8,
    inputHint: "请输入 4–64570080 的整数。",
    checksum: "none",
    checksumLabel: "无校验位",
    ratio: "双轨固定比例",
    height: 8,
  },
  {
    id: "telepen-alpha",
    bcid: "telepen",
    tecItSlug: "TelepenAlpha",
    title: "Telepen Alpha",
    shortTitle: "Telepen Alpha",
    eyebrow: "ASCII 远程传输",
    description: "面向远程数据采集的全 ASCII 线性码，适合需要高密度传输文本和控制字符的场景。",
    detailLabel: "字符集",
    detailValue: "ASCII 0–127",
    standard: "Telepen",
    footer: "全 ASCII · 自动校验",
    action: "打开编辑器",
    icon: TerminalSquare,
    tone: "teal",
    category: "logistics",
    sample: "ABC-abc-1234",
    inputKind: "ascii",
    maxLength: 120,
    inputHint: "支持可打印 ASCII 字符。",
    checksum: "automatic",
    checksumLabel: "自动 · 1 位",
    ratio: "1:2.5",
    height: 12,
  },
] as const satisfies readonly LinearSymbologyDefinition[];

export const linearSymbologyById: Readonly<Record<LinearSymbologyId, LinearSymbologyDefinition>> =
  Object.fromEntries(linearSymbologies.map((definition) => [definition.id, definition])) as Readonly<
    Record<LinearSymbologyId, LinearSymbologyDefinition>
  >;

export const isLinearSymbology = (value: string): value is LinearSymbologyId =>
  value in linearSymbologyById;
