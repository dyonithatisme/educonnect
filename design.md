# Wanted Design System — Reference

Source: `Wanted Design System/` (CC BY 4.0, Wanted Lab)  
CSS tokens: `Wanted Design System/colors_and_type.css`  
Load fonts: `<link rel="stylesheet" href="Wanted Design System/colors_and_type.css">`

---

## Non-Negotiables

1. Primary action is **Blue 40 `#0066FF`**. No invented blues.
2. The **only gradient** is the brand symbol (blue→pink→orange PNG). Never CSS gradients on buttons, backgrounds, cards, or text.
3. Hairline is always **`1px solid rgba(112,115,124,0.22)`**.
4. No emoji in product UI.
5. Korean copy is primary; English is concise and paired.
6. Icons: 24×24 grid, 1.75–2px stroke, rounded terminals (Lucide-compatible).

---

## Color System

### Atomic Palette (CSS variable → hex)

**Neutral** (warm gray, primary text system)
| Variable | Hex |
|---|---|
| `--wds-neutral-10` | `#17181a` — primary text |
| `--wds-neutral-20` | `#292a2e` |
| `--wds-neutral-22` | `#2e2f33` |
| `--wds-neutral-30` | `#3d4046` |
| `--wds-neutral-40` | `#575a5f` |
| `--wds-neutral-50` | `#72757a` |
| `--wds-neutral-60` | `#8e9197` |
| `--wds-neutral-80` | `#c9cacc` |
| `--wds-neutral-90` | `#e6e6e7` |
| `--wds-neutral-95` | `#f2f2f3` |
| `--wds-neutral-99` | `#fafafa` |

**Cool Neutral** (dominant UI gray)
| Variable | Hex |
|---|---|
| `--wds-cool-5` | `#0c0d0f` |
| `--wds-cool-10` | `#17171a` |
| `--wds-cool-15` | `#222326` |
| `--wds-cool-17` | `#272a2e` |
| `--wds-cool-20` | `#2e2f33` |
| `--wds-cool-22` | `#35363a` |
| `--wds-cool-25` | `#3b3d42` |
| `--wds-cool-30` | `#484a4f` |
| `--wds-cool-40` | `#64676d` |
| `--wds-cool-50` | `#80838a` |
| `--wds-cool-60` | `#989ba2` |
| `--wds-cool-70` | `#aeb0b6` |
| `--wds-cool-80` | `#c8ccd1` |
| `--wds-cool-90` | `#e4e6ea` |
| `--wds-cool-95` | `#f1f2f4` |
| `--wds-cool-96` | `#f5f6f7` |
| `--wds-cool-97` | `#f7f7f8` — standard page/card bg tint |
| `--wds-cool-98` | `#f9fafb` |
| `--wds-cool-99` | `#fcfcfd` |

**Blue** (primary brand action)
| Variable | Hex |
|---|---|
| `--wds-blue-40` | `#0066ff` — **Primary** |
| `--wds-blue-30` | `#005eeb` — hover/pressed |
| `--wds-blue-20` | `#004bc0` — pressed deep |
| `--wds-blue-95` | `#eaf2ff` — subtle tint |
| `--wds-blue-99` | `#f4f8ff` — subtler tint |

**Status Colors**
| Color | Variable | Hex |
|---|---|---|
| Positive (green) | `--wds-green-60` | `#00bf40` |
| Negative (red) | `--wds-red-50` | `#ff4242` |
| Caution (orange) | `--wds-orange-40` | `#e25d00` |
| Informative | = Blue 40 | `#0066ff` |
| Purple accent | `--wds-purple-50` | `#9747ff` |
| Violet accent | `--wds-violet-45` | `#6541f2` |

### Semantic Tokens (Light Mode)

**Foreground**
```css
--wds-fg-neutral-primary:    rgba(23,23,25,1)        /* main text */
--wds-fg-neutral-secondary:  rgba(46,47,51,0.88)     /* secondary text */
--wds-fg-neutral-assistive:  rgba(55,56,60,0.61)     /* helper/label */
--wds-fg-neutral-subtle:     rgba(55,56,60,0.28)     /* placeholder */
--wds-fg-neutral-disabled:   rgba(112,115,124,0.22)  /* disabled */
--wds-fg-neutral-inverse:    #ffffff

--wds-fg-accent-primary:     #0066ff
--wds-fg-accent-hover:       #005eeb
--wds-fg-accent-pressed:     #004bc0

--wds-fg-status-positive:    #00bf40
--wds-fg-status-negative:    #ff4242
--wds-fg-status-caution:     #e25d00
--wds-fg-status-informative: #0066ff
```

