# Dashboard Refetch Notes

This note explains why dashboard data refetches on every visit today, and how to avoid unnecessary requests while keeping data fresh.

## Current Behavior

In `app/pages/dashboard.vue`, both API calls run on mount:

- `getCashbookBalances()`
- `getRecentTransactions()`

Because this happens in `onMounted`, navigating away and coming back to dashboard will trigger both requests again.

## Why Move to Store

Moving dashboard data to a Pinia store gives:

- Faster back-and-forth navigation (reuse cached state)
- Single data source for multiple components
- Cleaner fetch logic (page only calls store actions)

This matches the existing load-once pattern already used in `app/stores/useExpenses.ts` (`categoriesLoaded` + optional `force`).

## Stale Data Tradeoff

If data is cached in store, new server data may exist while UI still shows old cached data.  
This is expected unless we define a freshness strategy.

## Recommended Freshness Strategy (Reference)

This was the broader strategy discussed before finalizing the current approach:

1. **TTL-based refresh**
   - Keep `lastFetchedAt` in store.
   - If cache age is below TTL (example: 30-60s), use cache.
   - If cache age exceeds TTL, refetch.

2. **Mutation-based invalidation**
   - After actions that affect cashbook data (expense create/update, loan disbursement, installment payment), invalidate dashboard cache.
   - Next dashboard open should refetch immediately.

3. **Manual refresh**
   - Optional refresh button for explicit user-triggered sync.

## Agreed Freshness Strategy

Use **TTL only** with a fixed interval:

- Keep `lastFetchedAt` in store.
- If cache age is below **15 minutes**, use cached data.
- If cache age is **15 minutes or more**, refetch from API.

Decision: no mutation-based invalidation and no manual-refresh requirement for now.

## Suggested Store Shape

Example fields for a future `useCashbookStore`:

- `balances`
- `recentTransactions`
- `isLoaded`
- `loadingBalances`
- `loadingTransactions`
- `errorBalances`
- `errorTransactions`
- `lastFetchedAt`

Suggested actions:

- `fetchDashboardData({ force?: boolean })`
- `fetchBalances({ force?: boolean })`
- `fetchRecentTransactions({ force?: boolean })`
- `invalidateDashboardCache()`

## Practical Rule of Thumb

- Show cached data immediately for responsiveness.
- Refetch when cache age reaches 15 minutes.

This keeps dashboard fast while ensuring data is refreshed on a predictable schedule.

## Final Decision (Current Implementation Direction)

We will use **TTL-only** cache freshness with a **15-minute** interval:

- Cache and reuse dashboard data in store.
- Refetch only when cache age is 15 minutes or more.
- No mutation-based invalidation for now.
- No manual refresh requirement for now.
