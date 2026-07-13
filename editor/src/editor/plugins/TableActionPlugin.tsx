import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
  $getNodeByKey,
  $isNodeSelection,
} from 'lexical';
import {
  $isTableCellNode,
  $isTableNode,
  TableCellNode,
  TableNode,
  TableRowNode,
  $isTableRowNode,
} from '@lexical/table';
import { $findMatchingParent, mergeRegister } from '@lexical/utils';
import {
  AlignLeft, AlignCenter, AlignRight,
  ArrowUpToLine, ArrowDownToLine, ArrowLeftToLine, ArrowRightToLine,
  Trash2, Table as TableIcon, Grid3X3
} from 'lucide-react';

/**
 * Floating table action toolbar.
 * Appears at the top-left of the selected table.
 */
export default function TableActionPlugin(): React.ReactElement | null {
  const [editor] = useLexicalComposerContext();
  const [activeTableKey, setActiveTableKey] = useState<string | null>(null);
  const [tableCellNodeKey, setTableCellNodeKey] = useState<string | null>(null);
  const [position, setPosition] = useState({ top: -10000, left: -10000 });
  const toolbarRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!activeTableKey) return;
    const domElement = editor.getElementByKey(activeTableKey);
    if (!domElement) return;

    const rect = domElement.getBoundingClientRect();
    setPosition({
      top: rect.top - 40, // Above the table
      left: rect.right,
    });
  }, [editor, activeTableKey]);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          editor.getEditorState().read(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection) && !$isNodeSelection(selection)) {
              setActiveTableKey(null);
              setTableCellNodeKey(null);
              return;
            }

            const nodes = selection.getNodes();
            const firstNode = nodes[0];
            const cellNode = $findMatchingParent(firstNode, $isTableCellNode);

            if (cellNode && $isTableCellNode(cellNode)) {
              setTableCellNodeKey(cellNode.getKey());
              const tableNode = $findMatchingParent(cellNode, $isTableNode);
              if (tableNode && $isTableNode(tableNode)) {
                setActiveTableKey(tableNode.getKey());
                updatePosition();
              }
            } else {
              setActiveTableKey(null);
              setTableCellNodeKey(null);
            }
          });
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          if (activeTableKey) {
            const node = $getNodeByKey(activeTableKey);
            if (!$isTableNode(node)) {
              setActiveTableKey(null);
            }
            updatePosition();
          }
        });
      }),
    );
  }, [editor, activeTableKey, updatePosition]);

  // Handle scrolling to reposition
  useEffect(() => {
    if (activeTableKey) {
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [activeTableKey, updatePosition]);

  const addRow = useCallback(
    (after: boolean) => {
      editor.update(() => {
        if (!tableCellNodeKey) return;
        const cell = $getNodeByKey(tableCellNodeKey);
        if (!$isTableCellNode(cell)) return;
        const row = $findMatchingParent(cell, $isTableRowNode) as TableRowNode | null;
        if (!row) return;
        const table = $findMatchingParent(row, $isTableNode) as TableNode | null;
        if (!table) return;

        const colCount = row.getChildrenSize();
        const newRow = new TableRowNode();
        for (let i = 0; i < colCount; i++) {
          newRow.append(new TableCellNode(0));
        }

        if (after) {
          row.insertAfter(newRow);
        } else {
          row.insertBefore(newRow);
        }
      });
    },
    [editor, tableCellNodeKey],
  );

  const removeRow = useCallback(() => {
    editor.update(() => {
      if (!tableCellNodeKey) return;
      const cell = $getNodeByKey(tableCellNodeKey);
      if (!$isTableCellNode(cell)) return;
      const row = $findMatchingParent(cell, $isTableRowNode) as TableRowNode | null;
      if (!row) return;
      const table = $findMatchingParent(row, $isTableNode) as TableNode | null;
      if (!table) return;

      if (table.getChildrenSize() <= 1) return;
      row.remove();
    });
  }, [editor, tableCellNodeKey]);

  const addColumn = useCallback(
    (after: boolean) => {
      editor.update(() => {
        if (!tableCellNodeKey) return;
        const cell = $getNodeByKey(tableCellNodeKey);
        if (!$isTableCellNode(cell)) return;
        const row = $findMatchingParent(cell, $isTableRowNode) as TableRowNode | null;
        if (!row) return;
        const table = $findMatchingParent(row, $isTableNode) as TableNode | null;
        if (!table) return;

        const cellIndex = cell.getIndexWithinParent();

        const rows = table.getChildren();
        for (const tableRow of rows) {
          if (!$isTableRowNode(tableRow)) continue;
          const cells = tableRow.getChildren();
          const targetCell = cells[cellIndex];
          if (!targetCell) continue;

          const newCell = new TableCellNode(0);
          if (after) {
            targetCell.insertAfter(newCell);
          } else {
            targetCell.insertBefore(newCell);
          }
        }
      });
    },
    [editor, tableCellNodeKey],
  );

  const removeColumn = useCallback(() => {
    editor.update(() => {
      if (!tableCellNodeKey) return;
      const cell = $getNodeByKey(tableCellNodeKey);
      if (!$isTableCellNode(cell)) return;
      const row = $findMatchingParent(cell, $isTableRowNode) as TableRowNode | null;
      if (!row) return;
      const table = $findMatchingParent(row, $isTableNode) as TableNode | null;
      if (!table) return;

      const cellIndex = cell.getIndexWithinParent();
      if (row.getChildrenSize() <= 1) return;

      const rows = table.getChildren();
      for (const tableRow of rows) {
        if (!$isTableRowNode(tableRow)) continue;
        const cells = tableRow.getChildren();
        if (cells[cellIndex]) {
          cells[cellIndex].remove();
        }
      }
    });
  }, [editor, tableCellNodeKey]);

  const deleteTable = useCallback(() => {
    editor.update(() => {
      if (!activeTableKey) return;
      const table = $getNodeByKey(activeTableKey);
      if ($isTableNode(table)) {
        table.remove();
      }
    });
  }, [editor, activeTableKey]);

  const toggleBorders = useCallback(() => {
    editor.update(() => {
      if (!activeTableKey) return;
      const tableDOM = editor.getElementByKey(activeTableKey);
      if (tableDOM) {
        // Simple approach: toggle a class on the rendered DOM element.
        // It resets on unmount, but suffices for visual toggle in the session.
        tableDOM.classList.toggle('rte-table-no-borders');
      }
    });
  }, [editor, activeTableKey]);

  const alignTable = useCallback((alignment: 'left' | 'center' | 'right') => {
    editor.update(() => {
      if (!activeTableKey) return;
      const table = $getNodeByKey(activeTableKey);
      if ($isTableNode(table)) {
        // TableNode is an ElementNode, we can setFormat on it.
        table.setFormat(alignment);
      }
    });
  }, [editor, activeTableKey]);

  if (!activeTableKey || !editor.isEditable()) return null;

  return (
    <div
      ref={toolbarRef}
      className="rte-floating-toolbar rte-table-floating-toolbar"
      style={{ top: position.top, left: position.left, transform: 'translateX(-100%)' }}
    >
      <button type="button" className="rte-floating-toolbar-btn" onClick={() => alignTable('left')} title="Align Left">
        <AlignLeft size={16} />
      </button>
      <button type="button" className="rte-floating-toolbar-btn" onClick={() => alignTable('center')} title="Align Center">
        <AlignCenter size={16} />
      </button>
      <button type="button" className="rte-floating-toolbar-btn" onClick={() => alignTable('right')} title="Align Right">
        <AlignRight size={16} />
      </button>
      
      <div className="rte-toolbar-divider" style={{ height: '16px' }} />
      
      <button type="button" className="rte-floating-toolbar-btn" onClick={() => addRow(false)} title="Add Row Above">
        <ArrowUpToLine size={16} />
      </button>
      <button type="button" className="rte-floating-toolbar-btn" onClick={() => addRow(true)} title="Add Row Below">
        <ArrowDownToLine size={16} />
      </button>
      <button type="button" className="rte-floating-toolbar-btn rte-floating-toolbar-btn--danger" onClick={removeRow} title="Delete Row">
        <Trash2 size={16} />
      </button>

      <div className="rte-toolbar-divider" style={{ height: '16px' }} />

      <button type="button" className="rte-floating-toolbar-btn" onClick={() => addColumn(false)} title="Add Column Left">
        <ArrowLeftToLine size={16} />
      </button>
      <button type="button" className="rte-floating-toolbar-btn" onClick={() => addColumn(true)} title="Add Column Right">
        <ArrowRightToLine size={16} />
      </button>
      <button type="button" className="rte-floating-toolbar-btn rte-floating-toolbar-btn--danger" onClick={removeColumn} title="Delete Column">
        <Trash2 size={16} />
      </button>

      <div className="rte-toolbar-divider" style={{ height: '16px' }} />
      
      <button type="button" className="rte-floating-toolbar-btn" onClick={toggleBorders} title="Toggle Borders">
        <Grid3X3 size={16} />
      </button>
      
      <button type="button" className="rte-floating-toolbar-btn rte-floating-toolbar-btn--danger" onClick={deleteTable} title="Delete Table">
        <TableIcon size={16} />
      </button>
    </div>
  );
}