**Background**
```css
--wds-bg-page:               #ffffff
--wds-bg-elevated:           #ffffff
--wds-bg-neutral-subtle:     #f7f7f8   /* cool-97 */
--wds-bg-neutral-subtler:    #f9fafb   /* cool-98 */
--wds-bg-neutral-strong:     #f1f2f4   /* cool-95 */
--wds-bg-accent-primary:     #0066ff
--wds-bg-accent-subtle:      #eaf2fe   /* most common accent surface */
--wds-bg-accent-subtler:     #f4f8ff
--wds-bg-accent-violet-subtle: #f0ecfe
--wds-bg-overlay-scrim:      rgba(0,0,0,0.56)

--wds-bg-status-positive:          #00bf40
--wds-bg-status-positive-subtle:   #e6f9ed
--wds-bg-status-negative:          #ff4242
--wds-bg-status-negative-subtle:   #ffecec
```

**Lines**
```css
--wds-line-subtle:           rgba(112,115,124,0.22)  /* THE signature hairline */
--wds-line-moderate:         rgba(112,115,124,0.40)
--wds-line-strong:           rgba(112,115,124,0.88)
--wds-line-solid-hairline:   #dbdcdf
--wds-line-accent:           #0066ff
```

---

## Typography

**Font families**
```css
--wds-font-sans:   "Pretendard", -apple-system, BlinkMacSystemFont, system-ui, "Noto Sans KR", sans-serif;
--wds-font-brand:  "Wanted Sans Variable", "Wanted Sans", "Pretendard", sans-serif;
--wds-font-mono:   "SF Mono", ui-monospace, "JetBrains Mono", "Menlo", "Consolas", monospace;
```

- **Pretendard** — primary UI font, 9 weights (100–900), OTFs in `Wanted Design System/fonts/`
- **Wanted Sans** — brand/marketing surfaces only (loaded via CDN in colors_and_type.css)
- **SF Mono** — code/docs only

Dominant weights in product: **500 (Medium), 600 (SemiBold), 700 (Bold)**

**Type Scale** (7 tiers, 18 sub-tiers)

| Class | Size | Line Height | Letter Spacing | Weight |
|---|---|---|---|---|
| `.wds-display-1` | 56px | 1.25 | -0.017em | 700 |
| `.wds-display-2` | 40px | 1.3 | -0.0282em | 700 |
| `.wds-display-3` | 36px | 1.334 | -0.027em | 700 |
| `.wds-title-1` | 32px | 1.375 | -0.0253em | 700 |
| `.wds-title-2` | 28px | 1.358 | -0.0236em | 700 |
| `.wds-title-3` | 24px | 1.334 | -0.023em | 700 |
| `.wds-heading-1` | 22px | 1.364 | -0.0194em | 700 |
| `.wds-heading-2` | 20px | 1.4 | -0.012em | 700 |
| `.wds-headline-1` | 18px | 1.445 | -0.002em | 600 |
| `.wds-headline-2` | 17px | 1.412 | 0 | 700 |
| `.wds-body-1n` | 16px | 1.5 | +0.0057em | 500 |
| `.wds-body-1r` | 16px | 1.625 | +0.0057em | 500 |
| `.wds-body-2n` | 15px | 1.467 | +0.0096em | 500 |
| `.wds-body-2r` | 15px | 1.6 | +0.0096em | 500 |
| `.wds-label-1n` | 14px | 1.429 | +0.0145em | 600 |
| `.wds-label-1r` | 14px | 1.571 | +0.0145em | 500 |
| `.wds-label-2` | 13px | 1.385 | +0.0194em | 600 |
| `.wds-caption-1` | 12px | 1.334 | +0.0252em | 600 |
| `.wds-caption-2` | 11px | 1.273 | +0.0311em | 700 |

Rule: letter-spacing is **negative for large text** (Display–Heading) and **positive for small text** (Body–Caption).

---

## Spacing

4px base grid.

```css
--wds-space-2:   2px    --wds-space-4:   4px    --wds-space-6:   6px
--wds-space-8:   8px    --wds-space-10:  10px   --wds-space-12:  12px
--wds-space-16:  16px   --wds-space-20:  20px   --wds-space-24:  24px
--wds-space-32:  32px   --wds-space-40:  40px   --wds-space-48:  48px
--wds-space-64:  64px   --wds-space-96:  96px   --wds-space-128: 128px
```

Common usage:
- Component internal padding: 12–24px
- Card padding: 16–24px (small), 48–64px (large)
- Section padding: 64–128px
- Vertical rhythm between sections: 96–128px

---

## Border Radius

