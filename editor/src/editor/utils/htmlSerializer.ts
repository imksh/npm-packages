import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { $getRoot, type LexicalEditor } from 'lexical';

/**
 * Parse an HTML string and load it into the editor.
 * Replaces all existing content.
 */
export function importHTML(editor: LexicalEditor, html: string): void {
  editor.update(() => {
    const root = $getRoot();
    root.clear();

    if (!html || html.trim() === '') {
      return;
    }

    // Strip the code-wrapper divs added by exportHTML before parsing,
    // so Lexical only sees the raw <pre> elements.
    const cleaned = html.replace(
      /<div class="rte-code-wrapper">(<pre[\s\S]*?<\/pre>)[\s\S]*?<\/div>/gi,
      '$1',
    );

    const parser = new DOMParser();
    const dom = parser.parseFromString(cleaned, 'text/html');
    const nodes = $generateNodesFromDOM(editor, dom);

    if (nodes.length > 0) {
      root.append(...nodes);
    }
  });
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

  // Wrap each <pre> block with the copy button wrapper
  html = html.replace(
    /(<pre[^>]*>(?:[\s\S]*?)<\/pre>)/gi,
    `<div class="rte-code-wrapper">$1${COPY_BTN_HTML}</div>`,
  );

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
