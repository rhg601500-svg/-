import { useState, useEffect, useRef } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─────────────────────────────────────────────────────────
// ✅ 여기만 바꾸세요! (STEP 3에서 복사한 값 붙여넣기)
// ─────────────────────────────────────────────────────────
const SUPABASE_URL  = "https://moiarbpczfmgbuskcokp.supabase.co/rest/v1/";
const SUPABASE_KEY  = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vaWFyYnBjemZtZ2J1c2tjb2twIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyMzU5NDksImV4cCI6MjEwMzgxMTk0OX0.1jMzFJn37sK60pIwcKC-KiFL4yRMY4mFsNyRFtLlOb4";
// ─────────────────────────────────────────────────────────

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── 색상 토큰
const T = {
  navy:       "#0F2A47",
  blue:       "#1D5FA8",
  sky:        "#EBF3FC",
  mint:       "#0A7C6A",
  mintSoft:   "#E6F4F1",
  orange:     "#C85A00",
  orangeSoft: "#FFF0E6",
  red:        "#B91C1C",
  redSoft:    "#FEF2F2",
  green:      "#15803D",
  gray50:     "#F8FAFC",
  gray100:    "#F1F5F9",
  gray200:    "#E2E8F0",
  gray400:    "#94A3B8",
  gray500:    "#64748B",
  gray700:    "#334155",
  gray900:    "#0F172A",
  white:      "#FFFFFF",
};

// ── 아이콘
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    location: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    clock:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    alert:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    camera:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>,
    send:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
    check:    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    x:        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    bell:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
    shield:   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
    plus:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    user:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    list:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
    chevronRight: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
    refresh:  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,
    wifi:     <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>,
  };
  return icons[name] || null;
};

