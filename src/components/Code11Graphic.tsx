import { useMemo } from "react";
import {
  buildCode11Encoding,
  code11BarsFromPattern,
  code11PatternWidth,
  type Code11ChecksumMode,
} from "../lib/code11";

export interface Code11GraphicProps {
  readonly data: string;
  readonly checksumMode: Code11ChecksumMode;
  readonly showCheckDigits: boolean;
  readonly compact?: boolean;
}

export const Code11Graphic = ({
  data,
  checksumMode,
  showCheckDigits,
  compact = false,
}: Code11GraphicProps) => {
  const encoding = useMemo(() => buildCode11Encoding(data, checksumMode), [checksumMode, data]);
  const moduleWidth = compact ? 1.8 : 2.25;
  const quietZone = compact ? 18 : 24;
  const width = Math.ceil(code11PatternWidth(encoding.pattern, moduleWidth) + quietZone * 2);
  const height = compact ? 140 : 158;
  const bars = useMemo(
    () => code11BarsFromPattern(encoding.pattern, moduleWidth),
    [encoding.pattern, moduleWidth],
  );
  const displayText = showCheckDigits ? encoding.encodedData : encoding.data;
  const textLength = displayText.length > 24 ? width - quietZone * 2 : undefined;
  const checkLabel = encoding.checkDigits ? `CHECK ${encoding.checkDigits}` : "CHECK OFF";

  return (
    <svg
      className={`code11-graphic${compact ? " code11-graphic--compact" : ""}`}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`Code-11 条码 ${displayText || "等待输入"}`}
    >
      <rect className="code11-graphic__background" width={width} height={height} rx="10" />
      <rect className="code11-graphic__quiet-zone" x="10" y="22" width="8" height="99" rx="4" />
      <rect className="code11-graphic__quiet-zone" x={width - 18} y="22" width="8" height="99" rx="4" />
      {bars.map((bar, index) => (
        <rect
          className="code11-graphic__bar"
          key={`${bar.x}-${index}`}
          x={quietZone + bar.x}
          y="28"
          width={bar.width}
          height="86"
          rx="0.4"
        />
      ))}
      <text className="code11-graphic__guard" x={quietZone} y="17">START</text>
      <text className="code11-graphic__guard" x={width - quietZone} y="17" textAnchor="end">STOP</text>
      <text
        className="code11-graphic__text"
        x={width / 2}
        y="135"
        textAnchor="middle"
        textLength={textLength}
        lengthAdjust={textLength ? "spacingAndGlyphs" : undefined}
      >
        {displayText || "等待输入"}
      </text>
      <text className="code11-graphic__meta" x={quietZone} y="150">X=0.191mm · {checkLabel}</text>
      <text className="code11-graphic__meta" x={width - quietZone} y="150" textAnchor="end">
        {encoding.data.length} DATA CHARS
      </text>
    </svg>
  );
};
