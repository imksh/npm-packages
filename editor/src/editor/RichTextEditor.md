# Rich Text Editor

A production-ready, reusable Rich Text Editor component built on **Lexical** for React.

Designed to be self-contained — copy the entire `RichTextEditor/` folder into any React project.

---

## Quick Start

### Installation

```bash
npm install lexical @lexical/react @lexical/rich-text @lexical/list @lexical/link \
  @lexical/code @lexical/table @lexical/html @lexical/selection @lexical/utils \
  @lexical/markdown prismjs lucide-react
npm install -D @types/prismjs
```

### Usage

```tsx
'use client';

import { useState } from 'react';
import { RichTextEditor } from '@/components/RichTextEditor';

export default function MyPage() {
  const [html, setHtml] = useState('<p>Hello world</p>');

  return (
    <RichTextEditor
      value={html}
      onChange={setHtml}
      placeholder="Start writing..."
      minHeight={400}
    />
  );
}
```

---

## API Reference

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | `''` | Initial HTML content |
| `onChange` | `(html: string) => void` | — | Fires when content changes (debounced 300ms) |
| `placeholder` | `string` | `'Start writing...'` | Placeholder text |
| `readOnly` | `boolean` | `false` | Disables editing, hides toolbar |
| `autoFocus` | `boolean` | `false` | Focus on mount |
| `minHeight` | `number` | `200` | Minimum height in px |
| `disabled` | `boolean` | `false` | Grayed-out state |
| `showToolbar` | `boolean` | `true` | Show/hide toolbar |
| `className` | `string` | `''` | Extra CSS class on wrapper |
| `onImageUpload` | `(file: File) => Promise<string>` | — | Image upload handler |
| `onOpenImageDrawer` | `(cb: (url: string) => void) => void` | — | External image picker |

### Feature Flags

All features are **enabled by default**. Set any to `false` to remove from the editor.

| Flag | Type | Default | Toolbar Feature |
|------|------|---------|-----------------|
| `bold` | `boolean` | `true` | Bold button |
| `italic` | `boolean` | `true` | Italic button |
| `underline` | `boolean` | `true` | Underline button |
| `strikethrough` | `boolean` | `true` | Strikethrough button |
| `inlineCode` | `boolean` | `true` | Inline code button |
| `codeBlock` | `boolean` | `true` | Code block button + language selector |
| `headings` | `boolean` | `true` | H1, H2, H3, Paragraph buttons |
| `fontSize` | `boolean` | `true` | Font size selector |
| `textColor` | `boolean` | `true` | Text color picker |
| `highlight` | `boolean` | `true` | Background highlight picker |
| `alignment` | `boolean` | `true` | Left, Center, Right, Justify |
| `bulletList` | `boolean` | `true` | Bullet list |
| `numberedList` | `boolean` | `true` | Numbered list |
| `checkList` | `boolean` | `true` | Check list |
| `blockquote` | `boolean` | `true` | Blockquote |
| `link` | `boolean` | `true` | Link insert/edit/remove |
| `image` | `boolean` | `true` | Image insert |
| `table` | `boolean` | `true` | Table insert + R+/R-/C+/C- controls |
| `horizontalRule` | `boolean` | `true` | Horizontal divider |
| `undoRedo` | `boolean` | `true` | Undo / Redo |

**Example — Minimal Editor:**

```tsx
<RichTextEditor
  value={html}
  onChange={setHtml}
  headings={false}
  fontSize={false}
  textColor={false}
  highlight={false}
  table={false}
  image={false}
  codeBlock={false}
  horizontalRule={false}
/>
```

### Ref API

```tsx
import { useRef } from 'react';
import { RichTextEditor } from '@/components/RichTextEditor';
import type { RichTextEditorRef } from '@/components/RichTextEditor';

function MyEditor() {
  const editorRef = useRef<RichTextEditorRef>(null);

  return (
    <>
      <RichTextEditor ref={editorRef} />
      <button onClick={() => editorRef.current?.setContent('<p>New content</p>')}>
        Set Content
      </button>
      <button onClick={() => console.log(editorRef.current?.getContent())}>
        Get Content
      </button>
      <button onClick={() => editorRef.current?.focus()}>Focus</button>
      <button onClick={() => editorRef.current?.clear()}>Clear</button>
    </>
  );
}
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+B` | Bold |
| `Ctrl+I` | Italic |
| `Ctrl+U` | Underline |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` | Redo |
| `Tab` | Indent |
| `Shift+Tab` | Outdent |

Markdown shortcuts are also supported: `#`, `##`, `###`, `>`, `-`, `1.`, `` ` ``, `---`

---

## Image Handling

The editor does **not** upload images. It exposes callbacks:

### External Drawer (Recommended)

