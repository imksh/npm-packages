import { useEffect, useCallback } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  KEY_TAB_COMMAND,
  KEY_ENTER_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  $getSelection,
  $isRangeSelection,
} from "lexical";
import { mergeRegister } from "@lexical/utils";

/**
 * Registers keyboard shortcuts:
 * - Ctrl+B, Ctrl+I, Ctrl+U are handled natively by Lexical
 * - Ctrl+Z, Ctrl+Shift+Z are handled by HistoryPlugin
 * - Tab / Shift+Tab for indent/outdent
 */
export default function KeyboardShortcutPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return mergeRegister(
      // Tab handling
      editor.registerCommand(
        KEY_TAB_COMMAND,
        (event: KeyboardEvent) => {
          event.preventDefault();
          if (event.shiftKey) {
            editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
          } else {
            editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
          }
          return true;
        },
        COMMAND_PRIORITY_HIGH,
      ),
      // Enter handling for escaping inline code format
      editor.registerCommand(
        KEY_ENTER_COMMAND,
        (event: KeyboardEvent | null) => {
          editor.update(() => {
            const selection = $getSelection();
            if (
              $isRangeSelection(selection) &&
              selection.isCollapsed() &&
              selection.hasFormat("code")
            ) {
              selection.toggleFormat("code");
            }
          });
          // Return false so default Enter behavior (new line) still occurs,
          // but now the inline code format is toggled off for the new line!
          return false;
        },
        COMMAND_PRIORITY_HIGH,
      ),
    );
  }, [editor]);

  return null;
}
