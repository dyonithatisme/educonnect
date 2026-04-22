// Wanted UI Kit — job card + job detail
const { useState: _useState2 } = React;

function JobCard({ job, onClick, bookmarked, onBookmark }) {
  const [hover, setHover] = _useState2(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        background: "#fff", borderRadius: 16, cursor: "pointer", overflow: "hidden",
        boxShadow: hover
          ? "0 2px 10px 0 rgba(23,23,23,.10), 0 12px 24px -4px rgba(23,23,23,.12)"
          : "0 1px 4px 0 rgba(23,23,23,.06), 0 2px 8px 0 rgba(23,23,23,.07)",
        transition: "box-shadow 180ms cubic-bezier(.4,0,.2,1)",
        display: "flex", flexDirection: "column",
      }}>
      <div style={{
        aspectRatio: "4 / 3", background: job.cover || "linear-gradient(135deg, #eaf2fe 0%, #f0ecfe 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <button onClick={e => { e.stopPropagation(); onBookmark?.(); }}
          style={{
            position: "absolute", top: 10, right: 10, width: 36, height: 36, borderRadius: 9999,
            border: "none", background: "rgba(255,255,255,.88)", backdropFilter: "blur(8px)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            color: bookmarked ? "#0066ff" : "#17181a",
          }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"}
            stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      </div>
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 4 }}>
        <div style={{ font: "700 16px/1.4 var(--wds-font-sans)", color: "#17181a", letterSpacing: "-.002em" }}>{job.title}</div>
        <div style={{ font: "500 13px/1.4 var(--wds-font-sans)", color: "rgba(55,56,60,.88)" }}>{job.company}</div>
        <div style={{ font: "500 12px/1.334 var(--wds-font-sans)", color: "rgba(55,56,60,.61)" }}>
          {job.location} · 경력 {job.years}
        </div>
        <div style={{ marginTop: 10, font: "700 13px/1 var(--wds-font-sans)", color: "#0066ff" }}>
          채용보상금 {job.reward}만원
        </div>
      </div>
    </div>
  );
}

function JobDetail({ job, onClose, onApply, applied }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,.56)",
      display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 50,
      animation: "wds-fade-in 180ms cubic-bezier(0,0,.2,1) both",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: "24px 24px 0 0", width: "100%", maxWidth: 720, maxHeight: "90vh",
        overflow: "auto", padding: 0, position: "relative",
        animation: "wds-slide-up 260ms cubic-bezier(0,0,.2,1) both",
      }}>
        <div style={{
          aspectRatio: "2 / 1", background: job.cover || "linear-gradient(135deg, #eaf2fe 0%, #f0ecfe 100%)",
          position: "relative",
        }}>
          <button onClick={onClose} style={{
            position: "absolute", top: 16, right: 16, width: 40, height: 40, borderRadius: 9999,
            border: "none", background: "rgba(255,255,255,.88)", backdropFilter: "blur(8px)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}><Icon name="x" size={20} /></button>
        </div>
        <div style={{ padding: "32px 40px 120px" }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            <Chip tone="blue">{job.category || "Design"}</Chip>
            <Chip tone="neutral">경력 {job.years}</Chip>
            <Chip tone="red">D-{job.deadline || 5}</Chip>
          </div>
          <h1 style={{ font: "700 32px/1.375 var(--wds-font-sans)", letterSpacing: "-.0253em", margin: "0 0 8px", color: "#17181a" }}>
            {job.title}
          </h1>
          <div style={{ font: "500 16px/1.5 var(--wds-font-sans)", color: "rgba(55,56,60,.88)", marginBottom: 32 }}>
            {job.company} · {job.location}
          </div>
          <h2 style={{ font: "700 20px/1.4 var(--wds-font-sans)", letterSpacing: "-.012em", margin: "0 0 12px" }}>주요 업무</h2>
          <ul style={{ font: "500 15px/1.6 var(--wds-font-sans)", color: "rgba(55,56,60,.88)", paddingLeft: 20, marginBottom: 28 }}>
            <li>Wanted Design System 유지보수 및 확장</li>
            <li>프로덕트 디자이너와의 긴밀한 협업</li>
            <li>iOS / Android / Web 공통 컴포넌트 설계</li>
          </ul>
          <h2 style={{ font: "700 20px/1.4 var(--wds-font-sans)", letterSpacing: "-.012em", margin: "0 0 12px" }}>자격 요건</h2>
          <ul style={{ font: "500 15px/1.6 var(--wds-font-sans)", color: "rgba(55,56,60,.88)", paddingLeft: 20, marginBottom: 28 }}>
            <li>관련 경력 {job.years} 이상</li>
            <li>Figma를 활용한 시스템 설계 경험</li>
            <li>토큰 기반 디자인 시스템 운영 경험</li>
          </ul>
          <div style={{
            display: "flex", alignItems: "center", gap: 16, padding: "20px 24px",
            background: "#f7f7f8", borderRadius: 16, marginTop: 40,
          }}>
            <div>
              <div style={{ font: "500 12px/1.334 var(--wds-font-sans)", color: "rgba(55,56,60,.61)", letterSpacing: ".025em" }}>채용보상금</div>
              <div style={{ font: "700 24px/1.3 var(--wds-font-sans)", letterSpacing: "-.023em", color: "#0066ff" }}>{job.reward}만원</div>
            </div>
          </div>
        </div>
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: 20, background: "rgba(255,255,255,.92)", backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(112,115,124,.14)",
          display: "flex", gap: 8,
        }}>
          <Button variant="line" leadingIcon="bookmark">북마크</Button>
          <Button variant="line" leadingIcon="share">공유</Button>
          <div style={{ flex: 1 }} />
          <Button variant={applied ? "secondary" : "primary"} size="lg" onClick={onApply} disabled={applied}>
            {applied ? "지원 완료" : "지원하기"}
          </Button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { JobCard, JobDetail });
