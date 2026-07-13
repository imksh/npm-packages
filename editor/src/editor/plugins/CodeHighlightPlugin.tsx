import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { registerCodeHighlighting } from '@lexical/code';

/**
 * Registers code syntax highlighting using @lexical/code's built-in tokenizer.
 * Uses Prism.js when available for enhanced highlighting.
 * Architecture allows swapping the tokenizer without changing this plugin.
 */
export default function CodeHighlightPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return registerCodeHighlighting(editor);
  }, [editor]);

  return null;
}
