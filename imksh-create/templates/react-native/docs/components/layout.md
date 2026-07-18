# Layout Components

Layout components provide the foundational structure of the application screens, ensuring consistent padding, spacing, and structural organization.

## `Container`
Wraps main content to ensure consistent margins across all screens.

## `ScrollContainer`
Similar to `Container`, but uses a `ScrollView`. Essential for screens whose content exceeds the device height.

## `KeyboardAvoidingViewWrapper`
An extremely helpful utility that wraps the screen and automatically adjusts the layout padding when the virtual keyboard appears, preventing inputs from being hidden by the keyboard.

### Usage Example
```tsx
import { KeyboardAvoidingViewWrapper } from '@/components/ui/layout/KeyboardAvoidingViewWrapper';
import { Input } from '@/components/ui/inputs/Input';

export default function LoginScreen() {
  return (
    <KeyboardAvoidingViewWrapper>
      {/* Content won't be blocked by the keyboard here! */}
      <Input placeholder="Username" />
      <Input placeholder="Password" />
    </KeyboardAvoidingViewWrapper>
  );
}
```

## `Divider`
A simple horizontal or vertical line to separate content sections visually.

## `Grid` & `Stack`
Utility components for quickly aligning children items using flexbox properties, saving you from writing repetitive nativewind classes.
