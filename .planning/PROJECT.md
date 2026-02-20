# Gjej Makine AL - Project Definition

## Vision
Albanian car marketplace app (AutoScout24 for Albania) connecting buyers and sellers.

## Tech Stack
- **Mobile App:** Expo SDK 52 / React Native 0.76 / TypeScript
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Styling:** Emotion Native (keeping, modernizing)
- **Data:** TanStack React Query v5
- **Admin:** Next.js (separate app, same Supabase)

## Current State
- Auth works (sign-in/sign-up/demo mode)
- Search page with filters (uses mock data, not wired to Supabase)
- Car detail page (mock data)
- 6 placeholder screens (Saved, New Listing, My Listings, Messages, Profile Settings, Help)
- No admin dashboard
- No real data pipeline

## Milestone 1: Full-Featured MVP

### Phase 1: Foundation & Data Layer
Wire up real Supabase data, fix tech debt, consolidate shared types/constants.

### Phase 2: Modern UI/Theming
Modernize Emotion theme system, add design tokens (spacing, typography, shadows, radii), standardize all screens to use Emotion styled with theme tokens, remove hardcoded colors.

### Phase 3: Core Features - Buyer Side
Build Saved Cars (favorites), wire search to real data with pagination, add text search, implement car detail from DB.

### Phase 4: Core Features - Seller Side
Build New Listing (with image upload via Supabase Storage), My Listings management, Profile Settings.

### Phase 5: Communication
Build messaging system between buyers and sellers. Wire "Contact Seller" button.

### Phase 6: Admin Dashboard
Separate Next.js app with Tailwind. Manage listings, users, reported content, analytics. Connects to same Supabase.

### Phase 7: Polish & Deploy
Error boundaries, loading states, empty states, performance optimization (expo-image, pagination), deployment config.
