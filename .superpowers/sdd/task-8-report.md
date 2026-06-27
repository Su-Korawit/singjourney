# Task 8 Report — LINE push notifications on status change

## Status
**Complete**

## Changes
- **`src/lib/line/push.ts`** — `buildStatusMessage`, `pushLineMessage` (POST to LINE push API), `pushStatusToInterestedUsers` (queries checkins → users, pushes to all interested LINE users).
- **`src/lib/line/push.test.ts`** — TDD tests: closed message content, push HTTP call with Bearer token, notify all users who checked in.
- **`src/lib/line/webhook.ts`** — After successful override insert, best-effort push via `pushStatusToInterestedUsers` when `LINE_MESSAGING_ACCESS_TOKEN` is set; push failures do not fail the webhook.
- **`src/lib/line/webhook.test.ts`** — `beforeEach` clears `LINE_MESSAGING_ACCESS_TOKEN` so push branch is skipped in unit tests.

## TDD
1. **RED** — `npx vitest run src/lib/line/push.test.ts` failed (`Cannot find package '@/lib/line/push'`).
2. **GREEN** — Implemented `push.ts`; 3 push tests pass.
3. **Integration** — Updated `handleStatusReport` to call push after save; webhook tests still pass (3 tests, token unset).
4. **Full suite** — `npm test` — 30 files, 72 tests, all passed.

## Commit
```
feat(line): push LINE notification to interested users on status change
```

## SHA
`0732b04`

## Tests
```
npx vitest run src/lib/line/push.test.ts — 3 passed
npx vitest run src/lib/line/webhook.test.ts — 3 passed
npm test — 30 files, 72 tests, all passed (green)
```

## Notes
- Consumes `handleStatusReport` flow from Task 7; requires `LINE_MESSAGING_ACCESS_TOKEN` at runtime for actual pushes.
- Push is best-effort: errors are swallowed so override save always succeeds.

## Concerns
- None blocking.
