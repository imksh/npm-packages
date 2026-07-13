'use client';

import React, { useEffect, useRef, useMemo } from 'react';

// ── Lexical Core ────────────────────────────────────────────────
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { TabIndentationPlugin } from '@lexical/react/LexicalTabIndentationPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';

// ── Lexical Nodes ───────────────────────────────────────────────
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';
import { TRANSFORMERS } from '@lexical/markdown';

// ── Custom Nodes ────────────────────────────────────────────────
import { ImageNode } from './nodes/ImageNode';

// ── Custom Plugins ──────────────────────────────────────────────
import ToolbarPlugin from './plugins/ToolbarPlugin';
import OnChangePlugin from './plugins/OnChangePlugin';
import KeyboardShortcutPlugin from './plugins/KeyboardShortcutPlugin';
import ImagePlugin from './plugins/ImagePlugin';
import CodeHighlightPlugin from './plugins/CodeHighlightPlugin';
import FloatingLinkPlugin from './plugins/FloatingLinkPlugin';
import TableActionPlugin from './plugins/TableActionPlugin';
import TableCellResizerPlugin from './plugins/TableCellResizerPlugin';
import ImageActionMenuPlugin from './plugins/ImageActionMenuPlugin';
import CodeActionMenuPlugin from './plugins/CodeActionMenuPlugin';
import TabEscapePlugin from './plugins/TabEscapePlugin';
import RootClickPlugin from './plugins/RootClickPlugin';
import ImperativeHandlePlugin from './plugins/ImperativeHandlePlugin';

// ── Utils & Theme ───────────────────────────────────────────────
import { editorTheme } from './utils/editorTheme';
import { importHTML } from './utils/htmlSerializer';

// ── Types ───────────────────────────────────────────────────────
import type {
  RichTextEditorProps,
  RichTextEditorRef,
  RichTextEditorFeatures,
} from './types';

// ── Styles ──────────────────────────────────────────────────────
import './RichTextEditor.css';

// ─── Initial Content Loader Plugin ──────────────────────────────
function InitialContentPlugin({ value }: { value?: string }): null {
  const [editor] = React.useState(() => null);
  // We handle this via the LexicalComposer's editorState instead
  return null;
}

