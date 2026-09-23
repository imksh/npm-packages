import { useCallback, useEffect, useState, useRef } from "react";
import type { LexicalEditor, ElementNode, RangeSelection } from "lexical";
import {
  $getSelection,
  $isRangeSelection,
  $setSelection,
  $isTextNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $createParagraphNode,
} from "lexical";
import {
  $isHeadingNode,
  $createHeadingNode,
  type HeadingTagType,
} from "@lexical/rich-text";
import { $isListNode, ListNode } from "@lexical/list";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { $isCodeNode } from "@lexical/code";
import { $setBlocksType } from "@lexical/selection";
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from "@lexical/selection";
import {
  $findMatchingParent,
  $getNearestNodeOfType,
  mergeRegister,
} from "@lexical/utils";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import { $createQuoteNode, $isQuoteNode } from "@lexical/rich-text";
import { $createCodeNode } from "@lexical/code";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { INSERT_IMAGE_COMMAND } from "../nodes/ImageNode";
import { INSERT_VIDEO_COMMAND } from "../nodes/VideoNode";
import type {
  ToolbarState,
  ToolbarActions,
  BlockType,
  ElementAlignment,
  TextFormatType,
  ImagePayload,
  VideoPayload,
  InsertTablePayload,
} from "../types";
import { INITIAL_TOOLBAR_STATE } from "../types";

/**
 * Hook that manages toolbar state by listening to editor selection changes,
 * and provides action callbacks for formatting operations.
 */
