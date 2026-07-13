import React, { useState, useRef, useEffect, useCallback } from 'react';

interface LinkDialogProps {
  /** Whether the dialog is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Submit handler */
  onSubmit: (url: string, text?: string) => void;
  /** Remove link handler */
  onRemove?: () => void;
  /** Pre-filled URL for editing */
  initialUrl?: string;
  /** Pre-filled text for editing */
  initialText?: string;
  /** Whether this is editing an existing link */
  isEditing?: boolean;
}

/**
 * Modal dialog for inserting or editing a link.
 */
const LinkDialog: React.FC<LinkDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onRemove,
  initialUrl = '',
  initialText = '',
  isEditing = false,
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [text, setText] = useState(initialText);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUrl(initialUrl);
      setText(initialText);
      setError('');
      // Focus after render
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, initialUrl, initialText]);

  const validateUrl = useCallback((value: string): boolean => {
    if (!value.trim()) {
      setError('URL is required');
      return false;
    }
    try {
      // Allow relative URLs and URLs with protocol
      if (value.startsWith('/') || value.startsWith('#') || value.startsWith('mailto:')) {
        return true;
      }
      const urlToTest = value.match(/^https?:\/\//) ? value : `https://${value}`;
      new URL(urlToTest);
      setError('');
      return true;
    } catch {
      setError('Please enter a valid URL');
      return false;
    }
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!validateUrl(url)) return;

      let finalUrl = url.trim();
      // Add protocol if missing
      if (
        !finalUrl.startsWith('http://') &&
        !finalUrl.startsWith('https://') &&
        !finalUrl.startsWith('/') &&
        !finalUrl.startsWith('#') &&
        !finalUrl.startsWith('mailto:')
      ) {
        finalUrl = `https://${finalUrl}`;
      }

      onSubmit(finalUrl, text.trim() || undefined);
      onClose();
    },
    [url, text, validateUrl, onSubmit, onClose],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  if (!isOpen) return null;

  return (
    <div className="rte-dialog-overlay" onClick={onClose} onKeyDown={handleKeyDown}>
      <div
        className="rte-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label={isEditing ? 'Edit link' : 'Insert link'}
        aria-modal="true"
      >
        <div className="rte-dialog-header">
          <h3 className="rte-dialog-title">{isEditing ? 'Edit Link' : 'Insert Link'}</h3>
          <button
            type="button"
            className="rte-dialog-close"
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="rte-dialog-body">
          <div className="rte-dialog-field">
            <label htmlFor="rte-link-url" className="rte-dialog-label">
              URL
            </label>
            <input
              ref={inputRef}
              id="rte-link-url"
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError('');
              }}
              placeholder="https://example.com"
              className={`rte-dialog-input ${error ? 'rte-dialog-input--error' : ''}`}
              autoComplete="url"
            />
            {error && <span className="rte-dialog-error">{error}</span>}
          </div>

          {!isEditing && (
            <div className="rte-dialog-field">
              <label htmlFor="rte-link-text" className="rte-dialog-label">
                Text (optional)
              </label>
              <input
                id="rte-link-text"
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Display text"
                className="rte-dialog-input"
              />
            </div>
          )}

          <div className="rte-dialog-actions">
            {isEditing && onRemove && (
              <button
                type="button"
                className="rte-dialog-btn rte-dialog-btn--danger"
                onClick={() => {
                  onRemove();
                  onClose();
                }}
              >
                Remove Link
              </button>
            )}
            <div className="rte-dialog-actions-right">
              <button type="button" className="rte-dialog-btn rte-dialog-btn--secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="rte-dialog-btn rte-dialog-btn--primary">
                {isEditing ? 'Update' : 'Insert'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(LinkDialog);
