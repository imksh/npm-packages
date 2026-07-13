import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Settings2, Undo2, Redo2, Maximize, Minimize } from 'lucide-react';
import type { RichTextEditorFeatures } from '../types';

interface ActionsSelectorProps {
  onUndo: () => void;
  onRedo: () => void;
  onToggleFullscreen?: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isFullscreen: boolean;
  features: RichTextEditorFeatures;
  disabled?: boolean;
}

const ActionsSelector: React.FC<ActionsSelectorProps> = ({
  onUndo,
  onRedo,
  onToggleFullscreen,
  canUndo,
  canRedo,
  isFullscreen,
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
        aria-label="Actions"
        aria-expanded={isOpen}
        title="Actions"
        style={{ minWidth: '40px', padding: '0 4px' }}
      >
        <Settings2 size={18} />
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
        <div className="rte-font-size-dropdown" style={{ minWidth: '160px', padding: '4px', right: 0, left: 'auto' }} role="listbox" aria-label="Editor actions">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {features.undoRedo !== false && (
              <>
                <button
                  type="button"
                  role="option"
                  className="rte-font-size-option"
                  onClick={() => handleAction(onUndo)}
                  disabled={!canUndo}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px', padding: '4px 8px', height: 'auto', width: '100%', opacity: canUndo ? 1 : 0.5, cursor: canUndo ? 'pointer' : 'not-allowed' }}
                >
                  <Undo2 size={16} />
                  <span>Undo</span>
                </button>
                <button
                  type="button"
                  role="option"
                  className="rte-font-size-option"
                  onClick={() => handleAction(onRedo)}
                  disabled={!canRedo}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px', padding: '4px 8px', height: 'auto', width: '100%', opacity: canRedo ? 1 : 0.5, cursor: canRedo ? 'pointer' : 'not-allowed' }}
                >
                  <Redo2 size={16} />
                  <span>Redo</span>
                </button>
              </>
            )}
            {onToggleFullscreen && (
              <button
                type="button"
                role="option"
                className="rte-font-size-option"
                onClick={() => handleAction(onToggleFullscreen)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px', padding: '4px 8px', height: 'auto', width: '100%' }}
              >
                {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(ActionsSelector);