```tsx
<RichTextEditor
  onOpenImageDrawer={(insertCallback) => {
    // Open your custom drawer/modal
    openImagePicker((selectedUrl) => {
      insertCallback(selectedUrl); // Inserts the image
    });
  }}
/>
```

### URL Fallback

If `onOpenImageDrawer` is not provided, clicking the image button opens a simple URL input dialog.

### Image Features

- **Resizable**: Drag corner/edge handles to resize
- **Alignable**: Click image → alignment toolbar (left/center/right)
- **Deletable**: Select + Backspace/Delete

---

## Table Features

- **Insert**: Click table button → grid picker or manual row/col input
- **Add Row**: `R+` button in floating toolbar
- **Remove Row**: `R−` button
- **Add Column**: `C+` button
- **Remove Column**: `C−` button

The floating toolbar appears when a table cell is selected.

---

## Theming

The editor uses **CSS custom properties with fallbacks**:

```css
background: var(--color-base-100, #ffffff);
color: var(--color-base-content, #111827);
border-color: var(--color-base-300, #e5e7eb);
```

### Required Variables

| Variable | Purpose | Fallback |
|----------|---------|----------|
| `--color-base-100` | Editor background | `#ffffff` |
| `--color-base-200` | Toolbar background | `#f8fafc` |
| `--color-base-300` | Borders, dividers | `#e5e7eb` |
| `--color-base-content` | Text color | `#111827` |
| `--color-primary` | Accent, active states | `#2563eb` |
| `--color-primary-content` | Active button text | `#ffffff` |
| `--color-error` | Danger actions | `#ef4444` |

If using **FlyonUI/DaisyUI**, these variables are automatically available.  
For other projects, define them in your root CSS or the variables fallback to sane defaults.

### Dark Mode

Works automatically with `[data-theme="dark"]` if the CSS variables change.

---

## Portability

To use in another React project:

1. Copy the entire `RichTextEditor/` folder
2. Install peer dependencies (see Installation)
3. Import and use:

```tsx
import { RichTextEditor } from './components/RichTextEditor';
```

4. If not using FlyonUI, define the CSS variables or rely on fallbacks

### Peer Dependencies

| Package | Purpose |
|---------|---------|
| `react` ≥ 18 | React |
| `lexical` | Editor core |
| `@lexical/*` | Editor features |
| `lucide-react` | Toolbar icons |
| `prismjs` | Syntax highlighting (optional) |

---

## Extensibility

The architecture supports future plugins without refactoring:

1. **Create a plugin** in `plugins/`
2. **Register nodes** in `nodes/`
3. **Add to `RichTextEditor.tsx`** conditionally

Potential extensions:
- AI writing suggestions
- Comments & annotations
- @mentions
- Emoji picker
- Math equations (KaTeX)
- Mermaid diagrams
- Video/audio embeds
- Collaborative editing (Yjs)
- Version history

---

## File Structure

```
RichTextEditor/
├── index.ts              # Public API barrel
├── RichTextEditor.tsx     # Main component
├── RichTextEditor.css     # All styles
├── RichTextEditor.md      # This documentation
├── types/
│   └── index.ts           # TypeScript interfaces & constants
├── components/
│   ├── Toolbar.tsx         # Toolbar UI
│   ├── ToolbarButton.tsx   # Memoized button
│   ├── FontSizeSelector.tsx
│   ├── ColorPicker.tsx
│   ├── LinkDialog.tsx
│   ├── ImageDialog.tsx
│   ├── TableDialog.tsx
│   └── Divider.tsx
├── plugins/
│   ├── ToolbarPlugin.tsx   # Toolbar ↔ Editor bridge
│   ├── OnChangePlugin.tsx  # HTML serialization
│   ├── ImagePlugin.tsx
│   ├── CodeHighlightPlugin.tsx
│   ├── FloatingLinkPlugin.tsx
│   ├── TableActionPlugin.tsx
│   ├── KeyboardShortcutPlugin.tsx
│   ├── AutoSavePlugin.tsx
│   └── ImperativeHandlePlugin.tsx
├── nodes/
│   ├── ImageNode.tsx       # Custom image node
│   └── index.ts
├── hooks/
│   ├── useEditorToolbar.ts # Toolbar state hook
│   └── useDebounce.ts
└── utils/
    ├── editorTheme.ts      # Lexical theme classes
    └── htmlSerializer.ts   # HTML import/export
```

---

## Empty State

The editor returns `""` (empty string) instead of `<p><br></p>` when the editor contains no meaningful text content.

---

## Performance Notes

- Toolbar buttons are `React.memo`'d
- `onChange` is debounced (300ms default)
- Update listeners are registered once and cleaned up on unmount
- Feature-flag-disabled plugins are never mounted
- Nodes list is memoized
