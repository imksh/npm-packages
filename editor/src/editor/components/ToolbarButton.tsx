import React from 'react';

interface ToolbarButtonProps {
  /** Click handler */
  onClick: () => void;
  /** Whether this button's feature is currently active */
  isActive?: boolean;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Accessible label */
  ariaLabel: string;
  /** Tooltip text (defaults to ariaLabel) */
  title?: string;
  /** Icon or text content */
  children: React.ReactNode;
  /** Additional CSS class */
  className?: string;
}

/**
 * A single memoized toolbar button with hover, active, and disabled states.
 */
const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  onClick,
  isActive = false,
  disabled = false,
  ariaLabel,
  title,
  children,
  className = '',
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-pressed={isActive}
      title={title ?? ariaLabel}
      className={[
        'rte-toolbar-btn',
        isActive ? 'rte-toolbar-btn--active' : '',
        disabled ? 'rte-toolbar-btn--disabled' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  );
};

export default React.memo(ToolbarButton);
