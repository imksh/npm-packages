import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isNodeSelection,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
  $getNodeByKey,
} from 'lexical';
import { mergeRegister } from '@lexical/utils';
import { $isImageNode, type ImageAlignment } from '../nodes/ImageNode';
import { AlignLeft, AlignCenter, AlignRight, Trash2, Image as ImageIcon } from 'lucide-react';
import ImageDialog from '../components/ImageDialog';

interface ImageActionMenuPluginProps {
  onOpenImageDrawer?: (callback: (url: string) => void) => void;
}

export default function ImageActionMenuPlugin({
  onOpenImageDrawer,
}: ImageActionMenuPluginProps): React.ReactElement | null {
  const [editor] = useLexicalComposerContext();
  const [activeImageKey, setActiveImageKey] = useState<string | null>(null);
  const [alignment, setAlignment] = useState<ImageAlignment>('inline');
  const [position, setPosition] = useState({ top: -10000, left: -10000 });
  const [showReplaceDialog, setShowReplaceDialog] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!activeImageKey) return;
    const domElement = editor.getElementByKey(activeImageKey);
    if (!domElement) return;

    const img = domElement.querySelector('img');
    if (!img) return;
    
    const rect = img.getBoundingClientRect();
    setPosition({
      top: rect.top - 40,
      left: rect.right,
    });
  }, [editor, activeImageKey]);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          editor.getEditorState().read(() => {
            const selection = $getSelection();
            if ($isNodeSelection(selection)) {
              const nodes = selection.getNodes();
              if (nodes.length === 1 && $isImageNode(nodes[0])) {
                setActiveImageKey(nodes[0].getKey());
                setAlignment(nodes[0].getAlignment());
                updatePosition();
                return;
              }
            }
            setActiveImageKey(null);
          });
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          if (activeImageKey) {
            const node = $getNodeByKey(activeImageKey);
            if ($isImageNode(node)) {
              setAlignment(node.getAlignment());
            } else {
              setActiveImageKey(null);
            }
            updatePosition();
          }
        });
      }),
    );
  }, [editor, activeImageKey, updatePosition]);

  // Handle scrolling to reposition
  useEffect(() => {
    if (activeImageKey) {
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [activeImageKey, updatePosition]);

  const handleAlignment = useCallback((align: ImageAlignment) => {
    editor.update(() => {
      if (!activeImageKey) return;
      const node = $getNodeByKey(activeImageKey);
      if ($isImageNode(node)) {
        // If clicking the same alignment, toggle back to inline
        node.setAlignment(node.getAlignment() === align ? 'inline' : align);
      }
    });
  }, [editor, activeImageKey]);

  const handleDelete = useCallback(() => {
    editor.update(() => {
      if (!activeImageKey) return;
      const node = $getNodeByKey(activeImageKey);
      if ($isImageNode(node)) {
        node.remove();
      }
    });
  }, [editor, activeImageKey]);

  const handleReplaceSubmit = useCallback((url: string) => {
    if (url && activeImageKey) {
      editor.update(() => {
        const node = $getNodeByKey(activeImageKey);
        if ($isImageNode(node)) {
          node.setSrc(url);
        }
      });
    }
  }, [editor, activeImageKey]);

  const handleReplace = useCallback(() => {
    setShowReplaceDialog(true);
  }, []);

  if (!activeImageKey || !editor.isEditable()) return null;

  return (
    <>
      <div
        ref={toolbarRef}
        className="rte-floating-toolbar rte-image-floating-toolbar"
        style={{ top: position.top, left: position.left, transform: 'translateX(-100%)' }}
      >
      <button
        type="button"
        className={`rte-floating-toolbar-btn ${alignment === 'left' ? 'active' : ''}`}
        onClick={() => handleAlignment('left')}
        title="Float Left"
      >
        <AlignLeft size={16} />
      </button>
      <button
        type="button"
        className={`rte-floating-toolbar-btn ${alignment === 'center' ? 'active' : ''}`}
        onClick={() => handleAlignment('center')}
        title="Align Center"
      >
        <AlignCenter size={16} />
      </button>
      <button
        type="button"
        className={`rte-floating-toolbar-btn ${alignment === 'right' ? 'active' : ''}`}
        onClick={() => handleAlignment('right')}
        title="Float Right"
      >
        <AlignRight size={16} />
      </button>
      <div className="rte-toolbar-divider" style={{ height: '16px' }} />
      <button
        type="button"
        className="rte-floating-toolbar-btn"
        onClick={handleReplace}
        title="Replace Image"
      >
        <ImageIcon size={16} />
      </button>
      <button
        type="button"
        className="rte-floating-toolbar-btn rte-floating-toolbar-btn--danger"
        onClick={handleDelete}
        title="Delete Image"
      >
        <Trash2 size={16} />
      </button>
    </div>

      <ImageDialog
        isOpen={showReplaceDialog}
        onClose={() => setShowReplaceDialog(false)}
        onSubmit={handleReplaceSubmit}
        onOpenImageDrawer={onOpenImageDrawer}
      />
    </>
  );
}