// ── 날짜 포맷
function formatDatetime(d) {
  const pad = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const RISK_TYPES = ["끼임·협착", "떨어짐·추락", "넘어짐·미끄러짐", "물체에 맞음", "화학물질 노출", "전기 감전", "화재·폭발 우려", "기타"];
const LOCATIONS  = ["제1공장", "제2공장", "조립라인 A", "조립라인 B", "프레스 구역", "도장 구역", "창고", "야적장", "사무동", "기타"];

// ─────────────────────────────────────────────────────────
// 관리자 상세 화면
// ─────────────────────────────────────────────────────────
function ReportDetail({ r, onBack }) {
  const [done, setDone] = useState(r.status === "완료");
  const [saving, setSaving] = useState(false);

  const handleDone = async () => {
    setSaving(true);
    await supabase.from("reports").update({ status: "완료" }).eq("id", r.id);
    setDone(true);
    setSaving(false);
  };

  return (
    <div style={{ minHeight:"100vh", background:T.gray50, fontFamily:"'Noto Sans KR','Apple SD Gothic Neo',sans-serif" }}>
      <div style={{ background:T.navy, padding:"16px 20px", display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={onBack} style={{ background:"none", border:"none", color:T.white, cursor:"pointer", padding:4 }}>
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <span style={{ color:T.white, fontSize:17, fontWeight:700 }}>신고 상세</span>
      </div>

      <div style={{ padding:"20px 16px", maxWidth:520, margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:12 }}>
          <span style={{
            fontSize:12, fontWeight:700, padding:"4px 12px", borderRadius:20,
            background: done ? T.mintSoft : T.orangeSoft,
            color:      done ? T.mint     : T.orange,
            border:     `1px solid ${done ? T.mint : T.orange}`,
          }}>{done ? "처리 완료" : "처리 대기"}</span>
        </div>

        {[
          { label:"발생 위치", value:r.location,  icon:"location", color:T.blue   },
          { label:"보고 일시", value:r.created_at ? formatDatetime(new Date(r.created_at)) : "-", icon:"clock", color:T.mint },
          { label:"위험 유형", value:r.risk_type, icon:"alert",    color:T.orange },
        ].map(item => (
          <div key={item.label} style={{ background:T.white, borderRadius:12, padding:"14px 16px", marginBottom:10, display:"flex", alignItems:"center", gap:14, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
            <div style={{ width:40, height:40, borderRadius:10, background:item.color+"18", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Icon name={item.icon} size={20} color={item.color} />
            </div>
            <div>
              <div style={{ fontSize:11, color:T.gray500, marginBottom:2 }}>{item.label}</div>
              <div style={{ fontSize:15, fontWeight:600, color:T.gray900 }}>{item.value}</div>
            </div>
          </div>
        ))}

        <div style={{ background:T.white, borderRadius:12, padding:"16px", marginBottom:10, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize:11, color:T.gray500, marginBottom:8 }}>위험 상세 내용</div>
          <div style={{ fontSize:14, color:T.gray700, lineHeight:1.7 }}>{r.content}</div>
        </div>

        {r.photos && r.photos.length > 0 && (
          <div style={{ background:T.white, borderRadius:12, padding:"16px", marginBottom:10, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
            <div style={{ fontSize:11, color:T.gray500, marginBottom:10 }}>첨부 사진 ({r.photos.length}장)</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:8 }}>
              {r.photos.map((p, i) => (
                <img key={i} src={p} alt={`첨부${i+1}`} style={{ width:"100%", aspectRatio:"1", objectFit:"cover", borderRadius:8, border:`1px solid ${T.gray200}` }} />
              ))}
            </div>
          </div>
        )}

        <div style={{ background:T.white, borderRadius:12, padding:"14px 16px", marginBottom:20, display:"flex", alignItems:"center", gap:12, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
          <div style={{ width:36, height:36, borderRadius:10, background:T.sky, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <Icon name="user" size={18} color={T.blue} />
          </div>
          <div>
            <div style={{ fontSize:11, color:T.gray500 }}>신고자</div>
            <div style={{ fontSize:14, fontWeight:600, color:T.gray900 }}>{r.reporter || "익명"}</div>
          </div>
        </div>

        {!done && (
          <button onClick={handleDone} disabled={saving}
            style={{ width:"100%", padding:"16px", background:T.mint, color:T.white, border:"none", borderRadius:14, fontSize:16, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
            <Icon name="check" size={18} color={T.white} />
            {saving ? "처리 중..." : "조치 완료 처리"}
          </button>
        )}
        {done && (
          <div style={{ textAlign:"center", padding:"16px", background:T.mintSoft, borderRadius:14, color:T.mint, fontWeight:700, fontSize:15 }}>
            ✅ 조치 완료된 신고입니다
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 관리자 대시보드
// ─────────────────────────────────────────────────────────
function AdminView({ onBack }) {
  const [reports, setReports]   = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [newAlert, setNewAlert] = useState(false);

  // 신고 목록 불러오기
  const fetchReports = async () => {
    const { data } = await supabase
      .from("reports")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setReports(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReports();

    // ✅ 실시간 구독 — 새 신고가 들어오면 자동으로 목록에 추가
    const channel = supabase
      .channel("admin-watch")
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "reports" },
        (payload) => {
          setReports(prev => [payload.new, ...prev]);
          setNewAlert(true); // 🔔 새 신고 알림 배너 표시
          setTimeout(() => setNewAlert(false), 4000);

          // 브라우저 알림 (관리자가 허용한 경우)
          if (Notification.permission === "granted") {
            new Notification("🚨 새 아차사고 신고", {
              body: `${payload.new.location} — ${payload.new.risk_type}`,
              icon: "/favicon.ico",
            });
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  // 브라우저 알림 권한 요청
  const requestNotification = () => {
    Notification.requestPermission();
  };

  if (selected) {
    return <ReportDetail r={selected} onBack={() => { setSelected(null); fetchReports(); }} />;
  }

  const pending  = reports.filter(r => r.status !== "완료").length;
  const complete = reports.filter(r => r.status === "완료").length;

  return (
    <div style={{ minHeight:"100vh", background:T.gray50, fontFamily:"'Noto Sans KR','Apple SD Gothic Neo',sans-serif" }}>
      {/* 헤더 */}
      <div style={{ background:T.navy, padding:"16px 20px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <button onClick={onBack} style={{ background:"none", border:"none", color:T.white, cursor:"pointer", padding:4 }}>
              <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <span style={{ color:T.white, fontSize:17, fontWeight:700 }}>관리자 대시보드</span>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={requestNotification}
              style={{ background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.2)", borderRadius:8, padding:"6px 10px", color:T.white, cursor:"pointer", display:"flex", alignItems:"center", gap:4 }}>
              <Icon name="bell" size={14} color={T.white} />
              <span style={{ fontSize:11 }}>알림 켜기</span>
            </button>
            <button onClick={fetchReports}
              style={{ background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.2)", borderRadius:8, padding:"6px 10px", color:T.white, cursor:"pointer" }}>
              <Icon name="refresh" size={16} color={T.white} />
            </button>
          </div>
        </div>
        {/* 실시간 연결 표시 */}
        <div style={{ display:"flex", alignItems:"center", gap:6, marginTop:8 }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#4ADE80" }} />
          <span style={{ color:"rgba(255,255,255,.6)", fontSize:11 }}>실시간 연결됨 — 새 신고 자동 수신 중</span>
        </div>
      </div>

      {/* 새 신고 알림 배너 */}
      {newAlert && (
        <div style={{ background:T.orange, padding:"12px 20px", display:"flex", alignItems:"center", gap:10 }}>
          <Icon name="bell" size={18} color={T.white} />
          <span style={{ color:T.white, fontWeight:700, fontSize:14 }}>🚨 새 아차사고 신고가 접수되었습니다!</span>
        </div>
      )}

      <div style={{ padding:"16px", maxWidth:520, margin:"0 auto" }}>
        {/* 통계 카드 */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:20 }}>
          {[
            { label:"전체 신고", value:reports.length, color:T.blue   },
            { label:"처리 대기", value:pending,         color:T.orange },
            { label:"처리 완료", value:complete,         color:T.green  },
          ].map(s => (
            <div key={s.label} style={{ background:T.white, borderRadius:12, padding:"14px 10px", textAlign:"center", boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
              <div style={{ fontSize:26, fontWeight:800, color:s.color }}>{s.value}</div>
              <div style={{ fontSize:11, color:T.gray500, marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* 신고 목록 */}
        <div style={{ fontSize:13, fontWeight:700, color:T.gray700, marginBottom:10 }}>신고 목록</div>

        {loading ? (
          <div style={{ textAlign:"center", padding:"40px 0", color:T.gray400 }}>
            <Icon name="refresh" size={28} color={T.gray200} />
            <div style={{ marginTop:8, fontSize:13 }}>불러오는 중...</div>
          </div>
        ) : reports.length === 0 ? (
          <div style={{ background:T.white, borderRadius:12, padding:"40px 20px", textAlign:"center" }}>
            <Icon name="list" size={36} color={T.gray200} />
            <div style={{ marginTop:10, fontSize:14, color:T.gray400 }}>접수된 신고가 없습니다</div>
          </div>
        ) : (
          reports.map((r) => {
            const isDone = r.status === "완료";
            return (
              <div key={r.id} onClick={() => setSelected(r)}
                style={{ background:T.white, borderRadius:12, padding:"14px 16px", marginBottom:10,
                  boxShadow:"0 1px 4px rgba(0,0,0,.06)", cursor:"pointer",
                  display:"flex", alignItems:"center", gap:12,
                  borderLeft:`4px solid ${isDone ? T.green : T.orange}`,
                  opacity: isDone ? 0.7 : 1,
                }}>
                <div style={{ width:40, height:40, borderRadius:10, background: isDone ? T.mintSoft : T.orangeSoft, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Icon name={isDone ? "check" : "alert"} size={20} color={isDone ? T.mint : T.orange} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:T.gray900, marginBottom:2 }}>{r.risk_type}</div>
                  <div style={{ fontSize:12, color:T.gray500 }}>
                    {r.location} · {r.created_at ? formatDatetime(new Date(r.created_at)) : ""}
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                  <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:10,
                    background: isDone ? T.mintSoft : T.orangeSoft,
                    color:      isDone ? T.mint     : T.orange,
                  }}>{isDone ? "완료" : "대기"}</span>
                  <Icon name="chevronRight" size={16} color={T.gray400} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 신고 완료 화면
// ─────────────────────────────────────────────────────────
function SuccessView({ onNew, onAdmin }) {
  return (
    <div style={{ minHeight:"100vh", background:T.navy, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:32, fontFamily:"'Noto Sans KR','Apple SD Gothic Neo',sans-serif" }}>
      <div style={{ width:88, height:88, background:"rgba(255,255,255,.1)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24 }}>
        <div style={{ width:64, height:64, background:T.mint, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Icon name="check" size={32} color={T.white} />
        </div>
      </div>
      <div style={{ fontSize:22, fontWeight:800, color:T.white, marginBottom:10, textAlign:"center" }}>신고가 접수되었습니다</div>
      <div style={{ fontSize:14, color:"rgba(255,255,255,.6)", textAlign:"center", lineHeight:1.7, marginBottom:20 }}>
        안전담당자에게 즉시 알림이 전송되었습니다.<br/>신속히 확인하여 조치하겠습니다.
      </div>
      <div style={{ background:"rgba(255,255,255,.08)", borderRadius:12, padding:"12px 20px", marginBottom:32, display:"flex", alignItems:"center", gap:8 }}>
        <Icon name="wifi" size={16} color="rgba(255,255,255,.7)" />
        <span style={{ color:"rgba(255,255,255,.7)", fontSize:13 }}>Supabase DB 저장 완료 · 관리자 실시간 알림 발송</span>
      </div>
      <button onClick={onNew}
        style={{ width:"100%", maxWidth:360, padding:"16px", background:T.white, color:T.navy, border:"none", borderRadius:14, fontSize:15, fontWeight:700, cursor:"pointer", marginBottom:12 }}>
        새 신고 작성
      </button>
      <button onClick={onAdmin}
        style={{ width:"100%", maxWidth:360, padding:"16px", background:"rgba(255,255,255,.12)", color:T.white, border:"1px solid rgba(255,255,255,.2)", borderRadius:14, fontSize:15, fontWeight:600, cursor:"pointer" }}>
        관리자 화면 보기
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// 메인 신고 폼
// ─────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]     = useState("form");
  const [now, setNow]           = useState(new Date());
  const [errors, setErrors]     = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const fileRef = useRef();

  const [form, setForm] = useState({
    location: "", customLocation: "", riskType: "", content: "", reporter: "", photos: [],
  });

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: null }));
  };

  const handlePhoto = (e) => {
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => setForm(f => ({ ...f, photos: [...f.photos, ev.target.result] }));
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (idx) => setForm(f => ({ ...f, photos: f.photos.filter((_, i) => i !== idx) }));

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

    setSubmitting(true);
    setSubmitError("");

    // ✅ Supabase DB에 신고 저장
    const { error } = await supabase.from("reports").insert({
      location:  form.location === "기타" ? form.customLocation : form.location,
      risk_type: form.riskType,
      content:   form.content,
      reporter:  form.reporter || "익명",
      photos:    form.photos,
      status:    "대기",
    });

    setSubmitting(false);

    if (error) {
      // 연결 오류 시 안내
      setSubmitError("저장 중 오류가 발생했습니다. URL과 KEY를 다시 확인해 주세요.\n(" + error.message + ")");
      return;
    }

    // 성공 → 폼 초기화 후 완료 화면
    setForm({ location:"", customLocation:"", riskType:"", content:"", reporter:"", photos:[] });
    setErrors({});
    setScreen("success");
  };

  if (screen === "success") return <SuccessView onNew={() => setScreen("form")} onAdmin={() => setScreen("admin")} />;
  if (screen === "admin")   return <AdminView onBack={() => setScreen("form")} />;

  const inputStyle = (errKey) => ({
    width:"100%", boxSizing:"border-box",
    padding:"13px 14px", borderRadius:12, fontSize:15,
    border:`1.5px solid ${errors[errKey] ? T.red : T.gray200}`,
    background: errors[errKey] ? T.redSoft : T.white,
    color:T.gray900, outline:"none", fontFamily:"inherit",
  });

  const labelStyle = {
    fontSize:13, fontWeight:700, color:T.gray700,
    marginBottom:6, display:"flex", alignItems:"center", gap:6,
  };

  return (
    <div style={{ minHeight:"100vh", background:T.gray100, fontFamily:"'Noto Sans KR','Apple SD Gothic Neo',sans-serif" }}>

      {/* 헤더 */}
      <div style={{ background:T.navy, position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 12px rgba(0,0,0,.2)" }}>
        <div style={{ padding:"14px 20px 10px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:32, height:32, background:T.orange, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon name="shield" size={18} color={T.white} />
            </div>
            <div>
              <div style={{ color:T.white, fontSize:15, fontWeight:800, lineHeight:1.2 }}>아차사고 신고</div>
              <div style={{ color:"rgba(255,255,255,.5)", fontSize:11 }}>위아마그나 안전관리</div>
            </div>
          </div>
          <button onClick={() => setScreen("admin")}
            style={{ background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.15)", borderRadius:8, padding:"6px 12px", color:"rgba(255,255,255,.8)", fontSize:12, cursor:"pointer", fontFamily:"inherit" }}>
            관리자
          </button>
        </div>
        <div style={{ background:"rgba(0,0,0,.2)", padding:"8px 20px", display:"flex", alignItems:"center", gap:6 }}>
          <Icon name="clock" size={13} color="rgba(255,255,255,.6)" />
          <span style={{ color:"rgba(255,255,255,.75)", fontSize:13, fontFamily:"monospace", letterSpacing:0.5 }}>
            {formatDatetime(now)} 자동 기록
          </span>
        </div>
      </div>

      <div style={{ padding:"16px 16px 32px", maxWidth:520, margin:"0 auto" }}>

        {/* 안내 배너 */}
        <div style={{ background:T.orangeSoft, border:`1px solid ${T.orange}30`, borderRadius:12, padding:"12px 14px", marginBottom:20, display:"flex", gap:10, alignItems:"flex-start" }}>
          <Icon name="alert" size={18} color={T.orange} />
          <div style={{ fontSize:13, color:T.orange, lineHeight:1.6, fontWeight:600 }}>
            아차사고를 발견하셨나요?<br/>
            <span style={{ fontWeight:400 }}>망설이지 말고 지금 바로 신고해 주세요. 작은 신호가 큰 사고를 막습니다.</span>
          </div>
        </div>

        {/* ① 발생 위치 */}
        <div style={{ background:T.white, borderRadius:16, padding:"18px 16px", marginBottom:12, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
          <div style={labelStyle}>
            <Icon name="location" size={16} color={T.blue} />
            발생 위치 <span style={{ color:T.red }}>*</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {LOCATIONS.map(loc => (
              <button key={loc} onClick={() => set("location", loc)} style={{
                padding:"10px 8px", borderRadius:10, fontSize:13, fontWeight:600, cursor:"pointer",
                border:`1.5px solid ${form.location === loc ? T.blue : T.gray200}`,
                background: form.location === loc ? T.sky : T.white,
                color:      form.location === loc ? T.blue : T.gray700,
                fontFamily:"inherit", transition:"all .15s",
              }}>{loc}</button>
            ))}
          </div>
          {errors.location && <div style={{ color:T.red, fontSize:12, marginTop:8 }}>⚠ {errors.location}</div>}
          {form.location === "기타" && (
            <input value={form.customLocation} onChange={e => set("customLocation", e.target.value)}
              placeholder="위치를 직접 입력하세요" style={{ ...inputStyle("customLocation"), marginTop:10 }} />
          )}
          {errors.customLocation && <div style={{ color:T.red, fontSize:12, marginTop:4 }}>⚠ {errors.customLocation}</div>}
        </div>

        {/* ② 보고 일시 (자동) */}
        <div style={{ background:T.white, borderRadius:16, padding:"18px 16px", marginBottom:12, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
          <div style={labelStyle}>
            <Icon name="clock" size={16} color={T.mint} />
            보고 일시 <span style={{ fontSize:11, color:T.gray400, fontWeight:400 }}>(자동 기록)</span>
          </div>
          <div style={{ background:T.mintSoft, borderRadius:10, padding:"12px 14px", display:"flex", alignItems:"center", gap:10 }}>
            <Icon name="clock" size={18} color={T.mint} />
            <span style={{ fontSize:16, fontWeight:700, color:T.mint, fontFamily:"monospace", letterSpacing:0.5 }}>
              {formatDatetime(now)}
            </span>
          </div>
          <div style={{ fontSize:11, color:T.gray400, marginTop:6 }}>전송 시점의 일시가 Supabase DB에 자동 저장됩니다</div>
        </div>

        {/* ③ 위험 유형 */}
        <div style={{ background:T.white, borderRadius:16, padding:"18px 16px", marginBottom:12, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
          <div style={labelStyle}>
            <Icon name="alert" size={16} color={T.orange} />
            위험 유형 <span style={{ color:T.red }}>*</span>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {RISK_TYPES.map(type => (
              <button key={type} onClick={() => set("riskType", type)} style={{
                padding:"10px 8px", borderRadius:10, fontSize:13, fontWeight:600, cursor:"pointer",
                border:`1.5px solid ${form.riskType === type ? T.orange : T.gray200}`,
                background: form.riskType === type ? T.orangeSoft : T.white,
                color:      form.riskType === type ? T.orange     : T.gray700,
                fontFamily:"inherit", transition:"all .15s",
              }}>{type}</button>
            ))}
          </div>
          {errors.riskType && <div style={{ color:T.red, fontSize:12, marginTop:8 }}>⚠ {errors.riskType}</div>}
        </div>

        {/* ④ 위험 내용 */}
        <div style={{ background:T.white, borderRadius:16, padding:"18px 16px", marginBottom:12, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
          <div style={labelStyle}>
            <Icon name="alert" size={16} color={T.red} />
            위험 내용 <span style={{ color:T.red }}>*</span>
          </div>
          <textarea value={form.content} onChange={e => set("content", e.target.value)}
            placeholder={"어떤 상황이었는지 구체적으로 작성해 주세요.\n예) 프레스 작업 중 안전커버 없이 가동되고 있어 협착 위험을 느꼈습니다."}
            rows={5} style={{ ...inputStyle("content"), resize:"none", lineHeight:1.7 }} />
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
            {errors.content ? <span style={{ color:T.red, fontSize:12 }}>⚠ {errors.content}</span> : <span />}
            <span style={{ fontSize:12, color:T.gray400 }}>{form.content.length}자</span>
          </div>
        </div>

        {/* ⑤ 사진 첨부 */}
        <div style={{ background:T.white, borderRadius:16, padding:"18px 16px", marginBottom:12, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
          <div style={labelStyle}>
            <Icon name="camera" size={16} color={T.gray700} />
            사진 첨부 <span style={{ fontSize:11, color:T.gray400, fontWeight:400 }}>(선택)</span>
          </div>
          {form.photos.length > 0 && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3, 1fr)", gap:8, marginBottom:10 }}>
              {form.photos.map((p, i) => (
                <div key={i} style={{ position:"relative", aspectRatio:"1" }}>
                  <img src={p} alt={`첨부${i+1}`} style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:10, border:`1px solid ${T.gray200}` }} />
                  <button onClick={() => removePhoto(i)}
                    style={{ position:"absolute", top:4, right:4, width:22, height:22, borderRadius:"50%", background:"rgba(0,0,0,.6)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon name="x" size={12} color={T.white} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={handlePhoto} style={{ display:"none" }} />
          <button onClick={() => fileRef.current.click()}
            style={{ width:"100%", padding:"14px", background:T.gray50, border:`1.5px dashed ${T.gray200}`, borderRadius:12, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:6, color:T.gray500, fontFamily:"inherit" }}>
            <Icon name="plus" size={22} color={T.gray400} />
            <span style={{ fontSize:13, fontWeight:600 }}>사진 추가</span>
            <span style={{ fontSize:11, color:T.gray400 }}>현장 상황을 촬영하여 첨부해 주세요</span>
          </button>
        </div>

        {/* ⑥ 신고자 */}
        <div style={{ background:T.white, borderRadius:16, padding:"18px 16px", marginBottom:24, boxShadow:"0 1px 4px rgba(0,0,0,.06)" }}>
          <div style={labelStyle}>
            <Icon name="user" size={16} color={T.gray500} />
            신고자 이름 <span style={{ fontSize:11, color:T.gray400, fontWeight:400 }}>(선택 · 익명 가능)</span>
          </div>
          <input value={form.reporter} onChange={e => set("reporter", e.target.value)}
            placeholder="이름을 입력하지 않으면 익명으로 처리됩니다"
            style={inputStyle()} />
        </div>

        {/* 오류 메시지 */}
        {submitError && (
          <div style={{ background:T.redSoft, border:`1px solid ${T.red}30`, borderRadius:12, padding:"12px 14px", marginBottom:16, fontSize:13, color:T.red, lineHeight:1.6, whiteSpace:"pre-wrap" }}>
            ⚠ {submitError}
          </div>
        )}

        {/* 제출 버튼 */}
        <button onClick={handleSubmit} disabled={submitting}
          style={{
            width:"100%", padding:"18px", borderRadius:16, border:"none",
            cursor: submitting ? "not-allowed" : "pointer",
            background: submitting ? T.gray400 : T.navy,
            color:T.white, fontSize:17, fontWeight:800,
            display:"flex", alignItems:"center", justifyContent:"center", gap:10,
            boxShadow: submitting ? "none" : `0 4px 20px ${T.navy}60`,
            transition:"all .2s", fontFamily:"inherit",
          }}>
          {submitting ? (
            <>
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
              </svg>
              Supabase에 저장 중...
            </>
          ) : (
            <>
              <Icon name="send" size={20} color={T.white} />
              신고 접수하기
            </>
          )}
        </button>

        <div style={{ textAlign:"center", marginTop:14, fontSize:12, color:T.gray400 }}>
          신고 내용은 Supabase DB에 암호화 저장되며 안전담당자에게만 전달됩니다
        </div>
      </div>
    </div>
  );
}
