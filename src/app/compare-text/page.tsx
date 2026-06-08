"use client";

import { useState, useEffect } from "react";

type CompareResult = {
  added: string[];
  removed: string[];
  same: string[];
  changed: boolean;
};

function normalizeWord(word: string) {
  return word.trim().replace(/\s+/g, " ").replace(/,+$/, "");
}

function splitWords(text: string) {
  return text.split(/[\s,]+/).map(normalizeWord).filter((w) => w.length > 0);
}

function compareWords(before: string, after: string): CompareResult {
  const beforeWords = new Set(splitWords(before));
  const afterWords = new Set(splitWords(after));
  const added: string[] = [];
  const removed: string[] = [];
  const same: string[] = [];
  afterWords.forEach((w) => (beforeWords.has(w) ? same.push(w) : added.push(w)));
  beforeWords.forEach((w) => { if (!afterWords.has(w)) removed.push(w); });
  return { added, removed, same, changed: added.length > 0 || removed.length > 0 };
}

const s = {
  page: { minHeight: "100vh", background: "#f3f4f6", padding: "32px 24px", fontFamily: "sans-serif" },
  container: { maxWidth: 900, margin: "0 auto" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 } as React.CSSProperties,
  headerLeft: { display: "flex", alignItems: "center", gap: 12 },
  hicon: { width: 38, height: 38, borderRadius: 10, background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center" },
  htitle: { fontSize: 17, fontWeight: 600, color: "#111", margin: 0 },
  hsub: { fontSize: 12, color: "#9ca3af", marginTop: 2 },
  clearBtn: { display: "flex", alignItems: "center", gap: 6, fontSize: 12, padding: "7px 14px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", color: "#6b7280", cursor: "pointer" },
  editors: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 } as React.CSSProperties,
  editorCard: { background: "#fff", border: "1px solid #f0f0f0", borderRadius: 14, overflow: "hidden" },
  editorHead: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid #f5f5f5" } as React.CSSProperties,
  editorLabel: { fontSize: 12, fontWeight: 600, color: "#6b7280", display: "flex", alignItems: "center", gap: 6 },
  uploadBtn: { fontSize: 11, padding: "4px 10px", borderRadius: 6, border: "1px solid #e5e7eb", background: "transparent", color: "#9ca3af", cursor: "pointer" },
  textarea: { width: "100%", minHeight: 140, padding: "12px 14px", fontSize: 12, fontFamily: "monospace", border: "none", outline: "none", resize: "vertical", background: "transparent", color: "#374151", lineHeight: 1.7 } as React.CSSProperties,
};

export default function CommandComparePage() {
  const [before, setBefore] = useState("");
  const [after, setAfter] = useState("");
  const [result, setResult] = useState<CompareResult>({ added: [], removed: [], same: [], changed: false });

  useEffect(() => { setResult(compareWords(before, after)); }, [before, after]);

  const handleClear = () => { setBefore(""); setAfter(""); setResult({ added: [], removed: [], same: [], changed: false }); };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>, set: React.Dispatch<React.SetStateAction<string>>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => set(ev.target?.result as string);
    reader.readAsText(file);
  };

  const Tag = ({ label, bg, color }: { label: string; bg: string; color: string }) => (
    <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 5, background: bg, color, fontSize: 11, margin: "2px 3px 2px 0", fontFamily: "monospace" }}>
      {label}
    </span>
  );

  const ResultCard = ({
    icon, title, items, bg, color, countBg, countColor,
  }: { icon: string; title: string; items: string[]; bg: string; color: string; countBg: string; countColor: string }) => (
    <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: 14, padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 16 }}>{icon}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color }}>{title}</span>
        <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: countBg, color: countColor }}>
          {items.length}
        </span>
      </div>
      <div style={{ lineHeight: 1.8 }}>
        {items.length === 0
          ? <span style={{ fontSize: 12, color: "#d1d5db" }}>ไม่มี</span>
          : items.map((w) => <Tag key={w} label={w} bg={bg} color={color} />)
        }
      </div>
    </div>
  );

  return (
    <main style={s.page}>
      <div style={s.container}>

        {/* Header */}
        <div style={s.header}>
          <div style={s.headerLeft}>
            <div style={s.hicon}>
              <svg width="19" height="19" fill="none" stroke="#3b82f6" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8M8 11h5M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
              </svg>
            </div>
            <div>
              <p style={s.htitle}>Compare Text</p>
              <p style={s.hsub}>เปรียบเทียบและหาความต่างของข้อความ</p>
            </div>
          </div>
          <button onClick={handleClear} style={s.clearBtn}>
            ↺ เคลียร์ทั้งหมด
          </button>
        </div>

        {/* Editors */}
        <div style={s.editors}>
          {[
            { label: "ก่อน", badge: "Before", badgeBg: "#eff6ff", badgeColor: "#1d4ed8", val: before, set: setBefore },
            { label: "หลัง", badge: "After", badgeBg: "#f0fdf4", badgeColor: "#15803d", val: after, set: setAfter },
          ].map(({ label, badge, badgeBg, badgeColor, val, set }) => (
            <div key={label} style={s.editorCard}>
              <div style={s.editorHead}>
                <div style={s.editorLabel}>
                  {label}
                  <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: badgeBg, color: badgeColor }}>{badge}</span>
                </div>
                <label style={s.uploadBtn}>
                  ↑ อัปโหลด .txt
                  <input type="file" accept=".txt" style={{ display: "none" }} onChange={(e) => handleFile(e, set)} />
                </label>
              </div>
              <textarea
                placeholder={`วางข้อความ ${label}...`}
                value={val}
                onChange={(e) => set(e.target.value)}
                style={s.textarea}
              />
            </div>
          ))}
        </div>

        {/* Status */}
        {(before || after) && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 16px",
            borderRadius: 12, marginBottom: 12,
            background: result.changed ? "#fef2f2" : "#f0fdf4",
            border: `1px solid ${result.changed ? "#fecaca" : "#bbf7d0"}`,
          }}>
            <span style={{ fontSize: 15 }}>{result.changed ? "🔴" : "🟢"}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: result.changed ? "#dc2626" : "#16a34a" }}>
              {result.changed ? "มีการเปลี่ยนแปลง" : "เหมือนกันทุกอย่าง"}
            </span>
            {result.changed && (
              <span style={{ fontSize: 12, color: "#dc2626" }}>
                — เพิ่ม {result.added.length} / หาย {result.removed.length} รายการ
              </span>
            )}
          </div>
        )}

        {/* Results */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <ResultCard icon="➕" title="เพิ่มเข้ามา" items={result.added}
            bg="#f0fdf4" color="#15803d" countBg="#dcfce7" countColor="#15803d" />
          <ResultCard icon="➖" title="หายไป" items={result.removed}
            bg="#fef2f2" color="#dc2626" countBg="#fee2e2" countColor="#dc2626" />
          <ResultCard icon="✔" title="เหมือนกัน" items={result.same}
            bg="#f9fafb" color="#6b7280" countBg="#f3f4f6" countColor="#6b7280" />
        </div>

      </div>
    </main>
  );
}