# Gjej Makine AL — Architecture & Developer Guide

## Overview

Gjej Makine ("Find Car") is a car marketplace for Albania. The system has two apps sharing one Supabase backend:

- **Mobile App** — React Native / Expo (root of repo)
- **Admin Dashboard** — Next.js (`/admin`)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Mobile | Expo SDK 52, React Native 0.76, TypeScript |
| Admin | Next.js 16, Tailwind CSS v4, TypeScript |
| Backend | Supabase (Postgres, Auth, Storage, Realtime) |
| State | TanStack React Query v5 (mobile), client-side fetch (admin) |
| Styling | Emotion Native + theme system (mobile), Tailwind dark theme (admin) |
| Navigation | Expo Router v4 (file-based, Stack + Tabs) |

---

## Database Schema (Supabase)

```
vehicles
  id, user_id, title, make, model, year, price, mileage,
  transmission, fuel_type, description, features[], image_urls[],
  location, status (active|pending|rejected|sold), created_at, updated_at

user_profiles
  id, display_name, phone, role (user|admin|super_admin|dealership), created_at

saved_cars
  user_id, vehicle_id, created_at

conversations
  id, vehicle_id, buyer_id, seller_id, updated_at

messages
  id, conversation_id, sender_id, content, read, created_at

Storage bucket: vehicle-images
```

### Role System

| Role | Mobile App | Admin Dashboard |
|---|---|---|
| `user` | Full access, manage own listings | Dashboard + My Listings |
| `dealership` | Full access, manage own listings | Dashboard + My Listings + Analytics |
| `admin` | Full access | Full dashboard access |
| `super_admin` | Full access | Full dashboard + user role management |

---

## Mobile App Architecture

### Directory Structure

```
app/                    # Expo Router screens (file-based routing)
  (public)/             # Landing page (unauthenticated)
  (auth)/               # Sign-in, Sign-up
  (protected)/          # Auth-gated area
    (tabs)/             # Bottom tabs: Home, Search, Saved, Profile
    (screens)/          # Stack screens: car detail, new listing, messages, etc.
components/             # Shared UI components
config/                 # Supabase client init (AsyncStorage sessions)
constants/              # Theme, colors, filter options, mock data
context/                # AuthProvider (session + demo mode)
hooks/                  # useColorScheme, useRefreshOnFocus, useThemeColor
services/               # Supabase API functions + React Query hooks
types/                  # Vehicle, Filters, Emotion theme types
```

### Navigation Flow

```
Root Stack
├── (public)/index       → Landing hero screen
├── (auth)/sign-in       → Email/password login + demo mode
├── (auth)/sign-up       → Registration
└── (protected)/         → Redirects to (public) if no session & no demo
    ├── (tabs)/
    │   ├── index        → Home (featured cars, brands, stats)
    │   ├── search       → Search + filter bottom sheet (FlashList)
    │   ├── saved        → Saved/favorited cars
    │   └── profile      → User profile + menu
    └── (screens)/
        ├── car/[id]     → Car detail (images, specs, contact seller)
        ├── new-listing  → Create listing (image picker, form)
        ├── my-listings  → User's own listings
        ├── messages     → Conversation list
        ├── messages/[id]→ Chat thread
        ├── help         → Help center
        └── profile-settings → Edit profile
```

### Key Patterns

- **Auth guard via layouts**: `(protected)/_layout.tsx` checks session/demoMode, redirects if neither
- **Demo mode**: Allows browsing without auth, falls back to mock data
- **React Query everywhere**: All data fetching via `useQuery`/`useMutation` with optimistic updates (e.g. saved cars)
- **Theming**: Emotion Native with full light/dark `CustomTheme` objects (palette, spacing, fontSize, shadows)
- **Web support**: 430px max-width wrapper for mobile-like web layout

### Services Layer (`services/supabase.api.ts`)

Single file exporting raw functions + React Query hooks for:
- **Vehicles**: CRUD, filtered list, user's vehicles, image upload to Storage
- **Saved Cars**: toggle with optimistic update
- **Messaging**: conversations, messages, send, mark read, getOrCreate conversation

---

## Admin Dashboard Architecture

### Directory Structure

```
admin/src/
  app/
    globals.css              # Dark theme CSS variables
    layout.tsx               # Root layout with AuthProvider
    login/page.tsx           # Multi-role login
    (dashboard)/
      layout.tsx             # Sidebar + AuthGuard + Suspense
      page.tsx               # Role-based dashboard home
      listings/page.tsx      # Listings management
      users/page.tsx         # User management (super_admin only)
      analytics/page.tsx     # Analytics with bar charts
  components/
    AuthGuard.tsx            # Role-gated wrapper (allowedRoles prop)
    Sidebar.tsx              # Role-filtered nav + logout
    StatsCard.tsx            # Stat card with optional trend
  lib/
    auth.tsx                 # AuthProvider + useAuth() hook
    supabase.ts              # Browser + server Supabase clients
```

### Auth Flow

1. `AuthProvider` (root) loads session + profile on mount, or activates demo mode
2. `AuthGuard` checks `useAuth()` — redirects to `/login` if no session, redirects to `/` if role not in `allowedRoles`
3. `Sidebar` filters nav links by role
4. Individual pages (e.g. Users) can add their own `<AuthGuard allowedRoles={[...]}>` wrapper

### Design System

Dark theme with CSS custom properties consumed via Tailwind v4:
- Background: `#0f1115`, Surface: `#1a1d23`
- Primary: `#38bdf8` (sky blue), Accent: `#6366f1` (indigo)
- Sidebar: gradient from indigo-950 to slate-900

---

## Environment Variables

### Mobile App (`.env`)
```
EXPO_PUBLIC_SUPABASE_APP_URL=<supabase-url>
EXPO_PUBLIC_SUPABASE_API_KEY=<supabase-anon-key>
```

### Admin (`admin/.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=<supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-key>
```

---

## Running Locally

```bash
# Mobile app
npm install
npx expo start

# Admin dashboard
cd admin
npm install
npm run dev          # runs on localhost:3002
```

---

## Pending

- SQL migration to add `dealership` role (see admin-dashboard-overhaul.md)
- No Supabase migrations folder — schema managed via Supabase dashboard SQL editor
