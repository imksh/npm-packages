import React, { useState, useRef, useCallback, useEffect } from "react";
import { RichTextEditor, isHTMLEmpty } from "@imksh/editor";
import type { RichTextEditorRef, RichTextEditorFeatures } from "@imksh/editor";
import "../../src/editor/RichTextEditor.css";
import { Star } from "lucide-react";

// ─── Feature flag config ────────────────────────────────────────
interface FeatureConfig {
  key: keyof RichTextEditorFeatures;
  label: string;
  group: string;
}

const FEATURE_CONFIG: FeatureConfig[] = [
  { key: "bold", label: "Bold", group: "Text" },
  { key: "italic", label: "Italic", group: "Text" },
  { key: "underline", label: "Underline", group: "Text" },
  { key: "strikethrough", label: "Strikethrough", group: "Text" },
  { key: "inlineCode", label: "Inline Code", group: "Text" },
  { key: "fontSize", label: "Font Size", group: "Text" },
  { key: "textColor", label: "Text Color", group: "Text" },
  { key: "highlight", label: "Highlight", group: "Text" },
  { key: "headings", label: "Headings", group: "Blocks" },
  { key: "blockquote", label: "Blockquote", group: "Blocks" },
  { key: "codeBlock", label: "Code Block", group: "Blocks" },
  { key: "bulletList", label: "Bullet List", group: "Lists" },
  { key: "numberedList", label: "Numbered List", group: "Lists" },
  { key: "checkList", label: "Checklist", group: "Lists" },
  { key: "alignment", label: "Alignment", group: "Layout" },
  { key: "link", label: "Links", group: "Insert" },
  { key: "image", label: "Images", group: "Insert" },
  { key: "video", label: "Video", group: "Insert" },
  { key: "table", label: "Tables", group: "Insert" },
  { key: "horizontalRule", label: "Horizontal Rule", group: "Insert" },
  { key: "undoRedo", label: "Undo / Redo", group: "Actions" },
];

const GROUPS = ["Text", "Blocks", "Lists", "Layout", "Insert", "Actions"];

const INITIAL_HTML = `<h2>Welcome to the Editor Playground 👋</h2>
<p>This is a <strong>live demo</strong> of the <code>@imksh/editor</code> package. Try the toolbar above to format text.</p>
<h3>Features</h3>
<ul>
  <li>Rich text formatting — <strong>bold</strong>, <em>italic</em>, <u>underline</u>, ~~strikethrough~~</li>
  <li>Code blocks with syntax highlighting</li>
  <li>Tables, images, video, links, and more</li>
</ul>
<pre><code class="language-javascript">// Code block example
function greet(name) {
  return \`Hello, \${name}!\`;
}
console.log(greet('World'));</code></pre>
<blockquote><p>Use the <strong>Feature Toggles</strong> panel on the left to enable/disable toolbar features on the fly.</p></blockquote>`;

type OutputTab = "html" | "markdown" | "json" | "preview";

