import React from 'react';

/**
 * Vertical divider between toolbar button groups.
 */
const Divider: React.FC = () => {
  return <div className="rte-toolbar-divider" role="separator" aria-orientation="vertical" />;
};

export default React.memo(Divider);