export function useEditorToolbar(editor: LexicalEditor): {
  state: ToolbarState;
  actions: ToolbarActions;
} {
  const [state, setState] = useState<ToolbarState>(INITIAL_TOOLBAR_STATE);

  const lastSelectionRef = useRef<RangeSelection | null>(null);

  // ── Update toolbar state from selection ──────────────────────
  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    // Cache the active range selection so toolbar actions (like dropdowns and inputs)
    // can restore it even after the editor temporarily loses focus
    lastSelectionRef.current = selection.clone();

    // Text formatting
    const isBold = selection.hasFormat("bold");
    const isItalic = selection.hasFormat("italic");
    const isUnderline = selection.hasFormat("underline");
    const isStrikethrough = selection.hasFormat("strikethrough");
    const isCode = selection.hasFormat("code");

    // Font properties
    let fontSize = $getSelectionStyleValueForProperty(
      selection,
      "font-size",
      "16px",
    );

    // If selection is collapsed, also inspect the anchor text node directly in case
    // $getSelectionStyleValueForProperty skipped it due to boundary offset
    if (selection.isCollapsed()) {
      const anchorNode = selection.anchor.getNode();
      if ($isTextNode(anchorNode)) {
        const style = anchorNode.getStyle();
        const match = style.match(/font-size:\s*([^;]+)/);
        if (match) {
          fontSize = match[1].trim();
        }
      }
    }

    const fontColor = $getSelectionStyleValueForProperty(
      selection,
      "color",
      "",
    );
    const bgColor = $getSelectionStyleValueForProperty(
      selection,
      "background-color",
      "",
    );

    // Block type
    const anchorNode = selection.anchor.getNode();
    let element =
      anchorNode.getKey() === "root"
        ? anchorNode
        : ($findMatchingParent(anchorNode, (e) => {
            const parent = e.getParent();
            return parent !== null && parent.getKey() === "root";
          }) ?? anchorNode.getTopLevelElementOrThrow());

    let blockType: BlockType = "paragraph";
    let codeLanguage = "";

    if ($isHeadingNode(element)) {
      const tag = element.getTag();
      blockType = tag as BlockType;
    } else if ($isListNode(element)) {
      const listType = (element as ListNode).getListType();
      if (listType === "bullet") blockType = "bullet";
      else if (listType === "number") blockType = "number";
      else if (listType === "check") blockType = "check";
    } else if ($isQuoteNode(element)) {
      blockType = "quote";
    } else if ($isCodeNode(element)) {
      blockType = "code";
      codeLanguage =
        (element as ReturnType<typeof $createCodeNode>).getLanguage() || "";
    }

    // Check parent for list
    const parentList = $getNearestNodeOfType(anchorNode, ListNode);
    if (parentList) {
      const listType = parentList.getListType();
      if (listType === "bullet") blockType = "bullet";
      else if (listType === "number") blockType = "number";
      else if (listType === "check") blockType = "check";
    }

    // Alignment
    let alignment: ElementAlignment = "left";
    const formatType = (element as ElementNode).getFormatType?.();
    if (
      formatType === "center" ||
      formatType === "right" ||
      formatType === "justify"
    ) {
      alignment = formatType;
    } else if (
      formatType === "left" ||
      formatType === "" ||
      formatType === undefined
    ) {
      alignment = "left";
    }

    // Link
    const isLink =
      $findMatchingParent(anchorNode, $isLinkNode) !== null ||
      $findMatchingParent(selection.focus.getNode(), $isLinkNode) !== null;

    setState((prev) => ({
      ...prev,
      isBold,
      isItalic,
      isUnderline,
      isStrikethrough,
      isCode,
      blockType,
      alignment,
      fontSize,
      fontColor,
      bgColor,
      isLink,
      codeLanguage,
    }));
  }, []);

  // ── Register listeners ───────────────────────────────────────
  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (canUndo: boolean) => {
          setState((prev) => ({ ...prev, canUndo }));
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (canRedo: boolean) => {
          setState((prev) => ({ ...prev, canRedo }));
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, updateToolbar]);

  // ── Actions ──────────────────────────────────────────────────
  const formatText = useCallback(
    (format: TextFormatType) => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
    },
    [editor],
  );

  const formatBlock = useCallback(
    (blockType: BlockType) => {
      editor.update(() => {
        let selection = $getSelection();
        if (!$isRangeSelection(selection) && lastSelectionRef.current) {
          $setSelection(lastSelectionRef.current.clone());
          selection = $getSelection();
        }
        if (!$isRangeSelection(selection)) return;

        switch (blockType) {
          case "paragraph":
            $setBlocksType(selection, () => $createParagraphNode());
            break;
          case "h1":
            $setBlocksType(selection, () => $createHeadingNode("h1"));
            break;
          case "h2":
            $setBlocksType(selection, () => $createHeadingNode("h2"));
            break;
          case "h3":
            $setBlocksType(selection, () => $createHeadingNode("h3"));
            break;
          case "quote":
            $setBlocksType(selection, () => $createQuoteNode());
            break;
          case "code":
            $setBlocksType(selection, () => $createCodeNode());
            break;
          case "bullet":
            editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
            break;
          case "number":
            editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
            break;
          case "check":
            editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
            break;
        }
      });
      editor.focus();
    },
    [editor],
  );

  const setAlignment = useCallback(
    (alignment: ElementAlignment) => {
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, alignment);
    },
    [editor],
  );

  const setFontSize = useCallback(
    (size: string) => {
      editor.update(() => {
        let selection = $getSelection();
        if (!$isRangeSelection(selection) && lastSelectionRef.current) {
          $setSelection(lastSelectionRef.current.clone());
          selection = $getSelection();
        }
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, { "font-size": size });
        }
      });
      editor.focus();
    },
    [editor],
  );

  const setTextColor = useCallback(
    (color: string) => {
      editor.update(() => {
        let selection = $getSelection();
        if (!$isRangeSelection(selection) && lastSelectionRef.current) {
          $setSelection(lastSelectionRef.current.clone());
          selection = $getSelection();
        }
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, { color: color || null });
        }
      });
      editor.focus();
    },
    [editor],
  );

  const setBgColor = useCallback(
    (color: string) => {
      editor.update(() => {
        let selection = $getSelection();
        if (!$isRangeSelection(selection) && lastSelectionRef.current) {
          $setSelection(lastSelectionRef.current.clone());
          selection = $getSelection();
        }
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, { "background-color": color || null });
        }
      });
      editor.focus();
    },
    [editor],
  );

  const insertLink = useCallback(
    (url: string, text?: string) => {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, { url, title: text, target: '_blank', rel: 'noopener noreferrer' });
    },
    [editor],
  );

  const removeLink = useCallback(() => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
  }, [editor]);

  const insertImage = useCallback(
    (payload: ImagePayload) => {
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
    },
    [editor],
  );

  const insertVideo = useCallback(
    (payload: VideoPayload) => {
      editor.dispatchCommand(INSERT_VIDEO_COMMAND, payload);
    },
    [editor],
  );

  const insertTable = useCallback(
    (payload: InsertTablePayload) => {
      editor.dispatchCommand(INSERT_TABLE_COMMAND, {
        rows: String(payload.rows),
        columns: String(payload.columns),
      });
    },
    [editor],
  );

  const insertHorizontalRule = useCallback(() => {
    editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
  }, [editor]);

  const undo = useCallback(() => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  }, [editor]);

  const redo = useCallback(() => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  }, [editor]);

  const setCodeLanguage = useCallback(
    (language: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;
        const anchorNode = selection.anchor.getNode();
        const element =
          $findMatchingParent(anchorNode, (e) => {
            const parent = e.getParent();
            return parent !== null && parent.getKey() === "root";
          }) ?? anchorNode.getTopLevelElementOrThrow();

        if ($isCodeNode(element)) {
          element.setLanguage(language);
        }
      });
    },
    [editor],
  );

  const actions: ToolbarActions = {
    formatText,
    formatBlock,
    setAlignment,
    setFontSize,
    setTextColor,
    setBgColor,
    insertLink,
    removeLink,
    insertImage,
    insertVideo,
    insertTable,
    insertHorizontalRule,
    undo,
    redo,
    setCodeLanguage,
  };

  return { state, actions };
}
