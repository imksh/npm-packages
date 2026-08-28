# @imksh/editor

A modern, reusable Lexical-based rich text editor component for React. Production-ready with comprehensive formatting, embedded media support, and an intuitive toolbar.

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
- 📝 **Block Elements**: Headings, paragraphs, blockquotes, code blocks
- 📋 **Lists**: Bullet, numbered, and check lists
- 🔗 **Links & Media**: Link insertion, image/video insertion, and editing with built-in dialogs or external drawers. Supports device uploads and callbacks.
- 📊 **Tables**: Full table support with add/remove rows and columns
- 🎨 **Styling**: Font size, text color, background highlight, alignment
- ⌨️ **Keyboard Shortcuts**: Full keyboard support including undo/redo
- 🎯 **Dynamic Responsive Toolbar**: Intelligently collapses formatting groups into dropdowns as screen width decreases, driven entirely by CSS Container Queries for zero-lag performance.
- 🪟 **Fullscreen Mode**: Built-in toggle to expand the editor to the full screen.
- 🔄 **HTML I/O**: Import and export as HTML
- 💾 **Auto-Save**: Built-in debounced auto-save plugin (if applicable)
- ♿ **Accessible**: Semantic HTML and keyboard navigation

## Installation

```bash
npm install @imksh/editor
```

### Peer Dependencies

Make sure you have React and Lexical installed:

```bash
npm install react react-dom lexical @lexical/react @lexical/rich-text @lexical/list @lexical/link @lexical/code @lexical/table @lexical/html @lexical/selection @lexical/utils @lexical/markdown prismjs lucide-react
```

## Quick Start

### Basic Usage

```tsx
import { RichTextEditor } from "@imksh/editor";
import "@imksh/editor/style.css"; // Essential for toolbar layout and responsiveness
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
  // Styling
  minHeight={300}
  maxHeight={600} // Enables internal scroll with sticky toolbar
  className="my-editor"
/>
```

### Markdown Output

If you need Markdown output instead of (or alongside) HTML, pass `onMarkdownChange`. Both callbacks can coexist and are independently debounced.

```tsx
<RichTextEditor
  value={html}
  onChange={setHtml}              // HTML output
  onMarkdownChange={setMarkdown}  // Markdown output (independent)
/>
```

> Markdown serialization uses Lexical's built-in transformers and supports all standard elements: bold, italic, headings, lists, inline code, fenced code blocks, and links.

### With Custom Image/Video Upload Handler

If you want the editor to handle file uploads when the user selects a local file, provide the `onImageUpload` and/or `onVideoUpload` prop.

```tsx
<RichTextEditor
  value={html}
  onChange={setHtml}
  onImageUpload={async (file) => {
    // Upload file to your server
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return data.url; // Return the hosted image URL
  }}
  onVideoUpload={async (file) => {
    // Similarly for videos
    return "https://my-domain.com/video.mp4";
  }}
/>
```

### Deletion Callbacks

If you need to know when an image or video is deleted (e.g. to clean up your cloud storage bucket), use the `onImageDelete` and `onVideoDelete` callbacks.

```tsx
<RichTextEditor
  onImageDelete={(src) => {
    console.log("Image deleted from editor:", src);
    // call api to delete from s3
  }}
  onVideoDelete={(src) => {
    console.log("Video deleted from editor:", src);
  }}
/>
```

### With External Image/Video Drawer / Media Gallery

If your app already has an external media gallery or image drawer, you can completely bypass the editor's default dialog by providing `onOpenImageDrawer` or `onOpenVideoDrawer`. When the user clicks the icon in the toolbar, your custom callback is triggered.

```tsx
<RichTextEditor
  value={html}
  onChange={setHtml}
  onOpenImageDrawer={(insertImageCallback) => {
    // 1. Open your custom media drawer UI here
    setMyMediaDrawerOpen(true);

    // 2. Save the insertImageCallback somewhere so you can call it later
    // When the user selects an image in your drawer, simply call:
    // insertImageCallback("https://my-domain.com/selected-image.jpg");
  }}
/>
```

## Media Editing

After an image or video is inserted, selecting it opens a floating toolbar with quick actions:

- Align left, center, or right
- Replace the media source
- Delete the media node

If `onOpenImageDrawer` / `onOpenVideoDrawer` is provided, both the insert flow and the replace flow can hand off to your own media picker. If not, the editor falls back to a URL prompt/device upload for replacement.

The editor also ships with screenshot assets in `docs/images` that you can use in your own docs or demos:

## API Reference

### Props

