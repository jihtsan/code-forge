import { Clipboard, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { brand, footerCheatSheet, footerDeveloperLinks, standards } from "../data/mockData";
import { BrandMark } from "./BrandMark";

export interface StandardsFooterProps {
  readonly onNotify: (message: string) => void;
}

export const StandardsFooter = ({ onNotify }: StandardsFooterProps) => {
  const copySnippet = async () => {
    try {
      await navigator.clipboard.writeText("const svg = renderISSN('1234567');");
      onNotify("集成代码已复制");
    } catch {
      onNotify("当前浏览器不允许访问剪贴板");
    }
  };

  return (
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
            <p>专注为中文连续出版物、图书出版发行社与现代物流印刷企业提供零误差、开放透明的矢量条码与智慧标签生产套件。</p>
            <span className="muted-code">{brand.engineVersion}</span>
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
            <h3>开发者开放接口（API）</h3>
            {footerDeveloperLinks.map((link) => {
              const external = link.href.startsWith("http");
              return external ? (
                <a href={link.href} target="_blank" rel="noreferrer" key={link.label}>{link.label}<ExternalLink size={11} /></a>
              ) : <Link to={link.href} key={link.label}>{link.label}</Link>;
            })}
          </div>
          <div className="footer-column">
            <h3>CLI / 快速集成引用</h3>
            <button className="code-snippet" type="button" onClick={copySnippet}>
              <span className="code-snippet__comment"># 即刻引用矢量引擎</span>
              <code><span>npm i @vectorlabel/engine</span></code>
              <span className="code-snippet__line">const svg = renderISSN('1234567');</span>
              <Clipboard size={13} aria-hidden="true" />
            </button>
            <span className="footer-note">开源协议: MIT License · 永久无商业收费门槛</span>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2025 VectorLabel Portal. All rights reserved. 遵循 ISO/IEC 15420 与 GS1 通用规范。</span>
          <span className="footer-bottom__links">
            <Link to="/engine">隐私权政策</Link>
            <span aria-hidden="true">·</span>
            <Link to="/engine">印刷公差校准指南</Link>
            <span aria-hidden="true">·</span>
            <Link to="/engine">免责声明</Link>
          </span>
        </div>
      </div>
    </footer>
  );
};
