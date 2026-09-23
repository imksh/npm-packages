# Rich Text Editor

A production-ready, reusable Rich Text Editor component built on **Lexical** for React.

---

## Quick Start

### Installation

```bash
npm install lexical @lexical/react @lexical/rich-text @lexical/list @lexical/link \
  @lexical/code @lexical/table @lexical/html @lexical/selection @lexical/utils \
  @lexical/markdown prismjs lucide-react
npm install -D @types/prismjs
```

### Basic Usage

```tsx
'use client';

import { useState } from 'react';
import { RichTextEditor } from '@imksh/editor';

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
| `onMarkdownChange` | `(md: string) => void` | — | Fires with Markdown output on change |
| `onJsonChange` | `(json: string) => void` | — | Fires with raw Lexical JSON on change |
| `placeholder` | `string` | `'Start writing...'` | Placeholder text |
| `readOnly` | `boolean` | `false` | Disables editing, hides toolbar |
| `autoFocus` | `boolean` | `false` | Focus on mount |
| `minHeight` | `number \| string` | `200` | Min height of content area |
| `maxHeight` | `number \| string` | — | Max height (enables scroll) |
| `height` | `number \| string` | — | Fixed height |
| `disabled` | `boolean` | `false` | Grayed-out non-interactive state |
| `showToolbar` | `boolean` | `true` | Show/hide toolbar |
| `className` | `string` | `''` | Extra CSS class on wrapper |
| `onImageUpload` | `(file: File) => Promise<string>` | — | Image upload handler, returns URL |
| `onVideoUpload` | `(file: File) => Promise<string>` | — | Video upload handler, returns URL |
| `onImageDelete` | `(src: string) => void` | — | Fires when an image is removed |
| `onVideoDelete` | `(src: string) => void` | — | Fires when a video is removed |
| `onOpenImageDrawer` | `(cb: (url: string) => void) => void` | — | Open external image picker |
| `onOpenVideoDrawer` | `(cb: (url: string) => void) => void` | — | Open external video picker |
| `customToolbarButtons` | `CustomToolbarButton[]` | — | Extra buttons in the toolbar (see below) |

---

### Feature Flags

All features are **enabled by default**. Set any to `false` to remove it from the editor.

| Flag | Default | Toolbar Feature |
|------|---------|-----------------|
| `bold` | `true` | Bold button |
| `italic` | `true` | Italic button |
| `underline` | `true` | Underline button |
| `strikethrough` | `true` | Strikethrough button |
| `inlineCode` | `true` | Inline code button |
| `codeBlock` | `true` | Code block + language selector |
| `headings` | `true` | H1, H2, H3, Paragraph block types |
| `fontSize` | `true` | Font size selector |
| `textColor` | `true` | Text colour picker |
| `highlight` | `true` | Background highlight picker |
| `alignment` | `true` | Left, Center, Right, Justify |
| `bulletList` | `true` | Bullet list |
| `numberedList` | `true` | Numbered list |
| `checkList` | `true` | Checklist |
| `blockquote` | `true` | Blockquote |
| `link` | `true` | Link insert / edit / remove |
| `image` | `true` | Image insert |
| `video` | `true` | Video insert |
| `table` | `true` | Table insert + row/column controls |
| `horizontalRule` | `true` | Horizontal divider |
| `undoRedo` | `true` | Undo / Redo |

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
  video={false}
  codeBlock={false}
  horizontalRule={false}
/>
```

---

### `CustomToolbarButton`

Pass an array of custom action buttons that appear in the toolbar **to the left of the fullscreen toggle**. On narrow screens they collapse into the Actions (⚙) dropdown.

```ts
interface CustomToolbarButton {
  key: string;           // Unique React key
  icon: React.ReactNode; // Icon element — Lucide icon, SVG, emoji, etc.
  label: string;         // Tooltip text + aria-label
  onClick: () => void;   // Click handler
  active?: boolean;      // Highlights button with primary colour when true
  disabled?: boolean;    // Disables this button independently
}
```

**Example:**

