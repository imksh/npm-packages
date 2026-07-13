import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
  $getNodeByKey,
} from 'lexical';
import { $isCodeNode } from '@lexical/code';
import { $findMatchingParent, mergeRegister } from '@lexical/utils';
import { Copy, Check } from 'lucide-react';
import { CODE_LANGUAGES } from '../types';

export default function CodeActionMenuPlugin(): React.ReactElement | null {
  const [editor] = useLexicalComposerContext();
  const [activeCodeKey, setActiveCodeKey] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>('');
  const [position, setPosition] = useState({ top: -10000, left: -10000 });
  const [isCopied, setIsCopied] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!activeCodeKey) return;
    const domElement = editor.getElementByKey(activeCodeKey);
    if (!domElement) return;

    const rect = domElement.getBoundingClientRect();
    setPosition({
      top: rect.top + 8, // Inside top-right
      left: rect.right - 8,
    });
  }, [editor, activeCodeKey]);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          editor.getEditorState().read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              const node = selection.anchor.getNode();
              const codeNode = $findMatchingParent(node, $isCodeNode);
              if (codeNode && $isCodeNode(codeNode)) {
                setActiveCodeKey(codeNode.getKey());
                setLanguage(codeNode.getLanguage() || '');
                updatePosition();
                return;
              }
            }
            setActiveCodeKey(null);
          });
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          if (activeCodeKey) {
            const node = $getNodeByKey(activeCodeKey);
            if ($isCodeNode(node)) {
              setLanguage(node.getLanguage() || '');
            } else {
              setActiveCodeKey(null);
            }
            updatePosition();
          }
        });
      }),
    );
  }, [editor, activeCodeKey, updatePosition]);

  // Handle scrolling to reposition
  useEffect(() => {
    if (activeCodeKey) {
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [activeCodeKey, updatePosition]);

  const handleCopy = useCallback(() => {
    editor.getEditorState().read(() => {
      if (!activeCodeKey) return;
      const node = $getNodeByKey(activeCodeKey);
      if ($isCodeNode(node)) {
        const text = node.getTextContent();
        navigator.clipboard.writeText(text).then(() => {
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        });
      }
    });
  }, [editor, activeCodeKey]);

  if (!activeCodeKey) return null;

  return (
    <div
      ref={toolbarRef}
      className="rte-floating-toolbar rte-code-action-menu"
      style={{
        top: position.top,
        left: position.left,
        transform: 'translateX(-100%)', // Shift left to align right edge
      }}
    >
      <span className="rte-code-language-badge">
        {CODE_LANGUAGES[language] || 'Plain Text'}
      </span>
      <div className="rte-toolbar-divider" style={{ height: '14px', margin: '0 4px' }} />
      <button
        type="button"
        className="rte-floating-toolbar-btn"
        onClick={handleCopy}
        title="Copy Code"
      >
        {isCopied ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
      </button>
    </div>
  );
}
