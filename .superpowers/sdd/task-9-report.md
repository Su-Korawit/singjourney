# Task 9 Report — HoursBadge community override badge

## Status
**Complete**

## Changes
- **`src/components/places/HoursBadge.tsx`** — Added optional `override` prop; uses `effectiveStatus()` to resolve status; shows "อัปเดตโดยชุมชน" label when `source === "community"`. Auto path labels unchanged ("เปิดอยู่" / "ปิดแล้ว" / "ใกล้ปิด").
- **`src/components/places/HoursBadge.test.tsx`** — Added community override test case; added `afterEach(cleanup)` so DOM isolation works across the three tests in the suite.

## TDD
1. **RED** — `npx vitest run src/components/places/HoursBadge.test.tsx` failed (missing "อัปเดตโดยชุมชน", override prop not supported).
2. **GREEN** — Implemented `HoursBadge` with `effectiveStatus` + community badge; 3 HoursBadge tests pass.
3. **Full suite** — `npm test` — 30 files, 73 tests, all passed.

## Commit
```
feat(line): show community override + 'อัปเดตโดยชุมชน' badge in HoursBadge
```

## SHA
`5c25bea`

## Tests
```
npx vitest run src/components/places/HoursBadge.test.tsx — 3 passed
npm test — 30 files, 73 tests, all passed (green)
```

## Notes
- Consumes `effectiveStatus` from Task 1; `OverrideStatus` type from `@/lib/types`.
- Step 5 (server wiring to fetch `place_status_overrides` and pass prop) is manual — not in scope for this task's file changes.
- Existing auto-path tests unchanged; labels and regex matchers preserved.

## Concerns
- None blocking.
