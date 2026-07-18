# Feedback Components

Components designed to provide visual or physical feedback to the user, including loading states and gesture wrappers.

## `GestureWrapper`
A powerful utility component that simplifies `react-native-gesture-handler`. It abstracts the boilerplate of the `GestureDetector` API.

### Usage Example
```tsx
import { GestureWrapper } from '@/components/ui/feedback/GestureWrapper';
import { View, Text } from 'react-native';

export default function InteractiveCard() {
  return (
    <GestureWrapper
      onTap={() => console.log("Card Tapped")}
      onDoubleTap={() => console.log("Card Liked (Double Tap)")}
      onSwipeLeft={() => console.log("Dismissed to the left")}
      onPanUpdate={(e) => console.log(`Dragging at X: ${e.translationX}`)}
    >
      <View className="p-8 bg-blue-500 rounded-xl">
        <Text className="text-white text-xl">Interact with me!</Text>
      </View>
    </GestureWrapper>
  );
}
```

## `CircularProgress` & `ProgressBar`
Used to indicate loading progress or task completion.

## `Skeleton`
Used as a placeholder while data is loading.

## `Spinner`
An infinite spinning loading indicator.
