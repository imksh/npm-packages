import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $insertNodes,
  $getRoot,
  COMMAND_PRIORITY_EDITOR,
} from 'lexical';
import { $createParagraphNode } from 'lexical';
import { $createVideoNode, INSERT_VIDEO_COMMAND } from '../nodes/VideoNode';
import type { VideoPayload } from '../types';

/**
 * Registers the INSERT_VIDEO_COMMAND and handles video insertion.
 * Inserts the video node directly at the selection cursor (inline).
 */
export default function VideoPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      INSERT_VIDEO_COMMAND,
      (payload: VideoPayload) => {
        const videoNode = $createVideoNode(payload);
        const selection = $getSelection();
        
        if (selection === null) {
          const root = $getRoot();
          const p = $createParagraphNode();
          p.append(videoNode);
          root.append(p);
        } else {
          $insertNodes([videoNode]);
        }
        
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
