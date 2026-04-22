// Wanted UI Kit — layout components
const { useState: _useState } = React;

function TopNav({ route, onNavigate, unread = 3 }) {
  const tabs = [
    { id: "jobs", label: "채용" },
    { id: "pay", label: "커리어" },
    { id: "gigs", label: "프리랜서" },
    { id: "resume", label: "이력서" },
    { id: "hr", label: "기업" },
  ];
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 40,
      height: 64, background: "rgba(255,255,255,0.88)", backdropFilter: "saturate(180%) blur(12px)",
      borderBottom: "1px solid rgba(112,115,124,.14)",
      display: "flex", alignItems: "center", padding: "0 48px", gap: 36,
    }}>
      <a href="#" onClick={e => { e.preventDefault(); onNavigate("jobs"); }}
         style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
        <img src="../../assets/logos/wanted-symbol.png" alt="Wanted" style={{ height: 28, width: "auto" }} />
        <img src="../../assets/logos/wanted-logotype.svg" alt="wanted" style={{ height: 16, width: "auto" }} />
      </a>
      <nav style={{ display: "flex", gap: 28 }}>
        {tabs.map(t => (
          <a key={t.id} href="#" onClick={e => { e.preventDefault(); onNavigate(t.id); }}
            style={{
              font: "600 15px/1 var(--wds-font-sans)",
              color: route === t.id ? "#17181a" : "rgba(55,56,60,.61)",
              textDecoration: "none",
              paddingBottom: 4,
              borderBottom: route === t.id ? "2px solid #17181a" : "2px solid transparent",
            }}>{t.label}</a>
        ))}
      </nav>
      <div style={{ flex: 1 }} />
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <IconButton name="search" onClick={() => onNavigate("search")} />
        <div style={{ position: "relative" }}>
          <IconButton name="bell" />
          {unread > 0 && <span style={{
            position: "absolute", top: 6, right: 6, minWidth: 16, height: 16, padding: "0 4px",
            borderRadius: 8, background: "#ff4242", color: "#fff",
            font: "700 10px/1 var(--wds-font-sans)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>{unread}</span>}
        </div>
        <div style={{
          width: 32, height: 32, borderRadius: 9999,
          background: "#eaf2fe", color: "#0066ff",
          display: "flex", alignItems: "center", justifyContent: "center",
          font: "700 13px var(--wds-font-sans)", cursor: "pointer", marginLeft: 4,
        }}>J</div>
      </div>
    </header>
  );
}

function IconButton({ name, onClick }) {
  const [h, setH] = _useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        width: 40, height: 40, border: "none", background: h ? "#f1f2f4" : "transparent",
        borderRadius: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        color: "#17181a", transition: "background 140ms cubic-bezier(.4,0,.2,1)",
      }}>
      <Icon name={name} size={20} />
    </button>
  );
}

function FilterBar({ filters, onToggle }) {
  const opts = [
    { id: "designer", label: "디자이너" },
    { id: "senior", label: "경력 3–5년" },
    { id: "seoul", label: "서울" },
    { id: "remote", label: "원격근무" },
    { id: "startup", label: "스타트업" },
  ];
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: "20px 0" }}>
      {opts.map(o => {
        const on = filters.includes(o.id);
        return (
          <button key={o.id} onClick={() => onToggle(o.id)}
            style={{
              height: 36, padding: "0 14px",
              border: `1px solid ${on ? "#0066ff" : "rgba(112,115,124,.28)"}`,
              background: on ? "#eaf2fe" : "#fff",
              color: on ? "#0066ff" : "#484a4f",
              borderRadius: 9999, cursor: "pointer",
              font: "600 13px/1 var(--wds-font-sans)",
              transition: "all 140ms cubic-bezier(.4,0,.2,1)",
            }}>{o.label}</button>
        );
      })}
    </div>
  );
}

Object.assign(window, { TopNav, IconButton, FilterBar });
