# Technology Stack

**Analysis Date:** 2026-02-20

## Languages

**Primary:**
- TypeScript ^5.3.3 - All application code (`.ts`, `.tsx`)

**Secondary:**
- JavaScript - Build scripts (`scripts/reset-project.js`)

## Runtime

**Environment:**
- Node.js >= 20 (specified in `package.json` engines)
- Hermes JS engine for iOS and Android (configured in `app.json`)
- Metro bundler for web (static output)

**Package Manager:**
- npm (inferred from `package-lock.json`)
- yarn lockfile also present (`yarn.lock`) - potential inconsistency

## Frameworks

**Core:**
- Expo SDK ~52.0.17 - React Native framework and build toolchain
- React 18.3.1 - UI library
- React Native 0.76.6 - Cross-platform mobile runtime
- Expo Router ~4.0.11 - File-based routing (`app/` directory)

**State/Data:**
- TanStack React Query ^5.64.2 - Server state management and data fetching
- React Context - Auth state (`context/auth.tsx`)

**Styling:**
- Emotion Native ^11.11.0 + Emotion React ^11.14.0 - CSS-in-JS styling with theme support
- Custom theme system in `constants/theme.ts` with light/dark mode

**UI Components:**
- @gorhom/bottom-sheet ^5.0.6 - Bottom sheet modals
- @shopify/flash-list 1.7.1 - High-performance list rendering
- @expo/vector-icons ^14.0.2 - Icon library
- expo-blur ~14.0.1 - Blur effects
- expo-symbols ~0.2.0 - SF Symbols (iOS)

**Navigation:**
- @react-navigation/native ^7.0.0 - Navigation core
- @react-navigation/bottom-tabs ^7.0.0 - Tab navigation
- react-native-screens ~4.4.0 - Native screen containers
- react-native-safe-area-context 4.12.0 - Safe area handling

**Animation/Gestures:**
- react-native-reanimated ~3.16.1 - Animations
- react-native-gesture-handler ^2.22.0 - Gesture system

**Testing:**
- Jest ^29.2.1 - Test runner
- jest-expo ~52.0.2 - Expo-specific Jest preset
- react-test-renderer 18.3.1 - Component rendering for tests

**Build/Dev:**
- @babel/core ^7.25.2 - JavaScript transpilation
- EAS CLI >= 5.9.1 - Expo Application Services for builds (`eas.json`)
- @dev-plugins/react-query ^0.1.0 - React Query DevTools integration
- @tanstack/eslint-plugin-query ^5.64.2 - Lint rules for React Query

## Key Dependencies

**Critical (runtime):**
- `@supabase/supabase-js` ^2.47.12 - Backend-as-a-service (database, auth, API)
- `@tanstack/react-query` ^5.64.2 - All data fetching goes through this
- `@react-native-async-storage/async-storage` ^2.1.0 - Persistent local storage (used for Supabase auth session)
- `expo-router` ~4.0.11 - Entire routing architecture depends on this

**Platform Support:**
- `react-native-web` ~0.19.13 - Web platform support
- `react-native-url-polyfill` ^2.0.0 - URL polyfill required by Supabase on React Native
- `react-native-webview` 13.12.5 - WebView component
- `expo-network` ^7.0.5 - Network state detection for React Query online manager

**Potentially Redundant:**
- `react-native-async-storage` ^0.0.1 - Appears to be a duplicate/wrapper alongside `@react-native-async-storage/async-storage`

## Configuration

**TypeScript:**
- Config: `tsconfig.json` - extends `expo/tsconfig.base`
- Strict mode enabled
- Path alias: `@/*` maps to project root

**Expo:**
- Config: `app.json` - app metadata, plugins, and platform settings
- New Architecture enabled (`newArchEnabled: true`)
- Typed routes enabled (`experiments.typedRoutes: true`)
- Plugins: `expo-router`, `expo-splash-screen`

**EAS Build:**
- Config: `eas.json`
- Profiles: `development` (simulator), `preview` (internal), `production`
- iOS uses `m-medium` resource class for preview/production builds

**Environment:**
- `.env` file present - contains Supabase configuration
- Variables accessed via `process.env.EXPO_PUBLIC_SUPABASE_APP_URL` and `process.env.EXPO_PUBLIC_SUPABASE_API_KEY`
- Uses `EXPO_PUBLIC_` prefix for client-side env vars

**Testing:**
- Jest config inline in `package.json` with `jest-expo` preset
- Run: `npm test` (runs `jest --watchAll`)

**Linting:**
- Run: `expo lint` (no standalone ESLint config file detected)
- TanStack Query ESLint plugin installed

## Platform Targets

**iOS:**
- Supports tablet
- Bundle ID: `com.gjejmakine.al`
- Hermes engine
- Portrait orientation

**Android:**
- Adaptive icon configured
- Hermes engine

**Web:**
- Metro bundler with static output
- Deployed to Vercel (inferred from git history: "Fix node engine version for Vercel compatibility")
- Mobile-first layout: web view constrained to 430px max-width with centered layout

## Architecture Implications

- Supabase is the sole backend - no custom API server
- All data flows through React Query hooks wrapping Supabase client calls (`services/supabase.api.ts`)
- Auth is managed via Supabase Auth with session persistence in AsyncStorage
- Demo mode exists as a client-side flag in AuthContext (no backend involvement)
- Theme system uses Emotion's ThemeProvider with custom tokens extending React Navigation themes
- Type augmentation for Emotion theme in `types/emotion.d.ts`

---

*Stack analysis: 2026-02-20*
