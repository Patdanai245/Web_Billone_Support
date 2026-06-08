"use client";

import * as XLSX from "xlsx";
import FileSaver from "file-saver";
import { useState } from "react";

const { saveAs } = FileSaver;

const REQUIRED_COLUMNS = [
  "Create Date",
  "MSISDN / Incident ID",
  "Range IMSI",
  "Group Case",
  "Subcase",
  "Description",
  "Type",
  "System",
  "Solution",
  "Status",
  "Closed Date",
  "Assignee",
  "Contact",
  "Remark",
];

const getCellVal = (ws: XLSX.WorkSheet, col: string, row: number): any => {
  const cell = ws[`${col}${row}`];
  if (!cell) return "";
  return cell.v ?? "";
};

// แก้ไขหลัก: cellDates:false → val จะเป็น serial number เสมอ
// ใช้ XLSX.SSF.parse_date_code แปลงโดยตรง ไม่ผ่าน Date object เลย
const formatDate = (val: any): string => {
  if (!val) return "";

  // serial number (cellDates:false ส่งมาแบบนี้เสมอ)
  if (typeof val === "number" && val > 40000) {
    const p = XLSX.SSF.parse_date_code(val);
    if (p) return `${p.d}/${p.m}/${p.y}`;
  }

  // string ที่เป็น d/m/yyyy อยู่แล้ว
  const s = String(val).trim();
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s)) return s;

  // ISO string เช่น "2026-05-05" → แปลงแบบ UTC
  const d = new Date(s);
  if (!isNaN(d.getTime()) && d.getUTCFullYear() > 2000) {
    return `${d.getUTCDate()}/${d.getUTCMonth() + 1}/${d.getUTCFullYear()}`;
  }

  return s;
};

const toTimestamp = (dateStr: string): number => {
  if (!dateStr) return 0;
  const m = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return new Date(+m[3], +m[2] - 1, +m[1]).getTime();
  return 0;
};

const isPhoneSheet = (ws: XLSX.WorkSheet): boolean => {
  const cell = ws["A1"];
  return !!cell && String(cell.v ?? "").trim() === "Case No.";
};

const readPhoneSheet = (ws: XLSX.WorkSheet): any[] => {
  const range = XLSX.utils.decode_range(ws["!ref"] || "A1");
  const result: any[] = [];

  for (let r = range.s.r + 1; r <= range.e.r; r++) {
    const rowNum = r + 1;
    const createDateRaw = getCellVal(ws, "B", rowNum);
    const msisdn = getCellVal(ws, "C", rowNum);
    if (!createDateRaw && !msisdn) continue;

    result.push({
      "Create Date":          createDateRaw,
      "MSISDN / Incident ID": msisdn,
      "Range IMSI":           getCellVal(ws, "C", rowNum),
      "Group Case":           getCellVal(ws, "E", rowNum),
      "Subcase":              getCellVal(ws, "F", rowNum),
      "Description":          getCellVal(ws, "G", rowNum),
      "Type":                 getCellVal(ws, "H", rowNum),
      "System":               getCellVal(ws, "I", rowNum),
      "Solution":             getCellVal(ws, "J", rowNum),
      "Status":               getCellVal(ws, "K", rowNum),
      "Closed Date":          getCellVal(ws, "L", rowNum),
      "Assignee":             getCellVal(ws, "M", rowNum),
      "Contact":              getCellVal(ws, "N", rowNum),
      "Remark":               getCellVal(ws, "O", rowNum),
    });
  }
  return result;
};

const readLineSheet = (ws: XLSX.WorkSheet): any[] => {
  return XLSX.utils.sheet_to_json<any>(ws, { defval: "" });
};

