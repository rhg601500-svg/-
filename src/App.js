import { useState, useEffect, useRef, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import * as XLSX from "xlsx";

// ─────────────────────────────────────────────────────────
// ✅ 여기만 바꾸세요! (Supabase 프로젝트 값)
// ─────────────────────────────────────────────────────────
const SUPABASE_URL = "https://moiarbpczfmgbuskcokp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vaWFyYnBjemZtZ2J1c2tjb2twIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyMzU5NDksImV4cCI6MjEwMzgxMTk0OX0.1jMzFJn37sK60pIwcKC-KiFL4yRMY4mFsNyRFtLlOb4";

// ✅ 관리자 비밀번호 (Vercel 환경변수 REACT_APP_ADMIN_PW 로 덮어쓰기 권장)
const ADMIN_PW = process.env.REACT_APP_ADMIN_PW || "wia2026!";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── 색상 토큰
const T = {
  navy: "#0F2A47", blue: "#1D5FA8", sky: "#EBF3FC",
  mint: "#0A7C6A", mintSoft: "#E6F4F1",
  orange: "#C85A00", orangeSoft: "#FFF0E6",
  red: "#B91C1C", redSoft: "#FEF2F2", green: "#15803D",
  purple: "#6D28D9", purpleSoft: "#F3EEFF",
  gray50: "#F8FAFC", gray100: "#F1F5F9", gray200: "#E2E8F0",
  gray400: "#94A3B8", gray500: "#64748B", gray700: "#334155",
  gray900: "#0F172A", white: "#FFFFFF",
};

const FONT = "'Noto Sans KR','Apple SD Gothic Neo',sans-serif";

// ✅ 발생 위치 (요청 반영)
const LOCATIONS = [
  "조립 1라인", "조립 2라인", "창고동", "완제품 창고동",
  "폐기물 처리장", "주차장", "사무동", "기타",
];

const RISK_TYPES = [
  "끼임·협착", "떨어짐·추락", "넘어짐·미끄러짐", "물체에 맞음",
  "화학물질 노출", "전기 감전", "화재·폭발 우려", "기타",
];

// 위험유형별 심각도 가중치 (Risk Scoring)
const SEVERITY = {
  "끼임·협착": 5, "떨어짐·추락": 5, "화재·폭발 우려": 5,
  "전기 감전": 4, "화학물질 노출": 4, "물체에 맞음": 3,
  "넘어짐·미끄러짐": 2, "기타": 2,
};

const PALETTE = ["#1D5FA8", "#C85A00", "#0A7C6A", "#B91C1C", "#6D28D9",
                 "#15803D", "#0EA5E9", "#94A3B8", "#DB2777", "#CA8A04"];

// ── 아이콘
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
  const icons = {
    location: <svg {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>,
    clock: <svg {...p}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
    alert: <svg {...p}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
    camera: <svg {...p}><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>,
    send: <svg {...p}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>,
    check: <svg {...p} strokeWidth={2.5}><polyline points="20 6 9 17 4 12" /></svg>,
    x: <svg {...p}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
    bell: <svg {...p}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>,
    shield: <svg {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    plus: <svg {...p} strokeWidth={2.5}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
    user: <svg {...p}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    list: <svg {...p}><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>,
    chevronRight: <svg {...p}><polyline points="9 18 15 12 9 6" /></svg>,
    back: <svg {...p}><polyline points="15 18 9 12 15 6" /></svg>,
    refresh: <svg {...p}><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" /></svg>,
    wifi: <svg {...p}><path d="M5 12.55a11 11 0 0114.08 0" /><path d="M1.42 9a16 16 0 0121.16 0" /><path d="M8.53 16.11a6 6 0 016.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></svg>,
    lock: <svg {...p}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>,
    chart: <svg {...p}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
    download: <svg {...p}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>,
    brain: <svg {...p}><path d="M12 2a4 4 0 00-4 4v1a3 3 0 00-2 5.5A3 3 0 008 18v1a3 3 0 006 0" /><path d="M12 2a4 4 0 014 4v1a3 3 0 012 5.5A3 3 0 0116 18" /></svg>,
    logout: <svg {...p}><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>,
  };
  return icons[name] || null;
};

// ── 유틸
const pad = n => String(n).padStart(2, "0");
const formatDatetime = d => `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
const ymKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
const countBy = (arr, fn) => arr.reduce((m, x) => { const k = fn(x); m[k] = (m[k] || 0) + 1; return m; }, {});
const sortEntries = obj => Object.entries(obj).sort((a, b) => b[1] - a[1]);

// ─────────────────────────────────────────────────────────
// 차트 (외부 라이브러리 없이 SVG로 구현)
// ─────────────────────────────────────────────────────────
function DonutChart({ data, size = 170, thickness = 30, centerLabel, centerValue }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = (size - thickness) / 2;
  const C = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
      <svg width={size} height={size} style={{ flexShrink: 0 }}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.gray100} strokeWidth={thickness} />
          {total > 0 && data.map((d, i) => {
            const len = (d.value / total) * C;
            const el = (
              <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none"
                stroke={d.color} strokeWidth={thickness}
                strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-offset} />
            );
            offset += len;
            return el;
          })}
        </g>
        <text x={size / 2} y={size / 2 - 4} textAnchor="middle" fontSize={26} fontWeight={800} fill={T.gray900}>{centerValue ?? total}</text>
        <text x={size / 2} y={size / 2 + 16} textAnchor="middle" fontSize={11} fill={T.gray500}>{centerLabel ?? "건"}</text>
      </svg>
      <div style={{ flex: 1, minWidth: 140 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: d.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12.5, color: T.gray700, flex: 1 }}>{d.label}</span>
            <span style={{ fontSize: 12.5, fontWeight: 700, color: T.gray900 }}>{d.value}건</span>
            <span style={{ fontSize: 11.5, color: T.gray400, width: 44, textAlign: "right" }}>
              {total ? Math.round((d.value / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarList({ data, color = T.blue }) {
  const max = Math.max(1, ...data.map(d => d.value));
  return (
    <div>
      {data.map((d, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 4 }}>
            <span style={{ color: T.gray700, fontWeight: 600 }}>{d.label}</span>
            <span style={{ color: T.gray500 }}>{d.value}건</span>
          </div>
          <div style={{ height: 9, background: T.gray100, borderRadius: 6, overflow: "hidden" }}>
            <div style={{ width: `${(d.value / max) * 100}%`, height: "100%", background: d.color || color, borderRadius: 6, transition: "width .4s" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MonthlyTrend({ data }) {
  // data: [{label:'26.01', value:n}]
  const max = Math.max(1, ...data.map(d => d.value));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 130, paddingTop: 8 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{ fontSize: 10, color: T.gray500, fontWeight: 700 }}>{d.value || ""}</div>
          <div style={{
            width: "100%", height: `${Math.max(3, (d.value / max) * 88)}px`,
            background: d.value ? `linear-gradient(180deg, ${T.blue}, ${T.blue}90)` : T.gray200,
            borderRadius: "5px 5px 2px 2px", transition: "height .4s",
          }} />
          <div style={{ fontSize: 9.5, color: T.gray400 }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// AI 분석 엔진 (룰 기반 + 키워드 추출 + Risk Scoring)
// ─────────────────────────────────────────────────────────
const STOPWORDS = ["그리고", "하지만", "있습니다", "했습니다", "합니다", "때문에", "위해", "대한", "있는", "되어", "같습니다", "느꼈습니다", "됩니다", "관련", "중에", "부분"];

function extractKeywords(texts, topN = 8) {
  const freq = {};
  texts.join(" ").replace(/[^\uAC00-\uD7A3a-zA-Z0-9\s]/g, " ").split(/\s+/)
    .filter(w => w.length >= 2 && !STOPWORDS.includes(w))
    .forEach(w => { freq[w] = (freq[w] || 0) + 1; });
  return sortEntries(freq).filter(([, c]) => c >= 2).slice(0, topN);
}

function analyze(reports) {
  const rs = reports.filter(r => r.created_at);
  const byType = countBy(rs, r => r.risk_type || "기타");
  const byLoc = countBy(rs, r => r.location || "기타");
  const byStatus = countBy(rs, r => (r.status === "완료" ? "처리 완료" : "처리 대기"));
  const byHourBand = countBy(rs, r => {
    const h = new Date(r.created_at).getHours();
    if (h < 6) return "심야(00-06)";
    if (h < 12) return "오전(06-12)";
    if (h < 18) return "오후(12-18)";
    return "야간(18-24)";
  });
  const byWeekday = countBy(rs, r => "일월화수목금토"[new Date(r.created_at).getDay()] + "요일");
  const byMonth = countBy(rs, r => ymKey(new Date(r.created_at)));

  // Risk Score = Σ(심각도 × 건수), 위치별
  const locScore = {};
  rs.forEach(r => {
    const k = r.location || "기타";
    locScore[k] = (locScore[k] || 0) + (SEVERITY[r.risk_type] || 2);
  });

  const topType = sortEntries(byType)[0];
  const topLoc = sortEntries(byLoc)[0];
  const topBand = sortEntries(byHourBand)[0];
  const topRisk = sortEntries(locScore)[0];
  const keywords = extractKeywords(rs.map(r => r.content || ""));
  const total = rs.length;
  const done = rs.filter(r => r.status === "완료").length;
  const closeRate = total ? Math.round((done / total) * 100) : 0;
  const highSeverity = rs.filter(r => (SEVERITY[r.risk_type] || 2) >= 4).length;

  const findings = [];
  if (topType) findings.push(`전체 ${total}건 중 「${topType[0]}」이 ${topType[1]}건(${Math.round(topType[1] / total * 100)}%)으로 최다 발생 유형`);
  if (topLoc) findings.push(`발생 장소는 「${topLoc[0]}」이 ${topLoc[1]}건으로 집중 — 해당 구역 우선 점검 필요`);
  if (topBand) findings.push(`시간대별로는 ${topBand[0]} 시간대에 ${topBand[1]}건 집중`);
  if (topRisk) findings.push(`Risk Score 최상위 구역: 「${topRisk[0]}」 (심각도 가중 ${topRisk[1]}점)`);
  findings.push(`중대재해 연계 고위험 유형(추락·끼임·화재·감전·화학) ${highSeverity}건, 조치완료율 ${closeRate}%`);
  if (keywords.length) findings.push(`신고 본문 키워드 상위: ${keywords.slice(0, 5).map(k => k[0]).join(", ")}`);

  const actions = [];
  if (topLoc) actions.push(`「${topLoc[0]}」 대상 합동 안전점검 및 위험성평가 재실시`);
  if (topType) actions.push(`「${topType[0]}」 유형 표준작업지침(SOP) 재교육 및 방호장치 점검`);
  if (closeRate < 80) actions.push(`미조치 ${total - done}건에 대한 조치기한 지정 및 주간 트래킹`);
  if (topBand) actions.push(`${topBand[0]} 시간대 순회점검 강화 및 교대조 TBM 강조`);
  actions.push("월별 신고 데이터 DB 축적 → 분기 안전협의체 보고 시 추세 분석 반영");

  return { total, done, pending: total - done, closeRate, highSeverity,
    byType, byLoc, byStatus, byHourBand, byWeekday, byMonth, locScore,
    topType, topLoc, topBand, topRisk, keywords, findings, actions };
}

// ─────────────────────────────────────────────────────────
// 엑셀 리포트 생성
// ─────────────────────────────────────────────────────────
function exportExcel(reports, mode, period) {
  const filtered = reports.filter(r => {
    if (!r.created_at) return false;
    const d = new Date(r.created_at);
    return mode === "month" ? ymKey(d) === period : String(d.getFullYear()) === period;
  });
  if (filtered.length === 0) { alert("해당 기간에 신고 데이터가 없습니다."); return; }

  const a = analyze(filtered);
  const title = mode === "month" ? `${period.replace("-", "년 ")}월` : `${period}년`;
  const wb = XLSX.utils.book_new();

  // 1) AI 분석 요약
  const summary = [
    ["아차사고 AI 분석 리포트"], [`대상 기간: ${title}`], [`생성일시: ${formatDatetime(new Date())}`], [],
    ["■ 핵심 지표"],
    ["총 신고 건수", a.total], ["조치 완료", a.done], ["처리 대기", a.pending],
    ["조치 완료율(%)", a.closeRate], ["고위험 유형 건수", a.highSeverity],
    ["최다 발생 유형", a.topType ? `${a.topType[0]} (${a.topType[1]}건)` : "-"],
    ["최다 발생 장소", a.topLoc ? `${a.topLoc[0]} (${a.topLoc[1]}건)` : "-"],
    ["최다 발생 시간대", a.topBand ? `${a.topBand[0]} (${a.topBand[1]}건)` : "-"],
    ["Risk Score 최상위 구역", a.topRisk ? `${a.topRisk[0]} (${a.topRisk[1]}점)` : "-"], [],
    ["■ AI 분석 결과 (Findings)"], ...a.findings.map((f, i) => [`${i + 1}`, f]), [],
    ["■ 개선 권고 (Recommended Actions)"], ...a.actions.map((f, i) => [`${i + 1}`, f]), [],
    ["■ 본문 키워드 Top"], ["키워드", "출현 빈도"], ...a.keywords.map(k => [k[0], k[1]]),
  ];
  const ws1 = XLSX.utils.aoa_to_sheet(summary);
  ws1["!cols"] = [{ wch: 24 }, { wch: 90 }];
  XLSX.utils.book_append_sheet(wb, ws1, "AI분석요약");

  // 2) 유형별 / 3) 장소별 / 4) 시간대별
  const mk = (obj, colName, extra) => {
    const rows = sortEntries(obj);
    const tot = rows.reduce((s, r) => s + r[1], 0) || 1;
    const aoa = [[colName, "건수", "비율(%)", ...(extra ? ["Risk Score"] : [])],
      ...rows.map(([k, v]) => [k, v, Math.round(v / tot * 100), ...(extra ? [extra[k] || 0] : [])])];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws["!cols"] = [{ wch: 20 }, { wch: 8 }, { wch: 10 }, { wch: 12 }];
    return ws;
  };
  XLSX.utils.book_append_sheet(wb, mk(a.byType, "위험 유형"), "유형별분석");
  XLSX.utils.book_append_sheet(wb, mk(a.byLoc, "발생 장소", a.locScore), "장소별분석");
  XLSX.utils.book_append_sheet(wb, mk(a.byHourBand, "시간대"), "시간대별분석");
  XLSX.utils.book_append_sheet(wb, mk(a.byWeekday, "요일"), "요일별분석");
  if (mode === "year") XLSX.utils.book_append_sheet(wb, mk(a.byMonth, "월"), "월별추이");

  // 원본 데이터
  const raw = [["No", "접수일시", "발생 장소", "위험 유형", "심각도", "위험 내용", "신고자", "처리 상태", "사진(장)"],
    ...filtered.slice().sort((x, y) => new Date(x.created_at) - new Date(y.created_at)).map((r, i) => [
      i + 1, formatDatetime(new Date(r.created_at)), r.location, r.risk_type,
      SEVERITY[r.risk_type] || 2, r.content, r.reporter || "익명",
      r.status === "완료" ? "처리 완료" : "처리 대기", (r.photos || []).length,
    ])];
  const ws5 = XLSX.utils.aoa_to_sheet(raw);
  ws5["!cols"] = [{ wch: 5 }, { wch: 18 }, { wch: 14 }, { wch: 14 }, { wch: 7 }, { wch: 60 }, { wch: 10 }, { wch: 10 }, { wch: 8 }];
  XLSX.utils.book_append_sheet(wb, ws5, "신고원본데이터");

  XLSX.writeFile(wb, `아차사고_AI분석리포트_${period}.xlsx`);
}

// ─────────────────────────────────────────────────────────
// 공통 카드
// ─────────────────────────────────────────────────────────
const Card = ({ title, icon, iconColor, right, children, style }) => (
  <div style={{ background: T.white, borderRadius: 16, padding: "16px", marginBottom: 12, boxShadow: "0 1px 4px rgba(0,0,0,.06)", ...style }}>
    {title && (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          {icon && <Icon name={icon} size={16} color={iconColor || T.blue} />}
          <span style={{ fontSize: 14, fontWeight: 800, color: T.gray900 }}>{title}</span>
        </div>
        {right}
      </div>
    )}
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────
// 관리자 - 신고 상세
// ─────────────────────────────────────────────────────────
function ReportDetail({ r, onBack }) {
  const [done, setDone] = useState(r.status === "완료");
  const [saving, setSaving] = useState(false);
  const handleDone = async () => {
    setSaving(true);
    await supabase.from("reports").update({ status: "완료" }).eq("id", r.id);
    setDone(true); setSaving(false);
  };
  return (
    <div style={{ minHeight: "100vh", background: T.gray50, fontFamily: FONT }}>
      <div style={{ background: T.navy, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <Icon name="back" size={22} color={T.white} />
        </button>
        <span style={{ color: T.white, fontSize: 17, fontWeight: 700 }}>신고 상세</span>
      </div>
      <div style={{ padding: "20px 16px", maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20,
            background: done ? T.mintSoft : T.orangeSoft, color: done ? T.mint : T.orange,
            border: `1px solid ${done ? T.mint : T.orange}` }}>{done ? "처리 완료" : "처리 대기"}</span>
        </div>
        {[
          { label: "발생 위치", value: r.location, icon: "location", color: T.blue },
          { label: "보고 일시", value: r.created_at ? formatDatetime(new Date(r.created_at)) : "-", icon: "clock", color: T.mint },
          { label: "위험 유형", value: `${r.risk_type} (심각도 ${SEVERITY[r.risk_type] || 2}/5)`, icon: "alert", color: T.orange },
        ].map(item => (
          <div key={item.label} style={{ background: T.white, borderRadius: 12, padding: "14px 16px", marginBottom: 10, display: "flex", alignItems: "center", gap: 14, boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: item.color + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name={item.icon} size={20} color={item.color} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: T.gray500, marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: T.gray900 }}>{item.value}</div>
            </div>
          </div>
        ))}
        <Card><div style={{ fontSize: 11, color: T.gray500, marginBottom: 8 }}>위험 상세 내용</div>
          <div style={{ fontSize: 14, color: T.gray700, lineHeight: 1.7 }}>{r.content}</div></Card>
        {r.photos && r.photos.length > 0 && (
          <Card><div style={{ fontSize: 11, color: T.gray500, marginBottom: 10 }}>첨부 사진 ({r.photos.length}장)</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {r.photos.map((p, i) => <img key={i} src={p} alt={`첨부${i + 1}`} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 8, border: `1px solid ${T.gray200}` }} />)}
            </div></Card>
        )}
        <Card style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: T.sky, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="user" size={18} color={T.blue} /></div>
          <div><div style={{ fontSize: 11, color: T.gray500 }}>신고자</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.gray900 }}>{r.reporter || "익명"}</div></div>
        </Card>
        {!done ? (
          <button onClick={handleDone} disabled={saving}
            style={{ width: "100%", padding: "16px", background: T.mint, color: T.white, border: "none", borderRadius: 14, fontSize: 16, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}>
            <Icon name="check" size={18} color={T.white} />{saving ? "처리 중..." : "조치 완료 처리"}
          </button>
        ) : (
          <div style={{ textAlign: "center", padding: "16px", background: T.mintSoft, borderRadius: 14, color: T.mint, fontWeight: 700, fontSize: 15 }}>✅ 조치 완료된 신고입니다</div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 관리자 로그인
// ─────────────────────────────────────────────────────────
function AdminLogin({ onOk }) {
  const [pw, setPw] = useState(""); const [err, setErr] = useState("");
  const submit = () => {
    if (pw === ADMIN_PW) { sessionStorage.setItem("admin_ok", "1"); onOk(); }
    else setErr("비밀번호가 올바르지 않습니다.");
  };
  return (
    <div style={{ minHeight: "100vh", background: T.navy, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 28, fontFamily: FONT }}>
      <div style={{ width: 64, height: 64, background: "rgba(255,255,255,.1)", borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18 }}>
        <Icon name="lock" size={28} color={T.white} /></div>
      <div style={{ fontSize: 20, fontWeight: 800, color: T.white, marginBottom: 6 }}>관리자 로그인</div>
      <div style={{ fontSize: 13, color: "rgba(255,255,255,.55)", marginBottom: 26, textAlign: "center" }}>
        안전관리 담당자 전용 페이지입니다</div>
      <input type="password" value={pw} onChange={e => { setPw(e.target.value); setErr(""); }}
        onKeyDown={e => e.key === "Enter" && submit()} placeholder="비밀번호 입력"
        style={{ width: "100%", maxWidth: 340, boxSizing: "border-box", padding: "15px 16px", borderRadius: 12, border: "none", fontSize: 15, marginBottom: 10, fontFamily: "inherit", outline: "none" }} />
      {err && <div style={{ color: "#FCA5A5", fontSize: 13, marginBottom: 10 }}>⚠ {err}</div>}
      <button onClick={submit}
        style={{ width: "100%", maxWidth: 340, padding: "15px", background: T.orange, color: T.white, border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
        로그인</button>
      <button onClick={() => { window.location.hash = ""; }}
        style={{ marginTop: 14, background: "none", border: "none", color: "rgba(255,255,255,.5)", fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
        ← 신고 페이지로 이동</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 관리자 대시보드
// ─────────────────────────────────────────────────────────
function AdminDashboard() {
  const [reports, setReports] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newAlert, setNewAlert] = useState(false);
  const [tab, setTab] = useState("dash"); // dash | list
  const [mode, setMode] = useState("month");
  const [period, setPeriod] = useState(ymKey(new Date()));

  const fetchReports = async () => {
    const { data } = await supabase.from("reports").select("*").order("created_at", { ascending: false });
    if (data) setReports(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();
    const channel = supabase.channel("admin-watch")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "reports" }, payload => {
        setReports(prev => [payload.new, ...prev]);
        setNewAlert(true); setTimeout(() => setNewAlert(false), 4000);
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          new Notification("🚨 새 아차사고 신고", { body: `${payload.new.location} — ${payload.new.risk_type}` });
        }
      }).subscribe();
    return () => supabase.removeChannel(channel);
  }, []);

  const a = useMemo(() => analyze(reports), [reports]);

  const periods = useMemo(() => {
    const months = new Set(), years = new Set();
    reports.forEach(r => { if (r.created_at) { const d = new Date(r.created_at); months.add(ymKey(d)); years.add(String(d.getFullYear())); } });
    months.add(ymKey(new Date())); years.add(String(new Date().getFullYear()));
    return { months: [...months].sort().reverse(), years: [...years].sort().reverse() };
  }, [reports]);

  const last6 = useMemo(() => {
    const out = []; const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      out.push({ label: `${String(d.getFullYear()).slice(2)}.${pad(d.getMonth() + 1)}`, value: a.byMonth[ymKey(d)] || 0 });
    }
    return out;
  }, [a]);

  if (selected) return <ReportDetail r={selected} onBack={() => { setSelected(null); fetchReports(); }} />;

  const statusData = [
    { label: "처리 완료", value: a.done, color: T.green },
    { label: "처리 대기", value: a.pending, color: T.orange },
  ];
  const typeData = sortEntries(a.byType).map(([k, v], i) => ({ label: k, value: v, color: PALETTE[i % PALETTE.length] }));
  const locData = sortEntries(a.byLoc).map(([k, v], i) => ({ label: k, value: v, color: PALETTE[i % PALETTE.length] }));
  const bandData = sortEntries(a.byHourBand).map(([k, v]) => ({ label: k, value: v, color: T.purple }));

  const logout = () => { sessionStorage.removeItem("admin_ok"); window.location.hash = ""; window.location.reload(); };

  return (
    <div style={{ minHeight: "100vh", background: T.gray50, fontFamily: FONT }}>
      {/* 헤더 */}
      <div style={{ background: T.navy, padding: "16px 20px", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, background: T.blue, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="shield" size={17} color={T.white} /></div>
            <div>
              <div style={{ color: T.white, fontSize: 15, fontWeight: 800 }}>관리자 대시보드</div>
              <div style={{ color: "rgba(255,255,255,.5)", fontSize: 11 }}>위아마그나 안전관리</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => Notification.requestPermission()} style={btnGhost}><Icon name="bell" size={15} color={T.white} /></button>
            <button onClick={fetchReports} style={btnGhost}><Icon name="refresh" size={15} color={T.white} /></button>
            <button onClick={logout} style={btnGhost}><Icon name="logout" size={15} color={T.white} /></button>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, maxWidth: 720, margin: "8px auto 0" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80" }} />
          <span style={{ color: "rgba(255,255,255,.6)", fontSize: 11 }}>실시간 연결됨 — 새 신고 자동 수신 중</span>
        </div>
        {/* 탭 */}
        <div style={{ display: "flex", gap: 6, marginTop: 12, maxWidth: 720, margin: "12px auto 0" }}>
          {[["dash", "대시보드"], ["list", "신고 목록"]].map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              flex: 1, padding: "9px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
              fontSize: 13, fontWeight: 700, border: "none",
              background: tab === k ? T.white : "rgba(255,255,255,.1)",
              color: tab === k ? T.navy : "rgba(255,255,255,.7)",
            }}>{label}</button>
          ))}
        </div>
      </div>

      {newAlert && (
        <div style={{ background: T.orange, padding: "12px 20px", display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
          <Icon name="bell" size={18} color={T.white} />
          <span style={{ color: T.white, fontWeight: 700, fontSize: 14 }}>🚨 새 아차사고 신고가 접수되었습니다!</span>
        </div>
      )}

      <div style={{ padding: "16px", maxWidth: 720, margin: "0 auto" }}>
        {/* 통계 카드 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 12 }}>
          {[
            { label: "전체 신고", value: a.total, color: T.blue },
            { label: "처리 대기", value: a.pending, color: T.orange },
            { label: "처리 완료", value: a.done, color: T.green },
            { label: "완료율", value: `${a.closeRate}%`, color: T.purple },
          ].map(s => (
            <div key={s.label} style={{ background: T.white, borderRadius: 12, padding: "13px 6px", textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,.06)" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 10.5, color: T.gray500, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: T.gray400 }}>불러오는 중...</div>
        ) : tab === "dash" ? (
          <>
            <Card title="처리 현황 비율" icon="chart" iconColor={T.green}>
              <DonutChart data={statusData} centerValue={a.total} centerLabel="전체 건수" />
            </Card>

            <Card title="위험 유형별 발생 비율" icon="alert" iconColor={T.orange}>
              {typeData.length ? <DonutChart data={typeData} /> : <Empty />}
            </Card>

            <Card title="발생 장소별 분포" icon="location" iconColor={T.blue}>
              {locData.length ? <BarList data={locData} /> : <Empty />}
            </Card>

            <Card title="시간대별 발생 분포" icon="clock" iconColor={T.purple}>
              {bandData.length ? <BarList data={bandData} color={T.purple} /> : <Empty />}
            </Card>

            <Card title="최근 6개월 신고 추이" icon="chart" iconColor={T.blue}>
              <MonthlyTrend data={last6} />
            </Card>

            {/* AI 분석 */}
            <Card title="AI 분석 리포트" icon="brain" iconColor={T.purple}
              right={<span style={{ fontSize: 10, fontWeight: 700, color: T.purple, background: T.purpleSoft, padding: "3px 8px", borderRadius: 10 }}>AI · Risk Scoring</span>}>
              {a.total === 0 ? <Empty /> : (
                <>
                  <div style={{ background: T.purpleSoft, borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 800, color: T.purple, marginBottom: 8 }}>■ 분석 결과 (Findings)</div>
                    {a.findings.map((f, i) => (
                      <div key={i} style={{ fontSize: 12.5, color: T.gray700, lineHeight: 1.75, marginBottom: 4 }}>· {f}</div>
                    ))}
                  </div>
                  <div style={{ background: T.mintSoft, borderRadius: 12, padding: "12px 14px", marginBottom: 12 }}>
                    <div style={{ fontSize: 11.5, fontWeight: 800, color: T.mint, marginBottom: 8 }}>■ 개선 권고 (Actions)</div>
                    {a.actions.map((f, i) => (
                      <div key={i} style={{ fontSize: 12.5, color: T.gray700, lineHeight: 1.75, marginBottom: 4 }}>{i + 1}. {f}</div>
                    ))}
                  </div>
                  {a.keywords.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {a.keywords.map(([w, c]) => (
                        <span key={w} style={{ fontSize: 11.5, fontWeight: 600, color: T.blue, background: T.sky, padding: "5px 10px", borderRadius: 20 }}>#{w} {c}</span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </Card>

            {/* 엑셀 다운로드 */}
            <Card title="분석 리포트 엑셀 다운로드" icon="download" iconColor={T.green}>
              <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                {[["month", "월별"], ["year", "연별"]].map(([k, label]) => (
                  <button key={k} onClick={() => { setMode(k); setPeriod(k === "month" ? periods.months[0] : periods.years[0]); }}
                    style={{ flex: 1, padding: "9px", borderRadius: 10, cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700,
                      border: `1.5px solid ${mode === k ? T.green : T.gray200}`, background: mode === k ? T.mintSoft : T.white, color: mode === k ? T.green : T.gray700 }}>
                    {label} 리포트</button>
                ))}
              </div>
              <select value={period} onChange={e => setPeriod(e.target.value)}
                style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", borderRadius: 10, border: `1.5px solid ${T.gray200}`, fontSize: 14, fontFamily: "inherit", marginBottom: 10, background: T.white, color: T.gray900 }}>
                {(mode === "month" ? periods.months : periods.years).map(p => (
                  <option key={p} value={p}>{mode === "month" ? `${p.split("-")[0]}년 ${p.split("-")[1]}월` : `${p}년`}</option>
                ))}
              </select>
              <button onClick={() => exportExcel(reports, mode, period)}
                style={{ width: "100%", padding: "14px", background: T.green, color: T.white, border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}>
                <Icon name="download" size={18} color={T.white} />엑셀(.xlsx) 다운로드</button>
              <div style={{ fontSize: 11, color: T.gray400, marginTop: 8, lineHeight: 1.6 }}>
                포함 시트: AI분석요약 · 유형별 · 장소별 · 시간대별 · 요일별{mode === "year" ? " · 월별추이" : ""} · 신고원본데이터
              </div>
            </Card>
          </>
        ) : (
          <>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.gray700, marginBottom: 10 }}>신고 목록 ({reports.length}건)</div>
            {reports.length === 0 ? <Empty /> : reports.map(r => {
              const isDone = r.status === "완료";
              return (
                <div key={r.id} onClick={() => setSelected(r)}
                  style={{ background: T.white, borderRadius: 12, padding: "14px 16px", marginBottom: 10, boxShadow: "0 1px 4px rgba(0,0,0,.06)", cursor: "pointer", display: "flex", alignItems: "center", gap: 12, borderLeft: `4px solid ${isDone ? T.green : T.orange}`, opacity: isDone ? 0.75 : 1 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: isDone ? T.mintSoft : T.orangeSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon name={isDone ? "check" : "alert"} size={20} color={isDone ? T.mint : T.orange} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: T.gray900, marginBottom: 2 }}>{r.risk_type}</div>
                    <div style={{ fontSize: 12, color: T.gray500 }}>{r.location} · {r.created_at ? formatDatetime(new Date(r.created_at)) : ""}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: isDone ? T.mintSoft : T.orangeSoft, color: isDone ? T.mint : T.orange }}>{isDone ? "완료" : "대기"}</span>
                    <Icon name="chevronRight" size={16} color={T.gray400} />
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

const btnGhost = { background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)", borderRadius: 8, padding: "7px 9px", cursor: "pointer", display: "flex", alignItems: "center" };
const Empty = () => (
  <div style={{ textAlign: "center", padding: "28px 10px", color: T.gray400 }}>
    <Icon name="list" size={32} color={T.gray200} />
    <div style={{ marginTop: 8, fontSize: 13 }}>데이터가 없습니다</div>
  </div>
);

// ─────────────────────────────────────────────────────────
// 신고 완료 화면 (신고자용 — 관리자 진입 버튼 없음)
// ─────────────────────────────────────────────────────────
function SuccessView({ onNew }) {
  return (
    <div style={{ minHeight: "100vh", background: T.navy, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32, fontFamily: FONT }}>
      <div style={{ width: 88, height: 88, background: "rgba(255,255,255,.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
        <div style={{ width: 64, height: 64, background: T.mint, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name="check" size={32} color={T.white} /></div>
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: T.white, marginBottom: 10, textAlign: "center" }}>신고가 접수되었습니다</div>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,.6)", textAlign: "center", lineHeight: 1.7, marginBottom: 20 }}>
        안전담당자에게 즉시 알림이 전송되었습니다.<br />신속히 확인하여 조치하겠습니다.
      </div>
      <div style={{ background: "rgba(255,255,255,.08)", borderRadius: 12, padding: "12px 20px", marginBottom: 32, display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="wifi" size={16} color="rgba(255,255,255,.7)" />
        <span style={{ color: "rgba(255,255,255,.7)", fontSize: 13 }}>DB 저장 완료 · 관리자 실시간 알림 발송</span>
      </div>
      <button onClick={onNew}
        style={{ width: "100%", maxWidth: 360, padding: "16px", background: T.white, color: T.navy, border: "none", borderRadius: 14, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
        새 신고 작성</button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 신고자 페이지 (신고 기능만 제공 · 관리자 화면 접근 불가)
// ─────────────────────────────────────────────────────────
function ReporterApp() {
  const [screen, setScreen] = useState("form");
  const [now, setNow] = useState(new Date());
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileRef = useRef();
  const [form, setForm] = useState({ location: "", customLocation: "", riskType: "", content: "", reporter: "", photos: [] });

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);

  const set = (key, val) => { setForm(f => ({ ...f, [key]: val })); setErrors(e => ({ ...e, [key]: null })); };
  const handlePhoto = e => {
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => setForm(f => ({ ...f, photos: [...f.photos, ev.target.result] }));
      reader.readAsDataURL(file);
    });
  };
  const removePhoto = idx => setForm(f => ({ ...f, photos: f.photos.filter((_, i) => i !== idx) }));

  const validate = () => {
    const e = {};
    if (!form.location) e.location = "발생 위치를 선택해 주세요";
    if (form.location === "기타" && !form.customLocation.trim()) e.customLocation = "위치를 직접 입력해 주세요";
    if (!form.riskType) e.riskType = "위험 유형을 선택해 주세요";
    if (!form.content.trim()) e.content = "위험 내용을 입력해 주세요";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitting(true); setSubmitError("");
    const { error } = await supabase.from("reports").insert({
      location: form.location === "기타" ? `기타(${form.customLocation})` : form.location,
      risk_type: form.riskType, content: form.content,
      reporter: form.reporter || "익명", photos: form.photos, status: "대기",
    });
    setSubmitting(false);
    if (error) { setSubmitError("저장 중 오류가 발생했습니다.\n(" + error.message + ")"); return; }
    setForm({ location: "", customLocation: "", riskType: "", content: "", reporter: "", photos: [] });
    setErrors({}); setScreen("success");
  };

  if (screen === "success") return <SuccessView onNew={() => setScreen("form")} />;

  const inputStyle = errKey => ({
    width: "100%", boxSizing: "border-box", padding: "13px 14px", borderRadius: 12, fontSize: 15,
    border: `1.5px solid ${errors[errKey] ? T.red : T.gray200}`,
    background: errors[errKey] ? T.redSoft : T.white, color: T.gray900, outline: "none", fontFamily: "inherit",
  });
  const labelStyle = { fontSize: 13, fontWeight: 700, color: T.gray700, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 };

  return (
    <div style={{ minHeight: "100vh", background: T.gray100, fontFamily: FONT }}>
      <div style={{ background: T.navy, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 12px rgba(0,0,0,.2)" }}>
        <div style={{ padding: "14px 20px 10px", display: "flex", alignItems: "center", gap: 10, maxWidth: 520, margin: "0 auto" }}>
          <div style={{ width: 32, height: 32, background: T.orange, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="shield" size={18} color={T.white} /></div>
          <div>
            <div style={{ color: T.white, fontSize: 15, fontWeight: 800, lineHeight: 1.2 }}>아차사고 신고</div>
            <div style={{ color: "rgba(255,255,255,.5)", fontSize: 11 }}>위아마그나 안전관리</div>
          </div>
        </div>
        <div style={{ background: "rgba(0,0,0,.2)", padding: "8px 20px", display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="clock" size={13} color="rgba(255,255,255,.6)" />
          <span style={{ color: "rgba(255,255,255,.75)", fontSize: 13, fontFamily: "monospace" }}>{formatDatetime(now)} 자동 기록</span>
        </div>
      </div>

      <div style={{ padding: "16px 16px 32px", maxWidth: 520, margin: "0 auto" }}>
        <div style={{ background: T.orangeSoft, border: `1px solid ${T.orange}30`, borderRadius: 12, padding: "12px 14px", marginBottom: 20, display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Icon name="alert" size={18} color={T.orange} />
          <div style={{ fontSize: 13, color: T.orange, lineHeight: 1.6, fontWeight: 600 }}>
            아차사고를 발견하셨나요?<br />
            <span style={{ fontWeight: 400 }}>망설이지 말고 지금 바로 신고해 주세요. 작은 신호가 큰 사고를 막습니다.</span>
          </div>
        </div>

        {/* ① 발생 위치 */}
        <Card>
          <div style={labelStyle}><Icon name="location" size={16} color={T.blue} />발생 위치 <span style={{ color: T.red }}>*</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {LOCATIONS.map(loc => (
              <button key={loc} onClick={() => set("location", loc)} style={{
                padding: "12px 8px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
                border: `1.5px solid ${form.location === loc ? T.blue : T.gray200}`,
                background: form.location === loc ? T.sky : T.white,
                color: form.location === loc ? T.blue : T.gray700, fontFamily: "inherit",
              }}>{loc}</button>
            ))}
          </div>
          {errors.location && <div style={{ color: T.red, fontSize: 12, marginTop: 8 }}>⚠ {errors.location}</div>}
          {form.location === "기타" && (
            <input value={form.customLocation} onChange={e => set("customLocation", e.target.value)}
              placeholder="위치를 직접 입력하세요" style={{ ...inputStyle("customLocation"), marginTop: 10 }} />
          )}
          {errors.customLocation && <div style={{ color: T.red, fontSize: 12, marginTop: 4 }}>⚠ {errors.customLocation}</div>}
        </Card>

        {/* ② 보고 일시 */}
        <Card>
          <div style={labelStyle}><Icon name="clock" size={16} color={T.mint} />보고 일시 <span style={{ fontSize: 11, color: T.gray400, fontWeight: 400 }}>(자동 기록)</span></div>
          <div style={{ background: T.mintSoft, borderRadius: 10, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
            <Icon name="clock" size={18} color={T.mint} />
            <span style={{ fontSize: 16, fontWeight: 700, color: T.mint, fontFamily: "monospace" }}>{formatDatetime(now)}</span>
          </div>
        </Card>

        {/* ③ 위험 유형 */}
        <Card>
          <div style={labelStyle}><Icon name="alert" size={16} color={T.orange} />위험 유형 <span style={{ color: T.red }}>*</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {RISK_TYPES.map(type => (
              <button key={type} onClick={() => set("riskType", type)} style={{
                padding: "12px 8px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
                border: `1.5px solid ${form.riskType === type ? T.orange : T.gray200}`,
                background: form.riskType === type ? T.orangeSoft : T.white,
                color: form.riskType === type ? T.orange : T.gray700, fontFamily: "inherit",
              }}>{type}</button>
            ))}
          </div>
          {errors.riskType && <div style={{ color: T.red, fontSize: 12, marginTop: 8 }}>⚠ {errors.riskType}</div>}
        </Card>

        {/* ④ 위험 내용 */}
        <Card>
          <div style={labelStyle}><Icon name="alert" size={16} color={T.red} />위험 내용 <span style={{ color: T.red }}>*</span></div>
          <textarea value={form.content} onChange={e => set("content", e.target.value)}
            placeholder={"어떤 상황이었는지 구체적으로 작성해 주세요.\n예) 조립 1라인 컨베이어 안전커버가 열린 상태로 가동되어 끼임 위험을 느꼈습니다."}
            rows={5} style={{ ...inputStyle("content"), resize: "none", lineHeight: 1.7 }} />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            {errors.content ? <span style={{ color: T.red, fontSize: 12 }}>⚠ {errors.content}</span> : <span />}
            <span style={{ fontSize: 12, color: T.gray400 }}>{form.content.length}자</span>
          </div>
        </Card>

        {/* ⑤ 사진 첨부 */}
        <Card>
          <div style={labelStyle}><Icon name="camera" size={16} color={T.gray700} />사진 첨부 <span style={{ fontSize: 11, color: T.gray400, fontWeight: 400 }}>(선택)</span></div>
          {form.photos.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 10 }}>
              {form.photos.map((p, i) => (
                <div key={i} style={{ position: "relative", aspectRatio: "1" }}>
                  <img src={p} alt={`첨부${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 10, border: `1px solid ${T.gray200}` }} />
                  <button onClick={() => removePhoto(i)}
                    style={{ position: "absolute", top: 4, right: 4, width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,.6)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="x" size={12} color={T.white} /></button>
                </div>
              ))}
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" capture="environment" multiple onChange={handlePhoto} style={{ display: "none" }} />
          <button onClick={() => fileRef.current.click()}
            style={{ width: "100%", padding: "14px", background: T.gray50, border: `1.5px dashed ${T.gray200}`, borderRadius: 12, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: T.gray500, fontFamily: "inherit" }}>
            <Icon name="plus" size={22} color={T.gray400} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>사진 추가</span>
            <span style={{ fontSize: 11, color: T.gray400 }}>현장 상황을 촬영하여 첨부해 주세요</span>
          </button>
        </Card>

        {/* ⑥ 신고자 */}
        <Card style={{ marginBottom: 24 }}>
          <div style={labelStyle}><Icon name="user" size={16} color={T.gray500} />신고자 이름 <span style={{ fontSize: 11, color: T.gray400, fontWeight: 400 }}>(선택 · 익명 가능)</span></div>
          <input value={form.reporter} onChange={e => set("reporter", e.target.value)}
            placeholder="이름을 입력하지 않으면 익명으로 처리됩니다" style={inputStyle()} />
        </Card>

        {submitError && (
          <div style={{ background: T.redSoft, border: `1px solid ${T.red}30`, borderRadius: 12, padding: "12px 14px", marginBottom: 16, fontSize: 13, color: T.red, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>⚠ {submitError}</div>
        )}

        <button onClick={handleSubmit} disabled={submitting}
          style={{ width: "100%", padding: "18px", borderRadius: 16, border: "none", cursor: submitting ? "not-allowed" : "pointer",
            background: submitting ? T.gray400 : T.navy, color: T.white, fontSize: 17, fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontFamily: "inherit" }}>
          <Icon name="send" size={20} color={T.white} />{submitting ? "저장 중..." : "신고 접수하기"}
        </button>
        <div style={{ textAlign: "center", marginTop: 14, fontSize: 12, color: T.gray400 }}>
          신고 내용은 DB에 저장되며 안전담당자에게만 전달됩니다
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 라우터 — #/admin 은 관리자, 그 외는 신고자 전용
// ─────────────────────────────────────────────────────────
export default function App() {
  const [hash, setHash] = useState(window.location.hash);
  const [authed, setAuthed] = useState(sessionStorage.getItem("admin_ok") === "1");
  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const isAdmin = hash.startsWith("#/admin");
  if (!isAdmin) return <ReporterApp />;
  if (!authed) return <AdminLogin onOk={() => setAuthed(true)} />;
  return <AdminDashboard />;
}
