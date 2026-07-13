/**
 * Rich Text Editor — Public API
 *
 * Usage:
 * ```tsx
 * import { RichTextEditor } from '@/components/RichTextEditor';
 * import type { RichTextEditorRef, RichTextEditorProps } from '@/components/RichTextEditor';
 * ```
 */

// ── Main Component ──────────────────────────────────────────────
export { default as RichTextEditor } from "./RichTextEditor";

// ── Types ───────────────────────────────────────────────────────
export type {
  RichTextEditorProps,
  RichTextEditorRef,
  RichTextEditorFeatures,
  ToolbarState,
  ToolbarActions,
  ImagePayload,
  InsertTablePayload,
  BlockType,
  ElementAlignment,
  HeadingLevel,
  TextFormatType,
  ColorPreset,
  OnChangePluginProps,
  AutoSavePluginProps,
} from "./types";

// ── Constants ───────────────────────────────────────────────────
export {
  FONT_SIZES,
  TEXT_COLORS,
  BG_COLORS,
  CODE_LANGUAGES,
  INITIAL_TOOLBAR_STATE,
} from "./types";

// ── Utilities (for advanced use cases) ──────────────────────────
export {
  importHTML,
  exportHTML,
  isHTMLEmpty,
  isEditorEmpty,
} from "./utils/htmlSerializer";
export { editorTheme } from "./utils/editorTheme";

// ── Nodes (for extending the editor) ────────────────────────────
export {
  ImageNode,
  $createImageNode,
  $isImageNode,
  INSERT_IMAGE_COMMAND,
} from "./nodes/ImageNode";
export type { ImageAlignment } from "./nodes/ImageNode";

// ── Hooks (for building custom toolbars) ────────────────────────
export { useEditorToolbar } from "./hooks/useEditorToolbar";
export { useDebounce } from "./hooks/useDebounce";
