# Gesture Control Components

Handling touch events and gestures natively in React Native can be complex, but this template provides highly abstracted, easy-to-use gesture wrappers powered by `react-native-gesture-handler` and `react-native-reanimated`.

## `GestureWrapper`
The most versatile component for gesture handling. It abstracts away the boilerplate of the `GestureDetector` API, allowing you to easily handle taps, double-taps, drags, and directional swipes.

### Supported Events
- **Taps**: `onTap`, `onDoubleTap`
- **Directional Swipes**: `onSwipeLeft`, `onSwipeRight`, `onSwipeUp`, `onSwipeDown` (fires when a quick fling exceeds the velocity threshold).
- **Pan / Dragging**: `onPanStart`, `onPanUpdate`, `onPanEnd` (provides the raw `translationX`/`translationY` event data).

### Usage Example
```tsx
import { GestureWrapper } from '@/components/ui/feedback/GestureWrapper';
import { View, Text } from 'react-native';

export default function InteractiveCard() {
  return (
    <GestureWrapper
      // Simple Taps
      onTap={() => console.log("Card Tapped")}
      onDoubleTap={() => console.log("Card Liked (Double Tap)")}
      
      // Swipes
      onSwipeLeft={() => console.log("Dismissed to the left")}
      onSwipeRight={() => console.log("Dismissed to the right")}
      onSwipeUp={() => console.log("Swiped up")}
      
      // Continuous Dragging
      onPanUpdate={(e) => console.log(`Dragging at X: ${e.translationX}`)}
    >
      <View className="p-8 bg-blue-500 rounded-xl">
        <Text className="text-white text-xl">Interact with me!</Text>
      </View>
    </GestureWrapper>
  );
}
```

## `SwipeableRow` (Data Display)
While `GestureWrapper` is great for generic components, if you need a classic "Swipe to reveal actions" row (commonly seen in lists or emails), use the `SwipeableRow` component.

### Usage Example
```tsx
import { SwipeableRow, SwipeAction } from '@/components/ui/data-display/SwipeableRow';

// Define the actions revealed when swiping
const rightActions: SwipeAction[] = [
  {
    icon: <Icon name="delete" />,
    backgroundColor: '#EF4444',
    onPress: () => console.log('Delete tapped'),
  },
];

<SwipeableRow rightActions={rightActions}>
  <ListItem content="Swipe me!" />
</SwipeableRow>
```