| Prop                | Type                                        | Default              | Description                                         |
| ------------------- | ------------------------------------------- | -------------------- | --------------------------------------------------- |
| `value`             | `string`                                    | `''`                 | Initial HTML content                                |
| `onChange`          | `(html: string) => void`                    | —                    | Fires when content changes (debounced 300ms)        |
| `placeholder`       | `string`                                    | `'Start writing...'` | Placeholder text when empty                         |
| `readOnly`          | `boolean`                                   | `false`              | Read-only mode (disables editing and hides toolbar) |
| `autoFocus`         | `boolean`                                   | `false`              | Auto-focus the editor on mount                      |
| `minHeight`         | `number \| string`                          | `200`                | Minimum editor height                               |
| `maxHeight`         | `number \| string`                          | —                    | Maximum editor height (enables internal scroll)     |
| `height`            | `number \| string`                          | —                    | Fixed editor height (enables internal scroll)       |
| `disabled`          | `boolean`                                   | `false`              | Disable editing (grayed-out appearance)             |
| `showToolbar`       | `boolean`                                   | `true`               | Show/hide the toolbar                               |
| `className`         | `string`                                    | `''`                 | Additional CSS class on wrapper                     |
| `onMarkdownChange` | `(markdown: string) => void`                | —                    | Fires with Markdown string on content change        |
| `onImageUpload`     | `(file: File) => Promise<string>`           | —                    | Image upload handler (returns image URL)            |
| `onVideoUpload`     | `(file: File) => Promise<string>`           | —                    | Video upload handler (returns video URL)            |
| `onImageDelete`     | `(src: string) => void`                     | —                    | Callback when an image is deleted                   |
| `onVideoDelete`     | `(src: string) => void`                     | —                    | Callback when a video is deleted                    |
| `onOpenImageDrawer` | `(callback: (url: string) => void) => void` | —                    | Custom external image picker integration            |
| `onOpenVideoDrawer` | `(callback: (url: string) => void) => void` | —                    | Custom external video picker integration            |

### Feature Flags

All features are **enabled by default**. Set any to `false` to disable it from the toolbar and the editor completely:

| Flag             | Type      | Default |
| ---------------- | --------- | ------- |
| `bold`           | `boolean` | `true`  |
| `italic`         | `boolean` | `true`  |
| `underline`      | `boolean` | `true`  |
| `strikethrough`  | `boolean` | `true`  |
| `inlineCode`     | `boolean` | `true`  |
| `codeBlock`      | `boolean` | `true`  |
| `headings`       | `boolean` | `true`  |
| `fontSize`       | `boolean` | `true`  |
| `textColor`      | `boolean` | `true`  |
| `highlight`      | `boolean` | `true`  |
| `alignment`      | `boolean` | `true`  |
| `bulletList`     | `boolean` | `true`  |
| `numberedList`   | `boolean` | `true`  |
| `checkList`      | `boolean` | `true`  |
| `blockquote`     | `boolean` | `true`  |
| `link`           | `boolean` | `true`  |
| `image`          | `boolean` | `true`  |
| `video`          | `boolean` | `true`  |
| `table`          | `boolean` | `true`  |
| `horizontalRule` | `boolean` | `true`  |
| `undoRedo`       | `boolean` | `true`  |

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
  showToolbar={true}
  bold={true}
  italic={true}
  underline={true}
  strikethrough={true}
  inlineCode={true}
  codeBlock={true}
  headings={true}
  fontSize={true}
  textColor={true}
  highlight={true}
  alignment={true}
  bulletList={true}
  numberedList={true}
  checkList={true}
  blockquote={true}
  link={true}
  image={true}
  video={true}
  table={true}
  horizontalRule={true}
  undoRedo={true}
  onImageUpload={async (file) => {
    return "https://my-domain.com/uploaded-image.png";
  }}
  onVideoUpload={async (file) => {
    return "https://my-domain.com/uploaded-video.mp4";
  }}
  onImageDelete={(src) => {
    console.log("Deleted image:", src);
  }}
  onVideoDelete={(src) => {
    console.log("Deleted video:", src);
  }}
/>
```

## Keyboard Shortcuts

| Shortcut               | Action                        |
| ---------------------- | ----------------------------- |
| `Ctrl/Cmd + B`         | Bold                          |
| `Ctrl/Cmd + I`         | Italic                        |
| `Ctrl/Cmd + U`         | Underline                     |
| `Ctrl/Cmd + Shift + X` | Strikethrough                 |
| `Ctrl/Cmd + E`         | Center align                  |
| `Ctrl/Cmd + L`         | Left align                    |
| `Ctrl/Cmd + R`         | Right align                   |
| `Ctrl/Cmd + J`         | Justify                       |
| `Ctrl/Cmd + Z`         | Undo                          |
| `Ctrl/Cmd + Shift + Z` | Redo                          |
| `Tab`                  | Insert tab in code blocks     |
| `Escape`               | Exit code block or Fullscreen |

## Styling

The editor comes with default styles. To customize, you can:

1. **Override CSS variables** (coming soon)
2. **Use the `className` prop** for wrapper styling
3. **Import styles (Required for Toolbar Layout)**:

```tsx
import "@imksh/editor/style.css";
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT © 2024 Karan Sharma

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues, questions, or suggestions, please open an issue on [GitHub](https://github.com/imksh/npm-packages/issues).

---

Made with ❤️ by [Karan Sharma](https://github.com/imksh)
