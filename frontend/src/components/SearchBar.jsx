import { useState } from "react";
import { searchFeed } from "../api/client";

export default function SearchBar({ onResults, onClear }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await searchFeed(query);
      onResults(data.results);
    } catch (err) {
      console.error("Search failed:", err);
      onResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    onClear();
  };

  return (
    <div style={{ marginBottom: 28, animation: "fadeUp 0.4s ease 0.1s both" }}>
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: 4,
          background: "var(--surface)",
          border: `1px solid ${focused ? "var(--accent)" : "var(--border)"}`,
          borderRadius: 10,
          transition: "border-color 0.2s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            paddingLeft: 12,
            color: "var(--muted)",
          }}
        >
          {loading ? (
            <i
              className="fa-solid fa-spinner fa-spin"
              style={{ fontSize: 13 }}
            />
          ) : (
            <i
              className="fa-solid fa-magnifying-glass"
              style={{ fontSize: 13 }}
            />
          )}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search across your feed... 'quantization papers', 'vLLM changes'"
          style={{
            flex: 1,
            padding: "10px 4px",
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--text)",
            fontSize: 14,
            fontFamily: "'Inter', sans-serif",
          }}
        />
        {query && (
          <button
            onClick={handleClear}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--muted)",
              padding: "0 8px",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            <i className="fa-solid fa-xmark" />
          </button>
        )}
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          style={{
            background: "linear-gradient(135deg, var(--accent), #9b8cfa)",
            border: "none",
            color: "#fff",
            padding: "8px 18px",
            borderRadius: 7,
            fontSize: 13,
            fontWeight: 500,
            cursor: loading || !query.trim() ? "not-allowed" : "pointer",
            opacity: !query.trim() ? 0.5 : 1,
            transition: "opacity 0.2s ease",
          }}
        >
          Search
        </button>
      </div>
      <div
        style={{
          fontSize: 11,
          color: "var(--muted)",
          marginTop: 8,
          paddingLeft: 4,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        semantic search · powered by sentence-transformers + chromadb
      </div>
    </div>
  );
}
