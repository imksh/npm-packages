import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

interface ImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (src: string, alt?: string) => void;
  /** External image drawer callback */
  onOpenImageDrawer?: (callback: (url: string) => void) => void;
  /** Image upload callback */
  onImageUpload?: (file: File) => Promise<string>;
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
  onImageUpload,
}) => {
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasDrawer = typeof onOpenImageDrawer === 'function';
  const hasUpload = typeof onImageUpload === 'function';

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

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImageUpload) return;
    
    setIsUploading(true);
    setError('');
    try {
      const uploadedUrl = await onImageUpload(file);
      onSubmit(uploadedUrl, alt.trim() || undefined);
      onClose();
    } catch (err) {
      setError('Failed to upload image');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [onImageUpload, onSubmit, alt, onClose]);

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
              disabled={isUploading}
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
              disabled={isUploading}
            />
          </div>

          <div className="rte-dialog-actions">
            {hasUpload && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
                <button
                  type="button"
                  className="rte-dialog-btn rte-dialog-btn--secondary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 size={16} className="rte-spin" style={{ marginRight: '6px' }} />
                      Uploading...
                    </>
                  ) : (
                    'Upload from Device'
                  )}
                </button>
              </>
            )}
            {hasDrawer && !hasUpload && (
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
                Open Drawer
              </button>
            )}
            <div className="rte-dialog-actions-right">
              <button type="button" className="rte-dialog-btn rte-dialog-btn--secondary" onClick={onClose} disabled={isUploading}>
                Cancel
              </button>
              <button type="submit" className="rte-dialog-btn rte-dialog-btn--primary" disabled={isUploading}>
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
