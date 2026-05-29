# Practice Sessions

Practice Sessions is a React Native (Expo Go) app for recording short practice clips. It uses the gyroscope to enable recording only when the phone is stable, and automatically stops if the device moves.

## Features
- Gyroscope-based stability detection to enable/disable recording.
- Manual record/stop flow with automatic save.
- Local session storage and playback.
- Mic test screen to confirm microphone access.

## Tech Stack
- React Native (Expo Go)
- expo-av (record/play audio)
- expo-sensors (gyroscope)
- expo-file-system (local storage)

## Project Structure
- src/presentation: UI, screens, hooks
- src/application: use cases (stability monitoring)
- src/domain: models and stability logic
- src/infrastructure: device adapters (Expo gyroscope)

## Screens
- Sound: main recorder with stability gating and session list
- Gyroscope: stability status viewer
- Mic Test: quick microphone test

## Run
1) Install dependencies
```
bun install
```
2) Start the app
```
bun run start
```
3) Open in Expo Go on your device

## Permissions
- Microphone permission is requested in-app when recording is started.
- iOS usage text is configured in app.json.

## AI Usage
This project used AI assistance to:
- Draft and refine application architecture
- Generate and review React Native hook logic
- Debug permission and recording issues
- Improve UI consistency and documentation

Final code decisions, testing, and integration were done by the project owner.
