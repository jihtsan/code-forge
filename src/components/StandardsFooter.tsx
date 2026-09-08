import { Link } from "react-router-dom";
import { brand, footerCheatSheet, standards } from "../data/mockData";
import { BrandMark } from "./BrandMark";

export const StandardsFooter = () => (
  <footer className="standards-footer section-band" id="compliance-docs">
    <div className="shell">
      <div className="standards-ribbon">
        <div>
          <span className="eyebrow">Verified Standards</span>
          <p>全流程遵循国际印刷与商品标识权威规范</p>
        </div>
        <div className="standards-list">
          {standards.map((standard) => (
            <span className="standard-chip" key={standard.label}>
              <span className={`status-dot status-dot--${standard.tone}`} />
              {standard.label}
            </span>
          ))}
        </div>
      </div>

      <div className="footer-grid">
        <div className="footer-about">
          <BrandMark compact />
          <strong>{brand.name} Portal</strong>
          <p>面向出版与物流场景，在浏览器内完成条码生成、预览和文件导出。</p>
          <span className="muted-code">数据仅在当前浏览器内处理</span>
        </div>
        <div className="footer-column">
          <h3>码制对照速查（Cheat-sheet）</h3>
          {footerCheatSheet.map((link) => (
            <Link to={link.href} key={link.label}>
              <span>{link.label}</span><small>{link.meta}</small>
            </Link>
          ))}
        </div>
        <div className="footer-column">
          <h3>本地导出</h3>
          <span className="footer-capability"><strong>SVG</strong> 单枚矢量条码</span>
          <span className="footer-capability"><strong>PNG</strong> 高清位图</span>
          <span className="footer-capability"><strong>ZIP</strong> 批量 SVG 归档</span>
        </div>
        <div className="footer-column">
          <h3>批量数据源</h3>
          <span className="footer-capability"><strong>递增</strong> 固定步长序列</span>
          <span className="footer-capability"><strong>逐行</strong> 粘贴条码数据</span>
          <span className="footer-capability"><strong>CSV</strong> 条码列或首列，最多 50 条</span>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2025 VectorLabel Portal. All rights reserved. 遵循 ISO/IEC 15420 与 GS1 通用规范。</span>
        <span>本地处理 · 无需上传</span>
      </div>
    </div>
  </footer>
);
