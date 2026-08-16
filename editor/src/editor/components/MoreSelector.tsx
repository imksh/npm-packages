import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  MoreHorizontal, Bold, Italic, Underline, Strikethrough, Code, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, ListChecks,
  Link2, Unlink, Image, Table, Minus
} from 'lucide-react';
import type { ToolbarState, ToolbarActions, RichTextEditorFeatures, BlockType } from '../types';

interface MoreSelectorProps {
  state: ToolbarState;
  actions: ToolbarActions;
  features: RichTextEditorFeatures;
  disabled?: boolean;
  onLinkClick: () => void;
  onImageClick: () => void;
  onTableClick: () => void;
  onHorizontalRuleClick: () => void;
  onBlockTypeChange: (type: BlockType) => void;
}

const MoreSelector: React.FC<MoreSelectorProps> = ({
  state,
  actions,
  features,
  disabled = false,
  onLinkClick,
  onImageClick,
  onTableClick,
  onHorizontalRuleClick,
  onBlockTypeChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const closeDropdown = useCallback(() => setIsOpen(false), []);

  const hasAnyStyle = state.isBold || state.isItalic || state.isUnderline || state.isStrikethrough || state.isCode;
  const isAlignActive = state.alignment !== 'left';
  const isListActive = state.blockType === 'bullet' || state.blockType === 'number' || state.blockType === 'check';

  const isActive = hasAnyStyle || isAlignActive || isListActive || state.isLink;

  return (
    <div className="rte-font-size-selector" ref={containerRef}>
      <button
        type="button"
        className={`rte-font-size-trigger ${isActive ? 'rte-toolbar-btn--active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        aria-label="More options"
        aria-expanded={isOpen}
        title="More options"
        style={{ minWidth: '40px', padding: '0 4px', border: isActive ? '1px solid var(--color-primary, #2563eb)' : undefined }}
      >
        <MoreHorizontal size={18} />
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`rte-font-size-chevron ${isOpen ? 'rte-font-size-chevron--open' : ''}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="rte-font-size-dropdown" style={{ minWidth: '180px', padding: '8px', right: 0, left: 'auto' }} role="menu">
          
          {/* Text Styles */}
          {(features.bold !== false || features.italic !== false || features.underline !== false || features.strikethrough !== false || features.inlineCode !== false) && (
            <div style={{ display: 'flex', gap: '4px', paddingBottom: '8px', marginBottom: '8px', borderBottom: '1px solid var(--color-base-300)' }}>
              {features.bold !== false && (
                <button type="button" className={`rte-toolbar-btn ${state.isBold ? 'rte-toolbar-btn--active' : ''}`} onClick={() => actions.formatText('bold')} title="Bold">
                  <Bold size={16} />
                </button>
              )}
              {features.italic !== false && (
                <button type="button" className={`rte-toolbar-btn ${state.isItalic ? 'rte-toolbar-btn--active' : ''}`} onClick={() => actions.formatText('italic')} title="Italic">
                  <Italic size={16} />
                </button>
              )}
              {features.underline !== false && (
                <button type="button" className={`rte-toolbar-btn ${state.isUnderline ? 'rte-toolbar-btn--active' : ''}`} onClick={() => actions.formatText('underline')} title="Underline">
                  <Underline size={16} />
                </button>
              )}
              {features.strikethrough !== false && (
                <button type="button" className={`rte-toolbar-btn ${state.isStrikethrough ? 'rte-toolbar-btn--active' : ''}`} onClick={() => actions.formatText('strikethrough')} title="Strikethrough">
                  <Strikethrough size={16} />
                </button>
              )}
              {features.inlineCode !== false && (
                <button type="button" className={`rte-toolbar-btn ${state.isCode ? 'rte-toolbar-btn--active' : ''}`} onClick={() => actions.formatText('code')} title="Inline Code">
                  <Code size={16} />
                </button>
              )}
            </div>
          )}

          {/* Alignment */}
          {features.alignment !== false && (
            <div style={{ display: 'flex', gap: '4px', paddingBottom: '8px', marginBottom: '8px', borderBottom: '1px solid var(--color-base-300)' }}>
              <button type="button" className={`rte-toolbar-btn ${state.alignment === 'left' ? 'rte-toolbar-btn--active' : ''}`} onClick={() => { actions.setAlignment('left'); closeDropdown(); }} title="Align Left">
                <AlignLeft size={16} />
              </button>
              <button type="button" className={`rte-toolbar-btn ${state.alignment === 'center' ? 'rte-toolbar-btn--active' : ''}`} onClick={() => { actions.setAlignment('center'); closeDropdown(); }} title="Align Center">
                <AlignCenter size={16} />
              </button>
              <button type="button" className={`rte-toolbar-btn ${state.alignment === 'right' ? 'rte-toolbar-btn--active' : ''}`} onClick={() => { actions.setAlignment('right'); closeDropdown(); }} title="Align Right">
                <AlignRight size={16} />
              </button>
              <button type="button" className={`rte-toolbar-btn ${state.alignment === 'justify' ? 'rte-toolbar-btn--active' : ''}`} onClick={() => { actions.setAlignment('justify'); closeDropdown(); }} title="Justify">
                <AlignJustify size={16} />
              </button>
            </div>
          )}

          {/* Lists */}
          {(features.bulletList !== false || features.numberedList !== false || features.checkList !== false) && (
            <div style={{ display: 'flex', gap: '4px', paddingBottom: '8px', marginBottom: '8px', borderBottom: '1px solid var(--color-base-300)' }}>
              {features.bulletList !== false && (
                <button type="button" className={`rte-toolbar-btn ${state.blockType === 'bullet' ? 'rte-toolbar-btn--active' : ''}`} onClick={() => { onBlockTypeChange('bullet'); closeDropdown(); }} title="Bullet List">
                  <List size={16} />
                </button>
              )}
              {features.numberedList !== false && (
                <button type="button" className={`rte-toolbar-btn ${state.blockType === 'number' ? 'rte-toolbar-btn--active' : ''}`} onClick={() => { onBlockTypeChange('number'); closeDropdown(); }} title="Numbered List">
                  <ListOrdered size={16} />
                </button>
              )}
              {features.checkList !== false && (
                <button type="button" className={`rte-toolbar-btn ${state.blockType === 'check' ? 'rte-toolbar-btn--active' : ''}`} onClick={() => { onBlockTypeChange('check'); closeDropdown(); }} title="Checklist">
                  <ListChecks size={16} />
                </button>
              )}
            </div>
          )}

          {/* Insert */}
          {(features.link !== false || features.image !== false || features.table !== false || features.horizontalRule !== false) && (
            <div style={{ display: 'flex', gap: '4px' }}>
              {features.link !== false && (
                <button type="button" className={`rte-toolbar-btn ${state.isLink ? 'rte-toolbar-btn--active' : ''}`} onClick={() => { onLinkClick(); closeDropdown(); }} title="Link">
                  {state.isLink ? <Unlink size={16} /> : <Link2 size={16} />}
                </button>
              )}
              {features.image !== false && (
                <button type="button" className="rte-toolbar-btn" onClick={() => { onImageClick(); closeDropdown(); }} title="Image">
                  <Image size={16} />
                </button>
              )}
              {features.table !== false && (
                <button type="button" className="rte-toolbar-btn" onClick={() => { onTableClick(); closeDropdown(); }} title="Table">
                  <Table size={16} />
                </button>
              )}
              {features.horizontalRule !== false && (
                <button type="button" className="rte-toolbar-btn" onClick={() => { onHorizontalRuleClick(); closeDropdown(); }} title="Divider">
                  <Minus size={16} />
                </button>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default MoreSelector;
