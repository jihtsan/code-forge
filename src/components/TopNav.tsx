import { Code2, Moon, Sun, Zap, X, Menu, ScanLine } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { navigationItems } from "../data/mockData";
import { BrandMark } from "./BrandMark";

export interface TopNavProps {
  readonly activeSection?: string;
  readonly darkMode: boolean;
  readonly onToggleDarkMode: () => void;
}

export const TopNav = ({
  activeSection = "quick-generator",
  darkMode,
  onToggleDarkMode,
}: TopNavProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="top-nav">
      <div className="shell top-nav__inner">
        <Link className="top-nav__brand" to="/" aria-label="返回 VectorLabel 首页" onClick={() => setMobileOpen(false)}>
          <BrandMark />
        </Link>

        <nav className={`top-nav__links${mobileOpen ? " top-nav__links--open" : ""}`} aria-label="主导航">
          {navigationItems.map((item) => {
            const section = item.href.replace("/#", "");
            const active = section === activeSection;
            return (
              <Link
                className={`top-nav__link${active ? " is-active" : ""}`}
                key={item.href}
                to={item.href}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
          <Link className="top-nav__link top-nav__link--engine" to="/engine" onClick={() => setMobileOpen(false)}>
            <ScanLine size={14} aria-hidden="true" />
            编码工作台
          </Link>
        </nav>

        <div className="top-nav__actions">
          <Link className="button button--primary top-nav__quick" to="/#quick-generator">
            <Zap size={14} fill="currentColor" aria-hidden="true" />
            <span>快速开箱体验</span>
          </Link>
          <button
            className="icon-button icon-button--quiet"
            type="button"
            onClick={onToggleDarkMode}
            title={darkMode ? "切换浅色主题" : "切换深色主题"}
            aria-label={darkMode ? "切换浅色主题" : "切换深色主题"}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link className="icon-button icon-button--quiet top-nav__code" to="/engine" title="打开编码工作台" aria-label="打开编码工作台">
            <Code2 size={16} />
          </Link>
          <button
            className="icon-button icon-button--menu"
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "关闭导航菜单" : "打开导航菜单"}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
};
