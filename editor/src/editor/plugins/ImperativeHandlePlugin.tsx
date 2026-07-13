import { useImperativeHandle, type RefObject } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $getRoot } from 'lexical';
import type { RichTextEditorRef } from '../types';
import { importHTML, exportHTML } from '../utils/htmlSerializer';

interface ImperativeHandlePluginProps {
  editorRef: RefObject<RichTextEditorRef | null>;
}

/**
 * Exposes editor methods (setContent, getContent, focus, clear) via ref.
 */
export default function ImperativeHandlePlugin({
  editorRef,
}: ImperativeHandlePluginProps): null {
  const [editor] = useLexicalComposerContext();

  useImperativeHandle(
    editorRef,
    () => ({
      setContent: (html: string) => {
        importHTML(editor, html);
      },
      getContent: () => {
        return exportHTML(editor);
      },
      focus: () => {
        editor.focus();
      },
      clear: () => {
        editor.update(() => {
          const root = $getRoot();
          root.clear();
        });
      },
      getEditor: () => editor,
    }),
    [editor],
  );

  return null;
}
