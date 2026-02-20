# Architecture - Gjej Makine AL

**Analysis Date:** 2026-02-20

## Overview

Expo Router (v4) file-based routing app for car listings in Albania. React Native + TypeScript with Supabase backend. Supports iOS, Android, and web (with a max-width wrapper for desktop).

## Directory Structure

```
gjej-makine-al/
├── app/                    # Expo Router file-based routes
│   ├── _layout.tsx         # Root layout: providers + route groups
│   ├── +not-found.tsx      # 404 screen
│   ├── (public)/           # Unauthenticated landing
│   ├── (auth)/             # Sign-in / sign-up flows
│   └── (protected)/        # Authenticated area
│       ├── (tabs)/         # Bottom tab navigator (Home, Search, Saved, Profile)
│       └── (screens)/      # Stack screens pushed over tabs
├── components/             # Shared UI components
│   ├── ui/                 # Primitives (BottomSheet, IconSymbol, SearchPageHeader, etc.)
│   └── *.tsx               # Feature components (CarCard, SearchFilters, etc.)
├── config/                 # Client configs
│   └── supabase.ts         # Supabase client init
├── constants/              # Static values
│   ├── theme.ts            # Light/dark theme tokens
│   ├── Colors.ts           # Color tokens (legacy)
│   └── mock-data.ts        # Mock car listings + Car type
├── context/                # React Context providers
│   └── auth.tsx            # AuthProvider (session + demo mode)
├── hooks/                  # Custom hooks
│   ├── useColorScheme.ts   # System color scheme
│   ├── useTheme.ts         # Typed Emotion theme hook
│   └── useRefreshOnFocus.tsx
├── services/               # API/data layer
│   └── supabase.api.ts     # Supabase queries + React Query hooks
├── types/                  # TypeScript declarations
│   └── emotion.d.ts        # Emotion theme augmentation
└── assets/                 # Fonts, images
```

## Routing Architecture

### Route Groups

Three top-level route groups defined in `app/_layout.tsx`:

| Group | Path | Purpose | Auth Guard |
|-------|------|---------|------------|
| `(public)` | `app/(public)/` | Landing page | Redirects to `(protected)` if session exists |
| `(auth)` | `app/(auth)/` | Sign-in, sign-up | Redirects to `(protected)` if session exists |
| `(protected)` | `app/(protected)/` | Main app | Redirects to `(public)` if no session and no demo mode |

### Protected Area - Nested Navigation

`app/(protected)/_layout.tsx` contains two nested groups:

- `(tabs)` - Bottom tab navigator with 4 tabs
- `(screens)` - Stack navigator for detail/settings screens pushed over tabs

### Tab Navigator

Defined in `app/(protected)/(tabs)/_layout.tsx`:

| Tab | File | Icon |
|-----|------|------|
| Home | `(tabs)/index.tsx` | home |
| Search | `(tabs)/search.tsx` | search |
| Saved | `(tabs)/saved.tsx` | heart |
| Profile | `(tabs)/profile.tsx` | user |

### Screen Stack

Defined in `app/(protected)/(screens)/_layout.tsx`:

| Screen | File | Route |
|--------|------|-------|
| Car Detail | `(screens)/car/[id].tsx` | `/car/:id` (dynamic) |
| New Listing | `(screens)/new-listing/index.tsx` | `/new-listing` |
| Help | `(screens)/help/index.tsx` | `/help` |
| Messages | `(screens)/messages/index.tsx` | `/messages` |
| My Listings | `(screens)/my-listings/index.tsx` | `/my-listings` |
| Profile Settings | `(screens)/profile-settings/index.tsx` | `/profile-settings` |

## Provider Hierarchy

Defined in `app/_layout.tsx`, outermost to innermost:

```
QueryClientProvider (React Query)
  └── AuthProvider (session + demo mode context)
        └── GestureHandlerRootView
              └── ThemeProvider (@emotion/react, light/dark)
                    └── BottomSheetModalProvider (@gorhom/bottom-sheet)
                          └── Stack (Expo Router)
```

