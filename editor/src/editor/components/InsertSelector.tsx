import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Plus, Link2, Unlink, Image, Table, Minus } from 'lucide-react';
import type { RichTextEditorFeatures } from '../types';

interface InsertSelectorProps {
  onLinkClick: () => void;
  onImageClick: () => void;
  onTableClick: () => void;
  onHorizontalRuleClick: () => void;
  isLink: boolean;
  features: RichTextEditorFeatures;
  disabled?: boolean;
}

const InsertSelector: React.FC<InsertSelectorProps> = ({
  onLinkClick,
  onImageClick,
  onTableClick,
  onHorizontalRuleClick,
  isLink,
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

  const handleAction = useCallback(
    (action: () => void) => {
      action();
      setIsOpen(false);
    },
    [],
  );

  return (
    <div className="rte-font-size-selector" ref={containerRef}>
      <button
        type="button"
        className="rte-font-size-trigger"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        aria-label="Insert"
        aria-expanded={isOpen}
        title="Insert"
        style={{ minWidth: '40px', padding: '0 4px' }}
      >
        <Plus size={18} />
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
        <div className="rte-font-size-dropdown" style={{ minWidth: '160px', padding: '4px' }} role="listbox" aria-label="Insert elements">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {features.link !== false && (
              <button
                type="button"
                role="option"
                className={`rte-font-size-option ${isLink ? 'rte-font-size-option--active' : ''}`}
                onClick={() => handleAction(onLinkClick)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px', padding: '4px 8px', height: 'auto', width: '100%' }}
              >
                {isLink ? <Unlink size={16} /> : <Link2 size={16} />}
                <span>{isLink ? 'Remove Link' : 'Insert Link'}</span>
              </button>
            )}
            {features.image !== false && (
              <button
                type="button"
                role="option"
                className="rte-font-size-option"
                onClick={() => handleAction(onImageClick)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px', padding: '4px 8px', height: 'auto', width: '100%' }}
              >
                <Image size={16} />
                <span>Insert Image</span>
              </button>
            )}
            {features.table !== false && (
              <button
                type="button"
                role="option"
                className="rte-font-size-option"
                onClick={() => handleAction(onTableClick)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px', padding: '4px 8px', height: 'auto', width: '100%' }}
              >
                <Table size={16} />
                <span>Insert Table</span>
              </button>
            )}
            {features.horizontalRule !== false && (
              <button
                type="button"
                role="option"
                className="rte-font-size-option"
                onClick={() => handleAction(onHorizontalRuleClick)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px', padding: '4px 8px', height: 'auto', width: '100%' }}
              >
                <Minus size={16} />
                <span>Horizontal Divider</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(InsertSelector);
