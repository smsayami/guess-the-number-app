# Guess The Number

A simple, fully offline number-guessing game built with [Expo](https://expo.dev) and React Native (TypeScript).

The app picks a random number in a range (default 1–100, configurable before you start) and lets you guess it. After each guess you're told **Higher**, **Lower**, or **Correct!**, your attempt count is tracked, and a **Play Again** button appears once you win. No backend, no network calls — everything runs locally on the device.

## Running locally with Expo Go

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npx expo start
   ```
3. Scan the QR code with the **Expo Go** app on your iOS or Android device (or press `i`/`a` in the terminal to launch an iOS Simulator/Android Emulator).

## Publishing to app stores later

When you're ready to ship to the App Store or Google Play, use [EAS Build](https://docs.expo.dev/build/introduction/) to create production binaries — it handles signing and store-ready builds without needing a local native toolchain. No EAS configuration has been set up yet; that's a future step.
