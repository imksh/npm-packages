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


const getYouTubeEmbedUrl = (
  url: string,
  autoplay?: boolean,
  loop?: boolean,
  muted?: boolean,
  controls?: boolean
) => {
  if (!url) {
    return '';
  }
  let videoId = '';
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('youtube.com')) {
      if (urlObj.pathname.startsWith('/shorts/')) {
        videoId = urlObj.pathname.split('/shorts/')[1]?.split('?')[0] || '';
      } else if (urlObj.pathname.startsWith('/embed/')) {
        videoId = urlObj.pathname.split('/embed/')[1]?.split('?')[0] || '';
      } else {
        videoId = urlObj.searchParams.get('v') || '';
      }
    } else if (urlObj.hostname.includes('youtu.be')) {
      videoId = urlObj.pathname.slice(1).split('?')[0];
    }
  } catch {
    // ignore
  }
  
  if (videoId) {
    let embedUrl = `https://www.youtube.com/embed/${videoId}?`;
    const params = new URLSearchParams();
    if (autoplay) params.append('autoplay', '1');
    if (loop) {
      params.append('loop', '1');
      params.append('playlist', videoId);
    }
    if (muted) params.append('mute', '1');
    if (controls === false) params.append('controls', '0');
    
    const qs = params.toString();
    return qs ? `${embedUrl}${qs}` : embedUrl.slice(0, -1);
  }
  return url;
};

export const INSERT_VIDEO_COMMAND: LexicalCommand<VideoPayload> =
  createCommand('INSERT_VIDEO_COMMAND');

export const ON_VIDEO_DELETE_COMMAND: LexicalCommand<string> =
  createCommand('ON_VIDEO_DELETE_COMMAND');

