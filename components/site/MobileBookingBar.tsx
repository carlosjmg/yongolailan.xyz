"use client";

import React, { useEffect, useState } from "react";
import { scrollToSection } from "./shared";

export default function MobileBookingBar({ email }: { email: string }) {
  const [visible, setVisible] = useState(false);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.8);
      const contact = document.getElementById("contact");
      if (contact) {
        const r = contact.getBoundingClientRect();
        setNear(r.top < window.innerHeight && r.bottom > 0);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const show = visible && !near;

  return (
    <div
      className="mobile-booking-bar"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        display: "none",
        background: "oklch(8% 0.018 30 / 0.96)",
        backdropFilter: "blur(16px)",
        borderTop: "1px solid var(--border)",
        padding: "10px 14px calc(10px + env(safe-area-inset-bottom))",
        gap: "8px",
        transform: show ? "translateY(0)" : "translateY(110%)",
        transition: "transform 0.3s ease",
      }}
    >
      <a
        href={`mailto:${email}`}
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "48px",
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "var(--text)",
          textDecoration: "none",
          border: "1px solid var(--border)",
          borderRadius: "2px",
        }}
      >
        Email
      </a>
      <button
        onClick={() => scrollToSection("contact")}
        style={{
          flex: 1.4,
          minHeight: "48px",
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "oklch(8% 0.018 30)",
          background: "var(--gold)",
          border: "none",
          borderRadius: "2px",
          cursor: "pointer",
          fontWeight: 500,
        }}
      >
        Booking →
      </button>
    </div>
  );
}
