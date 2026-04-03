import { useEffect, useState } from "react";
import { getProcessedFeed } from "../api/client";
import useWebSocket from "../hooks/useWebSocket";

export default function AlertBanner() {
  const [dbAlerts, setDbAlerts] = useState([]);
  const { alerts: liveAlerts, dismissAlert } = useWebSocket();

  useEffect(() => {
    getProcessedFeed().then((data) => {
      setDbAlerts((data.items || []).filter((i) => i.is_breaking_change));
    });
  }, []);

  const allAlerts = [...liveAlerts, ...dbAlerts];
  if (!allAlerts.length) return null;

  return (
    <div
      style={{
        background: "rgba(247,92,106,0.08)",
        border: "1px solid rgba(247,92,106,0.25)",
        borderRadius: 8,
        padding: "12px 16px",
        marginBottom: 20,
        animation: "slideIn 0.3s ease both",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "var(--accent2)",
          fontWeight: 600,
          fontSize: 13,
          marginBottom: 8,
        }}
      >
        <i className="fa-solid fa-triangle-exclamation" />
        Breaking Changes
        {liveAlerts.length > 0 && (
          <span
            style={{
              background: "var(--accent2)",
              color: "#fff",
              fontSize: 10,
              padding: "1px 6px",
              borderRadius: 10,
              animation: "pulse 1.5s infinite",
            }}
          >
            LIVE
          </span>
        )}
      </div>

      {liveAlerts.map((a, i) => (
        <div
          key={`live-${i}`}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "4px 0",
            animation: "slideIn 0.3s ease both",
          }}
        >
          <a
            href={a.url}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: 13, color: "#e8a0a6" }}
          >
            🔴 {a.title}
          </a>
          <button
            onClick={() => dismissAlert(i)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--muted)",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      ))}

      {dbAlerts.map((a) => (
        <a
          key={a.id}
          href={a.url}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "block",
            fontSize: 13,
            color: "#e8a0a6",
            padding: "3px 0",
          }}
        >
          → {a.title}
        </a>
      ))}
    </div>
  );
}
