# Input Components

Inputs are used to collect data from the user. They are highly styled, accessible, and integrate cleanly with form libraries like React Hook Form.

## `Input` (Text Input)
The core text input component.

### Usage Example
```tsx
import { Input } from '@/components/ui/inputs/Input';
import { useState } from 'react';

export default function Form() {
  const [email, setEmail] = useState('');

  return (
    <Input
      label="Email Address"
      placeholder="Enter your email"
      value={email}
      onChangeText={setEmail}
      error={email.includes('@') ? '' : 'Invalid email'}
    />
  );
}
```

## `OTPInput`
A component optimized for handling multi-digit verification codes.
- Usage: `<OTPInput length={6} onComplete={(code) => console.log(code)} />`

## `PasswordInput`
An extension of the `Input` component that includes a toggle to show/hide the password text.

## Other Inputs
- `Checkbox`: Boolean selection.
- `Radio`: Select one from a list.
- `Switch`: A modern iOS/Android style toggle.
- `Slider`: Choose a numeric value on a track.
- `SearchBar`: A specialized text input for searching with a clear button.
- `TextArea`: A multiline text input.
