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
import { $isVideoNode, type VideoAlignment, ON_VIDEO_DELETE_COMMAND } from '../nodes/VideoNode';
import { AlignLeft, AlignCenter, AlignRight, Trash2, Video as VideoIcon } from 'lucide-react';
import VideoDialog from '../components/VideoDialog';

interface VideoActionMenuPluginProps {
  onOpenVideoDrawer?: (callback: (url: string) => void) => void;
  onVideoUpload?: (file: File) => Promise<string>;
}

export default function VideoActionMenuPlugin({
  onOpenVideoDrawer,
  onVideoUpload,
}: VideoActionMenuPluginProps): React.ReactElement | null {
  const [editor] = useLexicalComposerContext();
  const [activeVideoKey, setActiveVideoKey] = useState<string | null>(null);
  const [alignment, setAlignment] = useState<VideoAlignment>('inline');
  const [position, setPosition] = useState({ top: -10000, left: -10000 });
  const [showReplaceDialog, setShowReplaceDialog] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!activeVideoKey) return;
    const domElement = editor.getElementByKey(activeVideoKey);
    if (!domElement) return;

    const rootElement = editor.getRootElement();
    const scrollContainer = rootElement?.parentElement;
    const wrapperElement = rootElement?.closest('.rte-wrapper');
    if (!scrollContainer || !wrapperElement) return;

    const rect = domElement.getBoundingClientRect();
    const containerRect = scrollContainer.getBoundingClientRect();
    const wrapperRect = wrapperElement.getBoundingClientRect();

    if (rect.bottom < containerRect.top || rect.top > containerRect.bottom) {
      setPosition({ top: -10000, left: -10000 });
      return;
    }

    setPosition({
      top: Math.max(rect.top - 40, containerRect.top + 4) - wrapperRect.top,
      left: rect.right - wrapperRect.left,
    });
  }, [editor, activeVideoKey]);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          editor.getEditorState().read(() => {
            const selection = $getSelection();
            if ($isNodeSelection(selection)) {
              const nodes = selection.getNodes();
              if (nodes.length === 1 && $isVideoNode(nodes[0])) {
                setActiveVideoKey(nodes[0].getKey());
                setAlignment(nodes[0].getAlignment());
                updatePosition();
                return;
              }
            }
            setActiveVideoKey(null);
          });
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          if (activeVideoKey) {
            const node = $getNodeByKey(activeVideoKey);
            if ($isVideoNode(node)) {
              setAlignment(node.getAlignment());
            } else {
              setActiveVideoKey(null);
            }
            updatePosition();
          }
        });
      }),
    );
  }, [editor, activeVideoKey, updatePosition]);

  useEffect(() => {
    if (activeVideoKey) {
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [activeVideoKey, updatePosition]);

  const handleAlignment = useCallback((align: VideoAlignment) => {
    editor.update(() => {
      if (!activeVideoKey) return;
      const node = $getNodeByKey(activeVideoKey);
      if ($isVideoNode(node)) {
        node.setAlignment(node.getAlignment() === align ? 'inline' : align);
      }
    });
  }, [editor, activeVideoKey]);

  const handleDelete = useCallback(() => {
    editor.update(() => {
      if (!activeVideoKey) return;
      const node = $getNodeByKey(activeVideoKey);
      if ($isVideoNode(node)) {
        editor.dispatchCommand(ON_VIDEO_DELETE_COMMAND, node.getSrc());
        node.remove();
      }
    });
  }, [editor, activeVideoKey]);

  const handleReplaceSubmit = useCallback((url: string, options: { autoplay: boolean; loop: boolean; muted: boolean; controls: boolean }) => {
    if (url && activeVideoKey) {
      editor.update(() => {
        const node = $getNodeByKey(activeVideoKey);
        if ($isVideoNode(node)) {
          node.setSrc(url);
          // could set other options if we add setters
        }
      });
    }
  }, [editor, activeVideoKey]);

  const handleReplace = useCallback(() => {
    setShowReplaceDialog(true);
  }, []);

  if (!activeVideoKey || !editor.isEditable()) return null;

  return (
    <>
      <div
        ref={toolbarRef}
        className="rte-floating-toolbar rte-video-floating-toolbar"
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
          title="Replace Video"
        >
          <VideoIcon size={16} />
        </button>
        <button
          type="button"
          className="rte-floating-toolbar-btn rte-floating-toolbar-btn--danger"
          onClick={handleDelete}
          title="Delete Video"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <VideoDialog
        isOpen={showReplaceDialog}
        onClose={() => setShowReplaceDialog(false)}
        onSubmit={handleReplaceSubmit}
        onOpenVideoDrawer={onOpenVideoDrawer}
        onVideoUpload={onVideoUpload}
      />
    </>
  );
}
