# 🌟 Starter Kit Features

This starter kit is packed with a robust set of features, prebuilt components, and essential services designed to eliminate setup time so you can focus entirely on building your product.

---

## 🧩 UI Components

Our custom UI library is built entirely from atomic elements, fully typed, beautifully styled with NativeWind, and ready for gesture-driven interactions.

### 📐 Layout
- **`Container`**: A responsive wrapper for consistent screen margins.
- **`Section`**: A structured block for grouping related components with headers.
- **`ScrollContainer`**: An optimized scrolling view that natively handles keyboard avoidance and safe area insets.
- **`HStack` / `VStack`**: Flexbox utility components for rapid horizontal and vertical alignment.

### 🔘 Buttons
- **`Button`**: The core interactive element supporting multiple variants (`primary`, `secondary`, `accent`, `outline`, `ghost`), sizing (`sm`, `md`, `lg`), and a dynamic `soft` prop for pale translucent styling.
- **`IconButton`**: Icon-only circular buttons for compact interactions.
- **`FloatingActionButton`**: A prominent, elevated CTA button, typically anchored at the bottom of the screen.

### 📊 Data Display
- **`Avatar`**: Display user profile images with automatic fallbacks and size variants.
- **`Badge`**: Small status indicators supporting all semantic theme colors and the `soft` prop.
- **`Accordion`**: Collapsible vertical panels for FAQs or dense information.
- **`Card`**: Elevated, rounded containers for grouping information.
- **`SwipeableRow`**: Natively gesture-driven list items that reveal hidden actions (e.g., delete, archive) upon swiping left or right.

### 📝 Inputs & Controls
- **`Input`**: A highly styled text input supporting left/right icons, error states, and secure text entry.
- **`SearchBar`**: A dedicated input variant tailored for real-time search filtering.
- **`Switch`**: A native-feeling toggle switch for boolean states.
- **`Checkbox` & `Radio`**: Accessible selection controls for forms and settings.
- **`Slider`**: A continuous drag slider for numeric value selection.

### ⏳ Feedback & Loading
- **`Spinner`**: A minimal, rotating activity indicator.
- **`ProgressBar`**: A linear progress bar for uploading/downloading tasks.
- **`CircularProgress`**: An SVG-based circular indicator for data syncing or completion rates.
- **`Skeleton`**: Animated placeholder blocks for loading states before data is fetched.
- **`GestureWrapper`**: A powerful higher-order component that wraps any view to easily handle double-taps, long-presses, and directional swipes using `react-native-reanimated`.

### 🧭 Navigation & Overlays
- **`Tabs`**: Clean, customizable local tab navigation (supports `underline` and `button` pill styles).
- **`BottomModal`**: A gesture-driven, highly responsive bottom sheet that slides up and can be dismissed interactively via drag gestures.

---

## 🔌 Core Services

Pre-configured, strongly-typed service wrappers handle complex background logic so you don't have to write boilerplate.

### 🔐 Authentication (`auth.service.ts`)
Fully integrated Axios endpoints for standard auth flows:
- `sendOtp`: Dispatch sign-up verification codes.
- `signup`: Register a new user with OTP verification.
- `login`: Authenticate existing users.
- `updateMe`: Sync profile updates to the backend.
- `logout`: Clear session data securely.
- `savePushToken`: Send device push tokens to the server.

### 📱 Hardware Permissions (`permission.service.ts`)
A centralized, cross-platform handler that abstracts away iOS/Android permission complexity:
- `requirePermission`: Request camera, location, photo library, or microphone access gracefully.
- `openSettingsForApp`: Deep-link users to system settings if they previously blocked a permission.
- `registerForPushNotificationsAsync`: Automatically negotiate with Apple APNs / Firebase FCM, configure local Android channels, and return the Expo Push Token.

---

## 🏗 System Architecture

### 🚀 Tech Stack
- **Framework**: Expo / React Native
- **Styling**: NativeWind (Tailwind v3) & `react-native-reanimated`
- **Routing**: `expo-router`
- **Global State**: `zustand`
- **Storage**: `@react-native-async-storage/async-storage`
- **API**: `axios`

### 🎨 Theming
- **Dynamic Light/Dark Mode**: The entire UI responds instantly to the system appearance.
- **Semantic Colors**: Colors are defined centrally (e.g., `primary`, `base100`, `error`) via CSS variables, making global restyling effortless.

### ⚡ Build Pipeline
- Pre-configured `eas.json` and local `npm` scripts to instantly compile Cloud or Local `.apk`, `.aab`, and `.ipa` artifacts.