```css
--wds-radius-0:    0px
--wds-radius-xs:   4px
--wds-radius-sm:   6px
--wds-radius-md:   8px     /* small buttons */
--wds-radius-lg:   10px    /* medium buttons */
--wds-radius-xl:   12px    /* inputs, large buttons */
--wds-radius-2xl:  16px    /* cards */
--wds-radius-3xl:  24px    /* hero cards */
--wds-radius-4xl:  32px    /* section wrappers */
--wds-radius-full: 9999px  /* pills, capsule tags */
```

---

## Shadows

```css
--wds-shadow-emphasize:  0 1px 4px 0 rgba(23,23,23,.06), 0 6px 12px -2px rgba(23,23,23,.07);
--wds-shadow-normal:     0 1px 4px 0 rgba(23,23,23,.06), 0 2px 8px 0 rgba(23,23,23,.07);
--wds-shadow-strong:     0 2px 10px 0 rgba(23,23,23,.10), 0 12px 24px -4px rgba(23,23,23,.12);
--wds-shadow-inset-hairline: inset 0 0 0 1px rgba(112,115,124,0.22);
```

---

## Motion

```css
--wds-ease-standard: cubic-bezier(0.4, 0, 0.2, 1);
--wds-ease-enter:    cubic-bezier(0.0, 0, 0.2, 1);
--wds-ease-exit:     cubic-bezier(0.4, 0, 1, 1);
--wds-dur-fast:      120ms;
--wds-dur-base:      180ms;
--wds-dur-slow:      260ms;
```

- Subtle micro-interactions only — no bounce, no parallax, no auto-play
- Buttons: fade background 120–140ms on hover/press
- Menus: slide 4–8px on enter
- No scale transforms on press

---

## Interaction States

| State | Treatment |
|---|---|
| Hover | Blue-40 → Blue-30; neutrals 4–8% dim |
| Pressed | Even darker; `rgba(0,0,0,0.08)` scrim on neutrals |
| Focus | 2px ring in Blue-40, 2px offset |
| Disabled | Text opacity 0.22–0.28; fill `cool-95` |

---

## Components

### Buttons

```html
<!-- Sizes: sm (h36, r8, 14px), md (h44, r10, 15px), lg (h52, r12, 16px) -->
<!-- All: font-weight 600, letter-spacing 0.0145em, transition 140ms -->

<!-- Primary -->
<button style="background:#0066ff; color:#fff; border:none; height:44px; padding:0 18px; border-radius:10px; font-size:15px; font-weight:600; cursor:pointer;">
  지원하기
</button>

<!-- Secondary (blue tint) -->
<button style="background:#eaf2fe; color:#0066ff; border:none; height:44px; padding:0 18px; border-radius:10px; font-size:15px; font-weight:600; cursor:pointer;">
  컴포넌트 보기
</button>

<!-- Outline -->
<button style="background:#fff; color:#17181a; border:none; height:44px; padding:0 18px; border-radius:10px; font-size:15px; font-weight:600; box-shadow:inset 0 0 0 1px rgba(112,115,124,.28); cursor:pointer;">
  북마크
</button>

<!-- Ghost -->
<button style="background:transparent; color:#17181a; border:none; height:44px; padding:0 18px; border-radius:10px; font-size:15px; font-weight:600; cursor:pointer;">
  공유
</button>

<!-- Danger -->
<button style="background:#ff4242; color:#fff; border:none; height:44px; padding:0 18px; border-radius:10px; font-size:15px; font-weight:600; cursor:pointer;">
  삭제
</button>

<!-- Disabled -->
<button disabled style="background:rgba(112,115,124,.11); color:rgba(55,56,60,.28); border:none; height:44px; padding:0 18px; border-radius:10px; font-size:15px; font-weight:600; cursor:not-allowed; opacity:1;">
  Disabled
</button>
```

### Inputs

```html
<!-- Default -->
<input style="height:48px; padding:0 14px; border:1px solid rgba(112,115,124,.28); border-radius:12px; background:#fff; font-size:15px; font-weight:500; color:#17181a; outline:none; transition:all 140ms; font-family:inherit;">

<!-- Focus (add via JS/CSS :focus) -->
/* border-color: #0066ff; box-shadow: 0 0 0 2px #eaf2fe; */

<!-- Error -->
/* border-color: #ff4242; box-shadow: 0 0 0 2px #ffecec; */

<!-- Hint text -->
<span style="font-size:12px; font-weight:500; line-height:1.334; color:rgba(55,56,60,.61);">
  Default state
</span>

<!-- Error hint -->
<span style="font-size:12px; color:#ff4242;">존재하지 않는 회사입니다</span>

<!-- Checkbox (checked) -->
<div style="width:20px; height:20px; border-radius:6px; background:#0066ff; border:1.5px solid #0066ff; color:#fff; display:inline-flex; align-items:center; justify-content:center; font-size:12px; font-weight:700;">✓</div>
```

