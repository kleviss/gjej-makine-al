# Code Quality Analysis

**Analysis Date:** 2026-02-20

## Styling Consistency

**Mixed approaches detected.** The codebase uses two incompatible styling systems side by side:

1. **Emotion Native (`styled`)** - Used in most feature screens and components
   - Object syntax: `components/CarCard.tsx`, `components/ui/SearchPageHeader.tsx`, `components/ui/FiltersBottomSheet.tsx`, `app/(protected)/(tabs)/index.tsx`, `app/(protected)/(tabs)/search.tsx`, `app/(protected)/(screens)/car/[id].tsx`
   - Template literal syntax: `app/(auth)/sign-in.tsx` (mixes both object AND template literal Emotion syntax in the same file)

2. **React Native `StyleSheet.create`** - Used in older/simpler screens
   - `components/SearchFilters.tsx` (full StyleSheet, no Emotion)
   - `components/ThemedText.tsx` (StyleSheet)
   - `app/(protected)/(tabs)/saved.tsx` (StyleSheet + ThemedView)
   - `app/(protected)/(tabs)/profile.tsx` (StyleSheet + ThemedView)
   - `app/(protected)/(tabs)/search.tsx` (has BOTH: Emotion styled components at top AND an unused `StyleSheet.create` block at bottom, lines 219-234)

3. **Inline styles** - Scattered throughout
   - `app/_layout.tsx` line 66: `style={{ flex: 1 }}`
   - `app/_layout.tsx` lines 85-86: complex inline style objects with `boxShadow` cast as `any`
   - `app/(protected)/(tabs)/search.tsx` line 178: `style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}`

**Verdict:** No single styling convention. Emotion Native is the intended direction but adoption is incomplete.

## TypeScript Usage

**Strict mode enabled** in `tsconfig.json` with `"strict": true`.

**Good patterns:**
- `Car` interface properly typed in `constants/mock-data.ts`
- `AuthContextType` properly typed in `context/auth.tsx`
- `CustomTheme` interface extends `NavigationTheme` in `constants/theme.ts`
- Emotion theme augmentation in `types/emotion.d.ts`
- Component props interfaces defined (`CarCardProps`, `SearchFiltersProps`, `SearchPageHeaderProps`, `FiltersBottomSheetProps`)

**Weak patterns:**
- `useTheme() as CustomTheme` cast repeated in every file that uses the theme: `app/(protected)/(tabs)/index.tsx`, `app/(protected)/(tabs)/search.tsx`, `app/(protected)/(screens)/car/[id].tsx`, `app/(auth)/sign-in.tsx`, `components/ui/SearchPageHeader.tsx`. The `hooks/useTheme.ts` wrapper (`useEmotionStyledTheme`) exists but is never used.
- `config/supabase.ts` lines 7-8: `process.env` values cast as `string` with no runtime validation
- `services/supabase.api.ts`: `getVehicles()` returns untyped `data` from Supabase (no generic type parameter on `.from('Vehicles').select('*')`)
- `app/(auth)/sign-in.tsx` line 10: redundant explicit theme type `({ theme }: { theme: CustomTheme })` when Emotion already provides it

## Error Handling

**Minimal and inconsistent:**

- `context/auth.tsx`: `supabase.auth.getSession()` uses `.then()` with no `.catch()` - silent failure on auth init
- `app/(auth)/sign-in.tsx`: `signIn()` catches Supabase errors and displays them via state - this is the only screen with user-facing error handling
- `services/supabase.api.ts`: `getVehicles()` throws on error, relying on React Query to handle it. The `search.tsx` screen destructures `error` from `useVehicles()` but never renders it
- `app/(protected)/(screens)/car/[id].tsx`: Shows "Car not found" fallback for missing car - good
- `app/(protected)/(tabs)/profile.tsx`: `supabase.auth.signOut()` called with no error handling
- No global error boundary detected

## Test Coverage

**Effectively zero.** One test file exists:

- `components/__tests__/ThemedText-test.tsx`: Single snapshot test from Expo template
- `components/__tests__/__snapshots__/ThemedText-test.tsx.snap`: Snapshot file
- Jest configured in `package.json` with `jest-expo` preset
- No tests for any feature code (auth, search, filters, car details, services)
- No test utilities, factories, or mocking patterns established

## Linting & Formatting

