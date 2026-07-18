# Data Display Components

These components are used to display data visually, such as lists, images, and accordions.

## `SwipeableRow`
A highly complex component that wraps list items, allowing them to be swiped left or right to reveal action buttons.

### Usage Example
```tsx
import { SwipeableRow, SwipeAction } from '@/components/ui/data-display/SwipeableRow';
import { MaterialIcons } from '@expo/vector-icons';

export default function ItemList() {
  const rightActions: SwipeAction[] = [
    {
      icon: <MaterialIcons name="archive" size={24} color="white" />,
      backgroundColor: '#3B82F6', // Blue
      onPress: () => console.log('Archived!'),
    },
    {
      icon: <MaterialIcons name="delete" size={24} color="white" />,
      backgroundColor: '#EF4444', // Red
      onPress: () => console.log('Deleted!'),
    },
  ];

  return (
    <SwipeableRow rightActions={rightActions}>
      <View className="p-4 bg-white dark:bg-gray-800">
        <Text className="text-lg text-black dark:text-white">Swipe me left!</Text>
      </View>
    </SwipeableRow>
  );
}
```

## `Accordion`
An expandable section to hide/show details.

## `Avatar`
Displays a user profile image or their initials if the image is missing.

## `Badge`
A small visual indicator, often used for unread counts or status indicators.
