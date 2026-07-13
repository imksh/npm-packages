import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
  $getNodeByKey,
  $getNearestNodeFromDOMNode,
} from "lexical";
import {
  $isTableCellNode,
  TableCellNode,
  TableNode,
  $isTableNode,
} from "@lexical/table";
import { $findMatchingParent, mergeRegister } from "@lexical/utils";

export default function TableCellResizerPlugin(): React.ReactElement | null {
  const [editor] = useLexicalComposerContext();
  const [activeCell, setActiveCell] = useState<{
    dom: HTMLElement;
    type: "col" | "row";
  } | null>(null);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) return;

      const target = e.target as HTMLElement;
      if (!target) return;

      if (target.classList.contains("rte-table-cell-resizer")) return;

      const cell = target.closest("td, th") as HTMLElement;
      if (cell) {
        const rect = cell.getBoundingClientRect();
        // Check if cursor is within 10px of the right boundary
        if (Math.abs(rect.right - e.clientX) <= 10) {
          setActiveCell({ dom: cell, type: "col" });
          return;
        }
        // Check if cursor is within 10px of the bottom boundary
        if (Math.abs(rect.bottom - e.clientY) <= 10) {
          setActiveCell({ dom: cell, type: "row" });
          return;
        }
      }

      setActiveCell(null);
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isResizing]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!activeCell) return;
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = activeCell.dom.offsetWidth;
      const startHeight = activeCell.dom.offsetHeight;
      const isCol = activeCell.type === "col";

      setIsResizing(true);

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (isCol) {
          const diff = moveEvent.clientX - startX;
          const newWidth = Math.max(30, startWidth + diff);
          activeCell.dom.style.width = `${newWidth}px`;
        } else {
          const diff = moveEvent.clientY - startY;
          const newHeight = Math.max(20, startHeight + diff);
          activeCell.dom.style.height = `${newHeight}px`;
        }
      };

      const handleMouseUp = (upEvent: MouseEvent) => {
        setIsResizing(false);
        const finalDiffX = upEvent.clientX - startX;
        const finalDiffY = upEvent.clientY - startY;
        const newWidth = Math.max(30, startWidth + finalDiffX);
        const newHeight = Math.max(20, startHeight + finalDiffY);

        editor.update(() => {
          const cell = $getNearestNodeFromDOMNode(activeCell.dom);
          if ($isTableCellNode(cell)) {
            const row = cell.getParent();
            const table = row?.getParent();

            if (row && table && $isTableNode(table)) {
              if (isCol) {
                const colIndex = cell.getIndexWithinParent();
                const rows = table.getChildren();
                for (const r of rows) {
                  if (r && $isElementNode(r)) {
                    const targetCell = r.getChildAtIndex(colIndex);
                    if ($isTableCellNode(targetCell)) {
                      targetCell.setWidth(newWidth);
                    }
                  }
                }
              } else {
                // Row resizing: set height on all cells in the row, or the row itself
                // Lexical TableRowNode usually delegates height to cells or has setHeight
                const cells = row.getChildren();
                for (const c of cells) {
                  if ($isTableCellNode(c)) {
                    // There is no setHeight natively on TableCellNode, we might need to use inline styles.
                    // Actually, if we apply it to the DOM, it stays until rerender.
                    // Wait, Lexical TableCellNode has width, but not height!
                  }
                }
                // To persist height, we need to update the DOM directly or extend the node.
                // For now, since TableRowNode has height in some lexical versions, we try it:
                if (typeof (row as any).setHeight === "function") {
                  (row as any).setHeight(newHeight);
                } else {
                  // Fallback: apply to DOM element (won't persist across reloads, but works visually)
                  const rowDom = editor.getElementByKey(row.getKey());
                  if (rowDom) rowDom.style.height = `${newHeight}px`;
                }
              }
            }
          }
        });

        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [activeCell, editor],
  );

  if (!activeCell || !editor.isEditable()) return null;

  const cellRect = activeCell.dom.getBoundingClientRect();
  const tableDom = activeCell.dom.closest("table");
  if (!tableDom) return null;
  const tableRect = tableDom.getBoundingClientRect();

  const isCol = activeCell.type === "col";

  return (
    <div
      className={`rte-table-cell-resizer ${isCol ? "col-resizer" : "row-resizer"}`}
      style={
        isCol
          ? {
              top: tableRect.top,
              left: cellRect.right - 3,
              height: tableRect.height,
              width: "8px",
              cursor: "col-resize",
            }
          : {
              top: cellRect.bottom - 3,
              left: tableRect.left,
              width: tableRect.width,
              height: "8px",
              cursor: "row-resize",
            }
      }
      onMouseDown={handleMouseDown}
      title={isCol ? "Resize Column" : "Resize Row"}
    />
  );
}
