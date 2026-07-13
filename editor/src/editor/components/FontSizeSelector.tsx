import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FONT_SIZES } from '../types';

interface FontSizeSelectorProps {
  currentSize: string;
  onChange: (size: string) => void;
  disabled?: boolean;
}

/**
 * Font size dropdown selector with preset sizes and a custom input.
 */
const FontSizeSelector: React.FC<FontSizeSelectorProps> = ({
  currentSize,
  onChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Display size without 'px'
  const displaySize = currentSize ? currentSize.replace('px', '') : '16';

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
    (size: string) => {
      onChange(size);
      setIsOpen(false);
    },
    [onChange],
  );

  const handleCustomSubmit = useCallback(() => {
    const num = parseInt(customValue, 10);
    if (num >= 8 && num <= 144) {
      onChange(`${num}px`);
      setCustomValue('');
      setIsOpen(false);
    }
  }, [customValue, onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleCustomSubmit();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    },
    [handleCustomSubmit],
  );

  return (
    <div className="rte-font-size-selector" ref={containerRef}>
      <button
        type="button"
        className="rte-font-size-trigger"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        aria-label="Font size"
        aria-expanded={isOpen}
        title="Font size"
      >
        <span className="rte-font-size-value">{displaySize}</span>
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
        <div className="rte-font-size-dropdown" role="listbox" aria-label="Select font size">
          <div className="rte-font-size-custom">
            <input
              ref={inputRef}
              type="number"
              min={8}
              max={144}
              placeholder="Custom"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="rte-font-size-input"
              aria-label="Custom font size"
            />
            <span className="rte-font-size-unit">px</span>
          </div>
          <div className="rte-font-size-list">
            {FONT_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                role="option"
                aria-selected={currentSize === size}
                className={`rte-font-size-option ${currentSize === size ? 'rte-font-size-option--active' : ''}`}
                onClick={() => handleSelect(size)}
              >
                {size.replace('px', '')}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(FontSizeSelector);