function $convertVideoElement(domNode: HTMLElement): DOMConversionOutput | null {
  const video = domNode as HTMLVideoElement;
  if (video.src) {
    // Prefer the HTML width attribute (set by exportDOM), then fall back
    // to inline style.width, then to the video's intrinsic width.
    const attrWidth = video.getAttribute('width');
    const styleWidth = video.style.width ? parseInt(video.style.width, 10) : 0;
    const resolvedWidth = (attrWidth ? parseInt(attrWidth, 10) : 0) || styleWidth || video.videoWidth;

    const alignment = (video.getAttribute('data-alignment') as VideoAlignment) || 'inline';

    const node = $createVideoNode({
      src: video.src,
      width: resolvedWidth || 'inherit',
      height: 'inherit',
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

// Handles the <span class="rte-video-export-wrapper"> produced by exportDOM
// so that exported HTML round-trips correctly when loaded back into the editor.
function $convertVideoWrapperElement(domNode: HTMLElement): DOMConversionOutput | null {
  const video = domNode.querySelector('video') || domNode.querySelector('iframe');
  if (!video) return null;

  // Derive alignment from the wrapper span's float / display style.
  let alignment: VideoAlignment = 'inline';
  const float = domNode.style.cssFloat || domNode.style.float || '';
  const display = domNode.style.display || '';
  if (float === 'left') alignment = 'left';
  else if (float === 'right') alignment = 'right';
  else if (display === 'block') alignment = 'center';

  // Read the video's data-alignment attribute as a higher-priority fallback.
  const dataAlign = video.getAttribute('data-alignment') as VideoAlignment | null;
  if (dataAlign) alignment = dataAlign;

  const attrWidth = video.getAttribute('width');
  const styleWidth = video.style.width ? parseInt(video.style.width, 10) : 0;
  const resolvedWidth = (attrWidth ? parseInt(attrWidth, 10) : 0) || styleWidth || 0;

  const node = $createVideoNode({
    src: video.src,
    width: resolvedWidth || 'inherit',
    height: 'inherit',
    alignment,
    autoplay: video.autoplay,
    loop: video.loop,
    muted: video.muted,
    controls: video.controls,
  });
  return { node };
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
      iframe: () => ({
        conversion: $convertVideoElement,
        priority: 0,
      }),
      span: (node: Node) => {
        const el = node as HTMLElement;
        if (
          el.classList.contains('rte-video-export-wrapper') ||
          el.getAttribute('class') === 'rte-video-export-wrapper'
        ) {
          return {
            conversion: $convertVideoWrapperElement,
            priority: 2,
          };
        }
        return null;
      },
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
    const wrapper = document.createElement('span');
    wrapper.className = 'rte-video-export-wrapper';
    wrapper.style.display = 'block';
    wrapper.style.margin = '12px 0';
    
    const youtubeUrl = getYouTubeEmbedUrl(this.__src, this.__autoplay, this.__loop, this.__muted, this.__controls);
    const isYoutube = youtubeUrl !== this.__src;
    
    const media = isYoutube ? document.createElement('iframe') : document.createElement('video');
    
    if (this.__alignment === 'left') {
      media.style.cssFloat = 'left';
      media.style.margin = '0 16px 16px 0';
    } else if (this.__alignment === 'right') {
      media.style.cssFloat = 'right';
      media.style.margin = '0 0 16px 16px';
    } else if (this.__alignment === 'center') {
      wrapper.style.textAlign = 'center';
      media.style.display = 'inline-block';
    } else {
      media.style.display = 'inline-block';
    }
    
    if (isYoutube) {
      media.setAttribute('src', youtubeUrl);
      media.setAttribute('frameborder', '0');
      media.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      media.setAttribute('allowfullscreen', 'true');
    } else {
      media.setAttribute('src', this.__src);
      if (this.__autoplay) media.setAttribute('autoplay', 'true');
      if (this.__loop) media.setAttribute('loop', 'true');
      if (this.__muted) media.setAttribute('muted', 'true');
      if (this.__controls) media.setAttribute('controls', 'true');
    }
    
    media.setAttribute('data-alignment', this.__alignment);

    if (this.__width !== 'inherit') {
      // Set both the HTML attribute (read back by $convertVideoElement on re-import)
      // and the inline style (used by the UI renderer for display).
      media.setAttribute('width', String(this.__width));
      media.style.width = `${this.__width}px`;
      media.style.height = 'auto';
      if (isYoutube) media.style.aspectRatio = '16/9';
    } else if (isYoutube) {
      media.setAttribute('width', '560');
      media.style.width = '560px';
      media.style.height = 'auto';
      media.style.aspectRatio = '16/9';
    }
    
    wrapper.appendChild(media);
    return { element: wrapper };
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


  setAutoplay(autoplay: boolean): void {
    const self = this.getWritable();
    self.__autoplay = autoplay;
  }

  setLoop(loop: boolean): void {
    const self = this.getWritable();
    self.__loop = loop;
  }

  setMuted(muted: boolean): void {
    const self = this.getWritable();
    self.__muted = muted;
  }

  setControls(controls: boolean): void {
    const self = this.getWritable();
    self.__controls = controls;
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
  const youtubeUrl = getYouTubeEmbedUrl(src, autoplay, loop, muted, controls);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [isResizing, setIsResizing] = useState(false);
  const isEditable = editor.isEditable();

  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (isResizing) return false;

      if (event.target === videoRef.current || event.target === overlayRef.current) {
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
    (event: React.MouseEvent, direction: 'e' | 'se' | 'nw' | 'ne' | 'sw') => {
      if (!isEditable) return;
      event.preventDefault();
      event.stopPropagation();

      const startX = event.clientX;
      const startWidth = width !== 'inherit' ? width : videoRef.current?.videoWidth || 300;

      setIsResizing(true);

      const handleMouseMove = (e: MouseEvent) => {
        const diff = e.clientX - startX;
        const multiplier = direction.includes('w') ? -1 : 1;
        const newWidth = Math.max(50, startWidth + diff * multiplier);
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

  const isYoutube = youtubeUrl !== src;
  const videoStyle: React.CSSProperties = {
    width: width !== 'inherit' ? `${width}px` : (isYoutube ? '560px' : undefined),
    height: 'auto',
    maxWidth: '100%',
  };

  return (
    <span
      className={`rte-video-container rte-video-align-${alignment}`}
      draggable={false}
    >
      <span className={`rte-video-inner ${isSelected ? 'rte-video-selected' : ''}`}>
        {youtubeUrl !== src ? (
          <>
            <iframe
              src={youtubeUrl}
              style={{ ...videoStyle, border: 'none', aspectRatio: '16/9', pointerEvents: isResizing ? 'none' : 'auto' }}
              className="rte-video-element"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="YouTube video player"
            />
            {isEditable && !isSelected && (
              <div
                ref={overlayRef}
                style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, cursor: 'pointer' }}
              />
            )}
          </>
        ) : (
          <video
            ref={videoRef}
            src={src}
            style={{ ...videoStyle, pointerEvents: isResizing ? 'none' : 'auto' }}
            className="rte-video-element"
            draggable={false}
            controls={controls}
            autoPlay={autoplay}
            loop={loop}
            muted={muted}
          />
        )}

        {isSelected && isEditable && (
          <>
            <div
              className="rte-video-resize-handle rte-video-resize-nw"
              onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
              title="Drag to resize"
            />
            <div
              className="rte-video-resize-handle rte-video-resize-ne"
              onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
              title="Drag to resize"
            />
            <div
              className="rte-video-resize-handle rte-video-resize-sw"
              onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
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