On web, the entire content tree is wrapped in a max-width 430px container for mobile-like layout.

## Authentication Flow

Managed by `context/auth.tsx` using React Context.

1. `AuthProvider` calls `supabase.auth.getSession()` on mount
2. Subscribes to `supabase.auth.onAuthStateChange()` for live updates
3. Exposes: `session`, `initialized`, `demoMode`, `enterDemoMode()`, `exitDemoMode()`
4. Each route group layout checks `session` (and `demoMode` for protected) to redirect

**Sign-in:** `app/(auth)/sign-in.tsx` calls `supabase.auth.signInWithPassword()` directly.
**Sign-out:** `app/(protected)/(tabs)/profile.tsx` calls `supabase.auth.signOut()` directly.
**Demo mode:** Sets `demoMode: true` in context, bypasses auth guard in `(protected)/_layout.tsx`.

## Data Flow

### Server Data (React Query + Supabase)

Pattern in `services/supabase.api.ts`:

```
async function getVehicles() → supabase.from('Vehicles').select('*')
export const useVehicles() → useQuery({ queryKey: ['vehicles'], queryFn: getVehicles })
```

Used in `app/(protected)/(tabs)/search.tsx` which calls `useVehicles()`.

React Query online manager is configured in `app/_layout.tsx` using `expo-network` to detect connectivity changes.

### Local/Mock Data

Most screens currently use `MOCK_CARS` from `constants/mock-data.ts` rather than live Supabase data. The search screen fetches from Supabase but renders `MOCK_CARS` for the filtered list.

### State Management

- **Auth state:** React Context (`context/auth.tsx`)
- **Server state:** React Query (`@tanstack/react-query`)
- **UI state:** Local `useState` in components (filters, selected image, form inputs)
- **Theme:** Emotion ThemeProvider with `useTheme()` hook
- **No global client state store** (no Redux, Zustand, etc.)

## Styling Approach

Two patterns coexist:

1. **Emotion Native** (`styled` from `@emotion/native`) - Used in newer/feature screens: `(tabs)/index.tsx`, `(tabs)/search.tsx`, `(auth)/sign-in.tsx`, `(screens)/car/[id].tsx`, `components/CarCard.tsx`
2. **React Native StyleSheet** - Used in older/simpler screens: `(public)/index.tsx`, `(tabs)/saved.tsx`, `(tabs)/profile.tsx`, `components/SearchFilters.tsx`

Theme tokens defined in `constants/theme.ts` with `lightTheme` and `darkTheme` objects extending React Navigation's theme.

## Key Component Relationships

```
SearchScreen (tabs/search.tsx)
  ├── uses useVehicles() hook (services/supabase.api.ts)
  ├── uses MOCK_CARS + filterCars() (constants/mock-data.ts, components/SearchFilters.tsx)
  ├── renders FlashList of CarCard components
  ├── SearchPageHeader (components/ui/SearchPageHeader.tsx)
  ├── FiltersBottomSheet (components/ui/FiltersBottomSheet.tsx)
  └── BottomSheetModal (@gorhom/bottom-sheet)

CarCard (components/CarCard.tsx)
  └── Links to /car/[id] via expo-router Link

CarDetailsScreen (screens/car/[id].tsx)
  └── Reads id from useLocalSearchParams(), looks up MOCK_CARS
```

## Supabase Client

Configured in `config/supabase.ts`:
- Uses `AsyncStorage` for session persistence (client-side only)
- Auto-refreshes tokens on app foreground via `AppState` listener
- Env vars: `EXPO_PUBLIC_SUPABASE_APP_URL`, `EXPO_PUBLIC_SUPABASE_API_KEY`
- `.env` file present (not read for security)

## Platform Handling

- `app/_layout.tsx`: Web gets a centered 430px max-width wrapper with dark background
- `components/ui/IconSymbol.ios.tsx` / `IconSymbol.tsx`: Platform-specific icon implementations
- `components/ui/TabBarBackground.ios.tsx` / `TabBarBackground.tsx`: Platform-specific tab bar
- `hooks/useColorScheme.web.ts`: Web-specific color scheme hook