### Badges / Chips

```html
<!-- Base chip: border-radius 9999px, padding 6px 12px, font 600 13px -->
<span style="display:inline-flex; align-items:center; gap:6px; padding:6px 12px; border-radius:9999px; font-size:13px; font-weight:600; letter-spacing:.019em; background:#eaf2fe; color:#0066ff;">신규</span>

<!-- Variants -->
<!-- Blue:    bg #eaf2fe, color #0066ff -->
<!-- Green:   bg #e6f9ed, color #00a538 -->
<!-- Red:     bg #ffecec, color #ff4242 -->
<!-- Neutral: bg #f1f2f4, color #484a4f -->
<!-- Violet:  bg #f0ecfe, color #6541f2 -->
<!-- Outline: bg #fff, color #17181a, box-shadow inset 0 0 0 1px rgba(112,115,124,.28) -->

<!-- Notification badge -->
<span style="min-width:18px; height:18px; padding:0 5px; border-radius:9px; background:#ff4242; color:#fff; font-size:11px; font-weight:700; display:inline-flex; align-items:center; justify-content:center;">3</span>
```

### Job Card

```html
<div style="background:#fff; border-radius:16px; box-shadow:0 1px 4px 0 rgba(23,23,23,.06),0 2px 8px 0 rgba(23,23,23,.07); padding:20px; width:340px; font-family:inherit;">
  <!-- Company logo -->
  <div style="width:44px; height:44px; border-radius:10px; background:#f1f2f4; display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:700; color:rgba(46,47,51,.88);">W</div>
  <!-- Company name -->
  <div style="font-size:12px; font-weight:600; color:rgba(55,56,60,.61); letter-spacing:.019em; margin:16px 0 0;">WANTED LAB</div>
  <!-- Job title -->
  <h3 style="font-size:17px; font-weight:700; line-height:1.412; color:#17181a; margin:4px 0 12px; letter-spacing:0;">Senior Product Designer, Design System</h3>
  <!-- Meta chips -->
  <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:12px;">
    <span style="display:inline-flex; padding:4px 10px; border-radius:9999px; background:#f1f2f4; font-size:12px; font-weight:600; color:rgba(46,47,51,.88);">경력 5–8년</span>
    <span style="display:inline-flex; padding:4px 10px; border-radius:9999px; background:#f1f2f4; font-size:12px; font-weight:600; color:rgba(46,47,51,.88);">정규직</span>
  </div>
  <!-- Footer -->
  <div style="display:flex; justify-content:space-between; align-items:center; padding-top:12px; border-top:1px solid rgba(112,115,124,.14);">
    <span style="font-size:14px; font-weight:700; color:#0066ff;">채용보상금 500만원</span>
    <!-- Bookmark icon button -->
    <div style="width:32px; height:32px; border-radius:8px; background:#f1f2f4; display:flex; align-items:center; justify-content:center;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
    </div>
  </div>
</div>
```

---

## Layout

- Grid: 12-column, max-width 1440px (desktop marketing); 375/390px (mobile)
- Top nav: 64–72px tall, sticky, backdrop-filter: blur(12px) saturate(180%)
- Section vertical rhythm: 96–128px
- Page background: flat `#ffffff` — no gradients, no textures

---

## Iconography

- 300+ custom pictograms at 24×24 grid, 1.5–2px stroke, rounded terminals
- Fill-False (line) and Fill-True (solid) variants for each icon
- This port uses **Lucide** CDN as visually closest substitute
- Load: `<script src="https://unpkg.com/lucide@latest"></script>`
- Logo assets: `Wanted Design System/assets/logos/`
  - `wanted-symbol.png` — gradient W mark (use as `<img>`, never CSS gradient)
  - `wanted-logotype.svg`, `space-logotype.svg`, `gigs-logotype.svg`, `agent-logotype.svg`

---

## Copy & Voice

- **Language**: Korean primary, English supporting, concise and paired
- **Tone**: plain, service-oriented, lightly warm — few exclamation marks, no slang
- **Labels**: short — 2–4 characters/words KR, 1–2 words EN
- **Casing**: Title Case for product names; sentence case elsewhere
- **Verbs on buttons**: 지원하기(Apply), 북마크(Bookmark), 공유(Share), 확인(OK)
- **No emoji** anywhere in product UI

---

## Quick Starter HTML

```html
<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="Wanted Design System/colors_and_type.css">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--wds-bg-page); color: var(--wds-fg-neutral-primary); }
  </style>
</head>
<body>
  <!-- Your content here -->
</body>
</html>
```
