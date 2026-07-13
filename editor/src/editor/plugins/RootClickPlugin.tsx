import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getRoot,
  $createParagraphNode,
  COMMAND_PRIORITY_LOW,
  CLICK_COMMAND,
} from 'lexical';
import { $isTableNode } from '@lexical/table';
import { $isImageNode } from '../nodes/ImageNode';

/**
 * RootClickPlugin
 * Allows the user to click the empty top padding of the editor to insert a paragraph 
 * BEFORE the first element, if the first element is a block like a Table or Image.
 */
export default function RootClickPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      CLICK_COMMAND,
      (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        
        // If they click the editor root directly (e.g. the padding area)
        if (target && target.classList && target.classList.contains('rte-root')) {
          let handled = false;
          
          editor.update(() => {
            const root = $getRoot();
            const firstChild = root.getFirstChild();
            
            // Check if they clicked near the top (within ~40px of the top edge)
            const rootRect = target.getBoundingClientRect();
            
            // Check if they clicked near the top (within ~40px of the top edge)
            if (event.clientY - rootRect.top < 40) {
              const firstChild = root.getFirstChild();
              if (firstChild && ($isTableNode(firstChild) || $isImageNode(firstChild))) {
                const p = $createParagraphNode();
                firstChild.insertBefore(p);
                p.select();
                handled = true;
              }
            } 
            // Check if they clicked near the bottom (past the content)
            else if (rootRect.bottom - event.clientY < 40 || event.clientY > rootRect.top + target.scrollHeight - 40) {
              const lastChild = root.getLastChild();
              if (lastChild && ($isTableNode(lastChild) || $isImageNode(lastChild))) {
                const p = $createParagraphNode();
                lastChild.insertAfter(p);
                p.select();
                handled = true;
              }
            }
          });
          
          return handled;
        }
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor]);

  return null;
}
