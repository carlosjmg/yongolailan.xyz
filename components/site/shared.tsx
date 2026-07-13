"use client";

import React, { useState } from "react";

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY - 64;
    window.scrollTo({ top, behavior: "smooth" });
  }
}

export function CTAButton({
  label,
  primary,
  to,
  href,
}: {
  label: string;
  primary?: boolean;
  to?: string;
  href?: string;
}) {
  const [hover, setHover] = useState(false);
  const style: React.CSSProperties = {
    fontFamily: "var(--font-mono)",
    fontSize: "11px",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    padding: "13px 28px",
    border: primary ? "none" : "1px solid oklch(35% 0.015 30)",
    borderRadius: "2px",
    background: primary
      ? hover
        ? "oklch(65% 0.14 60)"
        : "var(--gold)"
      : hover
        ? "oklch(18% 0.018 30)"
        : "transparent",
    color: primary ? "oklch(8% 0.018 30)" : hover ? "var(--text)" : "var(--text-dim)",
    cursor: "pointer",
    transition: "all 0.2s",
    fontWeight: primary ? 500 : 400,
    display: "inline-block",
    textDecoration: "none",
    lineHeight: 1.2,
  };
  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
  };
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={style} {...handlers}>
        {label}
      </a>
    );
  }
  return (
    <button type="button" style={style} {...handlers} onClick={() => to && scrollToSection(to)}>
      {label}
    </button>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  light,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <div style={{ marginBottom: "clamp(40px, 5vw, 64px)" }}>
      {eyebrow && (
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--gold)",
            marginBottom: "14px",
          }}
        >
          {eyebrow}
        </div>
      )}
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(36px, 5vw, 72px)",
          fontWeight: 300,
          lineHeight: 1,
          color: light ? "oklch(95% 0.005 60)" : "var(--text)",
          letterSpacing: "-0.01em",
          marginBottom: subtitle ? "16px" : 0,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(14px, 1.4vw, 17px)",
            color: "var(--text-dim)",
            maxWidth: "560px",
            lineHeight: 1.7,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function EyebrowLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "10px",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: "var(--gold)",
        marginBottom: "16px",
        paddingBottom: "8px",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {children}
    </div>
  );
}

export function Section({
  id,
  dark,
  children,
  style,
}: {
  id?: string;
  dark?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <section
      id={id}
      data-section
      style={{
        padding: "clamp(72px, 8vw, 112px) clamp(20px, 6vw, 80px)",
        background: dark ? "var(--bg2)" : "var(--bg)",
        maxWidth: "1400px",
        margin: "0 auto",
        width: "100%",
        ...style,
      }}
    >
      {children}
    </section>
  );
}

export function SectionFullWidth({
  id,
  dark,
  children,
  style,
}: {
  id?: string;
  dark?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div id={id} data-section style={{ background: dark ? "var(--bg2)" : "var(--bg)", ...style }}>
      <div
        style={{
          padding: "clamp(72px, 8vw, 112px) clamp(20px, 6vw, 80px)",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export function DownloadRow({ label, icon = "↓", href }: { label: string; icon?: string; href?: string }) {
  const [hover, setHover] = useState(false);
  const inner = (
    <>
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "13px",
          color: hover ? "var(--text)" : "var(--text-dim)",
        }}
      >
        {label}
      </span>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--gold)" }}>{icon}</span>
    </>
  );
  const style: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    background: hover ? "var(--bg3)" : "var(--bg)",
    border: "1px solid",
    borderColor: hover ? "oklch(30% 0.015 30)" : "var(--border)",
    cursor: "pointer",
    transition: "all 0.2s",
    textDecoration: "none",
  };
  const handlers = { onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false) };
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={style} {...handlers}>
        {inner}
      </a>
    );
  }
  return (
    <div style={style} {...handlers}>
      {inner}
    </div>
  );
}
