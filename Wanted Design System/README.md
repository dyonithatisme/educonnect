# Wanted Design System

A faithful port of **Wanted Design System (Community)** — the design library that powers Wanted's family of products (원티드 / Wanted, a major Korean career platform). Distributed by Wanted under CC BY 4.0. This folder reconstructs the library for use as a design source of truth and for generating branded artifacts (prototypes, decks, mocks).

## Source
- **Figma file:** "Wanted Design System (Community).fig" (mounted). 25 pages, 36 top-level frames — Overview, Foundation (Color Atomic, Color Semantic, Typography, Grid), Logo, Icon, Spacing, Theme, Element, 1-Theme / 2-Element / 3-Component (full component library), Example, Guidelines.
- **Maintained by:** Wanted Lab (design: Hyungjin Kil · Chaeri Oh · Doeun Kim · Sanghyo Yee · Kyungmin Park · Sungho Cho · Jisoo Lee)
- **Brand center (external):** Wanted Brand Center — for authoritative logo/asset downloads.

## Products represented
Wanted is a multi-product ecosystem; the system covers logos + UI for all of them:
- **Wanted** — flagship career / job-matching platform (원티드)
- **Wanted Space** — space-booking / meeting-room product
- **Wanted Gigs** — freelance / gig work
- **Wanted LaaS** — ATS / recruitment SaaS ("Wanted 채용 솔루션")
- **Wanted OneID** — unified sign-on (원티드 통합 로그인)
- **Wanted Agent** — recent AI-agent product

## Index
- `colors_and_type.css` — color tokens (atomic + semantic) and typography scale
- `fonts/Pretendard-*.otf` — 9 local font weights (Thin 100 → Black 900), `@font-face`d
- `assets/logos/` — logotypes + symbol PNG for Wanted / Space / Gigs / Agent
- `preview/` — small HTML cards that populate the Design System review tab (colors, type, spacing, radii, shadows, buttons, inputs, badges, cards, icons, logos)
- `ui_kits/wanted/` — hi-fi recreation of the Wanted job-board product (index.html + Primitives/Layout/JobViews JSX)
- `SKILL.md` — Agent-Skill-compatible entry point

---

## Content fundamentals
Wanted's surface is bilingual by default (Korean primary, English supporting, occasional Japanese). Copy style:

- **Tone**: plain, service-oriented, lightly warm. Few exclamation marks; no slang.
- **Casing**: English titles use Title Case for product names, sentence case elsewhere. Korean follows standard sentence punctuation.
- **Person**: 2nd-person ("당신의 커리어", "your career") for marketing surfaces; neutral/infinitive for UI labels ("지원하기" = "Apply", "확인" = "OK").
- **Emoji**: not used in product UI. The system does not ship emoji assets.
- **Voice examples from the Figma file**:
  - "무한한 가능성을 탐험하며 자신만의 멋진 커리어를 찾아갈 수 있기를 바랍니다." (*"We hope you can explore infinite possibilities and find your own remarkable career."*)
  - "일관된 브랜드 아이덴티티와 시각적 스타일을 유지하기 위해 정의된 색상 모음입니다." (*"A set of colors defined to maintain a consistent brand identity and visual style."*)
  - Product buttons use verbs: `지원하기` (Apply), `북마크` (Bookmark), `공유` (Share), `컴포넌트 보기` (View components).
- **Labels are short**: 2–4 characters/words in KR, matched 1–2 words in EN.

---

## Visual foundations

**Color**
- Base canvas is **white** (`#ffffff`) in light mode; near-black **`#17181A` (neutral-10)** is primary text.
- The *dominant* neutral is **Cool Neutral** — warm-cool-gray scale from `#fcfcfd` down to `#0c0d0f`, with 22 steps. Surfaces at 95–98, hairlines at `rgba(112,115,124,0.22)`.
- **Primary action** is **`#0066ff` (Blue-40)**. Pressed = Blue-30, hover = Blue-30, on-primary = white. Subtle blue tint `#eaf2fe` is the standard "accent surface".
- **Semantic**: Positive `#00bf40` (green-60), Negative `#ff4242` (red-50), Caution (orange-40), Informative = Blue-40.
- **Secondary accents** that appear sparingly: Purple `#9747ff` (ring strokes), Violet surface `#f0ecfe`.
- Colors use **opacity layers** for text (88%, 61%, 28%, 22%) rather than a second neutral ramp — this is the signature pattern.

