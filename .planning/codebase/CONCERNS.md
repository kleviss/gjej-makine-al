# Codebase Concerns

**Analysis Date:** 2026-02-20

## Tech Debt

**Placeholder Screens (5 of 9 screens are stubs):**
- Issue: Screens render only a title and "coming soon" text with no functionality
- Files:
  - `app/(protected)/(screens)/messages/index.tsx`
  - `app/(protected)/(screens)/new-listing/index.tsx`
  - `app/(protected)/(screens)/my-listings/index.tsx`
  - `app/(protected)/(screens)/profile-settings/index.tsx`
  - `app/(protected)/(screens)/help/index.tsx`
  - `app/(protected)/(tabs)/saved.tsx`
- Impact: Core marketplace features (listing creation, messaging, saved cars) are non-functional
- Fix approach: Implement each screen incrementally, starting with new-listing and saved

**Mock Data Used in Production Paths:**
- Issue: Search screen fetches from Supabase via `useVehicles()` but filters and car detail screen read from `MOCK_CARS` in `constants/mock-data.ts`. The fetched `vehicles` data is never used for display.
- Files:
  - `app/(protected)/(tabs)/search.tsx` (line 10, 62, 106, 117)
  - `app/(protected)/(screens)/car/[id].tsx` (line 7, 198)
  - `constants/mock-data.ts`
- Impact: Search results and car details always show hardcoded data regardless of database content
- Fix approach: Replace all `MOCK_CARS` references with the `vehicles` data from `useVehicles()`. Create a shared query hook for single vehicle lookup.

**Duplicated Filter Constants:**
- Issue: Filter options (MAKES, PRICE_RANGES, YEARS, TRANSMISSIONS) are defined independently in two files with different values
- Files:
  - `app/(protected)/(tabs)/search.tsx` (lines 40-51)
  - `components/SearchFilters.tsx` (lines 8-19)
- Impact: Inconsistent filter options between components; currency symbols differ ($ vs €)
- Fix approach: Extract shared filter constants to `constants/filters.ts`

**Duplicate Filter Interface:**
- Issue: `Filters` interface is defined separately in two files
- Files:
  - `app/(protected)/(tabs)/search.tsx` (lines 52-57)
  - `components/SearchFilters.tsx` (lines 20-25)
- Impact: Type drift risk between components
- Fix approach: Define once in a shared types file

**Inconsistent Styling Approach:**
- Issue: Three different styling methods used across the app
- Files:
  - `app/(protected)/(tabs)/index.tsx`: Emotion `styled` (object syntax)
  - `app/(auth)/sign-in.tsx`: Emotion `styled` (template literal syntax)
  - `app/(protected)/(tabs)/profile.tsx`: React Native `StyleSheet.create`
  - `components/SearchFilters.tsx`: Hardcoded color values (`#2563eb`, `#f3f4f6`)
- Impact: Inconsistent theming; some components ignore dark mode entirely
- Fix approach: Standardize on Emotion styled with object syntax using theme tokens

**Unused StyleSheet in Search Screen:**
- Issue: `StyleSheet.create` block at bottom of search screen is never referenced
- Files: `app/(protected)/(tabs)/search.tsx` (lines 219-234)
- Impact: Dead code
- Fix approach: Remove the unused styles block

## Security Considerations

**Demo Mode Bypasses Auth:**
- Risk: `demoMode` flag in auth context allows full access to protected routes without authentication
- Files:
  - `context/auth.tsx` (lines 40-41)
  - `app/(protected)/_layout.tsx` (line 9)
  - `app/(auth)/sign-in.tsx` (line 135)
- Current mitigation: None - demo users can access all protected screens
- Recommendations: Restrict demo mode to read-only access; disable write operations (listing creation, messaging) in demo mode

**No Input Validation on Auth Forms:**
- Risk: Email and password fields have no client-side validation before submission
- Files:
  - `app/(auth)/sign-in.tsx` (lines 77-89)
  - `app/(auth)/sign-up.tsx` (lines 64-80)
- Current mitigation: Supabase server-side validation returns errors
- Recommendations: Add email format validation and minimum password length checks before API calls

**Console.log Leaking Error Details:**
- Risk: Auth error details logged to console in production
- Files: `app/(auth)/sign-in.tsx` (line 83)
- Current mitigation: None
- Recommendations: Remove console.log or gate behind `__DEV__` check

