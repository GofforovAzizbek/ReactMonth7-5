import { useEffect } from "react";
/* eslint-disable react-refresh/only-export-components */
import { Icon } from "./icons";

// ─── Stat Card ────────────────────────────────────────────────────────────────
export function StatCard({ label, value, sub, accent }) {
  return (
    <div
      style={{
        background: "#111",
        border: "1px solid rgba(255,255,255,0.07)",
        padding: "20px 24px",
        fontFamily: "'DM Mono', 'Courier New', monospace",
      }}
    >
      <p
        style={{
          margin: "0 0 6px",
          color: "rgba(255,255,255,0.35)",
          fontSize: 9,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: "0 0 4px",
          color: accent || "#fff",
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "-1px",
        }}
      >
        {value}
      </p>
      <p style={{ margin: 0, color: "rgba(255,255,255,0.25)", fontSize: 10 }}>
        {sub}
      </p>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const map = {
    pending: {
      bg: "rgba(250,204,21,0.1)",
      color: "#facc15",
      border: "rgba(250,204,21,0.2)",
      label: "Pending",
    },
    delivered: {
      bg: "rgba(74,222,128,0.1)",
      color: "#4ade80",
      border: "rgba(74,222,128,0.2)",
      label: "Delivered",
    },
    cancelled: {
      bg: "rgba(248,113,113,0.1)",
      color: "#f87171",
      border: "rgba(248,113,113,0.2)",
      label: "Cancelled",
    },
  };
  const s = map[status] || map.pending;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        fontSize: 10,
        fontFamily: "'DM Mono', monospace",
        letterSpacing: "0.05em",
      }}
    >
      {s.label}
    </span>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.75)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#111",
          border: "1px solid rgba(255,255,255,0.1)",
          width: "100%",
          maxWidth: 480,
          animation: "fadeUp 0.2s ease forwards",
          fontFamily: "'DM Mono', 'Courier New', monospace",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <p
            style={{ margin: 0, color: "#fff", fontSize: 13, fontWeight: 600 }}
          >
            {title}
          </p>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.4)",
              cursor: "pointer",
              padding: 4,
            }}
          >
            <Icon.x />
          </button>
        </div>
        <div style={{ padding: 20 }}>{children}</div>
      </div>
    </div>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────
export function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label
        style={{
          display: "block",
          fontSize: 9,
          color: "rgba(255,255,255,0.35)",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          marginBottom: 6,
          fontFamily: "'DM Mono', monospace",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

// ─── Shared input style ───────────────────────────────────────────────────────
export const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#fff",
  fontFamily: "'DM Mono', monospace",
  fontSize: 12,
  padding: "10px 12px",
  outline: "none",
};
