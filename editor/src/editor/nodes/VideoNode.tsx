import {
  $applyNodeReplacement,
  createCommand,
  DecoratorNode,
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type EditorConfig,
  type LexicalCommand,
  type LexicalNode,
  type NodeKey,
  type SerializedLexicalNode,
  type Spread,
} from 'lexical';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
} from 'lexical';
import type { VideoPayload } from '../types';

export type VideoAlignment = 'left' | 'center' | 'right' | 'inline';

type SerializedVideoNode = Spread<
  {
    src: string;
    width: number | 'inherit';
    height: number | 'inherit';
    alignment: VideoAlignment;
    autoplay: boolean;
    loop: boolean;
    muted: boolean;
    controls: boolean;
  },
  SerializedLexicalNode
>;

export const INSERT_VIDEO_COMMAND: LexicalCommand<VideoPayload> =
  createCommand('INSERT_VIDEO_COMMAND');

export const ON_VIDEO_DELETE_COMMAND: LexicalCommand<string> =
  createCommand('ON_VIDEO_DELETE_COMMAND');

function $convertVideoElement(domNode: HTMLElement): DOMConversionOutput | null {
  const video = domNode as HTMLVideoElement;
  if (video.src) {
    const width = video.width || video.videoWidth;
    const height = video.height || video.videoHeight;
    const alignment = (video.getAttribute('data-alignment') as VideoAlignment) || 'inline';
    
    const node = $createVideoNode({
      src: video.src,
      width: width || 'inherit',
      height: height || 'inherit',
      alignment,
      autoplay: video.autoplay,
      loop: video.loop,
      muted: video.muted,
      controls: video.controls,
    });
    return { node };
  }
  return null;
}

export class VideoNode extends DecoratorNode<React.ReactElement> {
  __src: string;
  __width: number | 'inherit';
  __height: number | 'inherit';
  __alignment: VideoAlignment;
  __autoplay: boolean;
  __loop: boolean;
  __muted: boolean;
  __controls: boolean;

  static getType(): string {
    return 'video';
  }

  static clone(node: VideoNode): VideoNode {
    return new VideoNode(
      node.__src,
      node.__width,
      node.__height,
      node.__alignment,
      node.__autoplay,
      node.__loop,
      node.__muted,
      node.__controls,
      node.__key,
    );
  }

  static importJSON(serializedNode: SerializedVideoNode): VideoNode {
    return $createVideoNode({
      src: serializedNode.src,
      width: serializedNode.width,
      height: serializedNode.height,
      alignment: serializedNode.alignment,
      autoplay: serializedNode.autoplay,
      loop: serializedNode.loop,
      muted: serializedNode.muted,
      controls: serializedNode.controls,
    });
  }

  static importDOM(): DOMConversionMap | null {
    return {
      video: () => ({
        conversion: $convertVideoElement,
        priority: 0,
      }),
    };
  }

  constructor(
    src: string,
    width: number | 'inherit' = 'inherit',
    height: number | 'inherit' = 'inherit',
    alignment: VideoAlignment = 'inline',
    autoplay: boolean = false,
    loop: boolean = false,
    muted: boolean = false,
    controls: boolean = true,
    key?: NodeKey,
  ) {
    super(key);
    this.__src = src;
    this.__width = width;
    this.__height = height;
    this.__alignment = alignment;
    this.__autoplay = autoplay;
    this.__loop = loop;
    this.__muted = muted;
    this.__controls = controls;
  }

  exportJSON(): SerializedVideoNode {
    return {
      type: 'video',
      version: 1,
      src: this.__src,
      width: this.__width,
      height: this.__height,
      alignment: this.__alignment,
      autoplay: this.__autoplay,
      loop: this.__loop,
      muted: this.__muted,
      controls: this.__controls,
    };
  }

  exportDOM(): DOMExportOutput {
    const span = document.createElement('span');
    span.className = 'rte-video-export-wrapper';
    span.style.display = 'inline-block';
    
    if (this.__alignment === 'left') span.style.cssFloat = 'left';
    else if (this.__alignment === 'right') span.style.cssFloat = 'right';
    else if (this.__alignment === 'center') {
      span.style.display = 'block';
      span.style.margin = '0 auto';
      span.style.textAlign = 'center';
    }
    
    const video = document.createElement('video');
    video.setAttribute('src', this.__src);
    video.setAttribute('data-alignment', this.__alignment);
    if (this.__autoplay) video.setAttribute('autoplay', 'true');
    if (this.__loop) video.setAttribute('loop', 'true');
    if (this.__muted) video.setAttribute('muted', 'true');
    if (this.__controls) video.setAttribute('controls', 'true');

    if (this.__width !== 'inherit') {
      video.style.width = `${this.__width}px`;
      video.style.height = 'auto';
    }
    
    span.appendChild(video);
    return { element: span };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span');
    span.className = 'rte-video-wrapper';
    return span;
  }

