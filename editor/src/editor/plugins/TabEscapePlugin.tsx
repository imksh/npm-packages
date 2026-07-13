import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  KEY_TAB_COMMAND,
  COMMAND_PRIORITY_HIGH,
  $getSelection,
  $isNodeSelection,
  $isRangeSelection,
  $createParagraphNode,
  $createTextNode,
  $isTextNode,
} from "lexical";
import { $isImageNode } from "../nodes/ImageNode";
import { $isTableNode } from "@lexical/table";
import { $isCodeNode } from "@lexical/code";

/**
 * TabEscapePlugin
 * Allows the user to press Tab to escape out of selected Nodes (Image, Table, Code Block)
 * or to escape the 'code' text format if at the end of an inline code segment.
 */
export default function TabEscapePlugin(): null {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    return editor.registerCommand(
      KEY_TAB_COMMAND,
      (event: KeyboardEvent) => {
        let handled = false;

        editor.update(() => {
          const selection = $getSelection();

          if ($isNodeSelection(selection)) {
            const nodes = selection.getNodes();
            if (nodes.length === 1) {
              const node = nodes[0];
              if (
                $isImageNode(node) ||
                $isTableNode(node) ||
                $isCodeNode(node)
              ) {
                let next = node.getNextSibling();
                if (!next) {
                  next = $createParagraphNode();
                  node.insertAfter(next);
                }
                if (next.selectStart) {
                  next.selectStart();
                } else if (next.select) {
                  next.select();
                }
                handled = true;
                event.preventDefault();
              }
            }
          } else if ($isRangeSelection(selection) && selection.isCollapsed()) {
            const anchor = selection.anchor;
            const node = anchor.getNode();
            

            // 1. Check if they are inside a CodeNode (Code Block)
            let parent = node.getParent();
            
            // In Lexical, if anchor is a block, getNode() might be the block itself.
            if ($isCodeNode(node)) {
              parent = node;
            }

            if ($isCodeNode(parent)) {
              // If they are at the very end of the Code block, escape it!
              // We check if this is the last text node and we are at its end.
              const isAtEnd =
                anchor.offset === node.getTextContentSize() &&
                node.getNextSibling() === null;
              if (isAtEnd) {
                let next = parent.getNextSibling();
                if (!next) {
                  next = $createParagraphNode();
                  parent.insertAfter(next);
                }
                if (next.selectStart) next.selectStart();
                else if (next.select) next.select();
                handled = true;
                event.preventDefault();
              }
            }
            // 2. Check if they are in normal text but it has the 'code' format (Inline Code)
            else if ($isTextNode(node) && node.hasFormat("code")) {
              // If there's already a non-code text node right after, just jump to it
              const next = node.getNextSibling();
              if (next && $isTextNode(next) && !next.hasFormat("code")) {
                next.select(0, 0);
              } else {
                // Insert a visible, normal space to safely escape the format
                const spaceNode = $createTextNode(" ");
                spaceNode.setFormat(node.getFormat()); // Copy existing formats (like bold)
                spaceNode.toggleFormat("code"); // Remove code format
                if (selection.hasFormat("code")) {
                  selection.toggleFormat("code");
                }
                node.insertAfter(spaceNode);
                spaceNode.select(); // Place cursor after the newly inserted space
              }

              handled = true;
              event.preventDefault();
            }
          }
        });

        return handled;
      },
      COMMAND_PRIORITY_HIGH, // Use HIGH to intercept before default indent or table cell navigation if needed
    );
  }, [editor]);

  return null;
}
