# Navigation Components

These components are used to guide the user between different views or show their current position within a multi-step process.

## `Tabs`
A highly complex, customizable top tab bar component, typically used for switching views horizontally (e.g., inside a profile or feed).

### Usage Example
```tsx
import { Tabs } from '@/components/ui/navigation/Tabs';
import { useState } from 'react';

export default function Profile() {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Posts", "Followers", "Following"];

  return (
    <Tabs 
      tabs={tabs} 
      activeIndex={activeTab} 
      onChange={setActiveTab} 
    />
  );
}
```

## `ProgressStepper`
Used for multi-step wizards, such as an onboarding flow or a multi-page checkout, clearly displaying the completed, current, and upcoming steps.

## `Pagination`
Displays a series of dots to indicate the current page in a carousel or swipeable view.
