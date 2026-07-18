# Getting Started

This mobile app is built on **Expo Router**, **NativeWind**, and **Zustand**. 

## App Architecture

- **`src/app/`**: This is the routing directory. Expo Router uses file-based routing similar to Next.js.
  - `_layout.tsx`: The root wrapper. This is where providers (`GestureHandlerRootView`, `PaperProvider`, `StatusBar`) are initialized.
  - `(tabs)/`: A route group that shares a bottom tab bar layout.
  - `login.tsx`: The login screen route.
- **`src/components/`**: Reusable React components. The `ui/` folder contains our custom design system.
- **`src/store/`**: Global state management using `Zustand`. `useAuthStore.ts` handles the authentication lifecycle.
- **`src/services/`**: Abstracts API calls and device native capabilities (e.g., `permission.service.ts` for unified hardware permissions).

## Managing Theme

The app uses **NativeWind** to handle styling. 
By default, the theme is bound to the device OS theme, but it can be overridden and saved using `AsyncStorage`.

```tsx
import { useColorScheme } from 'nativewind';

export default function MyComponent() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  
  return (
    <View className="bg-white dark:bg-gray-900">
      <Text className="text-black dark:text-white">Current theme: {colorScheme}</Text>
    </View>
  );
}
```

## Hardware Permissions

Never install a separate `expo-*` permission library manually. Use the `PermissionService`:

```typescript
import { permissionService } from '@/services/permission.service';

const requestCamera = async () => {
  const granted = await permissionService.requirePermission('camera');
  if (granted) {
    console.log('Camera ready!');
  }
}
```
