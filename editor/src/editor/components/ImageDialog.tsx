import React, { useState, useRef, useEffect, useCallback } from 'react';

interface ImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (src: string, alt?: string) => void;
  /** External image drawer callback */
  onOpenImageDrawer?: (callback: (url: string) => void) => void;
}

/**
 * Image insertion dialog.
 * Prefers onOpenImageDrawer when provided, otherwise shows URL input.
 */
const ImageDialog: React.FC<ImageDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onOpenImageDrawer,
}) => {
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const hasDrawer = typeof onOpenImageDrawer === 'function';

  useEffect(() => {
    if (isOpen) {
      setUrl('');
      setAlt('');
      setError('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!url.trim()) {
        setError('Image URL is required');
        return;
      }

      try {
        new URL(url);
      } catch {
        setError('Please enter a valid URL');
        return;
      }

      onSubmit(url.trim(), alt.trim() || undefined);
      onClose();
    },
    [url, alt, onSubmit, onClose],
  );

  // Don't render the dialog if not open
  if (!isOpen) return null;

  return (
    <div className="rte-dialog-overlay" onClick={onClose}>
      <div
        className="rte-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Insert image"
        aria-modal="true"
      >
        <div className="rte-dialog-header">
          <h3 className="rte-dialog-title">Insert Image</h3>
          <button type="button" className="rte-dialog-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="rte-dialog-body">
          <div className="rte-dialog-field">
            <label htmlFor="rte-image-url" className="rte-dialog-label">
              Image URL
            </label>
            <input
              ref={inputRef}
              id="rte-image-url"
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError('');
              }}
              placeholder="https://example.com/image.png"
              className={`rte-dialog-input ${error ? 'rte-dialog-input--error' : ''}`}
            />
            {error && <span className="rte-dialog-error">{error}</span>}
          </div>

          <div className="rte-dialog-field">
            <label htmlFor="rte-image-alt" className="rte-dialog-label">
              Alt text (optional)
            </label>
            <input
              id="rte-image-alt"
              type="text"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              placeholder="Image description"
              className="rte-dialog-input"
            />
          </div>

          <div className="rte-dialog-actions">
            {hasDrawer && (
              <button
                type="button"
                className="rte-dialog-btn rte-dialog-btn--secondary"
                onClick={() => {
                  onOpenImageDrawer!((imageUrl: string) => {
                    if (imageUrl) {
                      onSubmit(imageUrl, alt.trim() || undefined);
                      onClose();
                    }
                  });
                }}
              >
                Upload File
              </button>
            )}
            <div className="rte-dialog-actions-right">
              <button type="button" className="rte-dialog-btn rte-dialog-btn--secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="rte-dialog-btn rte-dialog-btn--primary">
                Insert
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default React.memo(ImageDialog);
