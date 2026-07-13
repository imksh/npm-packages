import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bold, Italic, Underline, Strikethrough, Code, Type } from 'lucide-react';
import type { ToolbarState, ToolbarActions, RichTextEditorFeatures } from '../types';

interface StyleSelectorProps {
  state: ToolbarState;
  actions: ToolbarActions;
  features: RichTextEditorFeatures;
  disabled?: boolean;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({
  state,
  actions,
  features,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = useCallback(
    (format: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code') => {
      actions.formatText(format);
      // We don't close the dropdown here so the user can toggle multiple styles
    },
    [actions],
  );

  const hasAnyStyle = state.isBold || state.isItalic || state.isUnderline || state.isStrikethrough || state.isCode;

  return (
    <div className="rte-font-size-selector" ref={containerRef}>
      <button
        type="button"
        className={`rte-font-size-trigger ${hasAnyStyle ? 'rte-toolbar-btn--active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        aria-label="Text Styles"
        aria-expanded={isOpen}
        title="Text Styles"
        style={{ minWidth: '40px', padding: '0 4px', border: hasAnyStyle ? '1px solid var(--color-primary, #2563eb)' : undefined }}
      >
        <Type size={18} />
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`rte-font-size-chevron ${isOpen ? 'rte-font-size-chevron--open' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="rte-font-size-dropdown" style={{ minWidth: '160px', padding: '4px' }} role="listbox" aria-label="Select text styles">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {features.bold !== false && (
              <button
                type="button"
                role="option"
                aria-selected={state.isBold}
                className={`rte-font-size-option ${state.isBold ? 'rte-font-size-option--active' : ''}`}
                onClick={() => handleToggle('bold')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px', padding: '4px 8px', height: 'auto', width: '100%' }}
              >
                <Bold size={16} />
                <span>Bold</span>
              </button>
            )}
            {features.italic !== false && (
              <button
                type="button"
                role="option"
                aria-selected={state.isItalic}
                className={`rte-font-size-option ${state.isItalic ? 'rte-font-size-option--active' : ''}`}
                onClick={() => handleToggle('italic')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px', padding: '4px 8px', height: 'auto', width: '100%' }}
              >
                <Italic size={16} />
                <span>Italic</span>
              </button>
            )}
            {features.underline !== false && (
              <button
                type="button"
                role="option"
                aria-selected={state.isUnderline}
                className={`rte-font-size-option ${state.isUnderline ? 'rte-font-size-option--active' : ''}`}
                onClick={() => handleToggle('underline')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px', padding: '4px 8px', height: 'auto', width: '100%' }}
              >
                <Underline size={16} />
                <span>Underline</span>
              </button>
            )}
            {features.strikethrough !== false && (
              <button
                type="button"
                role="option"
                aria-selected={state.isStrikethrough}
                className={`rte-font-size-option ${state.isStrikethrough ? 'rte-font-size-option--active' : ''}`}
                onClick={() => handleToggle('strikethrough')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px', padding: '4px 8px', height: 'auto', width: '100%' }}
              >
                <Strikethrough size={16} />
                <span>Strikethrough</span>
              </button>
            )}
            {features.inlineCode !== false && (
              <button
                type="button"
                role="option"
                aria-selected={state.isCode}
                className={`rte-font-size-option ${state.isCode ? 'rte-font-size-option--active' : ''}`}
                onClick={() => handleToggle('code')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px', padding: '4px 8px', height: 'auto', width: '100%' }}
              >
                <Code size={16} />
                <span>Inline Code</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(StyleSelector);
