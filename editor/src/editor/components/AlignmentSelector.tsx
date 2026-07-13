import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import type { ElementFormatType } from 'lexical';

interface AlignmentSelectorProps {
  currentAlignment: ElementFormatType;
  onChange: (alignment: ElementFormatType) => void;
  disabled?: boolean;
}

const ALIGNMENTS: { value: ElementFormatType; label: string; icon: React.FC<any> }[] = [
  { value: 'left', label: 'Left Align', icon: AlignLeft },
  { value: 'center', label: 'Center Align', icon: AlignCenter },
  { value: 'right', label: 'Right Align', icon: AlignRight },
  { value: 'justify', label: 'Justify Align', icon: AlignJustify },
];

const AlignmentSelector: React.FC<AlignmentSelectorProps> = ({
  currentAlignment,
  onChange,
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

  const handleSelect = useCallback(
    (alignment: ElementFormatType) => {
      onChange(alignment);
      setIsOpen(false);
    },
    [onChange],
  );

  // Find current alignment config, default to left
  const currentConfig = ALIGNMENTS.find((a) => a.value === currentAlignment) || ALIGNMENTS[0];
  const CurrentIcon = currentConfig.icon;

  return (
    <div className="rte-font-size-selector" ref={containerRef}>
      <button
        type="button"
        className="rte-font-size-trigger"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        aria-label="Text Alignment"
        aria-expanded={isOpen}
        title="Text Alignment"
        style={{ minWidth: '40px', padding: '0 4px' }}
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
        <div className="rte-font-size-dropdown" style={{ minWidth: '140px', padding: '4px' }} role="listbox" aria-label="Select alignment">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {ALIGNMENTS.map((alignment) => {
              const Icon = alignment.icon;
              return (
                <button
                  key={alignment.value}
                  type="button"
                  role="option"
                  aria-selected={currentAlignment === alignment.value}
                  className={`rte-font-size-option ${currentAlignment === alignment.value ? 'rte-font-size-option--active' : ''}`}
                  onClick={() => handleSelect(alignment.value)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px', padding: '4px 8px', height: 'auto', width: '100%' }}
                >
                  <Icon size={16} />
                  <span>{alignment.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(AlignmentSelector);
