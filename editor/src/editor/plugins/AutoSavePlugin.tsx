import { useEffect, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { exportHTML } from '../utils/htmlSerializer';

interface AutoSavePluginProps {
  onAutoSave: (html: string) => void;
  intervalMs?: number;
}

/**
 * Periodically auto-saves the editor content.
 * Only fires when content has changed since last save.
 */
export default function AutoSavePlugin({
  onAutoSave,
  intervalMs = 30000,
}: AutoSavePluginProps): null {
  const [editor] = useLexicalComposerContext();
  const lastSavedRef = useRef('');
  const isDirtyRef = useRef(false);

  // Track changes
  useEffect(() => {
    return editor.registerUpdateListener(({ dirtyElements, dirtyLeaves }) => {
      if (dirtyElements.size > 0 || dirtyLeaves.size > 0) {
        isDirtyRef.current = true;
      }
    });
  }, [editor]);

  // Auto-save interval
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDirtyRef.current) return;

      const html = exportHTML(editor);
      if (html !== lastSavedRef.current) {
        lastSavedRef.current = html;
        isDirtyRef.current = false;
        onAutoSave(html);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [editor, intervalMs, onAutoSave]);

  return null;
}
