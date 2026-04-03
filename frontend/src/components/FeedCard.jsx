import { useState } from "react";

const SOURCE_CONFIG = {
  hackernews: {
    color: "#ff6600",
    bg: "rgba(255,102,0,0.12)",
    icon: "fa-y-combinator",
    label: "HN",
  },
  github: {
    color: "#7c6af7",
    bg: "rgba(124,106,247,0.12)",
    icon: "fa-github",
    label: "GH",
  },
  arxiv: {
    color: "#e53e3e",
    bg: "rgba(229,62,62,0.12)",
    icon: "fa-graduation-cap",
    label: "arXiv",
  },
  devto: {
    color: "#3b49df",
    bg: "rgba(59,73,223,0.12)",
    icon: "fa-dev",
    label: "dev.to",
  },
};

export default function FeedCard({ item, index }) {
  const [hovered, setHovered] = useState(false);
  const src = SOURCE_CONFIG[item.source] || {
    color: "#888",
    bg: "rgba(136,136,136,0.12)",
    icon: "fa-globe",
    label: item.source,
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderBottom: "1px solid var(--border)",
        padding: "16px 14px",
        borderRadius: 8,
        marginBottom: 2,
        background: hovered ? "var(--surface)" : "transparent",
        borderLeft: item.is_breaking_change
          ? "3px solid var(--accent2)"
          : "3px solid transparent",
        transition: "background 0.15s ease",
        animation: `fadeUp 0.4s ease ${Math.min(index * 0.04, 0.4)}s both`,
        cursor: "default",
      }}
    >
      {/* Breaking change badge */}
      {item.is_breaking_change && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            background: "rgba(247,92,106,0.15)",
            border: "1px solid rgba(247,92,106,0.3)",
            color: "var(--accent2)",
            fontSize: 10,
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: 4,
            marginBottom: 8,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: 1,
          }}
        >
          <i className="fa-solid fa-triangle-exclamation" />
          BREAKING CHANGE
        </div>
      )}

      {/* Title */}
      <a href={item.url} target="_blank" rel="noreferrer">
        <div
          style={{
            fontSize: 15,
            fontWeight: 500,
            lineHeight: 1.4,
            color: hovered ? "var(--accent)" : "var(--text)",
            transition: "color 0.15s ease",
            marginBottom: 8,
          }}
        >
          {item.title}
        </div>
      </a>

      {/* Meta row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            background: src.bg,
            color: src.color,
            padding: "3px 8px",
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 600,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          <i className={`fa-brands ${src.icon}`} style={{ fontSize: 10 }} />
          {src.label}
        </span>

        {item.relevance_score && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              color: "var(--muted)",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <i
              className="fa-solid fa-chart-simple"
              style={{ fontSize: 9, color: "var(--accent3)" }}
            />
            {item.relevance_score}/10
          </span>
        )}

        {item.author && item.source !== "github" && (
          <span style={{ fontSize: 11, color: "var(--muted)" }}>
            · {item.author}
          </span>
        )}

        {item.published_at && (
          <span
            style={{ fontSize: 11, color: "var(--muted)", marginLeft: "auto" }}
          >
            {new Date(item.published_at).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Summary */}
      {item.summary && !item.summary.includes("not available") && (
        <div
          style={{
            marginTop: 10,
            padding: "10px 12px",
            background: "var(--surface2)",
            borderRadius: 6,
            fontSize: 13,
            color: "#a0a0b8",
            lineHeight: 1.6,
            borderLeft: "2px solid var(--border)",
          }}
        >
          {item.summary}
        </div>
      )}
    </div>
  );
}