// ─── Link Validation ────────────────────────────────────────────
function validateUrl(url: string): boolean {
  try {
    if (url.startsWith('/') || url.startsWith('#') || url.startsWith('mailto:')) {
      return true;
    }
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ─── Component ──────────────────────────────────────────────────
function RichTextEditorInner(
  props: RichTextEditorProps,
  ref: React.Ref<RichTextEditorRef>,
): React.ReactElement {
  const {
    value,
    onChange,
    placeholder = 'Start writing...',
    readOnly = false,
    autoFocus = false,
    minHeight = 200,
    maxHeight,
    height,
    disabled = false,
    showToolbar = true,
    className = '',
    onImageUpload,
    onOpenImageDrawer,
    // Feature flags (all default to true)
    bold = true,
    italic = true,
    underline = true,
    strikethrough = true,
    inlineCode = true,
    codeBlock = true,
    headings = true,
    fontSize = true,
    textColor = true,
    highlight = true,
    alignment = true,
    bulletList = true,
    numberedList = true,
    checkList = true,
    blockquote = true,
    link = true,
    image = true,
    table = true,
    horizontalRule = true,
    undoRedo = true,
  } = props;

  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const editorRef = useRef<RichTextEditorRef | null>(null);
  const hasLoadedInitialValue = useRef(false);

  // Handle Escape key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  // Merge features into an object
  const features: RichTextEditorFeatures = useMemo(
    () => ({
      bold,
      italic,
      underline,
      strikethrough,
      inlineCode,
      codeBlock,
      headings,
      fontSize,
      textColor,
      highlight,
      alignment,
      bulletList,
      numberedList,
      checkList,
      blockquote,
      link,
      image,
      table,
      horizontalRule,
      undoRedo,
    }),
    [
      bold, italic, underline, strikethrough, inlineCode, codeBlock,
      headings, fontSize, textColor, highlight, alignment,
      bulletList, numberedList, checkList, blockquote, link,
      image, table, horizontalRule, undoRedo,
    ],
  );

  // Build nodes list based on features
  const nodes = useMemo(() => {
    const nodeList: Array<typeof HeadingNode | typeof QuoteNode | typeof ListNode | typeof ListItemNode | typeof LinkNode | typeof AutoLinkNode | typeof CodeNode | typeof CodeHighlightNode | typeof TableNode | typeof TableCellNode | typeof TableRowNode | typeof HorizontalRuleNode | typeof ImageNode> = [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
    ];

    if (link !== false) {
      nodeList.push(LinkNode, AutoLinkNode);
    }
    if (codeBlock !== false || inlineCode !== false) {
      nodeList.push(CodeNode, CodeHighlightNode);
    }
    if (table !== false) {
      nodeList.push(TableNode, TableCellNode, TableRowNode);
    }
    if (horizontalRule !== false) {
      nodeList.push(HorizontalRuleNode);
    }
    if (image !== false) {
      nodeList.push(ImageNode);
    }

    return nodeList;
  }, [link, codeBlock, inlineCode, table, horizontalRule, image]);

  // Editor initial config
  const initialConfig = useMemo(
    () => ({
      namespace: 'RichTextEditor',
      theme: editorTheme,
      nodes,
      editable: !readOnly && !disabled,
      onError: (error: Error) => {
        console.error('[RichTextEditor]', error);
      },
      // Load initial HTML content
      editorState: value
        ? (editor: import('lexical').LexicalEditor) => {
            importHTML(editor, value);
          }
        : undefined,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [], // Only run on mount
  );

  // Forward ref
  React.useImperativeHandle(ref, () => editorRef.current!, []);

  // Wrapper class names
  const wrapperClasses = [
    'rte-wrapper',
    disabled ? 'rte-wrapper--disabled' : '',
    readOnly ? 'rte-wrapper--readonly' : '',
    isFullscreen ? 'rte-fullscreen' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={wrapperClasses}>
        {/* Toolbar */}
        {showToolbar && !readOnly && (
          <ToolbarPlugin
            features={features}
            onOpenImageDrawer={onOpenImageDrawer}
            disabled={disabled}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
          />
        )}

        {/* Content Area */}
        <div className="rte-content-wrapper">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className="rte-root"
                style={{ 
                  minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
                  maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
                  height: typeof height === 'number' ? `${height}px` : height,
                  overflowY: (maxHeight || height) ? 'auto' : undefined,
                }}
                aria-label="Rich text editor"
              />
            }
            placeholder={
              <div className="rte-placeholder">{placeholder}</div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>

        {/* ── Plugins ─────────────────────────────────────────── */}

        {/* History (undo/redo) */}
        {undoRedo !== false && <HistoryPlugin />}

        {/* Lists */}
        {(bulletList !== false || numberedList !== false) && <ListPlugin />}
        {checkList !== false && <CheckListPlugin />}

        {/* Links */}
        {link !== false && <LinkPlugin validateUrl={validateUrl} />}
        {link !== false && <FloatingLinkPlugin />}

        {/* Table */}
        {table !== false && (
          <>
            <TablePlugin />
            <TableActionPlugin />
            <TableCellResizerPlugin />
          </>
        )}

        {/* General Plugins */}
        <ListPlugin />
        <CheckListPlugin />
        <TabEscapePlugin />
        <RootClickPlugin />

        {/* Images */}
        {image !== false && (
          <>
            <ImagePlugin />
            <ImageActionMenuPlugin onOpenImageDrawer={onOpenImageDrawer} />
          </>
        )}

        {/* Code highlighting */}
        {(codeBlock !== false || inlineCode !== false) && (
          <>
            <CodeHighlightPlugin />
            <CodeActionMenuPlugin />
          </>
        )}

        {/* Horizontal rule */}
        {horizontalRule !== false && <HorizontalRulePlugin />}

        {/* Markdown shortcuts */}
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />

        {/* Tab indentation */}
        <TabIndentationPlugin />

        {/* Keyboard shortcuts */}
        <KeyboardShortcutPlugin />

        {/* Auto focus */}
        {autoFocus && <AutoFocusPlugin />}

        {/* onChange serialization */}
        {onChange && <OnChangePlugin onChange={onChange} />}

        {/* Imperative handle */}
        <ImperativeHandlePlugin editorRef={editorRef} />
      </div>
    </LexicalComposer>
  );
}

/**
 * Production-ready Rich Text Editor built on Lexical.
 *
 * @example
 * ```tsx
 * <RichTextEditor
 *   value={html}
 *   onChange={setHtml}
 *   placeholder="Start writing..."
 *   minHeight={400}
 * />
 * ```
 */
const RichTextEditor = React.forwardRef<RichTextEditorRef, RichTextEditorProps>(
  RichTextEditorInner,
);

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
