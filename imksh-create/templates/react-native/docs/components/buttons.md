# Button Components

Buttons trigger actions. The custom UI library provides several highly polished button variations.

## `Button`
The primary button component for the application, supporting different variants (solid, outline, ghost), colors, and loading states.

### Usage Example
```tsx
import { Button } from '@/components/ui/buttons/Button';

export default function Actions() {
  return (
    <>
      <Button 
        title="Submit" 
        onPress={() => console.log('Primary pressed')} 
      />
      <Button 
        title="Cancel" 
        variant="outline"
        onPress={() => console.log('Outline pressed')} 
      />
      <Button 
        title="Saving..." 
        loading={true}
      />
    </>
  );
}
```

## `IconButton`
A button that only contains an icon without text. Perfect for header buttons or tight layouts.

## `FloatingActionButton` (FAB)
A persistent button that hovers over the screen, typically placed in the bottom right corner. Ideal for primary creation actions like "Compose Message".

## `ButtonGroup`
A wrapper to seamlessly group multiple related buttons together horizontally.
