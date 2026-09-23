import React from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEditorToolbar } from '../hooks/useEditorToolbar';
import Toolbar from '../components/Toolbar';
import type { RichTextEditorFeatures, CustomToolbarButton } from '../types';

interface ToolbarPluginProps {
  features: RichTextEditorFeatures;
  onOpenImageDrawer?: (callback: (url: string) => void) => void;
  onOpenVideoDrawer?: (callback: (url: string) => void) => void;
  onImageUpload?: (file: File) => Promise<string>;
  onVideoUpload?: (file: File) => Promise<string>;
  disabled?: boolean;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  customToolbarButtons?: CustomToolbarButton[];
}

/**
 * Smart plugin that connects the Toolbar component to the Lexical editor.
 * Manages toolbar state via useEditorToolbar hook and passes it to Toolbar.
 */
export default function ToolbarPlugin({
  features,
  onOpenImageDrawer,
  onOpenVideoDrawer,
  onImageUpload,
  onVideoUpload,
  disabled = false,
  isFullscreen,
  onToggleFullscreen,
  customToolbarButtons,
}: ToolbarPluginProps): React.ReactElement {
  const [editor] = useLexicalComposerContext();
  const { state, actions } = useEditorToolbar(editor);

  return (
    <Toolbar
      state={state}
      actions={actions}
      features={features}
      onOpenImageDrawer={onOpenImageDrawer}
      onOpenVideoDrawer={onOpenVideoDrawer}
      onImageUpload={onImageUpload}
      onVideoUpload={onVideoUpload}
      disabled={disabled}
      isFullscreen={isFullscreen}
      onToggleFullscreen={onToggleFullscreen}
      customToolbarButtons={customToolbarButtons}
    />
  );
}
