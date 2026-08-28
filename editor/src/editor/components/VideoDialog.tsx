import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

interface VideoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (src: string, options: { autoplay: boolean; loop: boolean; muted: boolean; controls: boolean }) => void;
  /** External video drawer callback */
  onOpenVideoDrawer?: (callback: (url: string) => void) => void;
  /** Video upload callback */
  onVideoUpload?: (file: File) => Promise<string>;
}

/**
 * Video insertion dialog.
 */
const VideoDialog: React.FC<VideoDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onOpenVideoDrawer,
  onVideoUpload,
}) => {
  const [url, setUrl] = useState('');
  const [autoplay, setAutoplay] = useState(false);
  const [loop, setLoop] = useState(false);
  const [muted, setMuted] = useState(false);
  const [controls, setControls] = useState(true);
  
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const hasDrawer = typeof onOpenVideoDrawer === 'function';
  const hasUpload = typeof onVideoUpload === 'function';

  useEffect(() => {
    if (isOpen) {
      setUrl('');
      setAutoplay(false);
      setLoop(false);
      setMuted(false);
      setControls(true);
      setError('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!url.trim()) {
        setError('Video URL is required');
        return;
      }

      try {
        new URL(url);
      } catch {
        setError('Please enter a valid URL');
        return;
      }

      onSubmit(url.trim(), { autoplay, loop, muted, controls });
      onClose();
    },
    [url, autoplay, loop, muted, controls, onSubmit, onClose],
  );

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onVideoUpload) return;
    
    setIsUploading(true);
    setError('');
    try {
      const uploadedUrl = await onVideoUpload(file);
      onSubmit(uploadedUrl, { autoplay, loop, muted, controls });
      onClose();
    } catch (err) {
      setError('Failed to upload video');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [onVideoUpload, onSubmit, autoplay, loop, muted, controls, onClose]);

  if (!isOpen) return null;

  return (
    <div className="rte-dialog-overlay" onClick={onClose}>
      <div
        className="rte-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Insert video"
        aria-modal="true"
      >
        <div className="rte-dialog-header">
          <h3 className="rte-dialog-title">Insert Video</h3>
          <button type="button" className="rte-dialog-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="rte-dialog-body">
          <div className="rte-dialog-field">
            <label htmlFor="rte-video-url" className="rte-dialog-label">
              Video URL
            </label>
            <input
              ref={inputRef}
              id="rte-video-url"
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError('');
              }}
              placeholder="https://example.com/video.mp4"
              className={`rte-dialog-input ${error ? 'rte-dialog-input--error' : ''}`}
              disabled={isUploading}
            />
            {error && <span className="rte-dialog-error">{error}</span>}
          </div>

          <div className="rte-dialog-field" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: isUploading ? 'not-allowed' : 'pointer', fontSize: '14px', opacity: isUploading ? 0.5 : 1 }}>
              <input type="checkbox" checked={controls} onChange={(e) => setControls(e.target.checked)} disabled={isUploading} />
              Controls
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: isUploading ? 'not-allowed' : 'pointer', fontSize: '14px', opacity: isUploading ? 0.5 : 1 }}>
              <input type="checkbox" checked={autoplay} onChange={(e) => setAutoplay(e.target.checked)} disabled={isUploading} />
              Autoplay
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: isUploading ? 'not-allowed' : 'pointer', fontSize: '14px', opacity: isUploading ? 0.5 : 1 }}>
              <input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} disabled={isUploading} />
              Loop
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: isUploading ? 'not-allowed' : 'pointer', fontSize: '14px', opacity: isUploading ? 0.5 : 1 }}>
              <input type="checkbox" checked={muted} onChange={(e) => setMuted(e.target.checked)} disabled={isUploading} />
              Muted
            </label>
          </div>

          <div className="rte-dialog-actions">
            {hasUpload && (
              <>
                <input
                  type="file"
                  accept="video/*"
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
                  onOpenVideoDrawer!((videoUrl: string) => {
                    if (videoUrl) {
                      onSubmit(videoUrl, { autoplay, loop, muted, controls });
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

export default React.memo(VideoDialog);
