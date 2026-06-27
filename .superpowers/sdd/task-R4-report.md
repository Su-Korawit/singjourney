# Task R4 Report: Roadmap (MapLibre) เข้าโทนแบรนด์

## Status

DONE

## Commit

- `a59bbdc` feat(ui): warm-filtered roadmap, clay route + gold check-in markers

## Implementation Summary

- Added the required `.roadmap-warm .maplibregl-canvas` warm filter in `src/app/globals.css`.
- Replaced the Roadmap route color with clay `#9C3B2E`, increased line width, and added a subtle deep-clay shadow layer.
- Replaced default MapLibre markers with custom clay pin markers; check-in-enabled stops render with a gold ring.
- Replaced plain popup text with a brand-styled popup using `font-head` and a clay `"เช็คอิน"` button wired to the existing check-in flow.
- Updated `/map` layout so mobile shows a sticky map above the stop list, while desktop uses `360px` list + flexible map.
- Restyled the auto-route and check-in controls with clay/gold/paper/rice tokens.

## Verification

- `ReadLints` on edited files: no linter errors.
- `npm test`: passed, 15 test files and 31 tests.
- `npm run build`: passed, Next.js production build completed successfully.
- `git diff HEAD -- src/components/map/MapView.tsx src/app/globals.css src/app/map/page.tsx`: empty after commit.

## Self-Review

- Scope stayed within the task brief files: `src/components/map/MapView.tsx`, `src/app/globals.css`, and `src/app/map/page.tsx`.
- Existing pure logic, API routes, domain types, and test files were not modified.
- The old `#e07a2f` route color was removed from Roadmap source code and replaced with clay.
- Drag reorder behavior remains routed through the existing `StopList` and `setStops` flow.
- Popup check-in uses the existing `checkIn(placeId)` flow from the map page; no new API behavior was introduced.

## Concerns

- I could not perform a browser visual check in this environment, so visual confirmation is based on code review plus successful build.
- `rg` still finds `bg-orange-600` in older planner components outside the R4 file scope; I left them untouched because this task specifically listed the Roadmap files.

## Review Fix (gold markers)

**Status:** DONE

**Issue:** Gold-ring markers appeared on all stops whenever `onCheckIn` was provided, instead of only stops that have check-in items.

**Changes:**
- Added optional `rewardPlaceIds?: string[]` prop to `MapView`; marker gold ring now uses `rewardPlaceIdSet.has(s.place_id)`.
- `map/page.tsx` fetches distinct `place_id` values from `items_3d` via `createBrowserClient()` on mount and passes them as `rewardPlaceIds`.
- Default: no gold ring when `rewardPlaceIds` is omitted or the stop's `place_id` is not in the list.

**Verification:**
- `npm test`: 15 test files, 31 tests passed.
- `npm run build`: production build succeeded.
