import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $getRoot, type LexicalEditor } from 'lexical';

/**
 * Parse an HTML string and load it into the editor.
 * Replaces all existing content.
 */
export function importHTML(editor: LexicalEditor, html: string): void {
  if (!html || html.trim() === '') {
    editor.update(() => { $getRoot().clear(); });
    return;
  }

  // Strip code-wrapper divs added by exportHTML so Lexical only sees raw <pre>.
  const cleaned = html.replace(
    /<div class="rte-code-wrapper">(<pre[\s\S]*?<\/pre>)[\s\S]*?<\/div>/gi,
    '$1',
  );

  // Pre-scan the incoming HTML to find which table indices carry data-no-borders.
  // We do this BEFORE editor.update because after Lexical creates fresh DOM
  // elements for each TableNode, the attribute is gone — we re-apply it in
  // the onUpdate callback once Lexical has flushed to the live DOM.
  const noBorderIndices = new Set<number>();
  const tempParser = new DOMParser();
  const tempDom = tempParser.parseFromString(cleaned, 'text/html');
  tempDom.querySelectorAll('table').forEach((table, idx) => {
    if (table.hasAttribute('data-no-borders')) {
      noBorderIndices.add(idx);
    }
  });

  editor.update(
    () => {
      const root = $getRoot();
      root.clear();

      const parser = new DOMParser();
      const dom = parser.parseFromString(cleaned, 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);

      if (noBorderIndices.size > 0) {
        let tableIndex = 0;
        const traverse = (n: any) => {
          if (n.getType() === 'table') {
            if (noBorderIndices.has(tableIndex)) {
              const writable = n.getWritable();
              writable.__style = ((writable.__style || '') + ' --rte-no-borders: 1;').trim();
            }
            tableIndex++;
          }
          if (typeof n.getChildren === 'function') {
            n.getChildren().forEach(traverse);
          }
        };
        nodes.forEach(traverse);
      }

      if (nodes.length > 0) {
        root.append(...nodes);
      }
    }
  );
}

/** Inline copy-button SVG icons */
const COPY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

/**
 * Encode double-quotes as &quot; so an SVG string is safe to embed inside
 * an onclick="..." HTML attribute without breaking the attribute boundary.
 * The browser's HTML parser decodes &quot; → " before the JS engine runs,
 * so innerHTML still receives a fully valid SVG string.
 */
