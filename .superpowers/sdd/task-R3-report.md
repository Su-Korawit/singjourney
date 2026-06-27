## Task R3 Report

### What I implemented

- Added `DistrictMap` as a client component with a stylized SVG map for Sing Buri's 6 districts: เมืองสิงห์บุรี, บางระจัน, ค่ายบางระจัน, พรหมบุรี, อินทร์บุรี, ท่าช้าง.
- Each district is an accessible clickable/keyboard-selectable SVG group that calls `onSelect(districtName)`.
- Replaced the old home page with a new hero using the district map as the main visual.
- Wired district selection to `router.push('/map?district=...')`.
- Added three progressive-disclosure feature cards for Roadmap, AI วางแผน, and เก็บไอเทม.
- Removed the old orange home page buttons in favor of the existing clay/gold/paper/rice Tailwind tokens.

### TDD Evidence

#### RED

Command:

```bash
npm test -- src/components/home/DistrictMap.test.tsx
```

Relevant failing output before implementation:

```text
FAIL  src/components/home/DistrictMap.test.tsx > DistrictMap > renders six districts and calls onSelect with the clicked district
TestingLibraryElementError: Unable to find an accessible element with the role "button" and name "เมืองสิงห์บุรี"
```

Why this failure was expected:

- The smoke test required six district controls and an `onSelect` callback.
- At RED time, `DistrictMap` was only a typed stub returning `null`, so no district controls existed.

Initial test-file import check also failed before the stub existed:

```text
Error: Failed to resolve import "./DistrictMap" from "src/components/home/DistrictMap.test.tsx". Does the file exist?
```

#### GREEN

Command:

```bash
npm test -- src/components/home/DistrictMap.test.tsx
```

Passing output after implementation:

```text
Test Files  1 passed (1)
Tests  1 passed (1)
```

Note: one focused run immediately after implementation hit a transient Vitest worker startup timeout before the test file loaded. Rerunning the same command passed.

### Verification

Focused test:

```bash
npm test -- src/components/home/DistrictMap.test.tsx
```

Result:

```text
Test Files  1 passed (1)
Tests  1 passed (1)
```

Full suite:

```bash
npm test
```

Result:

```text
Test Files  15 passed (15)
Tests  31 passed (31)
```

Production build:

```bash
npm run build
```

Result:

```text
Compiled successfully
Finished TypeScript
Generating static pages using 10 workers (9/9)
```

### Files changed

- `src/components/home/DistrictMap.tsx`
- `src/components/home/DistrictMap.test.tsx`
- `src/app/page.tsx`
- `.superpowers/sdd/task-R3-report.md`

### Self-review findings

- Completeness: Implemented all R3 checklist items except visual browser confirmation, which I could not perform directly from this environment.
- Quality: Kept the map component focused on presentation and selection, and kept home page routing in `page.tsx`.
- Discipline: Did not touch pure logic, API routes, domain types, or existing tests.
- Testing: Smoke test verifies the six district controls and `onSelect` behavior with real DOM interaction.

### Issues or concerns

- `npm` prints `npm warn Unknown env config "devdir"` before every test/build command. The commands pass, but output is not pristine.
- One focused Vitest run hit a worker startup timeout before loading tests; the exact rerun passed, and the full suite also passed.
