import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/client";

export default function ProfileEditor({ onClose }) {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getProfile().then(setProfile);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await updateProfile(profile);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!profile) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "fadeIn 0.2s ease both",
      }}
    >
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: 32,
          width: "90%",
          maxWidth: 520,
          animation: "fadeUp 0.3s ease both",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20 }}>
            <i
              className="fa-solid fa-sliders"
              style={{ marginRight: 10, color: "var(--accent)" }}
            />
            Your Stack Profile
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--muted)",
              fontSize: 18,
            }}
          >
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        <label style={{ display: "block", marginBottom: 16 }}>
          <div
            style={{
              fontSize: 12,
              color: "var(--muted)",
              marginBottom: 6,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            TECH STACK (comma separated)
          </div>
          <input
            value={profile.stack}
            onChange={(e) => setProfile({ ...profile, stack: e.target.value })}
            style={{
              width: "100%",
              padding: "10px 14px",
              background: "var(--surface2)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--text)",
              fontSize: 14,
              fontFamily: "'JetBrains Mono', monospace",
              outline: "none",
            }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 16 }}>
          <div
            style={{
              fontSize: 12,
              color: "var(--muted)",
              marginBottom: 6,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            INTERESTS (comma separated)
          </div>
          <input
            value={profile.interests}
            onChange={(e) =>
              setProfile({ ...profile, interests: e.target.value })
            }
            style={{
              width: "100%",
              padding: "10px 14px",
              background: "var(--surface2)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              color: "var(--text)",
              fontSize: 14,
              fontFamily: "'JetBrains Mono', monospace",
              outline: "none",
            }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 24 }}>
          <div
            style={{
              fontSize: 12,
              color: "var(--muted)",
              marginBottom: 6,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            RELEVANCE THRESHOLD (0-10) — current: {profile.relevance_threshold}
          </div>
          <input
            type="range"
            min={0}
            max={10}
            step={1}
            value={profile.relevance_threshold}
            onChange={(e) =>
              setProfile({
                ...profile,
                relevance_threshold: parseInt(e.target.value),
              })
            }
            style={{ width: "100%", accentColor: "var(--accent)" }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              color: "var(--muted)",
              marginTop: 4,
            }}
          >
            <span>show everything</span>
            <span>highly selective</span>
          </div>
        </label>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: "100%",
            padding: "12px",
            background: saved
              ? "linear-gradient(135deg, var(--accent3), #4af7a0)"
              : "linear-gradient(135deg, var(--accent), #9b8cfa)",
            border: "none",
            borderRadius: 8,
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            transition: "background 0.3s ease",
          }}
        >
          {saved ? "✓ Saved!" : saving ? "Saving..." : "Save Profile"}
        </button>

        <p
          style={{
            fontSize: 12,
            color: "var(--muted)",
            textAlign: "center",
            marginTop: 12,
          }}
        >
          Changes apply on next ingestion cycle
        </p>
      </div>
    </div>
  );
}
