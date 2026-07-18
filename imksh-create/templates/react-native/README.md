# 📱 Mobile App (React Native + Expo)

This is the mobile application of the starter template, built entirely with **React Native** and **Expo**. It is designed to be a highly scalable boilerplate featuring a modern tech stack, a unified permissions system, and a robust custom UI component library.

## ✨ Key Features

- **Expo Router**: File-based routing that makes navigation predictable and deeply linkable.
- **NativeWind (Tailwind CSS)**: Styling is powered by Tailwind CSS classes, complete with dynamic Light/Dark mode support.
- **Custom UI Library**: Beautiful, highly-reusable components built from scratch (e.g., `Tabs`, `Button`, `Image`, `ScrollContainer`, `Input`) designed to work perfectly across both themes.
- **Zustand State Management**: Lightweight and fast global state management, used to handle the user's auth session securely.
- **Unified Permission Service**: A centralized handler for iOS and Android hardware permissions using `react-native-permissions`.
- **Push Notification Pipeline**: Built-in support for generating Expo Push Tokens on physical devices and syncing them to your backend.

## 🧩 Included UI Components

The starter kit comes with a massive, completely customizable, and gesture-driven UI library built from scratch out of atomic elements.

- **Layout**: `Container`, `Section`, `ScrollContainer`, `HStack`, `VStack`
- **Buttons**: `Button` (with variants, sizes, and soft props), `IconButton`, `FloatingActionButton`
- **Data Display**: `Avatar`, `Badge`, `Accordion`, `SwipeableRow`, `Card`
- **Inputs**: `Input`, `Checkbox`, `Radio`, `Switch`, `Slider`, `SearchBar`
- **Feedback & Loading**: `Spinner`, `ProgressBar`, `CircularProgress`, `Skeleton`, `GestureWrapper`
- **Navigation**: `Tabs` (Underline & Button variants)
- **Overlay & Modals**: `BottomModal` (Gesture-driven bottom sheet)

## 🔌 Included Services

Pre-configured service wrappers allow you to focus on logic rather than boilerplate:

- **`auth.service.ts`**: Prebuilt Axios integrations for `sendOtp`, `signup`, `login`, `updateMe`, `logout`, and `savePushToken`.
- **`permission.service.ts`**: A unified permissions handler exposing `requirePermission`, `openSettingsForApp`, and `registerForPushNotificationsAsync`.

---

## 🛠 Tech Stack

- **Framework**: Expo / React Native
- **Styling**: NativeWind (Tailwind v3) & `react-native-reanimated`
- **Routing**: `expo-router`
- **State**: `zustand`
- **Storage**: `@react-native-async-storage/async-storage`
- **API**: `axios`

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js (v18+)
- [EAS CLI](https://docs.expo.dev/build/setup/) (`npm install -g eas-cli`)
- iOS Simulator (macOS only) or Android Emulator

### Installation

1. Navigate to the `mobile` directory:
   ```bash
   cd mobile
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Press `i` to open the app on an iOS Simulator, or `a` to open it on an Android Emulator.

---

## 🏗 Project Structure

```bash
src/
├── app/                  # Expo Router screens (e.g., _layout.tsx, login.tsx, (tabs)/)
├── components/           # Reusable UI components
│   ├── common/           # Generic components (Loading, etc.)
│   └── ui/               # Custom UI library (Button, Tabs, Image, Input)
├── constants/            # Theme tokens (Colors, Typography)
├── services/             # API and business logic wrappers
│   ├── auth.service.ts   # Axios API calls for authentication
│   └── permission.service.ts # Unified hardware permission logic
├── store/                # Zustand global stores (useAuthStore.ts)
└── utils/                # Helper functions (storage.ts, api.ts)
```

---

## 📦 Build Instructions

This template is configured for both cloud-based builds (via EAS) and fast local compilations using standard Gradle scripts.

### Cloud Builds (Expo Application Services)

If you don't have Android Studio or Xcode configured, you can build directly in the cloud:

```bash
# Build an Android APK (Uses the "preview" profile in eas.json)
npm run build:eas:apk

# Build an Android App Bundle (.aab) for the Play Store (Uses "production" profile)
npm run build:eas:aab

# Build an iOS app
npm run build:ios
```

### Local Builds (Requires Android Studio/SDK)

If you have your local SDK set up, you can compile extremely fast on your own machine:

```bash
# Compile a local .apk
npm run build:apk

# Compile a local .aab
npm run build:aab
```

_(Note: Rebuilding natively is required whenever you add new npm packages containing native code, or modify the `app.json` plugins!)_

---

## 🔒 Handling Permissions

Rather than installing different disjointed `expo-*` libraries every time you need hardware access, this template centralizes all permission requests using the `PermissionService`.

To check or request access:

```typescript
import { permissionService } from "@/services/permission.service";

// Calling requirePermission() will automatically prompt the user if they haven't been asked yet
const hasCameraAccess = await permissionService.requirePermission("camera");

if (!hasCameraAccess) {
  // Deep link the user to the OS settings if they permanently blocked the permission
  permissionService.openSettingsForApp();
}
```

## 🔔 Push Notifications

To request push notifications, just call the utility function. It will automatically detect if it is running on a physical device, set up the required Android notification channels, fetch the token from Apple/Google, and return it:

```typescript
import { permissionService } from "@/services/permission.service";
import { authService } from "@/services/auth.service";

const token = await permissionService.registerForPushNotificationsAsync();

// Send it to the backend!
if (token) {
  await authService.savePushToken(token);
}
```
