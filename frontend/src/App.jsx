import { useState, useEffect } from "react";
import FeedList from "./components/FeedList";
import SearchBar from "./components/SearchBar";
import AlertBanner from "./components/AlertBanner";
import ProfileEditor from "./components/ProfileEditor";
import "./index.css";

const tabs = [
  { id: "feed", label: "All Feed", icon: "fa-signal" },
  { id: "processed", label: "Filtered", icon: "fa-filter" },
  { id: "digest", label: "Digest", icon: "fa-newspaper" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("processed");
  const [searchResults, setSearchResults] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 20px 60px" }}>
      <header
        style={{
          padding: "36px 0 28px",
          borderBottom: `1px solid var(--border)`,
          marginBottom: 32,
          animation: mounted ? "fadeUp 0.5s ease both" : "none",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  background:
                    "linear-gradient(135deg, var(--accent), var(--accent2))",
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                ✂
              </div>
              <h1
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 28,
                  fontWeight: 800,
                  letterSpacing: "-0.5px",
                  background:
                    "linear-gradient(90deg, var(--text), var(--accent))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                NoiseCut
              </h1>
            </div>
            <p
              style={{
                color: "var(--muted)",
                fontSize: 13,
                marginTop: 6,
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              signal / noise → ∞
            </p>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {["HN", "GH", "arXiv", "dev"].map((s, i) => (
              <span
                key={s}
                style={{
                  fontSize: 11,
                  padding: "3px 8px",
                  borderRadius: 4,
                  border: "1px solid var(--border)",
                  color: "var(--muted)",
                  fontFamily: "'JetBrains Mono', monospace",
                  animation: `fadeIn 0.4s ease ${i * 0.1}s both`,
                }}
              >
                {s}
              </span>
            ))}
            <button
              onClick={() => setShowProfile(true)}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--muted)",
                padding: "6px 14px",
                borderRadius: 7,
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "border-color 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "var(--accent)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "var(--border)")
              }
            >
              <i className="fa-solid fa-sliders" />
              Stack
            </button>
          </div>
        </div>
      </header>

      <AlertBanner />

      <SearchBar
        onResults={setSearchResults}
        onClear={() => setSearchResults(null)}
      />

      {searchResults ? (
        <SearchResults results={searchResults} />
      ) : (
        <>
          <div
            style={{
              display: "flex",
              gap: 4,
              marginBottom: 28,
              background: "var(--surface)",
              padding: 4,
              borderRadius: 10,
              border: "1px solid var(--border)",
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: 1,
                  padding: "8px 16px",
                  background:
                    activeTab === tab.id
                      ? "linear-gradient(135deg, var(--accent), #9b8cfa)"
                      : "transparent",
                  color: activeTab === tab.id ? "#fff" : "var(--muted)",
                  border: "none",
                  borderRadius: 7,
                  fontSize: 13,
                  fontWeight: 500,
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 7,
                }}
              >
                <i
                  className={`fa-solid ${tab.icon}`}
                  style={{ fontSize: 11 }}
                />
                {tab.label}
              </button>
            ))}
          </div>
          <FeedList tab={activeTab} />
        </>
      )}

      {showProfile && <ProfileEditor onClose={() => setShowProfile(false)} />}
    </div>
  );
}

function SearchResults({ results }) {
  return (
    <div style={{ animation: "fadeUp 0.3s ease both" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18 }}>
          Search Results
        </h3>
        <span
          style={{
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            padding: "2px 10px",
            borderRadius: 20,
            fontSize: 12,
            color: "var(--muted)",
          }}
        >
          {results.length} found
        </span>
      </div>
      {results.map((r, i) => (
        <div
          key={i}
          style={{
            borderBottom: "1px solid var(--border)",
            padding: "14px 0",
            animation: `fadeUp 0.3s ease ${i * 0.05}s both`,
          }}
        >
          <a
            href={r.metadata.url}
            target="_blank"
            rel="noreferrer"
            style={{ fontSize: 15, fontWeight: 500, color: "var(--text)" }}
            onMouseEnter={(e) => (e.target.style.color = "var(--accent)")}
            onMouseLeave={(e) => (e.target.style.color = "var(--text)")}
          >
            {r.metadata.title}
          </a>
          <div
            style={{
              fontSize: 11,
              color: "var(--muted)",
              marginTop: 4,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {r.metadata.source} · similarity: {(1 - r.distance).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
