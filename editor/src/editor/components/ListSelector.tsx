import React, { useState, useRef, useEffect, useCallback } from 'react';
import { List, ListOrdered, ListChecks } from 'lucide-react';
import type { BlockType, RichTextEditorFeatures } from '../types';

interface ListSelectorProps {
  currentBlockType: BlockType;
  onChange: (blockType: BlockType) => void;
  disabled?: boolean;
  features: RichTextEditorFeatures;
}

const LIST_TYPES: { value: BlockType; label: string; icon: React.FC<any> }[] = [
  { value: 'bullet', label: 'Bullet List', icon: List },
  { value: 'number', label: 'Numbered List', icon: ListOrdered },
  { value: 'check', label: 'Check List', icon: ListChecks },
];

const ListSelector: React.FC<ListSelectorProps> = ({
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
      // Toggle list type off if already selected
      if (currentBlockType === blockType) {
        onChange('paragraph');
      } else {
        onChange(blockType);
      }
      setIsOpen(false);
    },
    [currentBlockType, onChange],
  );

  // If a list is active, show its icon; otherwise default to Bullet List
  const isListActive = ['bullet', 'number', 'check'].includes(currentBlockType);
  const currentConfig = LIST_TYPES.find((a) => a.value === currentBlockType) || LIST_TYPES[0];
  const CurrentIcon = currentConfig.icon;

  const visibleListTypes = LIST_TYPES.filter((list) => {
    if (list.value === 'bullet' && features.bulletList === false) return false;
    if (list.value === 'number' && features.numberedList === false) return false;
    if (list.value === 'check' && features.checkList === false) return false;
    return true;
  });

  return (
    <div className="rte-font-size-selector" ref={containerRef}>
      <button
        type="button"
        className={`rte-font-size-trigger ${isListActive ? 'rte-toolbar-btn--active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        aria-label="Lists"
        aria-expanded={isOpen}
        title="Lists"
        style={{ minWidth: '40px', padding: '0 4px', border: isListActive ? '1px solid var(--color-primary, #2563eb)' : undefined }}
      >
        <CurrentIcon size={18} />
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
        <div className="rte-font-size-dropdown" style={{ minWidth: '140px', padding: '4px' }} role="listbox" aria-label="Select list type">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {visibleListTypes.map((list) => {
              const Icon = list.icon;
              return (
                <button
                  key={list.value}
                  type="button"
                  role="option"
                  aria-selected={currentBlockType === list.value}
                  className={`rte-font-size-option ${currentBlockType === list.value ? 'rte-font-size-option--active' : ''}`}
                  onClick={() => handleSelect(list.value)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px', padding: '4px 8px', height: 'auto', width: '100%' }}
                >
                  <Icon size={16} />
                  <span>{list.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(ListSelector);
