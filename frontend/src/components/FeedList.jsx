import { useEffect, useState } from "react";
import FeedCard from "./FeedCard";
import { getFeed, getProcessedFeed, getDigest } from "../api/client";

function SkeletonCard() {
  return (
    <div style={{ padding: "16px 0", borderBottom: "1px solid var(--border)" }}>
      {[80, 60, 40].map((w, i) => (
        <div
          key={i}
          style={{
            height: i === 0 ? 16 : 12,
            width: `${w}%`,
            borderRadius: 4,
            marginBottom: 8,
            background:
              "linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
          }}
        />
      ))}
    </div>
  );
}

export default function FeedList({ tab }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setItems([]);
    const fetcher =
      tab === "feed"
        ? getFeed
        : tab === "processed"
          ? getProcessedFeed
          : getDigest;
    fetcher().then((data) => {
      setItems(data.items || []);
      setLoading(false);
    });
  }, [tab]);

  if (loading)
    return (
      <div>
        {[...Array(5)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );

  if (!items.length)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 0",
          color: "var(--muted)",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 13,
        }}
      >
        <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
        No items yet. Ingestion runs every 30 minutes.
      </div>
    );

  return (
    <div>
      <div
        style={{
          fontSize: 12,
          color: "var(--muted)",
          marginBottom: 16,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {items.length} items
      </div>
      {items.map((item, i) => (
        <FeedCard key={item.id} item={item} index={i} />
      ))}
    </div>
  );
}
