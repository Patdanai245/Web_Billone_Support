import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f3f4f6",
      fontFamily: "sans-serif",
    }}>
      <div style={{
        background: "#fff",
        border: "1px solid #f0f0f0",
        borderRadius: 20,
        padding: "28px 24px",
        width: "100%",
        maxWidth: 340,
      }}>

        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: "#eff6ff",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 12,
          }}>
            <svg width="20" height="20" fill="none" stroke="#3b82f6" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M7 16.5a4.5 4.5 0 110-9 4.5 4.5 0 010 9zm10-7a4.5 4.5 0 110 9 4.5 4.5 0 010-9z" />
            </svg>
          </div>
          <p style={{ fontSize: 17, fontWeight: 600, color: "#111", margin: 0 }}>Internal Tools</p>
          <p style={{ fontSize: 12, color: "#9ca3af", margin: "4px 0 0" }}>เลือกเครื่องมือที่ต้องการใช้งาน</p>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>

          <Link href="/compare-text" style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 12px", borderRadius: 12,
            border: "1px solid #f0f0f0",
            textDecoration: "none",
            backgroundColor: "#fff",
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: "#eff6ff",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg width="17" height="17" fill="none" stroke="#3b82f6" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M8 7h8M8 11h5M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#111", margin: 0 }}>Compare Text</p>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0" }}>เปรียบเทียบและหาความต่างของข้อความ</p>
            </div>
            <span style={{
              fontSize: 10, fontWeight: 600,
              padding: "2px 8px", borderRadius: 99,
              background: "#eff6ff", color: "#3b82f6",
            }}>Text</span>
          </Link>

          <Link href="/match_day" style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 12px", borderRadius: 12,
            border: "1px solid #f0f0f0",
            textDecoration: "none",
            backgroundColor: "#fff",
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: "#f0fdf4",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg width="17" height="17" fill="none" stroke="#16a34a" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3 10h18M3 6h18M3 14h10M3 18h6" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#111", margin: 0 }}>Match Day</p>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0" }}>รวมและเรียงข้อมูลจาก Excel หลายชีท</p>
            </div>
            <span style={{
              fontSize: 10, fontWeight: 600,
              padding: "2px 8px", borderRadius: 99,
              background: "#f0fdf4", color: "#16a34a",
            }}>Excel</span>
          </Link>

          <Link href="/recharge_transfer" style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 12px", borderRadius: 12,
            border: "1px solid #f0f0f0",
            textDecoration: "none",
            backgroundColor: "#fff",
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: "#f5f3ff",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg width="17" height="17" fill="none" stroke="#7c3aed" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#111", margin: 0 }}>Recharge Transfer</p>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0" }}>ตรวจสอบประวัติการโอนเงินระหว่างเบอร์</p>
            </div>
            <span style={{
              fontSize: 10, fontWeight: 600,
              padding: "2px 8px", borderRadius: 99,
              background: "#f5f3ff", color: "#7c3aed",
            }}>Transfer</span>
          </Link>

          <Link href="/transaction-details" style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 12px", borderRadius: 12,
            border: "1px solid #f0f0f0",
            textDecoration: "none",
            backgroundColor: "#fff",
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 8,
              background: "#fff7ed",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg width="17" height="17" fill="none" stroke="#ea580c" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 12h6m-3-3v6M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#111", margin: 0 }}>Transaction Details</p>
              <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0" }}>ค้นหารายละเอียด Transaction และ API URL</p>
            </div>
            <span style={{
              fontSize: 10, fontWeight: 600,
              padding: "2px 8px", borderRadius: 99,
              background: "#fff7ed", color: "#ea580c",
            }}>Txn</span>
          </Link>

        </div>

        {/* Footer */}
        <div style={{ borderTop: "1px solid #f0f0f0", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }}></div>
            <span style={{ fontSize: 11, color: "#9ca3af" }}>พร้อมใช้งาน</span>
          </div>
          <span style={{ fontSize: 11, color: "#d1d5db" }}>v 1.0</span>
        </div>

      </div>
    </main>
  );
}