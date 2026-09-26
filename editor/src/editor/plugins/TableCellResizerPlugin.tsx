import React, { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getNearestNodeFromDOMNode,
  $isElementNode,
} from "lexical";
import {
  $isTableCellNode,
  $isTableNode,
  TableNode,
} from "@lexical/table";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Rendered px widths of each cell in the first <tr>. */
function getFirstRowWidths(tableDom: HTMLElement): number[] {
  const firstRow = tableDom.querySelector("tr");
  if (!firstRow) return [];
  return Array.from(firstRow.children).map((c) => (c as HTMLElement).offsetWidth);
}

/** Which column index does this cell occupy? -1 if not found. */
function getCellColIndex(cell: HTMLElement): number {
  const row = cell.closest("tr");
  if (!row) return -1;
  return Array.from(row.children).indexOf(cell);
}

/**
 * Apply percentage widths to every cell in every row AND to colgroup cols.
 * colPxWidths holds the desired pixel widths for each column.
 * The percentages are derived from those widths so the table stays at 100%.
 *
 * Lexical uses <colgroup><col> elements as the primary source for
 * table-layout:fixed column sizing, so we must update them too.
 */
function applyPctWidths(tableDom: HTMLElement, colPxWidths: number[]): void {
  const total = colPxWidths.reduce((s, w) => s + w, 0);
  if (total === 0) return;

  // Update <colgroup><col> elements (Lexical's primary width source)
  const cols = Array.from(tableDom.querySelectorAll(":scope > colgroup > col")) as HTMLElement[];
  cols.forEach((col, ci) => {
    const w = colPxWidths[ci] ?? colPxWidths[colPxWidths.length - 1];
    col.style.width = `${((w / total) * 100).toFixed(4)}%`;
  });

  // Also update <td>/<th> cells for consistency
  const rows = Array.from(tableDom.querySelectorAll("tr"));
  rows.forEach((row) => {
    Array.from(row.children).forEach((cell, ci) => {
      const w = colPxWidths[ci] ?? colPxWidths[colPxWidths.length - 1];
      (cell as HTMLElement).style.width = `${((w / total) * 100).toFixed(4)}%`;
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Plugin
// ─────────────────────────────────────────────────────────────────────────────

export default function TableCellResizerPlugin(): React.ReactElement | null {
  const [editor] = useLexicalComposerContext();

  const [activeCell, setActiveCell] = useState<{
    dom: HTMLElement;
    type: "col" | "row";
  } | null>(null);

  const [isCellResizing, setIsCellResizing] = useState(false);
  const [selectedTable, setSelectedTable] = useState<HTMLElement | null>(null);
  const [isTableResizing, setIsTableResizing] = useState(false);
  const [, forceUpdate] = useState(0);

  // ── Table click-selection ─────────────────────────────────────────────────

  useEffect(() => {
    const onClickInside = (e: MouseEvent) => {
      if (!editor.isEditable()) return;
      const editorRoot = editor.getRootElement();
      if (!editorRoot?.contains(e.target as Node)) { setSelectedTable(null); return; }
      setSelectedTable((e.target as HTMLElement).closest("table") as HTMLElement | null);
    };
    const onClickOutside = (e: MouseEvent) => {
      if (!editor.getRootElement()?.contains(e.target as Node)) setSelectedTable(null);
    };
    document.addEventListener("click", onClickInside, true);
    document.addEventListener("click", onClickOutside);
    return () => {
      document.removeEventListener("click", onClickInside, true);
      document.removeEventListener("click", onClickOutside);
    };
  }, [editor]);

  // ── Track overlay position on scroll / resize ─────────────────────────────

  useEffect(() => {
    if (!selectedTable && !activeCell) return;
    const update = () => forceUpdate((n) => n + 1);
    const editorRoot = editor.getRootElement();
    const ro = editorRoot ? new ResizeObserver(update) : null;
    if (ro && editorRoot) ro.observe(editorRoot);
    window.addEventListener("scroll", update, { passive: true, capture: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      ro?.disconnect();
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [selectedTable, activeCell, editor]);

  // ── Cell-edge hover ───────────────────────────────────────────────────────

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (isCellResizing || isTableResizing) return;
      if (!editor.isEditable()) { setActiveCell(null); return; }
      const target = e.target as HTMLElement;
      if (
        target.classList.contains("rte-table-cell-resizer") ||
        target.classList.contains("rte-table-resize-handle")
      ) return;
      const editorRoot = editor.getRootElement();
      if (!editorRoot?.contains(target)) { setActiveCell(null); return; }
      const cell = target.closest("td, th") as HTMLElement | null;
      if (cell) {
        const rect = cell.getBoundingClientRect();
        if (Math.abs(rect.right - e.clientX) <= 10) { setActiveCell({ dom: cell, type: "col" }); return; }
        if (Math.abs(rect.bottom - e.clientY) <= 10) { setActiveCell({ dom: cell, type: "row" }); return; }
      }
      setActiveCell(null);
    };
    document.addEventListener("mousemove", onMouseMove);
    return () => document.removeEventListener("mousemove", onMouseMove);
  }, [isCellResizing, isTableResizing, editor]);

  // ── Sync Table Alignment Class for "left" ─────────────────────────────────
  // Lexical's internal alignTableElement ignores "left" format, so we manually
  // add our float class to allow text wrapping around left-aligned tables.
  useEffect(() => {
    return editor.registerMutationListener(TableNode, (nodeMutations) => {
      editor.getEditorState().read(() => {
        for (const [nodeKey, mutation] of nodeMutations) {
          if (mutation === "created" || mutation === "updated") {
            const node = editor.getEditorState()._nodeMap.get(nodeKey);
            if (node && $isTableNode(node)) {
              const dom = editor.getElementByKey(nodeKey);
              if (dom) {
                // dom is the Lexical wrapper, the actual table is inside it if scrollable,
                // but usually the dom IS the table. Let's add it to the table element.
                const tableEl = dom.tagName === "TABLE" ? dom : dom.querySelector("table");
                if (tableEl) {
                  if (node.getFormatType() === "left") {
                    tableEl.classList.add("rte-table-align-left");
                  } else {
                    tableEl.classList.remove("rte-table-align-left");
                  }
                }
              }
            }
          }
        }
      });
    });
  }, [editor]);

  // ── Column / row drag ─────────────────────────────────────────────────────

  const handleCellResizerMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!activeCell) return;
      e.preventDefault();
      e.stopPropagation();

      const isCol = activeCell.type === "col";
      const tableDom = activeCell.dom.closest("table") as HTMLElement | null;

      // ── Column resize ─────────────────────────────────────────────────────
      if (isCol && tableDom) {
        const colIndex = getCellColIndex(activeCell.dom.closest("td, th") as HTMLElement);
        if (colIndex < 0) return;

        // Snapshot current px widths before any drag
        const startWidths = getFirstRowWidths(tableDom);
        const startX = e.clientX;
        const startColPx = startWidths[colIndex] ?? 0;
        // Next column absorbs the delta so the table total never changes
        const nextIndex = colIndex + 1;
        const startNextPx = startWidths[nextIndex] ?? 0;

        setIsCellResizing(true);

        const onMove = (mv: MouseEvent) => {
          const delta = mv.clientX - startX;
          const newColPx = Math.max(30, startColPx + delta);
          // How much can the next column give up?
          const actualDelta = newColPx - startColPx;
          const newNextPx = Math.max(30, startNextPx - actualDelta);
          const realDelta = startNextPx - newNextPx; // actual transferred amount

          const newWidths = startWidths.map((w, i) => {
            if (i === colIndex) return startColPx + realDelta;
            if (i === nextIndex) return newNextPx;
            return w;
          });
          // Apply as percentages so the table never overflows its container
          applyPctWidths(tableDom, newWidths);
        };

        const onUp = (up: MouseEvent) => {
          setIsCellResizing(false);
          const delta = up.clientX - startX;
          const newColPx = Math.max(30, startColPx + delta);
          const actualDelta = newColPx - startColPx;
          const newNextPx = Math.max(30, startNextPx - actualDelta);
          const realDelta = startNextPx - newNextPx;

          const finalWidths = startWidths.map((w, i) => {
            if (i === colIndex) return startColPx + realDelta;
            if (i === nextIndex) return newNextPx;
            return w;
          });

          // Persist via Lexical:
          // 1. TableNode.setColWidths() → drives the <colgroup> which exportDOM uses directly
          // 2. TableCellNode.setWidth() → kept for backwards compatibility / per-cell storage
          editor.update(() => {
            // Walk up from the cell DOM to find the Lexical TableCellNode
            const cellDom = activeCell.dom.closest("td, th") as HTMLElement | null;
            if (!cellDom) {
              console.warn("[RTE resize] No td/th found from activeCell.dom");
              return;
            }
            const cellNode = $getNearestNodeFromDOMNode(cellDom);
            if (!cellNode) {
              console.warn("[RTE resize] $getNearestNodeFromDOMNode returned null for", cellDom);
              return;
            }
            if (!$isTableCellNode(cellNode)) {
              console.warn("[RTE resize] Node is not TableCellNode, type:", cellNode.getType());
              // Try walking up to find a table cell
              return;
            }
            const rowNode = cellNode.getParent();
            if (!rowNode) {
              console.warn("[RTE resize] cellNode has no parent");
              return;
            }
            const tableNode = rowNode.getParent();
            if (!tableNode || !$isTableNode(tableNode)) {
              console.warn("[RTE resize] rowNode parent is not TableNode, parent:", rowNode.getParent()?.getType());
              return;
            }

            console.log("[RTE resize] Setting colWidths:", finalWidths.map((px) => Math.round(px)));

            // Set TableNode colWidths — this is what updateColgroup() and exportDOM() read
            tableNode.setColWidths(finalWidths.map((px) => Math.round(px)));

            // Also set per-cell widths for serialization / undo support
            for (const r of tableNode.getChildren()) {
              if (!r || !$isElementNode(r)) continue;
              finalWidths.forEach((px, ci) => {
                const tc = r.getChildAtIndex(ci);
                if ($isTableCellNode(tc)) tc.setWidth(Math.round(px));
              });
            }

            console.log("[RTE resize] Successfully persisted widths");
          });

          // Re-apply % widths after Lexical re-renders (it resets inline styles)
          requestAnimationFrame(() => {
            if (tableDom) applyPctWidths(tableDom, finalWidths);
          });

          document.removeEventListener("mousemove", onMove);
          document.removeEventListener("mouseup", onUp);
        };

        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
        return;
      }

      // ── Row resize ────────────────────────────────────────────────────────
      const startY = e.clientY;
      const startHeight = activeCell.dom.offsetHeight;
      setIsCellResizing(true);

      const onMove = (mv: MouseEvent) => {
        activeCell.dom.style.height = `${Math.max(20, startHeight + mv.clientY - startY)}px`;
      };
      const onUp = (up: MouseEvent) => {
        setIsCellResizing(false);
        const newH = Math.max(20, startHeight + up.clientY - startY);
        editor.update(() => {
          const cellNode = $getNearestNodeFromDOMNode(activeCell.dom);
          if (!$isTableCellNode(cellNode)) return;
          const rowNode = cellNode.getParent();
          if (!rowNode) return;
          if (typeof (rowNode as any).setHeight === "function") {
            (rowNode as any).setHeight(newH);
          } else {
            const rowDom = editor.getElementByKey(rowNode.getKey());
            if (rowDom) rowDom.style.height = `${newH}px`;
          }
        });
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    },
    [activeCell, editor],
  );

  // ── Whole-table resize (SE corner, %-based) ───────────────────────────────

  const handleTableResizerMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!selectedTable) return;
      e.preventDefault();
      e.stopPropagation();

      const containerWidth = selectedTable.parentElement?.clientWidth ?? selectedTable.offsetWidth;
      const startX = e.clientX;
      const currentPct =
        selectedTable.style.width?.endsWith("%")
          ? parseFloat(selectedTable.style.width)
          : (selectedTable.offsetWidth / containerWidth) * 100;

      setIsTableResizing(true);

      const onMove = (mv: MouseEvent) => {
        const newPct = Math.min(100, Math.max(10, currentPct + ((mv.clientX - startX) / containerWidth) * 100));
        selectedTable.style.width = `${newPct.toFixed(2)}%`;
      };
      const onUp = () => {
        setIsTableResizing(false);
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
    },
    [selectedTable],
  );

  // ── Render overlays ───────────────────────────────────────────────────────

  if (!editor.isEditable()) return null;

  let cellResizerEl: React.ReactElement | null = null;
  if (activeCell && !isTableResizing) {
    const cellRect = activeCell.dom.getBoundingClientRect();
    const tableDom = activeCell.dom.closest("table");
    if (tableDom) {
      const tableRect = tableDom.getBoundingClientRect();
      const isCol = activeCell.type === "col";
      cellResizerEl = (
        <div
          className={`rte-table-cell-resizer ${isCol ? "col-resizer" : "row-resizer"}`}
          style={
            isCol
              ? { top: tableRect.top, left: cellRect.right - 3, height: tableRect.height, width: 8, cursor: "col-resize" }
              : { top: cellRect.bottom - 3, left: tableRect.left, width: tableRect.width, height: 8, cursor: "row-resize" }
          }
          onMouseDown={handleCellResizerMouseDown}
          title={isCol ? "Resize column" : "Resize row"}
        />
      );
    }
  }

  let tableOverlayEl: React.ReactElement | null = null;
  if (selectedTable) {
    const rect = selectedTable.getBoundingClientRect();
    tableOverlayEl = (
      <>
        <div
          className="rte-table-selection-border"
          style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
          onMouseDown={(e) => e.stopPropagation()}
        />
        <div
          className="rte-table-resize-handle"
          style={{ top: rect.bottom - 6, left: rect.right - 6 }}
          onMouseDown={handleTableResizerMouseDown}
          title="Drag to resize table"
        />
      </>
    );
  }

  if (!cellResizerEl && !tableOverlayEl) return null;
  return <>{cellResizerEl}{tableOverlayEl}</>;
}
