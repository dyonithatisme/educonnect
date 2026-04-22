// Wanted UI Kit — components (plain Babel/JSX, exported to window)
// deps: React 18 via CDN

const { useState, useEffect } = React;

// ───── Icon (Lucide-style inline SVGs; 24x24 · 1.75 stroke) ─────
function Icon({ name, size = 20, color = "currentColor" }) {
  const paths = {
    home: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10" />,
    search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
    bookmark: <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />,
    share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></>,
    bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
    mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>,
    chevronDown: <polyline points="6 9 12 15 18 9" />,
    chevronRight: <polyline points="9 18 15 12 9 6" />,
    x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
    check: <path d="M20 6L9 17l-5-5" />,
    menu: <><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></>,
    briefcase: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>,
    mapPin: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>,
    filter: <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />,
    clock: <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"
      style={{ display: "block", flexShrink: 0 }}>
      {paths[name] || null}
    </svg>
  );
}

// ───── Button ─────
function Button({ variant = "primary", size = "md", children, onClick, disabled, leadingIcon, fullWidth, as = "button" }) {
  const sizes = {
    sm: { h: 36, px: 14, fs: 14, r: 8 },
    md: { h: 44, px: 18, fs: 15, r: 10 },
    lg: { h: 52, px: 22, fs: 16, r: 12 },
  }[size];
  const palette = {
    primary:   { bg: "#0066ff", fg: "#fff", hoverBg: "#005eeb" },
    secondary: { bg: "#eaf2fe", fg: "#0066ff", hoverBg: "#d6e4ff" },
    line:      { bg: "#fff",    fg: "#17181a", hoverBg: "#f7f7f8", border: "inset 0 0 0 1px rgba(112,115,124,.28)" },
    ghost:     { bg: "transparent", fg: "#17181a", hoverBg: "rgba(0,0,0,.04)" },
    danger:    { bg: "#ff4242", fg: "#fff", hoverBg: "#e11414" },
  }[variant];
  const [hover, setHover] = useState(false);
  const style = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
    height: sizes.h, padding: `0 ${sizes.px}px`, fontSize: sizes.fs,
    fontFamily: "var(--wds-font-sans)", fontWeight: 600, letterSpacing: "0.0145em",
    borderRadius: sizes.r, border: "none", cursor: disabled ? "not-allowed" : "pointer",
    background: disabled ? "rgba(112,115,124,.11)" : (hover ? palette.hoverBg : palette.bg),
    color: disabled ? "rgba(55,56,60,.28)" : palette.fg,
    boxShadow: palette.border || "none",
    transition: "background 140ms cubic-bezier(.4,0,.2,1)",
    width: fullWidth ? "100%" : undefined,
    textDecoration: "none",
  };
  const Tag = as;
  return (
    <Tag style={style} onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} disabled={disabled}>
      {leadingIcon && <Icon name={leadingIcon} size={sizes.fs + 2} />}
      {children}
    </Tag>
  );
}

// ───── Chip / Badge ─────
function Chip({ tone = "neutral", children, dot }) {
  const tones = {
    neutral: { bg: "#f1f2f4", fg: "#484a4f" },
    blue:    { bg: "#eaf2fe", fg: "#0066ff" },
    green:   { bg: "#e6f9ed", fg: "#00a538" },
    red:     { bg: "#ffecec", fg: "#ff4242" },
    violet:  { bg: "#f0ecfe", fg: "#6541f2" },
    outline: { bg: "#fff",    fg: "#17181a", border: "inset 0 0 0 1px rgba(112,115,124,.28)" },
  }[tone];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "5px 12px", borderRadius: 9999,
      background: tones.bg, color: tones.fg,
      fontFamily: "var(--wds-font-sans)", fontSize: 12, fontWeight: 600, letterSpacing: ".019em",
      boxShadow: tones.border || "none",
      whiteSpace: "nowrap",
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: 9999, background: "currentColor" }} />}
      {children}
    </span>
  );
}

// ───── TextField ─────
function TextField({ label, value, onChange, placeholder, type = "text", error, hint }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <span style={{ font: "600 13px/1.3 var(--wds-font-sans)", color: "#17181a" }}>{label}</span>}
      <input type={type} value={value} onChange={e => onChange?.(e.target.value)} placeholder={placeholder}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          height: 48, padding: "0 14px",
          borderRadius: 12, outline: "none",
          border: `1px solid ${error ? "#ff4242" : focus ? "#0066ff" : "rgba(112,115,124,.28)"}`,
          boxShadow: focus ? `0 0 0 2px ${error ? "#ffecec" : "#eaf2fe"}` : "none",
          background: "#fff", fontFamily: "var(--wds-font-sans)", fontSize: 15, fontWeight: 500,
          color: "#17181a", transition: "all 140ms cubic-bezier(.4,0,.2,1)",
        }} />
      {(error || hint) && (
        <span style={{ font: "500 12px/1.334 var(--wds-font-sans)", color: error ? "#ff4242" : "rgba(55,56,60,.61)" }}>
          {error || hint}
        </span>
      )}
    </div>
  );
}

Object.assign(window, { Icon, Button, Chip, TextField });
