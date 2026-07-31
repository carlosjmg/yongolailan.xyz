"use client";

import React from "react";
import type { NavItem } from "./Nav";
import { scrollToSection } from "./shared";

export default function Footer({
  navItems,
  email,
  whatsapp,
  whatsappUrl,
  labelName,
  labelLocation,
  domain,
  oneLiner,
  logo = "/images/Yongo-logo-blanco.webp",
}: {
  navItems: NavItem[];
  email: string;
  whatsapp: string;
  whatsappUrl: string;
  labelName: string;
  labelLocation: string;
  domain: string;
  oneLiner: string;
  logo?: string;
}) {
  const linkStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    fontFamily: "var(--font-body)",
    fontSize: "13px",
    color: "var(--text-dimmer)",
    cursor: "pointer",
    padding: 0,
    textAlign: "left",
    transition: "color 0.2s",
    textDecoration: "none",
  };

  return (
    <footer style={{ background: "oklch(6% 0.018 30)", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "60px clamp(24px, 6vw, 80px) 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "40px", marginBottom: "48px" }}>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt="Yongolailan" style={{ height: "24px", opacity: 0.8, marginBottom: "16px", display: "block" }} />
            <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--text-dimmer)", lineHeight: 1.7, maxWidth: "220px" }}>{oneLiner}</p>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", color: "var(--text-dimmer)", marginTop: "16px" }}>
              Cuban-born · Based in New York City
            </div>
          </div>

          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "16px" }}>Navigate</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {navItems.map((item) =>
                item.href ? (
                  <a
                    key={item.id}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={linkStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-dimmer)")}
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    style={linkStyle}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-dimmer)")}
                  >
                    {item.label}
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "16px" }}>Contact</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <a href={`mailto:${email}`} style={linkStyle} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-dimmer)")}>
                {email}
              </a>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={linkStyle} onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")} onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-dimmer)")}>
                {whatsapp}
              </a>
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "16px", marginTop: "32px" }}>Label</div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "var(--text-dimmer)" }}>
              {labelName}
              <br />
              {labelLocation}
            </div>
          </div>

          <div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold)", marginBottom: "16px" }}>Official Domain</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--text-dim)" }}>{domain}</div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.12em", color: "var(--text-dimmer)" }}>
            © {new Date().getFullYear()} Yongolailan · {labelName} · All Rights Reserved
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.1em", color: "var(--text-dimmer)" }}>
            DJ · Producer · Live Electronic Performer
          </div>
        </div>
      </div>
    </footer>
  );
}
