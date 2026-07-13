import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TEXT_COLORS, BG_COLORS, type ColorPreset } from '../types';

interface ColorPickerProps {
  /** 'text' for font color, 'background' for highlight */
  mode: 'text' | 'background';
  /** Currently applied color */
  currentColor: string;
  /** Color change handler */
  onChange: (color: string) => void;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * Color picker popover with a curated palette grid and reset option.
 */
const ColorPicker: React.FC<ColorPickerProps> = ({
  mode,
  currentColor,
  onChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const colors = mode === 'text' ? TEXT_COLORS : BG_COLORS;
  const label = mode === 'text' ? 'Text color' : 'Highlight';

  // Close on outside click
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
    (color: string) => {
      onChange(color);
      setIsOpen(false);
    },
    [onChange],
  );

  return (
    <div className="rte-color-picker" ref={containerRef}>
      <button
        type="button"
        className="rte-toolbar-btn rte-color-trigger"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        aria-label={label}
        aria-expanded={isOpen}
        title={label}
      >
        {mode === 'text' ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" /><circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" /><circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
            <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 11-6 6v3h9l3-3" /><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" />
          </svg>
        )}
        <span
          className="rte-color-indicator"
          style={{
            backgroundColor: currentColor || (mode === 'text' ? 'var(--color-base-content, #111827)' : 'transparent'),
          }}
        />
      </button>

      {isOpen && (
        <div className="rte-color-dropdown" role="listbox" aria-label={label}>
          <div className="rte-color-grid">
            {colors.map((preset: ColorPreset) => (
              <button
                key={preset.name}
                type="button"
                role="option"
                aria-selected={currentColor === preset.value}
                className={`rte-color-swatch ${currentColor === preset.value ? 'rte-color-swatch--active' : ''}`}
                style={{
                  backgroundColor: preset.value || (mode === 'text' ? 'var(--color-base-content, #111827)' : 'var(--color-base-100, #ffffff)'),
                }}
                onClick={() => handleSelect(preset.value)}
                title={preset.name}
                aria-label={preset.name}
              >
                {preset.value === '' && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(ColorPicker);
