import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $findMatchingParent, mergeRegister } from '@lexical/utils';

function getSelectedLinkNode() {
  const selection = $getSelection();
  if (!$isRangeSelection(selection)) return null;

  const anchor = selection.anchor.getNode();
  const focus = selection.focus.getNode();

  const linkNode =
    $findMatchingParent(anchor, $isLinkNode) ??
    $findMatchingParent(focus, $isLinkNode);

  return linkNode;
}

/**
 * Floating link editor that appears when a link is selected.
 * Shows the URL with edit and remove buttons.
 */
export default function FloatingLinkPlugin(): React.ReactElement | null {
  const [editor] = useLexicalComposerContext();
  const [linkUrl, setLinkUrl] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editUrl, setEditUrl] = useState('');
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const floatingRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const updatePosition = useCallback(() => {
    const nativeSelection = window.getSelection();
    if (!nativeSelection || nativeSelection.rangeCount === 0) return;

    const range = nativeSelection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const editorRoot = editor.getRootElement();
    if (!editorRoot) return;

    const editorRect = editorRoot.getBoundingClientRect();
    const top = rect.bottom - editorRect.top + 8;
    const left = Math.max(0, rect.left - editorRect.left);

    setPosition({ top, left });
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          editor.getEditorState().read(() => {
            const linkNode = getSelectedLinkNode();
            if (linkNode && $isLinkNode(linkNode)) {
              setLinkUrl(linkNode.getURL());
              setIsVisible(true);
              setIsEditing(false);
              updatePosition();
            } else {
              setIsVisible(false);
              setIsEditing(false);
            }
          });
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const linkNode = getSelectedLinkNode();
          if (linkNode && $isLinkNode(linkNode)) {
            setLinkUrl(linkNode.getURL());
            setIsVisible(true);
            updatePosition();
          } else {
            setIsVisible(false);
          }
        });
      }),
    );
  }, [editor, updatePosition]);

  const handleEdit = useCallback(() => {
    setEditUrl(linkUrl);
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [linkUrl]);

  const handleSave = useCallback(() => {
    if (editUrl.trim()) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, editUrl.trim());
      setIsEditing(false);
    }
  }, [editor, editUrl]);

  const handleRemove = useCallback(() => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    setIsVisible(false);
  }, [editor]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSave();
      }
      if (e.key === 'Escape') {
        setIsEditing(false);
      }
    },
    [handleSave],
  );

  if (!isVisible || !editor.isEditable()) return null;

  return (
    <div
      ref={floatingRef}
      className="rte-floating-link"
      style={{ top: position.top, left: position.left }}
    >
      {isEditing ? (
        <div className="rte-floating-link-edit">
          <input
            ref={inputRef}
            type="text"
            value={editUrl}
            onChange={(e) => setEditUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            className="rte-floating-link-input"
            placeholder="https://..."
          />
          <button type="button" className="rte-floating-link-btn" onClick={handleSave} title="Save">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
          <button
            type="button"
            className="rte-floating-link-btn"
            onClick={() => setIsEditing(false)}
            title="Cancel"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      ) : (
        <div className="rte-floating-link-view">
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rte-floating-link-url"
            title={linkUrl}
          >
            {linkUrl.length > 40 ? `${linkUrl.substring(0, 40)}...` : linkUrl}
          </a>
          <button type="button" className="rte-floating-link-btn" onClick={handleEdit} title="Edit link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button type="button" className="rte-floating-link-btn rte-floating-link-btn--danger" onClick={handleRemove} title="Remove link">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
