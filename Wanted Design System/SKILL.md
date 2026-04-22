---
name: wanted-design
description: Use this skill to generate well-branded interfaces and assets for Wanted (원티드 — Korean career platform + Wanted Space / Gigs / Agent / LaaS / OneID), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick map
- `colors_and_type.css` — all design tokens (atomic colors, semantic roles, 18-tier type scale, spacing, radii, shadows, motion)
- `fonts/Pretendard-*.otf` — the primary typeface, 9 weights; `@font-face`d in the CSS
- `assets/logos/` — the gradient W symbol (PNG) + wordmarks for Wanted / Space / Gigs / Agent (SVG)
- `preview/` — atomic specimens you can use as reference
- `ui_kits/wanted/` — JSX components for the flagship job-board product

## Non-negotiables
1. Primary action is **Blue 40 `#0066FF`**. Do not invent alternate blues.
2. The **only gradient** in the system is the brand symbol itself (blue → pink → orange). Never apply CSS gradients to buttons, backgrounds, cards, or text.
3. Hairline is **always** `1px solid rgba(112,115,124,0.22)`.
4. No emoji in product UI.
5. Korean copy is primary; keep English concise and paired.
6. Icons use 24×24 grid, 1.75–2px stroke, rounded terminals, Lucide-style in this port.
