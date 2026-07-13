import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Type, Heading1, Heading2, Heading3, TextQuote, CodeXml, List, ListOrdered, ListChecks } from 'lucide-react';
import type { BlockType, RichTextEditorFeatures } from '../types';

interface BlockTypeSelectorProps {
  currentBlockType: BlockType;
  onChange: (blockType: BlockType) => void;
  disabled?: boolean;
  features: RichTextEditorFeatures;
}

const BLOCK_TYPES: { value: BlockType; label: string; icon: React.FC<any> }[] = [
  { value: 'paragraph', label: 'Text', icon: Type },
  { value: 'h1', label: 'Heading 1', icon: Heading1 },
  { value: 'h2', label: 'Heading 2', icon: Heading2 },
  { value: 'h3', label: 'Heading 3', icon: Heading3 },
  { value: 'quote', label: 'Quote', icon: TextQuote },
  { value: 'code', label: 'Code', icon: CodeXml },
];

const BlockTypeSelector: React.FC<BlockTypeSelectorProps> = ({
  currentBlockType,
  onChange,
  disabled = false,
  features,
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

  const handleSelect = useCallback(
    (blockType: BlockType) => {
      // If already this type, toggle back to paragraph
      if (currentBlockType === blockType && blockType !== 'paragraph') {
        onChange('paragraph');
      } else {
        onChange(blockType);
      }
      setIsOpen(false);
    },
    [currentBlockType, onChange],
  );

  // Default to paragraph if block type is not in our list
  const currentConfig = BLOCK_TYPES.find((a) => a.value === currentBlockType) || BLOCK_TYPES[0];
  const CurrentIcon = currentConfig.icon;

  const visibleBlockTypes = BLOCK_TYPES.filter(block => {
    if (block.value === 'quote' && features.blockquote === false) return false;
    if (block.value === 'code' && features.codeBlock === false) return false;
    if ((block.value === 'h1' || block.value === 'h2' || block.value === 'h3') && features.headings === false) return false;
    return true;
  });

  return (
    <div className="rte-font-size-selector" ref={containerRef}>
      <button
        type="button"
        className="rte-font-size-trigger"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        aria-label="Text Type"
        aria-expanded={isOpen}
        title="Text Type"
        style={{ minWidth: '120px', padding: '0 8px', justifyContent: 'space-between' }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CurrentIcon size={16} />
          <span style={{ fontSize: '13px', fontWeight: 500 }}>{currentConfig.label}</span>
        </span>
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
        <div className="rte-font-size-dropdown" style={{ minWidth: '160px', padding: '4px' }} role="listbox" aria-label="Select block type">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {visibleBlockTypes.map((block) => {
              const Icon = block.icon;
              return (
                <button
                  key={block.value}
                  type="button"
                  role="option"
                  aria-selected={currentBlockType === block.value}
                  className={`rte-font-size-option ${currentBlockType === block.value ? 'rte-font-size-option--active' : ''}`}
                  onClick={() => handleSelect(block.value)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px', padding: '6px 8px', height: 'auto', width: '100%' }}
                >
                  <Icon size={16} />
                  <span>{block.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(BlockTypeSelector);
