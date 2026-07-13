import { useEffect, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes } from '@lexical/html';
import { $getRoot } from 'lexical';
import { useDebounce } from '../hooks/useDebounce';

interface OnChangePluginProps {
  onChange: (html: string) => void;
  debounceMs?: number;
}

/**
 * Serializes editor content to HTML on every change.
 * Debounced to avoid excessive serialization.
 * Returns "" for empty content instead of <p><br></p>.
 */
export default function OnChangePlugin({
  onChange,
  debounceMs = 300,
}: OnChangePluginProps): null {
  const [editor] = useLexicalComposerContext();
  const isFirstRender = useRef(true);

  const debouncedOnChange = useDebounce((html: string) => {
    onChange(html);
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
          return;
        }

        const html = $generateHtmlFromNodes(editor);
        debouncedOnChange(html);
      });
    });
  }, [editor, debouncedOnChange]);

  return null;
}
