## Task 8 Report - `/map` uses real PLACES + photos

Status: implemented.

Changes:
- Replaced the hardcoded three-stop map demo with `PLACES.slice(0, 5)` mapped into `PlanStop`.
- Kept the existing `localStorage` key `sj_stops` as the override source for selected plans.
- Added `PlaceImage` thumbnails to the check-in stop list using `placeById(s.place_id)?.image_url`.
- Added real-place images to MapView popups when the stop matches a known place.
- Added a regression test for real-place defaults and saved `sj_stops` behavior.

Verification:
- `npm test -- src/app/map/page.test.tsx` passed: 1 file, 2 tests.
- `npm test` passed: 20 files, 45 tests.
- Cursor diagnostics reported no linter errors for edited files.

Concerns:
- The first five `PLACES` entries reference `/images/places/p2.jpg`, `/images/places/p3.jpg`, and `/images/places/p5.jpg`; if those files are not present in `public/images/places`, the UI will rely on the existing `PlaceImage` fallback after image load failure.
