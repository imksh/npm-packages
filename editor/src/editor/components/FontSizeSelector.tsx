import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Check } from 'lucide-react';
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
  const customValueRef = useRef('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const savedRangeRef = useRef<Range | null>(null);

  // Keep customValueRef in sync
  useEffect(() => {
    customValueRef.current = customValue;
  }, [customValue]);

  // Display size without 'px'
  const displaySize = currentSize ? currentSize.replace('px', '') : '16';

  const clearHighlight = useCallback(() => {
    savedRangeRef.current = null;
    if (typeof Highlight !== 'undefined' && CSS.highlights) {
      try {
        CSS.highlights.delete('rte-selection-highlight');
      } catch {
        // ignore if not supported
      }
    }
  }, []);

  const saveDOMRange = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (!range.collapsed) {
        savedRangeRef.current = range.cloneRange();
        if (typeof Highlight !== 'undefined' && CSS.highlights) {
          try {
            const highlight = new Highlight(savedRangeRef.current);
            CSS.highlights.set('rte-selection-highlight', highlight);
          } catch {
            // ignore if not supported
          }
        }
      }
    }
  }, []);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        saveDOMRange();
        setCustomValue(displaySize);
      } else {
        clearHighlight();
      }
      return next;
    });
  }, [displaySize, saveDOMRange, clearHighlight]);

  const handleSelect = useCallback(
    (size: string) => {
      clearHighlight();
      onChange(size);
      setIsOpen(false);
    },
    [onChange, clearHighlight],
  );

  const handleCustomSubmit = useCallback(() => {
    const num = parseInt(customValueRef.current, 10);
    if (!isNaN(num) && num >= 8 && num <= 144) {
      clearHighlight();
      onChange(`${num}px`);
      setCustomValue('');
      setIsOpen(false);
    }
  }, [onChange, clearHighlight]);

  // Close dropdown on outside click, and apply valid custom size if user entered one
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        const num = parseInt(customValueRef.current, 10);
        if (!isNaN(num) && num >= 8 && num <= 144 && `${num}px` !== currentSize) {
          onChange(`${num}px`);
        }
        clearHighlight();
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onChange, clearHighlight, currentSize]);

  // Clean up selection highlight on unmount
  useEffect(() => {
    return () => {
      clearHighlight();
    };
  }, [clearHighlight]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        handleCustomSubmit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        clearHighlight();
        setIsOpen(false);
      }
    },
    [handleCustomSubmit, clearHighlight],
  );

  return (
    <div className="rte-font-size-selector" ref={containerRef}>
      <button
        type="button"
        className="rte-font-size-trigger"
        onMouseDown={(e) => {
          saveDOMRange();
          e.preventDefault();
        }}
        onClick={toggleOpen}
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
              onFocus={saveDOMRange}
              onChange={(e) => setCustomValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="rte-font-size-input"
              aria-label="Custom font size"
            />
            <span className="rte-font-size-unit">px</span>
            <button
              type="button"
              className="rte-font-size-apply-btn"
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleCustomSubmit}
              title="Apply font size"
              aria-label="Apply font size"
              disabled={!customValue || isNaN(parseInt(customValue, 10))}
            >
              <Check size={14} />
            </button>
          </div>
          <div className="rte-font-size-list">
            {FONT_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                role="option"
                aria-selected={currentSize === size}
                className={`rte-font-size-option ${currentSize === size ? 'rte-font-size-option--active' : ''}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
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