function encodeForAttr(svg: string): string {
  return svg.replace(/"/g, '&quot;');
}

/**
 * Inline onclick handler embedded in the copy button.
 * The onclick attribute is delimited by double-quotes, so all double-quotes
 * inside the SVG innerHTML strings must be encoded as &quot;.
 */
const COPY_ONCLICK = [
  `var p=this.closest('.rte-code-wrapper');`,
  `if(!p)return;`,
  `var t=(p.querySelector('code')||p.querySelector('pre')).innerText;`,
  `navigator.clipboard.writeText(t).then(function(){`,
    `var b=this;`,
    `b.innerHTML='${encodeForAttr(CHECK_ICON)}';`,
    `setTimeout(function(){b.innerHTML='${encodeForAttr(COPY_ICON)}';},2000);`,
  `}.bind(this));`,
].join('');

/** The copy button HTML injected into every exported code block. */
const COPY_BTN_HTML = `<button class="rte-code-copy-btn" title="Copy code" onclick="${COPY_ONCLICK}">${COPY_ICON}</button>`;

/**
 * Serialize the current editor state to an HTML string.
 * Returns empty string if the editor only contains an empty paragraph.
 * Each code block is wrapped in `.rte-code-wrapper` with a self-contained
 * copy button, so the button works in any app that renders this HTML.
 */
export function exportHTML(editor: LexicalEditor): string {
  let html = '';
  editor.getEditorState().read(() => {
    html = $generateHtmlFromNodes(editor);
  });

  // Normalize empty state
  if (isHTMLEmpty(html)) {
    return '';
  }

  // Lexical's TableCellNode.exportDOM() hardcodes `background-color: #f2f3f5`
  // on every <th> that has no user-set custom background colour. This makes
  // the header row/column appear grey in the preview even though the editor
  // itself shows no colour. Strip it so preview == editor.
  // Note: Browsers convert hex colors in inline styles to rgb() during outerHTML serialization.
  html = html.replace(
    /(<th\b[^>]*)\s+style="([^"]*)background-color:\s*(?:#f2f3f5|rgb\(\s*242\s*,\s*243\s*,\s*245\s*\))\s*;?([^"]*)"/gi,
    (_, open, before, after) => {
      const style = (before + after).replace(/;\s*$/, '').trim();
      return style ? `${open} style="${style}"` : open;
    },
  );

  // Stamp data-no-borders onto any table in the exported HTML whose live
  // editor DOM element carries the attribute (set by toggleBorders directly
  // on the DOM node, outside of Lexical state).
  // We match by DOM order — Lexical serialises tables in the same order they
  // appear in the editor root.
  //
  // Also: Transfer the live table's inline width (set by the SE resize handle
  // directly on the DOM) into the exported table so preview matches editor.
  const editorRoot = editor.getRootElement();
  if (editorRoot) {
    const allLiveTables = Array.from(editorRoot.querySelectorAll('table'));
    const liveNoBorderTables = Array.from(editorRoot.querySelectorAll('table[data-no-borders]'));

    // Check if any table has a non-100% width or data-no-borders
    const hasCustomWidths = allLiveTables.some((t) => {
      const w = (t as HTMLElement).style.width;
      return w && w !== '100%' && w !== '';
    });

    if (liveNoBorderTables.length > 0 || hasCustomWidths) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const exportedTables = Array.from(doc.querySelectorAll('table'));
      let mutated = false;

      allLiveTables.forEach((liveTable, idx) => {
        const exportedTable = exportedTables[idx];
        if (!exportedTable) return;

        // ── Transfer data-no-borders ────────────────────────────────────────
        if (liveTable.hasAttribute('data-no-borders')) {
          exportedTable.setAttribute('data-no-borders', 'true');
          exportedTable.style.borderColor = 'transparent';
          exportedTable.style.border = 'none';
          exportedTable.querySelectorAll('td, th, tr').forEach((cell) => {
            (cell as HTMLElement).style.border = 'none';
          });
          mutated = true;
        }

        // ── Transfer table width from SE resize handle ──────────────────────
        const liveWidth = (liveTable as HTMLElement).style.width;
        if (liveWidth && liveWidth !== '100%') {
          exportedTable.style.width = liveWidth;
          mutated = true;
        }

        // ── Transfer left alignment class ───────────────────────────────────
        if (liveTable.classList.contains('rte-table-align-left')) {
          exportedTable.classList.add('rte-table-align-left');
          mutated = true;
        }
      });

      if (mutated) {
        html = doc.body.innerHTML;
      }
    }
  }

  // Wrap each <pre> block with the copy button wrapper
  html = html.replace(
    /(<pre[^>]*>(?:[\s\S]*?)<\/pre>)/gi,
    `<div class="rte-code-wrapper">$1${COPY_BTN_HTML}</div>`,
  );

  // ── Normalise table column widths for preview ──────────────────────────────
  // Lexical stores column widths on <colgroup><col style="width:Xpx"> elements,
  // NOT on <td> inline styles (even though it also writes those).
  // With table-layout:fixed, <col> widths take precedence in column sizing.
  // We convert BOTH <col> and <td> widths to proportional percentages so the
  // preview renders the same column proportions as the editor at any width.
  {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    let tablesMutated = false;

    doc.querySelectorAll("table").forEach((table) => {
      // ── 1. Collect px widths ──────────────────────────────────────────────
      // Try <colgroup><col> first (Lexical's primary source), then <td>/<th>.
      const cols = Array.from(table.querySelectorAll(":scope > colgroup > col")) as HTMLElement[];
      let pxWidths: number[] = [];

      // Try cols first
      if (cols.length > 0) {
        pxWidths = cols.map((col) => {
          const w = col.style.width;
          if (w && w.endsWith("px")) return parseFloat(w);
          const wa = col.getAttribute("width");
          if (wa) return parseFloat(wa);
          return 0;
        });
      }

      // If cols had no widths, read from first-row cells instead
      const hasColWidths = pxWidths.some((w) => w > 0);
      if (!hasColWidths) {
        const firstRow = table.querySelector("tr");
        if (!firstRow) return;
        pxWidths = Array.from(firstRow.children).map((c) => {
          const w = (c as HTMLElement).style.width;
          if (w && w.endsWith("px")) return parseFloat(w);
          return 0;
        });
      }

      const hasWidths = pxWidths.some((w) => w > 0);
      if (!hasWidths) return; // No explicit widths — browser distributes equally, that's fine

      const total = pxWidths.reduce((s, w) => s + w, 0);
      if (total === 0) return;

      // ── 2. Convert <col> widths to percentages ────────────────────────────
      cols.forEach((col, ci) => {
        const w = pxWidths[ci] ?? pxWidths[pxWidths.length - 1];
        const pct = ((w / total) * 100).toFixed(4);
        col.style.width = `${pct}%`;
        col.removeAttribute("width"); // remove legacy attribute if present
      });

      // ── 3. Convert <td>/<th> widths to percentages ────────────────────────
      Array.from(table.querySelectorAll("tr")).forEach((row) => {
        Array.from(row.children).forEach((cell, ci) => {
          const w = pxWidths[ci] ?? pxWidths[pxWidths.length - 1];
          const pct = ((w / total) * 100).toFixed(4);
          (cell as HTMLElement).style.width = `${pct}%`;
        });
      });

      // ── 4. Ensure the table uses fixed layout so percentages are honoured ─
      table.style.tableLayout = "fixed";
      if (!table.style.width) table.style.width = "100%";

      tablesMutated = true;
    });

    if (tablesMutated) {
      html = doc.body.innerHTML;
    }
  }

  return html;
}

/**
 * Check if an HTML string represents empty content.
 * Treats `<p><br></p>`, whitespace-only, and similar as empty.
 */
export function isHTMLEmpty(html: string): boolean {
  if (!html || html.trim() === '') return true;

  const stripped = html
    .replace(/<p[^>]*>\s*(<br\s*\/?>)?\s*<\/p>/gi, '')
    .replace(/<div[^>]*>\s*(<br\s*\/?>)?\s*<\/div>/gi, '')
    .replace(/&nbsp;/gi, '')
    .trim();

  return stripped === '';
}

/**
 * Check if the editor's current state is empty (no meaningful content).
 */
export function isEditorEmpty(editor: LexicalEditor): boolean {
  let empty = true;
  editor.getEditorState().read(() => {
    const root = $getRoot();
    const textContent = root.getTextContent().trim();
    empty = textContent === '';
  });
  return empty;
}
