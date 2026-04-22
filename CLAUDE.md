# Project Instructions for Claude

## Design System

This project uses the **Wanted Design System**.

**항상 UI/프론트엔드 작업 전에 `design.md`를 읽으세요.**  
Always read `design.md` before any UI or frontend work.

Key reference: [design.md](design.md)  
CSS tokens: [Wanted Design System/colors_and_type.css](Wanted%20Design%20System/colors_and_type.css)

### Non-Negotiables (never break these)
1. Primary action = **Blue 40 `#0066FF`** — no custom blues
2. **No CSS gradients** — the only gradient is the brand W symbol PNG
3. Hairline border = **`1px solid rgba(112,115,124,0.22)`** always
4. **No emoji** in product UI
5. Korean copy is primary; English is concise and paired
6. Icons: Lucide, 24×24, 1.75–2px stroke, rounded terminals

### How to use
```html
<link rel="stylesheet" href="Wanted Design System/colors_and_type.css">
```
Use CSS variables from `colors_and_type.css` — never hardcode color hex values that already have tokens.
