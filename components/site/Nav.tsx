"use client";

import React, { useEffect, useState } from "react";
import { scrollToSection } from "./shared";

export interface NavItem {
  id: string;
  label: string;
}

export default function Nav({
  primary,
  secondary,
  logo = "/images/Yongo-logo-blanco.webp",
}: {
  primary: NavItem[];
  secondary: NavItem[];
  logo?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = primary.map((n) => n.id);
    const onScroll = () => {
      const offset = 100;
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.getBoundingClientRect().top < offset) {
          setActive(ids[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [primary]);

  const handleNav = (id: string) => {
    setMobileOpen(false);
    scrollToSection(id);
  };

  const navLinkStyle: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "var(--text-dim)",
    cursor: "pointer",
    transition: "color 0.2s",
    padding: "4px 0",
    border: "none",
    background: "none",
  };

  const mobileLinkStyle: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: "13px",
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "oklch(72% 0.01 60)",
    padding: "18px 0",
    borderBottom: "1px solid oklch(18% 0.015 30)",
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    cursor: "pointer",
    background: "none",
    textAlign: "left",
    width: "100%",
    minHeight: "52px",
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 clamp(20px, 4vw, 40px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
          transition: "background 0.4s, border-color 0.4s",
          ...(scrolled
            ? {
                background: "oklch(8% 0.018 30 / 0.94)",
                backdropFilter: "blur(16px)",
                borderBottom: "1px solid oklch(22% 0.015 30)",
              }
            : {}),
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo}
          alt="Yongolailan"
          style={{ height: "28px", opacity: 0.95, filter: "brightness(1.1)", cursor: "pointer" }}
          onClick={() => handleNav("home")}
        />

        <ul className="nav-desktop" style={{ display: "flex", gap: "28px", alignItems: "center", listStyle: "none" }}>
          {primary.map((item) => (
            <li key={item.id}>
              <button
                style={{ ...navLinkStyle, color: active === item.id ? "var(--gold)" : undefined }}
                onClick={() => handleNav(item.id)}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = active === item.id ? "var(--gold)" : "var(--text-dim)")
                }
              >
                {item.label}
              </button>
            </li>
          ))}
          <li style={{ paddingLeft: "8px", borderLeft: "1px solid var(--border)", marginLeft: "4px" }}>
            <button
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "oklch(8% 0.018 30)",
                background: "var(--gold)",
                padding: "8px 18px",
                border: "none",
                borderRadius: "2px",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onClick={() => handleNav("contact")}
              onMouseEnter={(e) => (e.currentTarget.style.background = "oklch(65% 0.14 60)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--gold)")}
            >
              Booking
            </button>
          </li>
        </ul>

        <button
          className="hamburger-btn"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            cursor: "pointer",
            background: "none",
            border: "none",
            padding: "8px",
          }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span
            style={{
              width: "24px",
              height: "1.5px",
              background: "var(--text)",
              transition: "all 0.3s",
              transform: mobileOpen ? "rotate(45deg) translate(4px, 4px)" : "none",
            }}
          />
          <span
            style={{ width: "24px", height: "1.5px", background: "var(--text)", transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }}
          />
          <span
            style={{
              width: "24px",
              height: "1.5px",
              background: "var(--text)",
              transition: "all 0.3s",
              transform: mobileOpen ? "rotate(-45deg) translate(4px, -4px)" : "none",
            }}
          />
        </button>
      </nav>

      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            top: "64px",
            left: 0,
            right: 0,
            bottom: 0,
            background: "oklch(8% 0.018 30 / 0.98)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid oklch(22% 0.015 30)",
            padding: "24px clamp(24px, 7vw, 40px) 40px",
            zIndex: 99,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          {primary.map((item) => (
            <button key={item.id} style={mobileLinkStyle} onClick={() => handleNav(item.id)}>
              {item.label}
            </button>
          ))}
          {secondary.map((item) => (
            <button key={item.id} style={{ ...mobileLinkStyle, color: "oklch(50% 0.01 60)" }} onClick={() => handleNav(item.id)}>
              {item.label}
            </button>
          ))}
          <button
            style={{
              marginTop: "20px",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "oklch(8% 0.018 30)",
              background: "var(--gold)",
              padding: "16px 20px",
              border: "none",
              borderRadius: "2px",
              cursor: "pointer",
              fontWeight: 500,
            }}
            onClick={() => handleNav("contact")}
          >
            Booking →
          </button>
        </div>
      )}
    </>
  );
}
