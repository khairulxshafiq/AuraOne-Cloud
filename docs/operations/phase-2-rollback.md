# Phase 2 Rollback Strategy & Runbook

## 1. Scope of Rollback
In the event that Phase 2 introduces unforeseen regressions in production or staging, the entire change set is isolated within branch `phase/2-design-system-app-shell` and pull request #3.

## 2. Fast Rollback Procedure
If the pull request is merged into `main` and needs immediate reversal:
1. Identify the merge commit on `main`:
   ```bash
   git log --oneline -n 5
   ```
2. Revert the merge commit using standard Git revert:
   ```bash
   git checkout main
   git pull origin main
   git revert -m 1 <MERGE_COMMIT_HASH> -m "revert: rollback Phase 2 design system and app shell"
   git push origin main
   ```
3. Verify that the previous stable commit (Phase 1B: `17bad65`) builds and tests pass cleanly:
   ```bash
   npm ci
   npm run check
   ```

## 3. Component-Level Fallback
- If `ThemeProvider` encounters hydration conflicts in non-standard user browsers, `lib/theme/ThemeContext.tsx` safely falls back to `'dark'` theme without crashing.
- If CSS variables fail to resolve, default CSS fallbacks ensure readability.