**Type**
- Primary sans: **Pretendard** (9 weights, 100–900; local OTFs in `fonts/`). Wanted uses 500/600/700 almost exclusively; Regular is rare.
- Brand / marketing: **Wanted Sans** (Wanted's own typeface — open source).
- Mono: **SF Mono** (docs, code inline).
- Scale: 7 tiers (Display / Title / Heading / Headline / Body / Label / Caption), 18 sub-tiers, 11px–56px. Line heights range 1.25 (display) to 1.6 (reading body). Letter spacing is negative for large text (-0.027em at Display) and positive for small text (+0.031em at Caption 2).

**Spacing**
- 4px grid; common steps 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128.
- Section padding in the Figma file is always 64 or 128. Card padding is 48 or 64. Component internal padding 12–24.

**Backgrounds**
- Page backgrounds are **flat white**. No gradients, no textures, no repeating patterns on product surfaces.
- The *only* gradient in the system is the **brand symbol itself** (blue → pink → orange, a three-stop gradient). This is the "W" mark and is treated as an image (PNG), never a CSS gradient.
- Hero imagery (when used) is full-bleed, slightly warm, photographic; people-focused (career, workplace). Not b&w, not grainy.

**Animation**
- Motion is **subtle** — 120–260ms, `cubic-bezier(0.4,0,0.2,1)` standard, no bounce.
- Micro-interactions: buttons fade opacity / shift background on press; menus slide 4–8px on enter.
- No parallax, no auto-playing hero reels in the system itself.

**Interaction states**
- **Hover** = darker tone (e.g. Blue-40 → Blue-30) OR 4–8% dim on neutrals.
- **Pressed** = even darker tone; neutrals use `rgba(0,0,0,0.08)` scrim overlay.
- **Focus** = 2px ring in Blue-40 (or Purple-50 for alt), 2px offset.
- **Disabled** = opacity 0.22–0.28 on text, `cool-95` fill.
- No scale transforms on press.

**Borders, radii, shadows**
- Hairline: **1px solid `rgba(112,115,124,0.22)`** — the single most-used stroke in the system (166× in the file).
- Corner radii, in ascending order: **0 · 4 · 6 · 8 · 10 · 12 · 16 · 24 · 32 · 9999** (pill). Buttons = 8–10. Inputs = 12. Cards = 16–24. Section wrappers = 32. Capsule tags = full.
- Shadows: three tiers, all tinted `rgba(23,23,23, a)` with low alpha:
  - Emphasize: `0 1px 4px 0 rgba(23,23,23,.06), 0 6px 12px -2px rgba(23,23,23,.07)`
  - Normal:    `0 1px 4px 0 rgba(23,23,23,.06), 0 2px 8px 0 rgba(23,23,23,.07)`
  - Strong:    `0 2px 10px 0 rgba(23,23,23,.10), 0 12px 24px -4px rgba(23,23,23,.12)`
- **Protection gradients** are *not* used. Overlays are solid scrims (`rgba(0,0,0,0.56)`).

**Cards**
- Radius 16–24, 1px hairline OR shadow-normal (rarely both). Background white or `cool-97`. Padding 16–24 small, 48–64 large.

**Transparency & blur**
- Used for text on imagery (88/61/28 opacity ladder) and for overlay scrims.
- Backdrop blur is used lightly on sticky nav (saturate 180% blur 12px), not widely.

**Imagery vibe**
- Cool-warm balanced photography; medium contrast; minor desaturation. People in work contexts.
- Illustrations are geometric and flat — not hand-drawn, no texture.

**Layout rules**
- Grid: 12-column, 1440 container for desktop marketing; 375/390 for mobile.
- Sections flow at 96–128px vertical rhythm.
- Fixed: top nav (64–72px tall), sticky CTA on job detail.

---

## Iconography
- **Icon system**: 300+ custom pictograms, 24×24 grid, 1.5–2px stroke, paired Fill-False/Fill-True variants (line vs filled). Families: navigation, action, status, logo marks (third-party brands like Google / Kakao / Apple), chevrons (thick / tight / small variants).
- Style: rounded terminals, geometric, no tapers. Filled variants use the same silhouette, solid.
- **Substitution flagged**: the Figma file ships each icon as an inline SVG component. Recreating all 300 by hand would be low-fidelity. For this port, icons are drawn from **Lucide** (CDN) as the closest visually-matched line set. Fill-True equivalents use Lucide's `fill="currentColor"` filled variants. If you need the *exact* pictograms, pull them from the Figma file at `/1-Theme/components/Name{IconName}/` — each file contains the raw SVG path.
- **Emoji**: not used. Not part of the system.
- **Unicode glyphs**: not used as icons.
- **Logos** (copied into `assets/logos/`):
  - `wanted-logotype.svg` — "wanted" wordmark
  - `space-logotype.svg` — "Space" wordmark
  - `gigs-logotype.svg` — "Gigs" wordmark
  - `agent-logotype.svg` — "Agent" wordmark
  - `wanted-symbol.png` — the "W" brand mark (three-stop gradient PNG, 1000×700)
  - `wanted-symbol-mask.svg` — vector mask for the symbol

---

## Fonts
- **Pretendard** — **9 local OTF files in `fonts/`** (Thin → Black). `@font-face` declarations in `colors_and_type.css` register them under the single family name `"Pretendard"` with weights 100–900.
- **Wanted Sans** — loaded via `wanteddev/wanted-sans` CDN (brand / marketing surface only).
- **SF Mono** — system-only (Apple). Falls back to `ui-monospace` / Menlo / JetBrains Mono on non-Apple platforms.

---

## How to use
```html
<link rel="stylesheet" href="colors_and_type.css">

<button class="wds-btn wds-btn--primary">지원하기</button>
<span class="wds-caption-1" style="color: var(--wds-fg-neutral-assistive)">마감 3일 전</span>
```

See `preview/` for visual specimens and `ui_kits/wanted/` for a working mock.