export default function ExcelMergePage() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleConvert = async () => {
    if (!files || files.length === 0) {
      alert("กรุณาเลือกไฟล์ Excel");
      return;
    }

    try {
      setLoading(true);
      setStatus("กำลังอ่านไฟล์...");
      const allData: any[] = [];

      for (const file of Array.from(files)) {
        const buffer = await file.arrayBuffer();
        // แก้ไขหลัก: cellDates:false → ได้ serial number ไม่ผ่าน Date object
        const workbook = XLSX.read(buffer, { type: "array", cellDates: false });

        for (const sheetName of workbook.SheetNames) {
          setStatus(`กำลังอ่าน: ${sheetName}`);
          const ws = workbook.Sheets[sheetName];

          const rawRows = isPhoneSheet(ws)
            ? readPhoneSheet(ws)
            : readLineSheet(ws);

          for (const row of rawRows) {
            if (!row["Create Date"] && !row["MSISDN / Incident ID"]) continue;

            const out: any = {};
            out["Create Date"]          = formatDate(row["Create Date"]);
            out["MSISDN / Incident ID"] = String(row["MSISDN / Incident ID"] ?? "").trim();
            out["Range IMSI"]           = String(row["Range IMSI"] ?? "").trim();
            out["Group Case"]           = String(row["Group Case"]   ?? "").trim();
            out["Subcase"]              = String(row["Subcase"]      ?? "").trim();
            out["Description"]          = String(row["Description"]  ?? "").trim();
            out["Type"]                 = String(row["Type"]         ?? "").trim();
            out["System"]               = String(row["System"]       ?? "").trim();
            out["Solution"]             = String(row["Solution"]     ?? "").trim();
            out["Status"]               = String(row["Status"]       ?? "").trim();
            out["Closed Date"]          = formatDate(row["Closed Date"]);
            out["Assignee"]             = String(row["Assignee"]     ?? "").trim();
            out["Contact"]              = String(row["Contact"]      ?? "").trim();
            out["Remark"]               = String(row["Remark"]       ?? "").trim();
            out["Source Sheet"] = sheetName.charAt(0).toUpperCase() + sheetName.slice(1).toLowerCase();


            allData.push(out);
          }
        }
      }

      if (allData.length === 0) { setStatus("ไม่พบข้อมูล ❌"); return; }

      setStatus("กำลังเรียง Create Date...");
      allData.sort((a, b) => toTimestamp(a["Create Date"]) - toTimestamp(b["Create Date"]));

      setStatus("กำลังสร้างไฟล์ Excel...");
      const wb = XLSX.utils.book_new();
      const ws2 = XLSX.utils.json_to_sheet(allData, {
        header: [...REQUIRED_COLUMNS, "Source Sheet"],
      });
      ws2["!cols"] = [14,34,22,28,28,55,14,14,50,14,14,22,20,30,25].map((w) => ({ wch: w }));
      XLSX.utils.book_append_sheet(wb, ws2, "Merged");

      const buf = XLSX.write(wb, { bookType: "xlsx", type: "array", compression: true });
      saveAs(
        new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
        "merged_sorted.xlsx"
      );

      setStatus(`ดาวน์โหลดเสร็จแล้ว ✅ (${allData.length} rows)`);
    } catch (err) {
      console.error(err);
      setStatus("เกิดข้อผิดพลาด ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight:"100vh", background:"#f3f4f6", display:"flex",
      justifyContent:"center", alignItems:"center", padding:40, fontFamily:"sans-serif" }}>
      <div style={{ width:"100%", maxWidth:900, background:"#fff", borderRadius:24,
        padding:40, boxShadow:"0 10px 30px rgba(0,0,0,0.1)" }}>

        <h1 style={{ fontSize:36, marginBottom:12 }}>Excel Merge</h1>
        <p style={{ color:"#666", lineHeight:1.8, marginBottom:24 }}>
          ✅ ชีท line — อ่านตาม header ปกติ<br />
          ✅ ชีท phone — อ่านด้วย cell reference (A,B,C...) ข้าม ArrayFormula<br />
          ✅ Group Case, Subcase, Type, System, Closed Date ถูกต้องทุกชีท<br />
          ✅ เรียง Create Date เก่า → ใหม่<br />
          ✅ แก้ timezone: ใช้ serial number แทน Date object
        </p>

        <input type="file" multiple accept=".xlsx,.xls"
          onChange={(e) => setFiles(e.target.files)}
          style={{ marginBottom:24, display:"block" }} />

        <div style={{ marginBottom:24 }}>
          <button onClick={handleConvert} disabled={loading}
            style={{ background:loading?"#9ca3af":"#2563eb", color:"#fff", border:"none",
              padding:"14px 28px", borderRadius:12, fontSize:18,
              cursor:loading?"not-allowed":"pointer", fontWeight:"bold" }}>
            {loading ? "กำลังแปลง..." : "แปลงรวมกัน"}
          </button>
        </div>

        {status && (
          <div style={{ padding:20, borderRadius:12, background:"#f9fafb",
            border:"1px solid #e5e7eb", color:loading?"#2563eb":"#16a34a", fontWeight:"bold" }}>
            {status}
          </div>
        )}
      </div>
    </main>
  );
}