**Supabase `select('*')` Without RLS Verification:**
- Risk: Fetching all columns from Vehicles table; unclear if Row Level Security policies are configured
- Files: `services/supabase.api.ts` (line 5)
- Current mitigation: Unknown - depends on Supabase dashboard configuration
- Recommendations: Select only needed columns; verify RLS policies exist on Vehicles table

## Performance Bottlenecks

**ScrollView Wrapping FlashList:**
- Problem: FlashList is nested inside a ScrollView, which defeats FlashList's virtualization
- Files: `app/(protected)/(tabs)/search.tsx` (lines 173-199)
- Cause: ScrollView with `contentContainerStyle={{ minHeight: '100%' }}` wraps the FlashList
- Improvement path: Remove outer ScrollView; use FlashList's built-in scroll and pull-to-refresh

**No Image Caching or Optimization:**
- Problem: Car images load from Unsplash URLs with no caching strategy
- Files:
  - `components/CarCard.tsx` (line 74-77)
  - `app/(protected)/(screens)/car/[id].tsx` (lines 224-227)
- Cause: Using basic `Image` component with remote URIs
- Improvement path: Use `expo-image` for built-in caching, blurhash placeholders, and progressive loading

**No Pagination on Vehicle Query:**
- Problem: `getVehicles()` fetches all vehicles with `select('*')` and no limit/offset
- Files: `services/supabase.api.ts` (line 5)
- Cause: No pagination implemented
- Improvement path: Add `.range()` or cursor-based pagination; implement infinite scroll in FlashList

## Fragile Areas

**Car Detail Screen Depends on Mock Data Array Lookup:**
- Files: `app/(protected)/(screens)/car/[id].tsx` (line 198)
- Why fragile: `MOCK_CARS.find((car) => car.id === id)` will always fail for real database IDs
- Safe modification: Replace with a `useVehicle(id)` query hook fetching from Supabase
- Test coverage: None

**Auth State Race Condition:**
- Files: `context/auth.tsx` (lines 27-38)
- Why fragile: `getSession()` and `onAuthStateChange` run concurrently; if auth state changes between the two calls, session could be set twice with different values
- Safe modification: Use only `onAuthStateChange` for initial session, or add a guard
- Test coverage: None

## Missing Critical Features

**No Listing Creation Flow:**
- Problem: New listing screen is a placeholder; users cannot post cars for sale
- Blocks: Core marketplace functionality (seller side)

**No Saved/Favorites System:**
- Problem: Saved screen is a placeholder; no backend table or local storage for favorites
- Blocks: User engagement and return visits

**No Messaging System:**
- Problem: Messages screen is a placeholder; "Contact Seller" button in car detail has no action
- Blocks: Buyer-seller communication

**No Search/Text Query:**
- Problem: Search screen has filters but no text-based search input
- Blocks: Users finding specific cars by keyword

**No Image Upload:**
- Problem: No image picker or Supabase Storage integration exists
- Blocks: Listing creation with photos

## Test Coverage Gaps

**Near-Zero Test Coverage:**
- What's not tested: Every screen, component, hook, service, and context
- Files: Only one test exists: `components/__tests__/ThemedText-test.tsx` (a snapshot test)
- Risk: Any refactoring or feature addition could break existing functionality undetected
- Priority: High - add tests for `context/auth.tsx`, `services/supabase.api.ts`, and `components/SearchFilters.tsx` first

## Deployment Concerns

**EAS Submit Config Has Placeholders:**
- Issue: `eas.json` contains `YOUR_APPLE_ID`, `YOUR_APP_STORE_CONNECT_APP_ID`, etc.
- Files: `eas.json` (lines 29-40)
- Impact: App Store submission will fail without real values

**Swap File Committed:**
- Issue: `config/.supabase.ts.swp` exists in the repo
- Files: `config/.supabase.ts.swp`
- Impact: Editor artifact cluttering the repo
- Fix approach: Delete and ensure `*.swp` is in `.gitignore` (it is, but file was committed before the rule)

**No Error Boundary:**
- Issue: No React error boundary wraps the app or any screen
- Files: `app/_layout.tsx`
- Impact: Unhandled JS errors crash the entire app with no recovery
- Fix approach: Add an ErrorBoundary component wrapping the root Stack

---

*Concerns audit: 2026-02-20*
