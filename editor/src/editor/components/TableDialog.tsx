import React, { useState, useRef, useEffect, useCallback } from 'react';

interface TableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rows: number, columns: number) => void;
}

/**
 * Table creation dialog with visual grid picker.
 */
const TableDialog: React.FC<TableDialogProps> = ({ isOpen, onClose, onSubmit }) => {
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);
  const [hoverRow, setHoverRow] = useState(0);
  const [hoverCol, setHoverCol] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const MAX_ROWS = 8;
  const MAX_COLS = 8;

  useEffect(() => {
    if (isOpen) {
      setRows(3);
      setColumns(3);
      setHoverRow(0);
      setHoverCol(0);
    }
  }, [isOpen]);

  const handleCellHover = useCallback((r: number, c: number) => {
    setHoverRow(r);
    setHoverCol(c);
  }, []);

  const handleCellClick = useCallback(
    (r: number, c: number) => {
      onSubmit(r, c);
      onClose();
    },
    [onSubmit, onClose],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (rows >= 1 && rows <= 20 && columns >= 1 && columns <= 20) {
        onSubmit(rows, columns);
        onClose();
      }
    },
    [rows, columns, onSubmit, onClose],
  );

  if (!isOpen) return null;

  return (
    <div className="rte-dialog-overlay" onClick={onClose}>
      <div
        className="rte-dialog rte-dialog--table"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Insert table"
        aria-modal="true"
        ref={containerRef}
      >
        <div className="rte-dialog-header">
          <h3 className="rte-dialog-title">Insert Table</h3>
          <button type="button" className="rte-dialog-close" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="rte-dialog-body">
          {/* Visual grid picker */}
          <div className="rte-table-grid" role="grid" aria-label="Table size picker">
            {Array.from({ length: MAX_ROWS }, (_, ri) => (
              <div key={ri} className="rte-table-grid-row" role="row">
                {Array.from({ length: MAX_COLS }, (_, ci) => {
                  const r = ri + 1;
                  const c = ci + 1;
                  const isHighlighted = r <= hoverRow && c <= hoverCol;
                  return (
                    <button
                      key={ci}
                      type="button"
                      role="gridcell"
                      className={`rte-table-grid-cell ${isHighlighted ? 'rte-table-grid-cell--highlighted' : ''}`}
                      onMouseEnter={() => handleCellHover(r, c)}
                      onClick={() => handleCellClick(r, c)}
                      aria-label={`${r} × ${c} table`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div className="rte-table-grid-label">
            {hoverRow > 0 && hoverCol > 0
              ? `${hoverRow} × ${hoverCol}`
              : 'Hover to select size'}
          </div>

          {/* Manual input */}
          <form onSubmit={handleSubmit} className="rte-table-manual">
            <div className="rte-table-manual-row">
              <label htmlFor="rte-table-rows" className="rte-dialog-label">
                Rows
              </label>
              <input
                id="rte-table-rows"
                type="number"
                min={1}
                max={20}
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value, 10) || 1)}
                className="rte-dialog-input rte-dialog-input--small"
              />
            </div>
            <div className="rte-table-manual-row">
              <label htmlFor="rte-table-cols" className="rte-dialog-label">
                Columns
              </label>
              <input
                id="rte-table-cols"
                type="number"
                min={1}
                max={20}
                value={columns}
                onChange={(e) => setColumns(parseInt(e.target.value, 10) || 1)}
                className="rte-dialog-input rte-dialog-input--small"
              />
            </div>
            <button type="submit" className="rte-dialog-btn rte-dialog-btn--primary rte-table-manual-btn">
              Insert
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TableDialog);
