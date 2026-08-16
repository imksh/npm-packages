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

    const rootElement = editor.getRootElement();
    const scrollContainer = rootElement?.parentElement;
    const wrapperElement = rootElement?.closest('.rte-wrapper');
    if (!scrollContainer || !wrapperElement) return;

    const rect = domElement.getBoundingClientRect();
    const containerRect = scrollContainer.getBoundingClientRect();
    const wrapperRect = wrapperElement.getBoundingClientRect();

    // Hide if the code block has scrolled out of view vertically
    if (rect.bottom < containerRect.top || rect.top > containerRect.bottom) {
      setPosition({ top: -10000, left: -10000 });
      return;
    }

    setPosition({
      top: Math.max(rect.top, containerRect.top) - wrapperRect.top + 8,
      left: rect.right - wrapperRect.left - 8,
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

  const handleLanguageChange = useCallback(
    (newLanguage: string) => {
      if (!activeCodeKey) return;
      editor.update(() => {
        const node = $getNodeByKey(activeCodeKey);
        if ($isCodeNode(node)) {
          node.setLanguage(newLanguage);
          setLanguage(newLanguage);
        }
      });
    },
    [editor, activeCodeKey],
  );

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
      <select
        className="rte-code-language-select rte-code-language-select--inline"
        value={language}
        onChange={(e) => handleLanguageChange(e.target.value)}
        aria-label="Select code language"
      >
        <option value="">Plain Text</option>
        {Object.entries(CODE_LANGUAGES).map(([value, label]) => (
          <option key={value} value={value}>
            {label as string}
          </option>
        ))}
      </select>

      <div className="rte-toolbar-divider" style={{ height: '16px' }} />

      <button
        type="button"
        className="rte-floating-toolbar-btn"
        onClick={handleCopy}
        title="Copy code"
        aria-label="Copy code"
      >
        {isCopied ? <Check size={14} className="rte-text-success" /> : <Copy size={14} />}
      </button>
    </div>
  );
}
