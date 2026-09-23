# @imksh/editor

A modern, reusable Lexical-based rich text editor component for React. Production-ready with comprehensive formatting, embedded media support, custom toolbar buttons, and an intuitive responsive toolbar.

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![npm version](https://img.shields.io/npm/v/@imksh/editor)
![TypeScript](https://img.shields.io/badge/Built%20with-TypeScript-blue)

## Screenshots

### Light Theme

![Light Theme](docs/images/editor-light.png)

### Dark Theme

![Dark Theme](docs/images/editor-dark.png)

## Features

- ✨ **Rich Text Formatting**: Bold, italic, underline, strikethrough, inline code
- 📝 **Block Elements**: Headings, paragraphs, blockquotes, code blocks with syntax highlighting
- 📋 **Lists**: Bullet, numbered, and check lists
- 🔗 **Links**: Link insertion with automatic `target="_blank"` handling for opening in new tabs
- 📸 **Media & YouTube**: Image and video insertion with resize + alignment. Paste a YouTube URL to automatically embed a responsive YouTube iframe! Supports video playback options (autoplay, loop, muted, controls). Supports device uploads and external drawers.
- 📊 **Tables**: Full table support — add/remove rows & columns, toggle borders, resize columns
- 🎨 **Styling**: Font size, text colour, background highlight, alignment
- ⌨️ **Keyboard Shortcuts**: Full keyboard support including undo/redo and Markdown shortcuts
- 🎯 **Responsive Toolbar**: Collapses formatting groups into dropdowns via CSS Container Queries
- 🪟 **Fullscreen Mode**: Built-in toggle to expand the editor full-screen
- 🔌 **Custom Toolbar Buttons**: Inject your own icon buttons into the toolbar via the `customToolbarButtons` prop
- 🔄 **HTML Round-trip**: Import/export HTML with lossless image sizes, alignments, and table border state
- 💾 **Auto-Save**: Built-in debounced auto-save plugin
- ♿ **Accessible**: Semantic HTML and full keyboard navigation

---

## Installation

```bash
npm install @imksh/editor
```

### Peer Dependencies

```bash
npm install react react-dom lexical @lexical/react @lexical/rich-text @lexical/list \
  @lexical/link @lexical/code @lexical/table @lexical/html @lexical/selection \
  @lexical/utils @lexical/markdown prismjs lucide-react
```

---

## Quick Start

### Basic Usage

```tsx
import { RichTextEditor } from "@imksh/editor";
import "@imksh/editor/style.css"; // Required for toolbar layout & responsiveness
import { useState } from "react";

export default function MyComponent() {
  const [html, setHtml] = useState("<p>Hello world</p>");

  return (
    <RichTextEditor
      value={html}
      onChange={setHtml}
      placeholder="Start typing..."
      minHeight={400}
    />
  );
}
```

### With Feature Flags

```tsx
<RichTextEditor
  value={html}
  onChange={setHtml}
  // Disable specific features
  table={false}
  image={false}
  codeBlock={false}
  // Sizing
  minHeight={300}
  maxHeight={600}   // Enables internal scroll with sticky toolbar
  className="my-editor"
/>
```

### Markdown Output

```tsx
<RichTextEditor
  value={html}
  onChange={setHtml}              // HTML output
  onMarkdownChange={setMarkdown}  // Markdown output (independently debounced)
/>
```

> Supports bold, italic, headings, lists, inline code, fenced code blocks, and links.

### Image & Video Upload

```tsx
<RichTextEditor
  value={html}
  onChange={setHtml}
  onImageUpload={async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    return (await res.json()).url;
  }}
  onVideoUpload={async (file) => {
    return "https://my-domain.com/uploaded-video.mp4";
  }}
/>
```

### Deletion Callbacks

```tsx
<RichTextEditor
  onImageDelete={(src) => {
    // e.g. delete from S3
    console.log("Image removed:", src);
  }}
  onVideoDelete={(src) => {
    console.log("Video removed:", src);
  }}
/>
```

### External Media Gallery / Drawer

```tsx
<RichTextEditor
  value={html}
  onChange={setHtml}
  onOpenImageDrawer={(insertImage) => {
    // Open your custom media picker, then call insertImage(url)
    setMyDrawerOpen(true);
    saveCallback(insertImage);
  }}
  onOpenVideoDrawer={(insertVideo) => {
    // You can pass a string URL:
    // openVideoPicker((url) => insertVideo(url));
    
    // OR pass a payload with options:
    openVideoPicker((url) => {
      insertVideo({
        src: url,
        autoplay: true,
        loop: true,
        muted: true,
        controls: false,
      });
    });
  }}
/>
```

### Custom Toolbar Buttons

Inject your own icon buttons into the toolbar to the left of the fullscreen toggle.
On narrow screens they automatically collapse into the Actions (⚙) dropdown.

```tsx
import { Sparkles } from "lucide-react";
import type { CustomToolbarButton } from "@imksh/editor";

const customButtons: CustomToolbarButton[] = [
  {
    key: "ai-improve",
    icon: <Sparkles size={16} />,
    label: "Improve with AI",   // shown as tooltip + aria-label
    onClick: () => handleAI(),
    active: isAIProcessing,     // highlights button when true
  },
];

<RichTextEditor
  value={html}
  onChange={setHtml}
  customToolbarButtons={customButtons}
/>
```

---

## Media Editing

After inserting an image or video, selecting it reveals a **floating toolbar**:

- Align left, center, right, or inline
- **Resize** by dragging the east/south-east handle — size persists in saved HTML
- Replace the media source (uses your drawer/upload callbacks if provided)
- Delete the node

### Video Embeds & YouTube

When inserting a video:
- You can toggle video playback options: **Autoplay**, **Loop**, **Muted**, and **Controls**.
- Simply pasting a **YouTube URL** will automatically detect it and generate a responsive YouTube `iframe` instead of a standard `<video>` tag.
- YouTube embeds fully support the same resizing, alignment, and playback options.

---

## API Reference

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `string` | `''` | Initial HTML content |
| `onChange` | `(html: string) => void` | — | Fires when content changes (debounced 300ms) |
| `onMarkdownChange` | `(md: string) => void` | — | Fires with Markdown string on change |
| `onJsonChange` | `(json: string) => void` | — | Fires with raw Lexical JSON on change |
| `placeholder` | `string` | `'Start writing...'` | Placeholder text when empty |
| `readOnly` | `boolean` | `false` | Read-only mode (disables editing, hides toolbar) |
| `autoFocus` | `boolean` | `false` | Auto-focus the editor on mount |
| `minHeight` | `number \| string` | `200` | Minimum editor content height |
| `maxHeight` | `number \| string` | — | Maximum height (enables internal scroll) |
| `height` | `number \| string` | — | Fixed height (enables internal scroll) |
| `disabled` | `boolean` | `false` | Grayed-out non-interactive state |
| `showToolbar` | `boolean` | `true` | Show/hide the toolbar |
| `className` | `string` | `''` | Extra CSS class on wrapper element |
| `onImageUpload` | `(file: File) => Promise<string>` | — | Image upload handler, must return hosted URL |
| `onVideoUpload` | `(file: File) => Promise<string>` | — | Video upload handler, must return hosted URL |
| `onImageDelete` | `(src: string) => void` | — | Called when an image node is deleted |
| `onVideoDelete` | `(src: string) => void` | — | Called when a video node is deleted |
| `onOpenImageDrawer` | `(cb: (url: string) => void) => void` | — | Override image insert with external picker |
| `onOpenVideoDrawer` | `(cb: (payload: string \| { src: string; autoplay?: boolean; loop?: boolean; muted?: boolean; controls?: boolean }) => void) => void` | — | Override video insert with external picker |
| `customToolbarButtons` | `CustomToolbarButton[]` | — | Custom buttons rendered in the toolbar |

### `CustomToolbarButton`

```ts
interface CustomToolbarButton {
  key: string;           // Unique React key
  icon: React.ReactNode; // Icon — Lucide icon, SVG, emoji, etc.
  label: string;         // Tooltip text + aria-label
  onClick: () => void;   // Click handler
  active?: boolean;      // Highlights button when true
  disabled?: boolean;    // Disables this button independently
}
```

### Feature Flags

All features are **enabled by default**. Set any to `false` to remove it entirely.

| Flag | Default |
| --- | --- |
| `bold` | `true` |
| `italic` | `true` |
| `underline` | `true` |
| `strikethrough` | `true` |
| `inlineCode` | `true` |
| `codeBlock` | `true` |
| `headings` | `true` |
| `fontSize` | `true` |
| `textColor` | `true` |
| `highlight` | `true` |
| `alignment` | `true` |
| `bulletList` | `true` |
| `numberedList` | `true` |
| `checkList` | `true` |
| `blockquote` | `true` |
| `link` | `true` |
| `image` | `true` |
| `video` | `true` |
| `table` | `true` |
| `horizontalRule` | `true` |
| `undoRedo` | `true` |

### Example: Minimal Editor

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
  link={false}
/>
```

### Example: Full-Featured Editor

```tsx
<RichTextEditor
  value={html}
  onChange={setHtml}
  minHeight={300}
  maxHeight={600}
  onImageUpload={async (file) => "https://my-domain.com/uploaded-image.png"}
  onVideoUpload={async (file) => "https://my-domain.com/uploaded-video.mp4"}
  onImageDelete={(src) => console.log("Deleted image:", src)}
  onVideoDelete={(src) => console.log("Deleted video:", src)}
  customToolbarButtons={[
    {
      key: "save",
      icon: <Save size={16} />,
      label: "Save",
      onClick: handleSave,
    },
  ]}
/>
```

### Ref API

```tsx
import { useRef } from "react";
import { RichTextEditor } from "@imksh/editor";
import type { RichTextEditorRef } from "@imksh/editor";

function MyEditor() {
  const editorRef = useRef<RichTextEditorRef>(null);

  return (
    <>
      <RichTextEditor ref={editorRef} />
      <button onClick={() => editorRef.current?.setContent("<p>Hi</p>")}>Set</button>
      <button onClick={() => console.log(editorRef.current?.getContent())}>Get</button>
      <button onClick={() => editorRef.current?.focus()}>Focus</button>
      <button onClick={() => editorRef.current?.clear()}>Clear</button>
    </>
  );
}
```

| Method | Description |
| --- | --- |
| `setContent(html)` | Replace editor content with an HTML string |
| `getContent()` | Return the current HTML string |
| `focus()` | Focus the editor |
| `clear()` | Clear all content |
| `getEditor()` | Return the underlying `LexicalEditor` instance |

---

## Table Features

- Insert via toolbar → grid picker or manual row/col input
- **Floating toolbar** on cell focus:

| Button | Action |
| --- | --- |
| Align Left / Center / Right | Table alignment |
| ↑ Row / ↓ Row / 🗑 Row | Add/remove rows |
| ← Col / → Col / 🗑 Col | Add/remove columns |
| ⊞ | **Toggle borders** — persisted in exported HTML |
| 🗑 Table | Delete entire table |

No-border state is saved via `data-no-borders` + inline `border: none` styles so it renders correctly in any HTML viewer without the editor's CSS.

---

## Keyboard Shortcuts

| Shortcut | Action |
| --- | --- |
| `Ctrl/Cmd + B` | Bold |
| `Ctrl/Cmd + I` | Italic |
| `Ctrl/Cmd + U` | Underline |
| `Ctrl/Cmd + Shift + X` | Strikethrough |
| `Ctrl/Cmd + E` | Center align |
| `Ctrl/Cmd + L` | Left align |
| `Ctrl/Cmd + R` | Right align |
| `Ctrl/Cmd + J` | Justify |
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` | Redo |
| `Tab` | Indent / insert tab in code blocks |
| `Escape` | Exit code block or fullscreen |

Markdown shortcuts: `#`, `##`, `###`, `>`, `-`, `1.`, `` ` ``, `---`

---

## Styling

Import the stylesheet (required for toolbar layout and responsiveness):

```tsx
import "@imksh/editor/style.css";
```

Customise via CSS variables:

```css
:root {
  --color-base-100: #ffffff;     /* Editor background */
  --color-base-200: #f8fafc;     /* Toolbar background */
  --color-base-300: #e5e7eb;     /* Borders */
  --color-base-content: #111827; /* Text colour */
  --color-primary: #2563eb;      /* Accent / active states */
  --color-primary-content: #fff; /* Active button text */
  --color-error: #ef4444;        /* Danger actions */
}
```

Dark mode works automatically when the variables change under `[data-theme="dark"]`. If using **FlyonUI / DaisyUI**, all variables are provided automatically.

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## License

MIT © 2024 Karan Sharma

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues, questions, or suggestions, please open an issue on [GitHub](https://github.com/imksh/npm-packages/issues).

---

Made with ❤️ by [Karan Sharma](https://github.com/imksh)
