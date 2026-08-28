import { useEffect, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';
import { $convertToMarkdownString, TRANSFORMERS } from '@lexical/markdown';
import { useDebounce } from '../hooks/useDebounce';
import { exportHTML } from '../utils/htmlSerializer';


interface OnChangePluginProps {
  onChange?: (html: string) => void;
  onMarkdownChange?: (markdown: string) => void;
  onJsonChange?: (json: string) => void;
  debounceMs?: number;
}

/**
 * Serializes editor content to HTML and/or Markdown on every change.
 * Debounced to avoid excessive serialization.
 * Returns "" for empty content instead of <p><br></p>.
 */
export default function OnChangePlugin({
  onChange,
  onMarkdownChange,
  onJsonChange,
  debounceMs = 300,
}: OnChangePluginProps): null {
  const [editor] = useLexicalComposerContext();
  const isFirstRender = useRef(true);

  const debouncedOnChange = useDebounce((html: string) => {
    onChange?.(html);
  }, debounceMs);

  const debouncedOnMarkdownChange = useDebounce((md: string) => {
    onMarkdownChange?.(md);
  }, debounceMs);

  const debouncedOnJsonChange = useDebounce((json: string) => {
    onJsonChange?.(json);
  }, debounceMs);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState, dirtyElements, dirtyLeaves }) => {
      // Skip the initial update
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }

      // Only serialize if something actually changed
      if (dirtyElements.size === 0 && dirtyLeaves.size === 0) {
        return;
      }

      editorState.read(() => {
        const root = $getRoot();
        const textContent = root.getTextContent().trim();

        // Empty state check
        if (textContent === '') {
          debouncedOnChange('');
          debouncedOnMarkdownChange('');
          return;
        }

        if (onChange) {
          // Use exportHTML so copy-button wrappers and any other
          // post-processing are included in what consumers receive.
          const html = exportHTML(editor);
          debouncedOnChange(html);
        }

        if (onMarkdownChange) {
          const markdown = $convertToMarkdownString(TRANSFORMERS);
          debouncedOnMarkdownChange(markdown);
        }

        if (onJsonChange) {
          const json = JSON.stringify(editorState.toJSON(), null, 2);
          debouncedOnJsonChange(json);
        }
      });
    });
  }, [editor, debouncedOnChange, debouncedOnMarkdownChange, debouncedOnJsonChange, onChange, onMarkdownChange, onJsonChange]);

  return null;
}