- `package.json` has `"lint": "expo lint"` script (uses ESLint under the hood)
- `@tanstack/eslint-plugin-query` installed as devDependency
- No `.eslintrc`, `.prettierrc`, `eslint.config.*`, or `biome.json` detected - relies entirely on Expo defaults
- No formatting tool configured (no Prettier)
- Inconsistent semicolons: most files use them, `app/_layout.tsx` omits some (lines 4, 26, 32, etc.)
- Inconsistent trailing commas and spacing throughout

## Code Duplication

**Significant duplication in filter-related code:**

1. **`Filters` interface** defined 3 times independently:
   - `components/SearchFilters.tsx` lines 20-25
   - `app/(protected)/(tabs)/search.tsx` lines 52-57
   - `components/ui/SearchPageHeader.tsx` lines 9-14

2. **Filter constants** (`MAKES`, `PRICE_RANGES`, `YEARS`, `TRANSMISSIONS`) defined twice:
   - `components/SearchFilters.tsx` lines 8-19
   - `app/(protected)/(tabs)/search.tsx` lines 40-51
   - Values differ between the two (e.g., different MAKES lists, $ vs EUR currency in price ranges)

3. **Filter handler functions** (`handleMakeSelect`, `handlePriceSelect`, `handleYearSelect`, `handleTransmissionSelect`) duplicated:
   - `components/SearchFilters.tsx` lines 63-83
   - `app/(protected)/(tabs)/search.tsx` lines 82-102

4. **Theme colors** defined in two places:
   - `constants/Colors.ts` (original Expo template)
   - `constants/theme.ts` (custom theme system)
   - `profile.tsx` imports from `Colors.ts` while most other files use `theme.ts`

## Component Reusability

**Reusable components:**
- `components/CarCard.tsx` - Well-structured, typed props, used in search list
- `components/ThemedText.tsx` - Generic themed text with variants
- `components/ThemedView.tsx` - Generic themed container
- `components/ui/FiltersBottomSheet.tsx` - Generic filter sheet with section-based API
- `components/ui/SearchPageHeader.tsx` - Search-specific but cleanly separated

**Not reusable / tightly coupled:**
- `components/SearchFilters.tsx` - Appears to be an older version, partially superseded by `FiltersBottomSheet.tsx`. Still imported in `search.tsx` only for the `filterCars` utility function (line 13)
- Styled components are defined inline in screen files rather than extracted to shared modules. Every screen re-creates `StyledContainer`, `Title`, `Price` etc. with slightly different values

## Mock Data vs Real Data

**Both exist, mock data dominates:**

- `constants/mock-data.ts`: 3 hardcoded `Car` objects used throughout the app
- `services/supabase.api.ts`: Real API call via `useVehicles()` hook fetching from Supabase `Vehicles` table
- `app/(protected)/(tabs)/search.tsx`: Imports BOTH `MOCK_CARS` and `useVehicles`. Fetches real data but renders `filteredCars` which is initialized from `MOCK_CARS` (line 62) and filtered against `MOCK_CARS` (lines 106, 117). The real `vehicles` data is fetched but never displayed.
- `app/(protected)/(screens)/car/[id].tsx`: Uses only `MOCK_CARS` to find car by ID (line 198)
- Demo mode exists in auth context but doesn't toggle between mock/real data

## Hardcoded Values

- `app/(protected)/(screens)/car/[id].tsx` line 18: `top: 66` magic number for back button position
- `app/(protected)/(tabs)/profile.tsx` line 59: `backgroundColor: '#007AFF'` hardcoded iOS blue
- `components/SearchFilters.tsx`: Multiple hardcoded colors (`#2563eb`, `#f3f4f6`, `#1f2937`, `#eee`, `#fff`) not using theme
- `app/_layout.tsx` line 85: `backgroundColor: '#1a1a2e'` hardcoded
- `components/ui/FiltersBottomSheet.tsx` line 46: `borderTopColor: '#e5e7eb'` hardcoded

## Dead Code

- `app/(protected)/(tabs)/search.tsx` lines 219-234: Unused `StyleSheet.create` block with commented-out properties
- `hooks/useTheme.ts`: `useEmotionStyledTheme()` hook exists but is never imported anywhere
- `components/SearchFilters.tsx`: The component itself is never rendered; only `filterCars` is imported from it
- `app/(protected)/(tabs)/search.tsx` lines 112-113: Empty lines (minor)
- `app/(protected)/(tabs)/profile.tsx` line 31: Commented-out Link code
