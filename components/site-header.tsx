"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About CODL" },
  { href: "#services", label: "Learning Services" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  return (
    <header className="site-header">
      <div className="container-shell header-inner">
        <a
          aria-label="ALABATT-HUB, home"
          className="brand"
          href="#home"
          onClick={() => setMenuOpen(false)}
        >
          <span className="brand-mark">
            <Icon name="cap" />
          </span>
          <span className="brand-copy">
            <strong>ALABATT-HUB</strong>
            <span>Centre for Open and Distance Learning</span>
          </span>
        </a>

        <nav aria-label="Main navigation" className="desktop-nav">
          {links.map((link) => (
            <a href={link.href} key={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <a className="button button-header" href="#student-portal">
          Student Portal
          <Icon name="arrow-right" />
        </a>

        <button
          aria-controls="mobile-navigation"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          className="menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          <Icon name={menuOpen ? "x" : "menu"} />
        </button>
      </div>

      <nav
        aria-label="Mobile navigation"
        className={`mobile-nav${menuOpen ? " is-open" : ""}`}
        id="mobile-navigation"
        inert={!menuOpen}
      >
        {links.map((link) => (
          <a
            href={link.href}
            key={link.href}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
        <a
          className="mobile-portal-link"
          href="#student-portal"
          onClick={() => setMenuOpen(false)}
        >
          Student Portal <Icon name="arrow-right" />
        </a>
      </nav>
    </header>
  );
}
