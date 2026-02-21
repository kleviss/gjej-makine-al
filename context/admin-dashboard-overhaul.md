# Admin Dashboard Overhaul — Progress Report

## Status: Complete (pending DB migration)

All code changes are merged to `master`. The admin app builds successfully.

## What Changed

### New File
- **`admin/src/lib/auth.tsx`** — `AuthProvider` context + `useAuth()` hook. Manages session, profile (with role), signOut, and demo mode. Wraps the entire app via root layout.

### Modified Files

| File | What changed |
|---|---|
| `admin/src/app/globals.css` | Dark theme: bg `#0f1115`, surface `#1a1d23`, primary `#38bdf8`, accent `#6366f1`, plus border/muted tokens |
| `admin/src/app/layout.tsx` | Wrapped children in `<AuthProvider>`, dark body classes |
| `admin/src/app/(dashboard)/layout.tsx` | Added `<Suspense>` boundary around `<AuthGuard>`, dark bg |
| `admin/src/app/login/page.tsx` | Accepts all roles (admin, super_admin, dealership, user). Dark gradient login UI |
| `admin/src/components/AuthGuard.tsx` | Now uses `useAuth()` hook. Accepts `allowedRoles` prop for page-level role gating |
| `admin/src/components/Sidebar.tsx` | Dark gradient sidebar. Nav links filtered by role. Logout button + user email at bottom |
| `admin/src/components/StatsCard.tsx` | Dark surface card. Optional `trend` prop (up/down arrow + percentage) |
| `admin/src/app/(dashboard)/page.tsx` | Role-based dashboard: super_admin gets 4 stat cards + recent listings table; dealership gets 3 cards; user gets 2 cards. Welcome message with name |
| `admin/src/app/(dashboard)/listings/page.tsx` | Search, pagination (20/page), image thumbnails. Super_admin sees all listings + approve/reject. Dealership/user sees "My Listings" |
| `admin/src/app/(dashboard)/users/page.tsx` | Restricted to super_admin/admin via `allowedRoles`. Search by name/phone. Role dropdown (user/admin/super_admin/dealership) per user |
| `admin/src/app/(dashboard)/analytics/page.tsx` | CSS bar charts for make/status breakdowns. Time period selector (7d, 30d, 90d) |

## Role System

| Role | Dashboard | Listings | Users | Analytics |
|---|---|---|---|---|
| `super_admin` | Full stats + recent listings | All listings, approve/reject | Full access, role management | Full platform |
| `admin` | Same as super_admin | Same as super_admin | Same as super_admin | Same as super_admin |
| `dealership` | My listings + pending + messages | Own listings only | No access | Own performance |
| `user` | My listings + saved cars | Own listings only | No access | No access |

## DB Migration (must run manually)

Run this in Supabase SQL editor before dealership role will work:

```sql
ALTER TABLE user_profiles DROP CONSTRAINT user_profiles_role_check;
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_role_check
  CHECK (role IN ('user', 'admin', 'super_admin', 'dealership'));
```

## Demo Mode

Still works — visit `/?demo=1` or click "Try Demo Mode" on login. Demo user gets `super_admin` role with display name "Demo Admin".

## How to Verify

```bash
cd admin && npm run dev
```

1. Login page at `/login` — dark themed, accepts any role
2. Sidebar shows correct nav items per role, logout works
3. Dashboard shows role-appropriate stats
4. Listings page has search, pagination, image thumbnails
5. Users page only accessible by super_admin/admin, has role dropdown
6. Analytics has bar charts and period selector
