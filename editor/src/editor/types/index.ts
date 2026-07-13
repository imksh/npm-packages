'use client';

import type { LexicalEditor, TextFormatType as LexicalTextFormatType } from 'lexical';

// ─── Feature Flags ───────────────────────────────────────────────
export interface RichTextEditorFeatures {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  inlineCode?: boolean;
  codeBlock?: boolean;
  headings?: boolean;
  fontSize?: boolean;
  textColor?: boolean;
  highlight?: boolean;
  alignment?: boolean;
  bulletList?: boolean;
  numberedList?: boolean;
  checkList?: boolean;
  blockquote?: boolean;
  link?: boolean;
  image?: boolean;
  table?: boolean;
  horizontalRule?: boolean;
  undoRedo?: boolean;
}

// ─── Editor Props ────────────────────────────────────────────────
export interface RichTextEditorProps extends RichTextEditorFeatures {
  /** HTML string to initialize or control the editor content */
  value?: string;
  /** Callback fired with HTML string when editor content changes */
  onChange?: (html: string) => void;
  /** Placeholder text when editor is empty */
  placeholder?: string;
  /** Disables editing, hides toolbar, preserves formatting */
  readOnly?: boolean;
  /** Automatically focuses the editor on mount */
  autoFocus?: boolean;
  /** Minimum height of the editor content area in pixels */
  minHeight?: number | string;
  /** Maximum height of the editor content area in pixels */
  maxHeight?: number | string;
  /** Fixed height of the editor content area in pixels */
  height?: number | string;
  /** Disables the editor with a grayed-out appearance */
  disabled?: boolean;
  /** Show or hide the toolbar */
  showToolbar?: boolean;
  /** Additional CSS class name for the wrapper */
  className?: string;
  /** Callback for image file upload — receives File, returns URL */
  onImageUpload?: (file: File) => Promise<string>;
  /** Callback to open external image drawer. Editor passes a callback to receive the URL. */
  onOpenImageDrawer?: (callback: (url: string) => void) => void;
}

// ─── Ref Handle ──────────────────────────────────────────────────
export interface RichTextEditorRef {
  /** Programmatically set HTML content */
  setContent: (html: string) => void;
  /** Get current HTML content */
  getContent: () => string;
  /** Focus the editor */
  focus: () => void;
  /** Clear editor content */
  clear: () => void;
  /** Get the underlying Lexical editor instance */
  getEditor: () => LexicalEditor | null;
}

// ─── Toolbar State ───────────────────────────────────────────────
export type HeadingLevel = 'h1' | 'h2' | 'h3';

export type BlockType =
  | 'paragraph'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'quote'
  | 'code'
  | 'bullet'
  | 'number'
  | 'check';

export type ElementAlignment = 'left' | 'center' | 'right' | 'justify';

export type TextFormatType = LexicalTextFormatType;

export interface ToolbarState {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  isCode: boolean;
  blockType: BlockType;
  alignment: ElementAlignment;
  fontSize: string;
  fontColor: string;
  bgColor: string;
  isLink: boolean;
  canUndo: boolean;
  canRedo: boolean;
  codeLanguage: string;
}

export const INITIAL_TOOLBAR_STATE: ToolbarState = {
  isBold: false,
  isItalic: false,
  isUnderline: false,
  isStrikethrough: false,
  isCode: false,
  blockType: 'paragraph',
  alignment: 'left',
  fontSize: '16px',
  fontColor: '',
  bgColor: '',
  isLink: false,
  canUndo: false,
  canRedo: false,
  codeLanguage: '',
};

// ─── Toolbar Actions ─────────────────────────────────────────────
export interface ToolbarActions {
  formatText: (format: TextFormatType) => void;
  formatBlock: (blockType: BlockType) => void;
  setAlignment: (alignment: ElementAlignment) => void;
  setFontSize: (size: string) => void;
  setTextColor: (color: string) => void;
  setBgColor: (color: string) => void;
  insertLink: (url: string, text?: string) => void;
  removeLink: () => void;
  insertImage: (payload: ImagePayload) => void;
  insertTable: (payload: InsertTablePayload) => void;
  insertHorizontalRule: () => void;
  undo: () => void;
  redo: () => void;
  setCodeLanguage: (language: string) => void;
}

// ─── Payloads ────────────────────────────────────────────────────
export interface ImagePayload {
  src: string;
  altText?: string;
  width?: number | 'inherit';
  height?: number | 'inherit';
  alignment?: 'left' | 'center' | 'right';
}

export interface InsertTablePayload {
  rows: number;
  columns: number;
}

// ─── Plugin Props ────────────────────────────────────────────────
export interface OnChangePluginProps {
  onChange: (html: string) => void;
  debounceMs?: number;
}

export interface AutoSavePluginProps {
  onAutoSave: (html: string) => void;
  intervalMs?: number;
}

// ─── Color Preset ────────────────────────────────────────────────
export interface ColorPreset {
  name: string;
  value: string;
}

export const TEXT_COLORS: ColorPreset[] = [
  { name: 'Default', value: '' },
  { name: 'Gray', value: '#6b7280' },
  { name: 'Brown', value: '#92400e' },
  { name: 'Orange', value: '#ea580c' },
  { name: 'Yellow', value: '#ca8a04' },
  { name: 'Green', value: '#16a34a' },
  { name: 'Blue', value: '#2563eb' },
  { name: 'Purple', value: '#9333ea' },
  { name: 'Pink', value: '#db2777' },
  { name: 'Red', value: '#dc2626' },
];

export const BG_COLORS: ColorPreset[] = [
  { name: 'Default', value: '' },
  { name: 'Gray', value: '#f3f4f6' },
  { name: 'Brown', value: '#fef3c7' },
  { name: 'Orange', value: '#ffedd5' },
  { name: 'Yellow', value: '#fef9c3' },
  { name: 'Green', value: '#dcfce7' },
  { name: 'Blue', value: '#dbeafe' },
  { name: 'Purple', value: '#f3e8ff' },
  { name: 'Pink', value: '#fce7f3' },
  { name: 'Red', value: '#fee2e2' },
];

// ─── Font Sizes ──────────────────────────────────────────────────
export const FONT_SIZES = [
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '24px',
  '28px',
  '32px',
  '36px',
  '48px',
  '64px',
  '72px',
];

// ─── Code Languages ─────────────────────────────────────────────
export const CODE_LANGUAGES: Record<string, string> = {
  '': 'Plain Text',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  java: 'Java',
  c: 'C',
  cpp: 'C++',
  csharp: 'C#',
  go: 'Go',
  rust: 'Rust',
  ruby: 'Ruby',
  php: 'PHP',
  swift: 'Swift',
  kotlin: 'Kotlin',
  html: 'HTML',
  css: 'CSS',
  sql: 'SQL',
  bash: 'Bash',
  json: 'JSON',
  xml: 'XML',
  yaml: 'YAML',
  markdown: 'Markdown',
};