```tsx
import { Sparkles } from 'lucide-react';
import type { CustomToolbarButton } from '@imksh/editor';

const myButtons: CustomToolbarButton[] = [
  {
    key: 'ai-improve',
    icon: <Sparkles size={16} />,
    label: 'Improve with AI',
    onClick: () => handleAIImprove(),
    active: isAIActive,
  },
];

<RichTextEditor
  value={html}
  onChange={setHtml}
  customToolbarButtons={myButtons}
/>
```

---

### Ref API

```tsx
import { useRef } from 'react';
import { RichTextEditor } from '@imksh/editor';
import type { RichTextEditorRef } from '@imksh/editor';

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

| Method | Signature | Description |
|--------|-----------|-------------|
| `setContent` | `(html: string) => void` | Replace editor content |
| `getContent` | `() => string` | Get current HTML |
| `focus` | `() => void` | Focus the editor |
| `clear` | `() => void` | Clear all content |
| `getEditor` | `() => LexicalEditor \| null` | Access the underlying Lexical instance |

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
    openImagePicker((selectedUrl) => {
      insertCallback(selectedUrl);
    });
  }}
/>
```

### File Upload

```tsx
<RichTextEditor
  onImageUpload={async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const { url } = await res.json();
    return url;
  }}
/>
```

If neither is provided, clicking the image button opens a simple URL input dialog.

### Image Features

- **Resizable**: Drag the east / south-east handle — width is persisted in saved HTML
- **Alignable**: Click image → floating toolbar (left / center / right / inline)
- **Deletable**: Select + `Backspace` or `Delete`
- **Round-trip safe**: Resize and alignment survive save → reload into editor

---

## Video Handling

Mirrors image handling exactly.

```tsx
<RichTextEditor
  onOpenVideoDrawer={(insertCallback) => {
    openVideoPicker((url) => insertCallback(url));
  }}
  onVideoUpload={async (file) => {
    return await uploadVideoAndGetUrl(file);
  }}
  onVideoDelete={(src) => console.log('Video removed:', src)}
/>
```

### Video Features

- **Resizable**: Same drag handles as images — width persisted
- **Alignable**: left / center / right / inline
- **Controls**: Play/pause, mute, loop toggleable via floating toolbar
- **Round-trip safe**: Width and alignment persist through save/reload

---

## Table Features

- **Insert**: Toolbar → table icon → grid picker or manual row/col input
- **Floating toolbar** appears when a table cell is focused:

| Button | Action |
|--------|--------|
| Align Left / Center / Right | Table-level alignment |
| ↑ Row | Add row above |
| ↓ Row | Add row below |
| 🗑 Row | Delete current row |
| ← Col | Add column left |
| → Col | Add column right |
| 🗑 Col | Delete current column |
| ⊞ | **Toggle borders** — removes/restores all borders; persisted in HTML |
| 🗑 Table | Delete entire table |

### No-border Tables

Clicking ⊞ toggles borders off. The borderless state is:

- **Saved** via `data-no-borders` attribute + `border: none` inline styles on all cells
- **Restored** when HTML is reloaded into the editor (`onUpdate` callback re-applies styles)
- **Rendered** correctly in any HTML viewer without needing the editor's CSS

---

## Theming

The editor uses **CSS custom properties with sensible fallbacks**:

```css
background: var(--color-base-100, #ffffff);
color: var(--color-base-content, #111827);
border-color: var(--color-base-300, #e5e7eb);
```

### CSS Variables

| Variable | Purpose | Fallback |
|----------|---------|----------|
| `--color-base-100` | Editor background | `#ffffff` |
| `--color-base-200` | Toolbar background | `#f8fafc` |
| `--color-base-300` | Borders, dividers | `#e5e7eb` |
| `--color-base-content` | Text colour | `#111827` |
| `--color-primary` | Accent, active states | `#2563eb` |
| `--color-primary-content` | Active button text | `#ffffff` |
| `--color-error` | Danger actions | `#ef4444` |

If using **FlyonUI / DaisyUI**, these variables are automatically available.

### Dark Mode

Works automatically with `[data-theme="dark"]` when the CSS variables change.

---

## Exported Utilities

