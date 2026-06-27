## Task 9 Report - Watt's Up full temple cards + MyCollection

Status: implemented.

Changes:
- Replaced watts-up placeholder temple cards with the five `TEMPLES` entries joined to `placeById` and rendered through `PlaceImage`.
- Updated the watts-up hero subcopy to remove Phase 4 placeholder language.
- Added `MyCollection` to read unlocked items and coupons from `localStorage` key `sj_items`.
- Saved newly awarded check-in items to `sj_items` in `/map`, de-duped by item id.
- Added regression tests for watts-up real temple content and awarded check-in collection persistence.

Verification:
- RED check: `npm test -- src/app/watts-up/page.test.tsx src/app/map/page.test.tsx` failed before implementation for missing real watts-up content and missing `sj_items` persistence.
- Targeted pass: `npm test -- src/app/watts-up/page.test.tsx src/app/map/page.test.tsx` passed: 2 files, 4 tests.
- Full suite: `npm test` passed: 21 files, 47 tests.
- Cursor diagnostics reported no linter errors for edited files.

Concerns:
- I did not run a live browser visual check; the content, images, collection heading, and localStorage persistence are covered by automated tests.
