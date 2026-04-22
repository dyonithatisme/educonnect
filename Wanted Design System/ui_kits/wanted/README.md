# Wanted UI Kit

A hi-fi click-through recreation of the **Wanted** job-board product (원티드). Mobile-first patterns adapted for desktop; 1280-max container.

## Files
- `index.html` — runnable demo; top nav + hero + filter bar + 8-card job grid + modal job detail
- `Primitives.jsx` — `Icon`, `Button`, `Chip`, `TextField`
- `Layout.jsx` — `TopNav`, `IconButton`, `FilterBar`
- `JobViews.jsx` — `JobCard`, `JobDetail` (bottom-sheet modal, 90vh, with sticky apply CTA)

## Core flows
1. Browse job grid (default state)
2. Toggle filter chips — visual only
3. Bookmark card (icon overlay, persists across open/close)
4. Click card → full-screen modal with job content + sticky Apply bar
5. Apply → button becomes "지원 완료", unread counter increments

## Notes
- Job covers are gradient placeholders — the real product uses company-supplied hero imagery.
- Icons are Lucide-style line icons drawn inline; in production replace with the Figma pictogram set.
- Every token (color, radius, shadow, type, motion) is pulled from `../../colors_and_type.css` — no hardcoded magic numbers.