```ts
import { exportHTML, importHTML, isHTMLEmpty, isEditorEmpty } from '@imksh/editor';
```

| Utility | Description |
|---------|-------------|
| `exportHTML(editor)` | Serialize editor state → HTML. Code blocks get a copy button. Image/video sizes, alignments, and table no-border state are all preserved. |
| `importHTML(editor, html)` | Load HTML into the editor, replacing existing content. No-border tables and media dimensions are correctly restored. |
| `isHTMLEmpty(html)` | `true` if HTML represents empty content (`<p><br></p>`, whitespace, etc.) |
| `isEditorEmpty(editor)` | `true` if the live editor contains no meaningful text |

---

## HTML Round-Trip Guarantees

| Feature | Saved as |
|---------|----------|
| Image resize width | `width` HTML attribute + `style="width:Npx"` on `<img>` |
| Image alignment | `data-alignment` attribute on wrapper `<span>` |
| Video resize width | `width` HTML attribute + `style="width:Npx"` on `<video>` |
| Video alignment | `data-alignment` attribute on wrapper `<span>` |
| Table no-borders | `data-no-borders` attribute + `border: none` inline on `<table>`, `<tr>`, `<td>`, `<th>` |
| Table column widths | `<colgroup>` / `<col width="...">` in exported HTML |
| Table header background | Lexical's default `#f2f3f5` header background is stripped from exported `<th>` so preview matches editor |

---

## File Structure

```
editor/src/editor/
├── index.ts                    # Public API barrel
├── RichTextEditor.tsx           # Main component
├── RichTextEditor.css           # All styles
├── RichTextEditor.md            # This documentation
├── types/
│   └── index.ts                # TypeScript interfaces & constants
├── components/
│   ├── Toolbar.tsx              # Toolbar UI (responsive, supports custom buttons)
│   ├── ToolbarButton.tsx        # Memoized button
│   ├── ActionsSelector.tsx      # Collapsed actions dropdown
│   ├── FontSizeSelector.tsx
│   ├── ColorPicker.tsx
│   ├── LinkDialog.tsx
│   ├── ImageDialog.tsx
│   ├── VideoDialog.tsx
│   ├── TableDialog.tsx
│   └── Divider.tsx
├── plugins/
│   ├── ToolbarPlugin.tsx        # Toolbar ↔ Editor bridge
│   ├── OnChangePlugin.tsx       # HTML/Markdown/JSON serialization
│   ├── ImagePlugin.tsx          # INSERT_IMAGE_COMMAND handler
│   ├── ImageActionMenuPlugin.tsx # Floating image toolbar
│   ├── VideoPlugin.tsx          # INSERT_VIDEO_COMMAND handler
│   ├── VideoActionMenuPlugin.tsx # Floating video toolbar
│   ├── CodeHighlightPlugin.tsx
│   ├── CodeActionMenuPlugin.tsx
│   ├── FloatingLinkPlugin.tsx
│   ├── TableActionPlugin.tsx    # Floating table toolbar (borders, rows, cols)
│   ├── TableCellResizerPlugin.tsx
│   ├── KeyboardShortcutPlugin.tsx
│   ├── TabEscapePlugin.tsx
│   ├── RootClickPlugin.tsx
│   ├── AutoSavePlugin.tsx
│   └── ImperativeHandlePlugin.tsx
├── nodes/
│   ├── ImageNode.tsx            # Custom resizable/alignable image node
│   ├── VideoNode.tsx            # Custom resizable/alignable video node
│   └── index.ts
├── hooks/
│   ├── useEditorToolbar.ts      # Toolbar state hook
│   └── useDebounce.ts
└── utils/
    ├── editorTheme.ts           # Lexical theme class map
    └── htmlSerializer.ts        # HTML import/export with post-processing
```

---

## Performance Notes

- Toolbar buttons are `React.memo`'d
- `onChange` / `onMarkdownChange` / `onJsonChange` are debounced (300ms default)
- Update listeners are registered once and cleaned up on unmount
- Feature-flag-disabled plugins are never mounted
- Node list and initial config are `useMemo`'d (computed once on mount)
