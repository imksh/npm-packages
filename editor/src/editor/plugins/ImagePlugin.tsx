import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  $insertNodes,
  $getRoot,
  COMMAND_PRIORITY_EDITOR,
} from 'lexical';
import { $createParagraphNode } from 'lexical';
import { $createImageNode, INSERT_IMAGE_COMMAND, type ImagePayload } from '../nodes/ImageNode';

/**
 * Registers the INSERT_IMAGE_COMMAND and handles image insertion.
 * Inserts the image node directly at the selection cursor (inline).
 */
export default function ImagePlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      INSERT_IMAGE_COMMAND,
      (payload: ImagePayload) => {
        const imageNode = $createImageNode(payload);
        const selection = $getSelection();
        
        if (selection === null) {
          const root = $getRoot();
          const p = $createParagraphNode();
          p.append(imageNode);
          root.append(p);
        } else {
          $insertNodes([imageNode]);
        }
        
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
