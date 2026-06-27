## Task 10 Report - Home Bang Rachan hero + events card

Status: implemented.

Changes:
- Updated the home hero eyebrow, headline, and subhead to center the Bang Rachan hero brand.
- Added the real Bang Rachan hero image through `PlaceImage` with a graceful fallback.
- Added the fourth feature card for `/events`.
- Updated the feature grid to `md:grid-cols-2 lg:grid-cols-4`.
- Added a home-page regression test for the new hero copy, image, events card, and grid classes.

Verification:
- RED check: `npm test -- src/app/page.test.tsx` failed before implementation because the Bang Rachan hero copy was missing.
- Targeted pass: `npm test -- src/app/page.test.tsx` passed: 1 file, 1 test.
- Full suite: `npm test` passed: 22 files, 48 tests.
- Cursor diagnostics reported no linter errors for edited files.

Concerns:
- I did not run a live browser visual check; the visible content, image source, events link, and responsive grid classes are covered by automated tests.
