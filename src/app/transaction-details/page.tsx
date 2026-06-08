"use client";

import { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";

interface TransactionItem {
  API_URL: string;
  TX_DATETIME: string;
  MSISDN: string;
  TX_ID: string;
}

const API_URL_OPTIONS = [
  "RetrieveUsageHistory",
  "recharge/nonvoucher/adjust/validate/1",
  "/rollbacktopuptotopupvalidate",
  "/aietopup",
  "QueryApprove",
  "<init>",
  "recharge/nonvoucher/adjustIfAvailable",
  "/loan",
  "recharge/nonvoucher/adjust/validate/3",
  "/isiTopup",
  "/nonorder/PreviouStageinquiry/{msisdn}",
  "/queryvarietyservice/{msisdn}",
  "/smartDevice/topup",
  "/smartDevice/topupCard",
  "queryBalance",
  "/transfertopupbalance",
  "queryCurrentUsageSum",
  "RetrieveTopupHistory",
  "RetrieveOfferingHistory",
  "rollbacktopup",
  "isrechargeexists",
  "/adjustNewPocket",
  "recharge/nonvoucher/validate",
  "/nonorder/LastStatusUpdateInquiry/{msisdn}",
  "/etopupapprove",
  "/topuptotopupbalance",
  "/smartDevice/transfer",
  "/rollbacktopuptotopup",
  "QueryCreditLimit",
  "/Charge",
  "recharge/nonvoucher/adjust",
  "/etopup/transfer",
  "/transfer/postvalidate",
  "/transfer",
  "/transfer/force",
  "recharge/nonvoucher",
  "/rollback",
  "/topuptotopupbalance2",
  "/rollbacktopup",
  "/adjustment/{msisdn}",
  "/nonorder/historyusageinquiry/{msisdn}",
  "recharge/nonvoucher/adjustForce",
  "recharge/nonvoucher/adjust/validate/2",
  "/transfer/available",
];

function MultiSelectDropdown({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = API_URL_OPTIONS.filter((o) =>
    o.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (val: string) => {
    onChange(selected.includes(val) ? selected.filter((s) => s !== val) : [...selected, val]);
  };

  const toggleAll = () => {
    onChange(selected.length === API_URL_OPTIONS.length ? [] : [...API_URL_OPTIONS]);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between pl-4 pr-3 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 bg-slate-50 outline-none focus:border-[#534AB7] focus:bg-white focus:ring-4 focus:ring-[#534AB7]/5 transition-all"
      >
        <span className="truncate text-left">
          {selected.length === 0
            ? <span className="text-slate-400">เลือก API URL</span>
            : selected.length === API_URL_OPTIONS.length
            ? "ทั้งหมด"
            : `เลือกแล้ว ${selected.length} รายการ`}
        </span>
        <span className={`ml-2 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>

      {/* Badge count */}
      {selected.length > 0 && selected.length < API_URL_OPTIONS.length && (
        <span className="absolute -top-2 -right-2 bg-[#534AB7] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
          {selected.length}
        </span>
      )}

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-slate-100">
            <input
              autoFocus
              type="text"
              placeholder="ค้นหา API URL..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg bg-slate-50 border border-slate-200 outline-none focus:border-[#534AB7] focus:ring-2 focus:ring-[#534AB7]/10 transition-all"
            />
          </div>

          {/* Select All */}
          <div
            onClick={toggleAll}
            className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-violet-50 border-b border-slate-100 transition-colors"
          >
            <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${selected.length === API_URL_OPTIONS.length ? "bg-[#534AB7] border-[#534AB7]" : "border-slate-300"}`}>
              {selected.length === API_URL_OPTIONS.length && <span className="text-white text-[10px]">✓</span>}
              {selected.length > 0 && selected.length < API_URL_OPTIONS.length && <span className="text-[#534AB7] text-[10px]">−</span>}
            </div>
            <span className="text-xs font-semibold text-slate-600">เลือกทั้งหมด</span>
          </div>

          {/* Options */}
          <div className="max-h-56 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-xs text-slate-400 text-center">ไม่พบ API URL</div>
            ) : (
              filtered.map((opt) => (
                <div
                  key={opt}
                  onClick={() => toggle(opt)}
                  className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-violet-50 transition-colors"
                >
                  <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors flex-shrink-0 ${selected.includes(opt) ? "bg-[#534AB7] border-[#534AB7]" : "border-slate-300"}`}>
                    {selected.includes(opt) && <span className="text-white text-[10px]">✓</span>}
                  </div>
                  <span className="text-xs text-slate-700 font-mono truncate">{opt}</span>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {selected.length > 0 && (
            <div className="p-2 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs text-slate-400">เลือกแล้ว {selected.length} รายการ</span>
              <button
                onClick={() => onChange([])}
                className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors"
              >
                ล้างทั้งหมด
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TransactionDetailsPage() {
  const [msisdn, setMsisdn] = useState("");
  const [txid, setTxid] = useState("");
  const [limit, setLimit] = useState(100);
  const [selectedAPIs, setSelectedAPIs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TransactionItem[]>([]);
  const [searched, setSearched] = useState(false);

  const formatDate = (dateString: string | number | Date) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return (
      date.toLocaleString("th-TH", {
        timeZone: "Asia/Bangkok",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }) + " น."
    );
  };

  const searchData = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const apiParam = selectedAPIs.length > 0 ? `&apiurls=${encodeURIComponent(JSON.stringify(selectedAPIs))}` : "";
      const res = await fetch(
        `/api/transaction-details?msisdn=${msisdn}&txid=${txid}&limit=${limit}${apiParam}`
      );
      const contentType = res.headers.get("content-type");
      if (!res.ok || !contentType?.includes("application/json")) {
        setData([]);
        setLoading(false);
        return;
      }
      const result = await res.json();
      setData(result.data || []);
    } catch (err) {
      console.error(err);
      setData([]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") searchData();
  };

  const exportExcel = () => {
    if (data.length === 0) { alert("ไม่มีข้อมูล"); return; }
    const exportData = data.map((item, index) => ({
      ลำดับ: index + 1,
      API_URL: item.API_URL,
      วันที่เวลา: formatDate(item.TX_DATETIME),
      MSISDN: item.MSISDN,
      TX_ID: item.TX_ID,
    }));
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transaction");
    XLSX.writeFile(workbook, "transaction_details.xlsx");
  };

  const uniqueAPIs = new Set(data.map((x) => x.API_URL)).size;
  const uniqueMSISDN = new Set(data.map((x) => x.MSISDN)).size;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 text-slate-800 font-sans selection:bg-[#534AB7]/10 selection:text-[#534AB7]">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <span className="inline-flex items-center gap-1.5 bg-violet-50 text-[#534AB7] text-xs font-semibold px-3 py-1.5 rounded-full mb-3 border border-violet-100 shadow-sm">
          ✨ ระบบจัดการข้อมูล
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-2">Transaction Details</h1>
        <p className="text-slate-500 text-sm md:text-base">ตรวจสอบและค้นหารายละเอียด Transaction ตาม MSISDN, TX_ID หรือ API URL</p>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Search Form */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 md:p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            {/* MSISDN */}
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">MSISDN</label>
              <div className="relative group">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-[#534AB7] transition-colors">📱</span>
                <input
                  type="text"
                  placeholder="ระบุหมายเลขโทรศัพท์"
                  value={msisdn}
                  onChange={(e) => setMsisdn(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 bg-slate-50 placeholder-slate-400 outline-none focus:border-[#534AB7] focus:bg-white focus:ring-4 focus:ring-[#534AB7]/5 transition-all"
                />
              </div>
            </div>

            {/* TX_ID */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">TX_ID</label>
              <div className="relative group">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg group-focus-within:text-[#534AB7] transition-colors">🔖</span>
                <input
                  type="text"
                  placeholder="Transaction ID"
                  value={txid}
                  onChange={(e) => setTxid(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 bg-slate-50 placeholder-slate-400 outline-none focus:border-[#534AB7] focus:bg-white focus:ring-4 focus:ring-[#534AB7]/5 transition-all"
                />
              </div>
            </div>

            {/* API URL Multi-select */}
            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">API URL</label>
              <MultiSelectDropdown selected={selectedAPIs} onChange={setSelectedAPIs} />
            </div>

            {/* Limit */}
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Limit</label>
              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="w-full px-3 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 bg-slate-50 outline-none focus:border-[#534AB7] focus:bg-white focus:ring-4 focus:ring-[#534AB7]/5 cursor-pointer transition-all appearance-none"
                style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: "no-repeat", backgroundPosition: "right 0.5rem center", backgroundSize: "1em" }}
              >
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={500}>500</option>
                <option value={1000}>1000</option>
              </select>
            </div>

            {/* Buttons */}
            <div className="md:col-span-2 flex gap-2">
              <button
                onClick={searchData}
                className="flex-1 flex items-center justify-center gap-2 bg-[#534AB7] hover:bg-[#433a9c] active:scale-[0.98] text-white px-4 py-3 rounded-xl text-sm font-semibold shadow-md shadow-violet-600/10 hover:shadow-lg hover:shadow-violet-600/20 transition-all duration-200"
              >
                🔍 ค้นหา
              </button>
              <button
                onClick={exportExcel}
                disabled={data.length === 0}
                className="flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl text-sm font-semibold shadow-md transition-all duration-200"
              >
                📥
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        {!loading && data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[
              { label: "รายการทั้งหมด", value: `${data.length} รายการ`, icon: "📊", bg: "from-blue-500/5 to-cyan-500/5", border: "border-blue-100" },
              { label: "API URL ไม่ซ้ำ", value: `${uniqueAPIs} URL`, icon: "🔗", bg: "from-emerald-500/5 to-teal-500/5", border: "border-emerald-100" },
              { label: "MSISDN ไม่ซ้ำ", value: `${uniqueMSISDN} เบอร์`, icon: "👥", bg: "from-purple-500/5 to-pink-500/5", border: "border-purple-100" },
            ].map((stat) => (
              <div key={stat.label} className={`bg-white border ${stat.border} rounded-2xl p-5 shadow-sm bg-gradient-to-br ${stat.bg} hover:scale-[1.02] transition-transform duration-200`}>
                <div className="flex justify-between items-start mb-2">
                  <p className="text-xs font-semibold text-slate-500 tracking-wide uppercase">{stat.label}</p>
                  <span className="text-lg bg-white p-1.5 rounded-lg shadow-sm border border-slate-100">{stat.icon}</span>
                </div>
                <p className="text-2xl font-bold text-slate-900 tracking-tight">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Table Container */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm min-h-[350px] flex flex-col justify-between">
          {loading && (
            <div className="flex flex-col justify-center items-center gap-3 py-24 my-auto">
              <div className="flex gap-2">
                {[0, 150, 300].map((delay) => (
                  <span key={delay} className="w-3 h-3 rounded-full bg-[#534AB7] animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                ))}
              </div>
              <p className="text-xs font-medium text-slate-400 mt-2 tracking-wider uppercase">กำลังดึงข้อมูล...</p>
            </div>
          )}

          {!loading && !searched && (
            <div className="text-center py-24 my-auto max-w-sm mx-auto p-4">
              <div className="w-16 h-16 bg-violet-50 text-3xl flex items-center justify-center rounded-2xl mx-auto mb-4 border border-violet-100 shadow-sm animate-pulse">🔎</div>
              <h3 className="text-base font-semibold text-slate-800 mb-1">พร้อมค้นหาข้อมูล</h3>
              <p className="text-sm text-slate-400">กรอก MSISDN, TX_ID หรือเลือก API URL ด้านบนเพื่อค้นหารายการ</p>
            </div>
          )}

          {!loading && searched && data.length === 0 && (
            <div className="text-center py-24 my-auto max-w-sm mx-auto p-4">
              <div className="w-16 h-16 bg-amber-50 text-3xl flex items-center justify-center rounded-2xl mx-auto mb-4 border border-amber-100 shadow-sm">📭</div>
              <h3 className="text-base font-semibold text-slate-800 mb-1">ไม่พบข้อมูล</h3>
              <p className="text-sm text-slate-400">ไม่พบรายการ Transaction สำหรับเงื่อนไขที่ค้นหา</p>
            </div>
          )}

          {!loading && data.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                    {["#", "🕐 TX_DATETIME", "📱 MSISDN", "🔖 TX_ID", "🔗 API_URL"].map((h) => (
                      <th key={h} className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map((item, index) => (
                    <tr key={index} className="hover:bg-slate-50/80 transition-colors duration-150">
                      <td className="p-4 text-center text-xs font-semibold text-slate-400 w-10">{index + 1}</td>
                      <td className="p-4 text-slate-500 font-medium text-xs whitespace-nowrap">{formatDate(item.TX_DATETIME)}</td>
                      <td className="p-4 font-semibold text-slate-700 tracking-wide">{item.MSISDN}</td>
                      <td className="p-4 font-medium text-slate-600 tracking-wide">{item.TX_ID}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center bg-violet-50 text-[#534AB7] text-xs font-bold px-2.5 py-1 rounded-lg border border-violet-100 shadow-sm font-mono">
                          {item.API_URL}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}