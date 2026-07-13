import React, { useState, useCallback } from "react";
import type {
  ToolbarState,
  ToolbarActions,
  RichTextEditorFeatures,
  BlockType,
} from "../types";
import { CODE_LANGUAGES } from "../types";
import ToolbarButton from "./ToolbarButton";
import FontSizeSelector from "./FontSizeSelector";
import AlignmentSelector from "./AlignmentSelector";
import BlockTypeSelector from "./BlockTypeSelector";
import ListSelector from "./ListSelector";
import StyleSelector from "./StyleSelector";
import InsertSelector from "./InsertSelector";
import ActionsSelector from "./ActionsSelector";
import ColorPicker from "./ColorPicker";
import LinkDialog from "./LinkDialog";
import ImageDialog from "./ImageDialog";
import TableDialog from "./TableDialog";
import Divider from "./Divider";
import {
  Heading1,
  Heading2,
  Heading3,
  Type,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  ListChecks,
  TextQuote,
  Link2,
  Unlink,
  Image,
  Table,
  Minus,
  Undo2,
  Redo2,
  CodeXml,
  Maximize,
  Minimize,
} from "lucide-react";

interface ToolbarProps {
  state: ToolbarState;
  actions: ToolbarActions;
  features: RichTextEditorFeatures;
  onOpenImageDrawer?: (callback: (url: string) => void) => void;
  disabled?: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

/**
 * Presentational toolbar component. Renders button groups based on feature flags.
 */
const Toolbar: React.FC<ToolbarProps> = ({
  state,
  actions,
  features,
  onOpenImageDrawer,
  disabled = false,
  isFullscreen = false,
  onToggleFullscreen,
}) => {
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [showTableDialog, setShowTableDialog] = useState(false);

  // ── Heading & Block Type ──────────────────────────────────────
  const handleBlockTypeChange = useCallback(
    (type: BlockType) => {
      // If already this type, toggle back to paragraph
      if (state.blockType === type && type !== "paragraph") {
        actions.formatBlock("paragraph");
      } else {
        actions.formatBlock(type);
      }
    },
    [state.blockType, actions],
  );

  // ── Link ──────────────────────────────────────────────────────
  const handleLinkClick = useCallback(() => {
    if (state.isLink) {
      actions.removeLink();
    } else {
      setShowLinkDialog(true);
    }
  }, [state.isLink, actions]);

  const handleLinkSubmit = useCallback(
    (url: string, text?: string) => {
      actions.insertLink(url, text);
    },
    [actions],
  );

  // ── Image ─────────────────────────────────────────────────────
  const handleImageClick = useCallback(() => {
    if (onOpenImageDrawer) {
      onOpenImageDrawer((url: string) => {
        if (url) {
          actions.insertImage({ src: url });
        }
      });
    } else {
      setShowImageDialog(true);
    }
  }, [onOpenImageDrawer, actions]);

  const handleImageSubmit = useCallback(
    (src: string, alt?: string) => {
      actions.insertImage({ src, altText: alt });
    },
    [actions],
  );

  // ── Table ─────────────────────────────────────────────────────
  const handleTableSubmit = useCallback(
    (rows: number, columns: number) => {
      actions.insertTable({ rows, columns });
    },
    [actions],
  );

  const iconSize = 18;

  return (
    <div
      className="rte-toolbar"
      role="toolbar"
      aria-label="Text formatting toolbar"
    >
      {/* ── Block Types & Headings ──────────────────────────────── */}
      {(features.headings !== false ||
        features.blockquote !== false ||
        features.codeBlock !== false) && (
        <div className="rte-block-collapsed">
          <BlockTypeSelector
            currentBlockType={state.blockType}
            onChange={handleBlockTypeChange}
            disabled={disabled}
            features={features}
          />
        </div>
      )}

      {features.headings !== false && (
        <div className="rte-block-expanded">
          <ToolbarButton
            onClick={() => handleBlockTypeChange("h1")}
            isActive={state.blockType === "h1"}
            disabled={disabled}
            ariaLabel="Heading 1"
          >
            <Heading1 size={iconSize} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => handleBlockTypeChange("h2")}
            isActive={state.blockType === "h2"}
            disabled={disabled}
            ariaLabel="Heading 2"
          >
            <Heading2 size={iconSize} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => handleBlockTypeChange("h3")}
            isActive={state.blockType === "h3"}
            disabled={disabled}
            ariaLabel="Heading 3"
          >
            <Heading3 size={iconSize} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => handleBlockTypeChange("paragraph")}
            isActive={state.blockType === "paragraph"}
            disabled={disabled}
            ariaLabel="Paragraph"
          >
            <Type size={iconSize} />
          </ToolbarButton>
          {features.blockquote !== false && (
            <ToolbarButton
              onClick={() => handleBlockTypeChange("quote")}
              isActive={state.blockType === "quote"}
              disabled={disabled}
              ariaLabel="Blockquote"
            >
              <TextQuote size={iconSize} />
            </ToolbarButton>
          )}
        </div>
      )}

      {/* Code block button */}
      {features.codeBlock !== false && (
        <>
          <div className="rte-block-expanded">
            <ToolbarButton
              onClick={() => handleBlockTypeChange("code")}
              isActive={state.blockType === "code"}
              disabled={disabled}
              ariaLabel="Code block"
            >
              <CodeXml size={iconSize} />
            </ToolbarButton>
          </div>

          <select
            className="rte-code-language-select"
            disabled={state.blockType !== "code"}
            value={state.codeLanguage}
            onChange={(e) => actions.setCodeLanguage(e.target.value)}
            aria-label="Select code language"
            style={{
              opacity: state.blockType === "code" ? 1 : 0.45,
              transition: "opacity 0.2s ease",
            }}
          >
            {Object.entries(CODE_LANGUAGES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </>
      )}

      {(features.headings !== false ||
        features.blockquote !== false ||
        features.codeBlock !== false) && (
        <>
          <div className="rte-block-expanded">
            <Divider />
          </div>
          <div className="rte-block-collapsed">
            <Divider />
          </div>
        </>
      )}

      {/* ── Font Size ─────────────────────────────────────────── */}
      {features.fontSize !== false && (
        <>
          <FontSizeSelector
            currentSize={state.fontSize}
            onChange={actions.setFontSize}
            disabled={disabled}
          />
          <Divider />
        </>
      )}

      {/* ── Text Formatting ───────────────────────────────────── */}
      {(features.bold !== false ||
        features.italic !== false ||
        features.underline !== false ||
        features.strikethrough !== false ||
        features.inlineCode !== false) && (
        <>
          <div className="rte-style-expanded">
            {features.bold !== false && (
              <ToolbarButton
                onClick={() => actions.formatText("bold")}
                isActive={state.isBold}
                disabled={disabled}
                ariaLabel="Bold (Ctrl+B)"
              >
                <Bold size={iconSize} />
              </ToolbarButton>
            )}
            {features.italic !== false && (
              <ToolbarButton
                onClick={() => actions.formatText("italic")}
                isActive={state.isItalic}
                disabled={disabled}
                ariaLabel="Italic (Ctrl+I)"
              >
                <Italic size={iconSize} />
              </ToolbarButton>
            )}
            {features.underline !== false && (
              <ToolbarButton
                onClick={() => actions.formatText("underline")}
                isActive={state.isUnderline}
                disabled={disabled}
                ariaLabel="Underline (Ctrl+U)"
              >
                <Underline size={iconSize} />
              </ToolbarButton>
            )}
            {features.strikethrough !== false && (
              <ToolbarButton
                onClick={() => actions.formatText("strikethrough")}
                isActive={state.isStrikethrough}
                disabled={disabled}
                ariaLabel="Strikethrough"
              >
                <Strikethrough size={iconSize} />
              </ToolbarButton>
            )}
            {features.inlineCode !== false && (
              <ToolbarButton
                onClick={() => actions.formatText("code")}
                isActive={state.isCode}
                disabled={disabled}
                ariaLabel="Inline code"
              >
                <Code size={iconSize} />
              </ToolbarButton>
            )}
          </div>
          <div className="rte-style-collapsed">
            <StyleSelector
              state={state}
              actions={actions}
              features={features}
              disabled={disabled}
            />
          </div>
          <Divider />
        </>
      )}

      {/* ── Colors ────────────────────────────────────────────── */}
      {features.textColor !== false && (
        <ColorPicker
          mode="text"
          currentColor={state.fontColor}
          onChange={actions.setTextColor}
          disabled={disabled}
        />
      )}
      {features.highlight !== false && (
        <ColorPicker
          mode="background"
          currentColor={state.bgColor}
          onChange={actions.setBgColor}
          disabled={disabled}
        />
      )}
      {(features.textColor !== false || features.highlight !== false) && (
        <Divider />
      )}

      {/* ── Insert Elements ─────────────────────────────────────── */}
      {(features.link !== false ||
        features.image !== false ||
        features.table !== false ||
        features.horizontalRule !== false) && (
        <>
          <div className="rte-insert-expanded">
            {features.link !== false && (
              <ToolbarButton
                onClick={handleLinkClick}
                isActive={state.isLink}
                disabled={disabled}
                ariaLabel={state.isLink ? "Remove link" : "Insert link"}
              >
                {state.isLink ? (
                  <Unlink size={iconSize} />
                ) : (
                  <Link2 size={iconSize} />
                )}
              </ToolbarButton>
            )}
            {features.image !== false && (
              <ToolbarButton
                onClick={handleImageClick}
                disabled={disabled}
                ariaLabel="Insert image"
              >
                <Image size={iconSize} />
              </ToolbarButton>
            )}
            {features.table !== false && (
              <ToolbarButton
                onClick={() => setShowTableDialog(true)}
                disabled={disabled}
                ariaLabel="Insert table"
              >
                <Table size={iconSize} />
              </ToolbarButton>
            )}
            {features.horizontalRule !== false && (
              <ToolbarButton
                onClick={actions.insertHorizontalRule}
                disabled={disabled}
                ariaLabel="Horizontal divider"
              >
                <Minus size={iconSize} />
              </ToolbarButton>
            )}
          </div>
          <div className="rte-insert-collapsed">
            <InsertSelector
              onLinkClick={handleLinkClick}
              onImageClick={handleImageClick}
              onTableClick={() => setShowTableDialog(true)}
              onHorizontalRuleClick={actions.insertHorizontalRule}
              isLink={state.isLink}
              features={features}
              disabled={disabled}
            />
          </div>
          <Divider />
        </>
      )}

      {/* ── Alignment ─────────────────────────────────────────── */}
      {features.alignment !== false && (
        <>
          <div className="rte-align-expanded">
            <ToolbarButton
              onClick={() => actions.setAlignment("left")}
              isActive={state.alignment === "left"}
              disabled={disabled}
              ariaLabel="Align left"
            >
              <AlignLeft size={iconSize} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => actions.setAlignment("center")}
              isActive={state.alignment === "center"}
              disabled={disabled}
              ariaLabel="Align center"
            >
              <AlignCenter size={iconSize} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => actions.setAlignment("right")}
              isActive={state.alignment === "right"}
              disabled={disabled}
              ariaLabel="Align right"
            >
              <AlignRight size={iconSize} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => actions.setAlignment("justify")}
              isActive={state.alignment === "justify"}
              disabled={disabled}
              ariaLabel="Justify"
            >
              <AlignJustify size={iconSize} />
            </ToolbarButton>
          </div>
          <div className="rte-align-collapsed">
            <AlignmentSelector
              currentAlignment={state.alignment}
              onChange={actions.setAlignment}
              disabled={disabled}
            />
          </div>
          <Divider />
        </>
      )}

      {/* ── Lists ─────────────────────────────────────────────── */}
      {(features.bulletList !== false ||
        features.numberedList !== false ||
        features.checkList !== false) && (
        <>
          <div className="rte-list-expanded">
            {features.bulletList !== false && (
              <ToolbarButton
                onClick={() => handleBlockTypeChange("bullet")}
                isActive={state.blockType === "bullet"}
                disabled={disabled}
                ariaLabel="Bullet list"
              >
                <List size={iconSize} />
              </ToolbarButton>
            )}
            {features.numberedList !== false && (
              <ToolbarButton
                onClick={() => handleBlockTypeChange("number")}
                isActive={state.blockType === "number"}
                disabled={disabled}
                ariaLabel="Numbered list"
              >
                <ListOrdered size={iconSize} />
              </ToolbarButton>
            )}
            {features.checkList !== false && (
              <ToolbarButton
                onClick={() => handleBlockTypeChange("check")}
                isActive={state.blockType === "check"}
                disabled={disabled}
                ariaLabel="Check list"
              >
                <ListChecks size={iconSize} />
              </ToolbarButton>
            )}
          </div>
          <div className="rte-list-collapsed">
            <ListSelector
              currentBlockType={state.blockType}
              onChange={handleBlockTypeChange}
              disabled={disabled}
              features={features}
            />
          </div>
          <Divider />
        </>
      )}

      {/* ── Blockquote ────────────────────────────────────────── */}

      {/* ── Blockquote ────────────────────────────────────────── */}

      {/* ── Undo / Redo ───────────────────────────────────────── */}

      {/* ── Dialogs ───────────────────────────────────────────── */}
      <LinkDialog
        isOpen={showLinkDialog}
        onClose={() => setShowLinkDialog(false)}
        onSubmit={handleLinkSubmit}
        onRemove={actions.removeLink}
        isEditing={state.isLink}
      />
      <ImageDialog
        isOpen={showImageDialog}
        onClose={() => setShowImageDialog(false)}
        onSubmit={handleImageSubmit}
        onOpenImageDrawer={onOpenImageDrawer}
      />
      <TableDialog
        isOpen={showTableDialog}
        onClose={() => setShowTableDialog(false)}
        onSubmit={handleTableSubmit}
      />

      {/* ── Actions (Undo/Redo & Fullscreen) ──────────────────── */}
      {(features.undoRedo !== false || onToggleFullscreen) && (
        <>
          <div className="rte-actions-expanded" style={{ marginLeft: "auto" }}>
            {features.undoRedo !== false && (
              <>
                <ToolbarButton
                  onClick={actions.undo}
                  disabled={disabled || !state.canUndo}
                  ariaLabel="Undo (Ctrl+Z)"
                >
                  <Undo2 size={iconSize} />
                </ToolbarButton>
                <ToolbarButton
                  onClick={actions.redo}
                  disabled={disabled || !state.canRedo}
                  ariaLabel="Redo (Ctrl+Shift+Z)"
                >
                  <Redo2 size={iconSize} />
                </ToolbarButton>
              </>
            )}
            {onToggleFullscreen && (
              <ToolbarButton
                onClick={onToggleFullscreen}
                disabled={disabled}
                ariaLabel={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize size={iconSize} />
                ) : (
                  <Maximize size={iconSize} />
                )}
              </ToolbarButton>
            )}
          </div>
          <div className="rte-actions-collapsed" style={{ marginLeft: "auto" }}>
            <ActionsSelector
              onUndo={actions.undo}
              onRedo={actions.redo}
              onToggleFullscreen={onToggleFullscreen}
              canUndo={state.canUndo}
              canRedo={state.canRedo}
              isFullscreen={isFullscreen}
              features={features}
              disabled={disabled}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(Toolbar);
