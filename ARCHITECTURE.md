# Architecture Notes — Guess The Number

## Overview
Guess The Number is a single-screen, fully offline mobile game built with **React Native** via **Expo** (TypeScript). There is no backend, server, or network dependency — all game logic runs on-device.

## Tech Stack
| Layer       | Choice                              | Notes |
|-------------|--------------------------------------|-------|
| UI framework| React Native (via Expo SDK)          | One codebase targets both iOS and Android |
| Language    | TypeScript                           | Scaffolded with `create-expo-app` TS template |
| State       | React `useState` (local component state) | No external state library needed for this scope |
| Backend     | None                                 | "Play and forget" — no accounts, no persistence, no sync |
| Build/publish | Expo Go (dev) → EAS Build (release) | EAS Build planned for producing signed store binaries |

## App Structure
```
guess-the-number-app/
├── App.tsx          # Entire app: single screen, all game logic and UI
├── index.ts         # Expo entry point, registers App
├── app.json         # Expo app config (name, icons, splash, etc.)
├── package.json      # Dependencies and scripts
└── assets/          # App icons, splash images (currently Expo defaults)
```

## Game Logic (`App.tsx`)
- **Range configuration**: user can set `min`/`max` (default 1–100) before playing; validated (must be numbers, min < max).
- **Target number**: `randomInRange(min, max)` picks the secret number on game start/reset.
- **Guess flow**: user submits a guess → compared to target → feedback set to `Higher`, `Lower`, or `Correct!`; `attempts` counter increments each guess.
- **Win state**: on correct guess, input is disabled and a `Play Again` button appears to reset with the same range.
- **Reset**: available any time to restart with a fresh target in the current range.

All state (`range`, `target`, `guess`, `feedback`, `attempts`, `won`) is local to the single `App` component — no global store, context, or persistence layer, consistent with the "play and forget" scope.

## Why No Backend (for now)
The game requirements are: generate a number, compare guesses, show feedback, reset. None of this requires server-side state, accounts, or cross-device sync. Keeping it client-only minimizes complexity and cost for v1.

## Future Considerations
If the app grows beyond v1 (e.g. leaderboards, saved stats, multiplayer), likely additions would be:
- **Persistence**: local only (e.g. `AsyncStorage`) for saving best scores on-device, before introducing any server.
- **Backend** (only if cross-device/account features are needed): a lightweight API (e.g. Node/Express or a managed BaaS like Supabase/Firebase) plus a database — not required for current scope.
- **Navigation**: if more screens are added (settings, stats, leaderboard), introduce Expo Router or React Navigation; currently unnecessary for a single-screen app.

## Publishing Path
1. Local development/testing via `npx expo start` + Expo Go app.
2. Production builds via **EAS Build** (Expo's cloud build service) — produces signed `.ipa` (iOS) and `.aab`/`.apk` (Android) without requiring a local native toolchain.
3. Submission to Apple App Store and Google Play via EAS Submit or manual upload.

See open issues in this repo for the remaining steps required before store submission (icons, bundle identifiers, EAS configuration, store metadata, developer accounts).