  updateDOM(prevNode: VideoNode): boolean {
    return (
      prevNode.__alignment !== this.__alignment ||
      prevNode.__width !== this.__width ||
      prevNode.__height !== this.__height ||
      prevNode.__src !== this.__src ||
      prevNode.__autoplay !== this.__autoplay ||
      prevNode.__loop !== this.__loop ||
      prevNode.__muted !== this.__muted ||
      prevNode.__controls !== this.__controls
    );
  }

  getSrc(): string { return this.__src; }
  getWidth(): number | 'inherit' { return this.__width; }
  getHeight(): number | 'inherit' { return this.__height; }
  getAlignment(): VideoAlignment { return this.__alignment; }

  setSrc(src: string): void {
    const self = this.getWritable();
    self.__src = src;
  }

  setWidth(width: number | 'inherit'): void {
    const self = this.getWritable();
    self.__width = width;
  }

  setHeight(height: number | 'inherit'): void {
    const self = this.getWritable();
    self.__height = height;
  }

  setAlignment(alignment: VideoAlignment): void {
    const self = this.getWritable();
    self.__alignment = alignment;
  }

  decorate(): React.ReactElement {
    return (
      <VideoComponent
        src={this.__src}
        width={this.__width}
        alignment={this.__alignment}
        autoplay={this.__autoplay}
        loop={this.__loop}
        muted={this.__muted}
        controls={this.__controls}
        nodeKey={this.__key}
      />
    );
  }
}

export function $createVideoNode(payload: VideoPayload): VideoNode {
  return $applyNodeReplacement(
    new VideoNode(
      payload.src,
      payload.width ?? 'inherit',
      payload.height ?? 'inherit',
      (payload.alignment as VideoAlignment) ?? 'inline',
      payload.autoplay ?? false,
      payload.loop ?? false,
      payload.muted ?? false,
      payload.controls ?? true,
    ),
  );
}

export function $isVideoNode(
  node: LexicalNode | null | undefined,
): node is VideoNode {
  return node instanceof VideoNode;
}

interface VideoComponentProps {
  src: string;
  width: number | 'inherit';
  alignment: VideoAlignment;
  autoplay: boolean;
  loop: boolean;
  muted: boolean;
  controls: boolean;
  nodeKey: NodeKey;
}

function VideoComponent({
  src,
  width,
  alignment,
  autoplay,
  loop,
  muted,
  controls,
  nodeKey,
}: VideoComponentProps): React.ReactElement {
  const [editor] = useLexicalComposerContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [isResizing, setIsResizing] = useState(false);
  const isEditable = editor.isEditable();

  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (isResizing) return false;

      if (event.target === videoRef.current) {
        if (!event.shiftKey) {
          clearSelection();
        }
        setSelected(true);
        return true;
      }
      return false;
    },
    [clearSelection, isResizing, setSelected],
  );

  const handleDelete = useCallback(
    (event: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        event.preventDefault();
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if ($isVideoNode(node)) {
            editor.dispatchCommand(ON_VIDEO_DELETE_COMMAND, node.getSrc());
            node.remove();
          }
        });
        return true;
      }
      return false;
    },
    [editor, isSelected, nodeKey],
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(CLICK_COMMAND, handleClick, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_BACKSPACE_COMMAND, handleDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_DELETE_COMMAND, handleDelete, COMMAND_PRIORITY_LOW),
    );
  }, [editor, handleClick, handleDelete]);

  const handleResizeMouseDown = useCallback(
    (event: React.MouseEvent, direction: 'e' | 'se') => {
      if (!isEditable) return;
      event.preventDefault();
      event.stopPropagation();

      const startX = event.clientX;
      const startWidth = width !== 'inherit' ? width : videoRef.current?.videoWidth || 300;

      setIsResizing(true);

      const handleMouseMove = (e: MouseEvent) => {
        const diff = e.clientX - startX;
        const newWidth = Math.max(50, startWidth + diff);
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if ($isVideoNode(node)) {
            node.setWidth(Math.round(newWidth));
          }
        });
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [editor, isEditable, nodeKey, width],
  );

  const videoStyle: React.CSSProperties = {
    width: width !== 'inherit' ? `${width}px` : undefined,
    height: 'auto',
    maxWidth: '100%',
  };

  return (
    <span
      className={`rte-video-container rte-video-align-${alignment}`}
      draggable={false}
    >
      <span className={`rte-video-inner ${isSelected ? 'rte-video-selected' : ''}`}>
        <video
          ref={videoRef}
          src={src}
          style={videoStyle}
          className="rte-video-element"
          draggable={false}
          controls={controls}
          autoPlay={autoplay}
          loop={loop}
          muted={muted}
        />

        {isSelected && isEditable && (
          <>
            <div
              className="rte-video-resize-handle rte-video-resize-e"
              onMouseDown={(e) => handleResizeMouseDown(e, 'e')}
              title="Drag to resize"
            />
            <div
              className="rte-video-resize-handle rte-video-resize-se"
              onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
              title="Drag to resize"
            />
          </>
        )}
      </span>
    </span>
  );
}