// ─── Component ──────────────────────────────────────────────────
export default function App() {
  const editorRef = useRef<RichTextEditorRef>(null);
  const [html, setHtml] = useState<string>(INITIAL_HTML);
  const [markdown, setMarkdown] = useState<string>("");
  const [json, setJson] = useState<string>("");
  const [features, setFeatures] = useState<Required<RichTextEditorFeatures>>({
    bold: true,
    italic: true,
    underline: true,
    strikethrough: true,
    inlineCode: true,
    fontSize: true,
    textColor: true,
    highlight: true,
    headings: true,
    blockquote: true,
    codeBlock: true,
    bulletList: true,
    numberedList: true,
    checkList: true,
    alignment: true,
    link: true,
    image: true,
    video: true,
    table: true,
    horizontalRule: true,
    undoRedo: true,
  });
  const [activeTab, setActiveTab] = useState<OutputTab>("html");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [readOnly, setReadOnly] = useState(false);
  const [minHeight, setMinHeight] = useState(300);
  const [showToolbar, setShowToolbar] = useState(true);
  const [copied, setCopied] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleFeature = useCallback((key: keyof RichTextEditorFeatures) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const getActiveOutput = () => {
    if (activeTab === "html") return html || "<!-- empty -->";
    if (activeTab === "markdown") return markdown || "<!-- empty -->";
    if (activeTab === "json") return json || "{}";
    return "";
  };

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(getActiveOutput()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [html, markdown, json, activeTab]);

  const handleClear = useCallback(() => {
    editorRef.current?.clear();
    setCleared(true);
    setTimeout(() => setCleared(false), 2000);
  }, []);

  const handleSetSample = useCallback(() => {
    editorRef.current?.setContent(INITIAL_HTML);
  }, []);

  const isEmpty = isHTMLEmpty(html);

  const TAB_LABELS: Record<OutputTab, string> = {
    html: "HTML",
    markdown: "Markdown",
    json: "JSON",
    preview: "Preview",
  };

  return (
    <div className="pg-root">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="pg-header">
        <div className="pg-header-left">
          <div className="pg-logo">
            <span className="pg-logo-icon">✦</span>
            <span className="pg-logo-text">editor</span>
            <span className="pg-logo-badge">playground</span>
          </div>
        </div>
        <div className="pg-header-right">
          <button
            className="pg-toggle-btn"
            style={{
              marginRight: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              padding: 0,
            }}
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            title={
              theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
          <a
            className="pg-header-link"
            href="https://github.com/imksh/editor"
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
          <button
            className="pg-toggle-btn"
            onClick={() => setIsSidebarOpen((p) => !p)}
            title={isSidebarOpen ? "Hide panel" : "Show panel"}
          >
            {isSidebarOpen ? "← Hide Panel" : "Show Panel →"}
          </button>
        </div>
      </header>

      <div className="pg-body">
        {/* ── Sidebar ──────────────────────────────────────────── */}
        {isSidebarOpen && (
          <aside className="pg-sidebar">
            <div className="pg-sidebar-section">
              <h3 className="pg-sidebar-title">Editor Options</h3>
              <label className="pg-option-row">
                <span className="pg-option-label">Read Only</span>
                <button
                  className={`pg-pill-btn ${readOnly ? "pg-pill-btn--on" : ""}`}
                  onClick={() => setReadOnly((p) => !p)}
                >
                  {readOnly ? "On" : "Off"}
                </button>
              </label>
              <label className="pg-option-row">
                <span className="pg-option-label">Toolbar</span>
                <button
                  className={`pg-pill-btn ${showToolbar ? "pg-pill-btn--on" : ""}`}
                  onClick={() => setShowToolbar((p) => !p)}
                >
                  {showToolbar ? "Visible" : "Hidden"}
                </button>
              </label>
              <label className="pg-option-row">
                <span className="pg-option-label">Min Height</span>
                <div className="pg-range-wrapper">
                  <input
                    type="range"
                    min={100}
                    max={600}
                    step={50}
                    value={minHeight}
                    onChange={(e) => setMinHeight(Number(e.target.value))}
                    className="pg-range"
                  />
                  <span className="pg-range-value">{minHeight}px</span>
                </div>
              </label>
            </div>

            <div className="pg-sidebar-section">
              <h3 className="pg-sidebar-title">Actions</h3>
              <div className="pg-action-row">
                <button className="pg-action-btn" onClick={handleSetSample}>
                  Load Sample
                </button>
                <button
                  className="pg-action-btn pg-action-btn--danger"
                  onClick={handleClear}
                >
                  {cleared ? "✓ Cleared!" : "Clear"}
                </button>
              </div>
            </div>

            <div className="pg-sidebar-section pg-sidebar-section--features">
              <h3 className="pg-sidebar-title">Feature Toggles</h3>
              {GROUPS.map((group) => (
                <div key={group} className="pg-feature-group">
                  <span className="pg-feature-group-label">{group}</span>
                  {FEATURE_CONFIG.filter((f) => f.group === group).map((f) => (
                    <label key={f.key} className="pg-feature-row">
                      <span className="pg-feature-label">{f.label}</span>
                      <button
                        className={`pg-toggle ${features[f.key] ? "pg-toggle--on" : ""}`}
                        onClick={() => toggleFeature(f.key)}
                        aria-pressed={features[f.key]}
                      >
                        <span className="pg-toggle-knob" />
                      </button>
                    </label>
                  ))}
                </div>
              ))}
            </div>
          </aside>
        )}

        {/* ── Main ─────────────────────────────────────────────── */}
        <main className="pg-main">
          <div className="pg-editor-card">
            <RichTextEditor
              ref={editorRef}
              value={INITIAL_HTML}
              customToolbarButtons={[
                {
                  key: "my-action",
                  icon: <Star size={16} />,
                  label: "My Action",
                  onClick: () => alert("Custom button clicked!"),
                  active: false,
                },
              ]}
              onChange={setHtml}
              onMarkdownChange={setMarkdown}
              onJsonChange={setJson}
              readOnly={readOnly}
              onImageUpload={async (file) => {
                // upload file to cloud, return url
                return new Promise((resolve) => {
                  setTimeout(() => {
                    resolve(
                      "https://plus.unsplash.com/premium_photo-1786552941093-cfa31e3fe2d0?q=80&w=1475&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    );
                  }, 5000);
                });
              }}
              onImageDelete={(link: string) => console.log("deleted")}
              showToolbar={showToolbar}
              height={minHeight}
              {...features}
            />
          </div>

          {/* ── Output panel ─────────────────────────────────── */}
          <div className="pg-output-card">
            <div className="pg-output-header">
              <div className="pg-output-tabs">
                {(["html", "markdown", "json", "preview"] as OutputTab[]).map(
                  (tab) => (
                    <button
                      key={tab}
                      className={`pg-tab ${activeTab === tab ? "pg-tab--active" : ""}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {TAB_LABELS[tab]}
                    </button>
                  ),
                )}
              </div>
              {activeTab !== "preview" && (
                <button className="pg-copy-btn" onClick={handleCopy}>
                  {copied ? "✓ Copied!" : `Copy ${TAB_LABELS[activeTab]}`}
                </button>
              )}
            </div>

            {activeTab === "preview" ? (
              <div
                className="pg-preview-output"
                dangerouslySetInnerHTML={{
                  __html:
                    html ||
                    '<p style="color: #6b7280; font-style: italic;">Nothing to preview yet.</p>',
                }}
              />
            ) : (
              <pre
                className={`pg-html-output${activeTab === "json" ? " pg-json-output" : activeTab === "markdown" ? " pg-markdown-output" : ""}`}
              >
                <code>{getActiveOutput()}</code>
              </pre>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
