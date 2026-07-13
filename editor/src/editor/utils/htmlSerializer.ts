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

    const parser = new DOMParser();
    const dom = parser.parseFromString(html, 'text/html');
    const nodes = $generateNodesFromDOM(editor, dom);

    if (nodes.length > 0) {
      root.append(...nodes);
    }
  });
}

/**
 * Serialize the current editor state to an HTML string.
 * Returns empty string if the editor only contains an empty paragraph.
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
