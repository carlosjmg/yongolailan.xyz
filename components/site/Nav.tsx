"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { scrollToSection } from "./shared";

export interface NavItem {
  id: string;
  label: string;
  href?: string;
}

export default function Nav({
  primary,
  secondary,
  logo = "/images/Yongo-logo-blanco.webp",
  logoSize = 40,
  bookingColor = "var(--gold)",
}: {
  primary: NavItem[];
  secondary: NavItem[];
  logo?: string;
  logoSize?: number | string;
  /** Hero colour chosen in the admin, so the Booking pill matches the hero. */
  bookingColor?: string;
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

  // Buttons pick up the global 44px tap-target min-height and centre their
  // label inside it; a plain <a> does not, which left the EPK link sitting
  // ~1px lower than its neighbours. Boxing both the same way keeps every
  // label on one line.
  const navLinkStyle: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.9)",
    cursor: "pointer",
    transition: "color 0.2s",
    padding: "4px 0",
    border: "none",
    background: "none",
    display: "inline-flex",
    alignItems: "center",
    minHeight: "44px",
    lineHeight: "normal",
  };

  const mobileLinkStyle: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: "13px",
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "oklch(72% 0.01 60)",
    padding: "16px 2px",
    borderBottom: "1px solid oklch(18% 0.015 30)",
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    cursor: "pointer",
    background: "none",
    textAlign: "left",
    width: "100%",
    minHeight: "54px",
    display: "flex",
    alignItems: "center",
    lineHeight: "normal",
    textDecoration: "none",
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
          padding: "0 clamp(20px, 4vw, 40px) 0 clamp(2px, 0.5vw, 6px)",
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
          style={{
            height: `${logoSize}px`,
            opacity: 0.95,
            filter: "brightness(1.1)",
            cursor: "pointer",
            // Nudged down ~3.5 mm from the nav centreline, per request.
            transform: "translateY(3.5mm)",
          }}
          onClick={() => handleNav("home")}
        />

        <ul className="nav-desktop" style={{ display: "flex", gap: "28px", alignItems: "center", listStyle: "none" }}>
          {primary.map((item) => {
            const linkColor = active === item.id ? "var(--gold)" : "rgba(255,255,255,0.9)";
            return (
              <li key={item.id}>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ ...navLinkStyle, color: linkColor, textDecoration: "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = linkColor)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    style={{ ...navLinkStyle, color: linkColor }}
                    onClick={() => handleNav(item.id)}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = linkColor)}
                  >
                    {item.label}
                  </button>
                )}
              </li>
            );
          })}

          {/* Desktop-only entry to the label, shown as a single word. */}
          <li>
            <Link
              href="/caribbean-sea-sound"
              style={{ ...navLinkStyle, color: "rgba(255,255,255,0.9)", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
            >
              Label
            </Link>
          </li>
        </ul>

        {/* Menu toggle — three waves (≋) that ripple continuously, crossing
            into an X when open. */}
        <button
          className="hamburger-btn"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            background: "none",
            border: "none",
            padding: "8px",
          }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.7"
            strokeLinecap="round"
            aria-hidden
          >
            {mobileOpen ? (
              <>
                <path d="M5 5 L19 19" />
                <path d="M19 5 L5 19" />
              </>
            ) : (
              [6.5, 12, 17.5].map((y, i) => (
                <path
                  key={y}
                  className="wave-line"
                  style={{ animationDelay: `${i * 0.22}s` }}
                  d={`M1.5 ${y} q 2.6 -2.4 5.25 0 t 5.25 0 t 5.25 0 t 5.25 0`}
                />
              ))
            )}
          </svg>
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
          {/* Booking sits first on phones, above the rest of the menu. */}
          <button
            onClick={() => handleNav("contact")}
            style={{
              alignSelf: "flex-start",
              marginBottom: "24px",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: bookingColor,
              background: "transparent",
              padding: "15px 38px",
              border: `1px solid ${bookingColor}`,
              borderRadius: "999px",
              cursor: "pointer",
              minHeight: "50px",
            }}
          >
            Booking
          </button>

          {primary.map((item) =>
            item.href ? (
              <a key={item.id} href={item.href} target="_blank" rel="noopener noreferrer" style={mobileLinkStyle}>
                {item.label}
              </a>
            ) : (
              <button key={item.id} style={mobileLinkStyle} onClick={() => handleNav(item.id)}>
                {item.label}
              </button>
            )
          )}
          {secondary.map((item) => (
            <button key={item.id} style={mobileLinkStyle} onClick={() => handleNav(item.id)}>
              {item.label}
            </button>
          ))}

          {/* The label lives on its own page. This and the Catalog link are
              the only two ways in on phones. */}
          <Link href="/caribbean-sea-sound" style={{ ...mobileLinkStyle, color: "var(--gold)" }} onClick={() => setMobileOpen(false)}>
            Caribbean Sea Sound →
          </Link>
        </div>
      )}
    </>
  );
}
