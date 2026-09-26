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

// ─── Types ───────────────────────────────────────────────────────
export type ImageAlignment = 'left' | 'center' | 'right' | 'inline';

export interface ImagePayload {
  src: string;
  altText?: string;
  caption?: string;
  width?: number | 'inherit';
  height?: number | 'inherit';
  alignment?: ImageAlignment;
  rounded?: boolean;
  key?: NodeKey;
}

type SerializedImageNode = Spread<
  {
    src: string;
    altText: string;
    caption: string;
    width: number | 'inherit';
    height: number | 'inherit';
    alignment: ImageAlignment;
    rounded: boolean;
  },
  SerializedLexicalNode
>;

// ─── Commands ────────────────────────────────────────────────────
export const INSERT_IMAGE_COMMAND: LexicalCommand<ImagePayload> =
  createCommand('INSERT_IMAGE_COMMAND');

export const ON_IMAGE_DELETE_COMMAND: LexicalCommand<string> =
  createCommand('ON_IMAGE_DELETE_COMMAND');

// ─── DOM Conversion ──────────────────────────────────────────────
function $convertImageElement(domNode: HTMLElement): DOMConversionOutput | null {
  const img = domNode as HTMLImageElement;
  if (img.src) {
    // Prefer the HTML width attribute (set by exportDOM), then fall back
    // to inline style.width, then to the image's natural width.
    const attrWidth = img.getAttribute('width');
    const styleWidth = img.style.width ? parseInt(img.style.width, 10) : 0;
    const resolvedWidth = (attrWidth ? parseInt(attrWidth, 10) : 0) || styleWidth || img.naturalWidth;

    const alignment = (img.getAttribute('data-alignment') as ImageAlignment) || 'left';
    const caption = img.getAttribute('data-caption') || '';

    const node = $createImageNode({
      src: img.src,
      altText: img.alt || '',
      caption,
      width: resolvedWidth || 'inherit',
      height: 'inherit',
      alignment,
      rounded: img.getAttribute('data-rounded') !== 'false', // Default to true
    });
    return { node };
  }
  return null;
}

// Handles the <span class="rte-image-export-wrapper"> produced by exportDOM
// so that exported HTML round-trips correctly when loaded back into the editor.
function $convertImageWrapperElement(domNode: HTMLElement): DOMConversionOutput | null {
  const img = domNode.querySelector('img');
  if (!img) return null;

  // Derive alignment from the wrapper span's float / display style.
  let alignment: ImageAlignment = 'left';
  const float = domNode.style.cssFloat || domNode.style.float || '';
  const display = domNode.style.display || '';
  if (float === 'left') alignment = 'left';
  else if (float === 'right') alignment = 'right';
  else if (display === 'block') alignment = 'center';

  // Read the img's data-alignment attribute as a higher-priority fallback.
  const dataAlign = img.getAttribute('data-alignment') as ImageAlignment | null;
  if (dataAlign) alignment = dataAlign;

  const attrWidth = img.getAttribute('width');
  const styleWidth = img.style.width ? parseInt(img.style.width, 10) : 0;
  const resolvedWidth = (attrWidth ? parseInt(attrWidth, 10) : 0) || styleWidth || 0;

  const node = $createImageNode({
    src: img.src,
    altText: img.alt || '',
    caption: img.getAttribute('data-caption') || '',
    width: resolvedWidth || 'inherit',
    height: 'inherit',
    alignment,
    rounded: img.getAttribute('data-rounded') !== 'false',
  });
  return { node };
}

// ─── Image Node ──────────────────────────────────────────────────
export class ImageNode extends DecoratorNode<React.ReactElement> {
  __src: string;
  __altText: string;
  __caption: string;
  __width: number | 'inherit';
  __height: number | 'inherit';
  __alignment: ImageAlignment;
  __rounded: boolean;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__caption,
      node.__width,
      node.__height,
      node.__alignment,
      node.__rounded,
      node.__key,
    );
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    return $createImageNode({
      src: serializedNode.src,
      altText: serializedNode.altText,
      caption: serializedNode.caption,
      width: serializedNode.width,
      height: serializedNode.height,
      alignment: serializedNode.alignment,
      rounded: serializedNode.rounded,
    });
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: $convertImageElement,
        priority: 0,
      }),
      span: (node: Node) => {
        const el = node as HTMLElement;
        if (
          el.classList.contains('rte-image-export-wrapper') ||
          el.getAttribute('class') === 'rte-image-export-wrapper'
        ) {
          return {
            conversion: $convertImageWrapperElement,
            priority: 2, // Higher than default so it wins over generic span handling
          };
        }
        return null;
      },
    };
  }

  constructor(
    src: string,
    altText: string = '',
    caption: string = '',
    width: number | 'inherit' = 'inherit',
    height: number | 'inherit' = 'inherit',
    alignment: ImageAlignment = 'left',
    rounded: boolean = true,
    key?: NodeKey,
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__caption = caption;
    this.__width = width;
    this.__height = height;
    this.__alignment = alignment;
    this.__rounded = rounded;
  }

  exportJSON(): SerializedImageNode {
    return {
      type: 'image',
      version: 1,
      src: this.__src,
      altText: this.__altText,
      caption: this.__caption,
      width: this.__width,
      height: this.__height,
      alignment: this.__alignment,
      rounded: this.__rounded,
    };
  }

  exportDOM(): DOMExportOutput {
    const wrapper = document.createElement('span');
    wrapper.className = 'rte-image-export-wrapper';
    wrapper.style.display = 'block';
    wrapper.style.margin = '12px 0';

    const container = document.createElement('span');
    
    if (this.__alignment === 'left') {
      container.style.cssFloat = 'left';
      container.style.margin = '0 16px 16px 0';
    } else if (this.__alignment === 'right') {
      container.style.cssFloat = 'right';
      container.style.margin = '0 0 16px 16px';
    } else if (this.__alignment === 'center') {
      wrapper.style.textAlign = 'center';
      container.style.display = 'inline-block';
    } else {
      container.style.display = 'inline-block';
    }
    
    const img = document.createElement('img');
    img.setAttribute('src', this.__src);
    img.setAttribute('alt', this.__altText);
    img.setAttribute('data-alignment', this.__alignment);
    img.setAttribute('data-rounded', String(this.__rounded));
    if (this.__rounded) {
      img.style.borderRadius = '8px';
    }
    if (this.__caption) img.setAttribute('data-caption', this.__caption);

    if (this.__width !== 'inherit') {
      // Set both the HTML attribute (read back by $convertImageElement on re-import)
      // and the inline style (used by the UI renderer for display).
      img.setAttribute('width', String(this.__width));
      img.style.width = `${this.__width}px`;
      img.style.height = 'auto'; // Maintain aspect ratio
    }
    
    container.appendChild(img);
    
    if (this.__caption) {
      const cap = document.createElement('span');
      cap.className = 'rte-image-caption-export';
      cap.style.display = 'block';
      cap.style.textAlign = 'center';
      cap.style.fontSize = '0.85em';
      cap.style.color = '#6b7280';
      cap.innerText = this.__caption;
      container.appendChild(cap);
    }

    wrapper.appendChild(container);

    return { element: wrapper };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span');
    span.className = 'rte-image-wrapper';
    // By default decorator nodes have user-select: none, we must allow selection around it
    return span;
  }

  updateDOM(prevNode: ImageNode): boolean {
    return (
      prevNode.__alignment !== this.__alignment ||
      prevNode.__width !== this.__width ||
      prevNode.__height !== this.__height ||
      prevNode.__caption !== this.__caption ||
      prevNode.__src !== this.__src ||
      prevNode.__rounded !== this.__rounded
    );
  }

  // ── Getters / Setters ──────────────────────────────────────────
  getSrc(): string { return this.__src; }
  getAltText(): string { return this.__altText; }
  getCaption(): string { return this.__caption; }
  getWidth(): number | 'inherit' { return this.__width; }
  getHeight(): number | 'inherit' { return this.__height; }
  getAlignment(): ImageAlignment { return this.__alignment; }
  getRounded(): boolean { return this.__rounded; }

  setSrc(src: string): void {
    const self = this.getWritable();
    self.__src = src;
  }
  
  setCaption(caption: string): void {
    const self = this.getWritable();
    self.__caption = caption;
  }

  setWidth(width: number | 'inherit'): void {
    const self = this.getWritable();
    self.__width = width;
  }

  setHeight(height: number | 'inherit'): void {
    const self = this.getWritable();
    self.__height = height;
  }

  setAlignment(alignment: ImageAlignment): void {
    const self = this.getWritable();
    self.__alignment = alignment;
  }

  setRounded(rounded: boolean): void {
    const self = this.getWritable();
    self.__rounded = rounded;
  }

  // ── Decorate ───────────────────────────────────────────────────
  decorate(): React.ReactElement {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        caption={this.__caption}
        width={this.__width}
        alignment={this.__alignment}
        rounded={this.__rounded}
        nodeKey={this.__key}
      />
    );
  }
}

// ─── Factory ─────────────────────────────────────────────────────
export function $createImageNode(payload: ImagePayload): ImageNode {
  return $applyNodeReplacement(
    new ImageNode(
      payload.src,
      payload.altText ?? '',
      payload.caption ?? '',
      payload.width ?? 'inherit',
      payload.height ?? 'inherit',
      payload.alignment ?? 'left',
      payload.rounded ?? true,
      payload.key,
    ),
  );
}

export function $isImageNode(
  node: LexicalNode | null | undefined,
): node is ImageNode {
  return node instanceof ImageNode;
}

// ─── Image Component (Decorator) ─────────────────────────────────
interface ImageComponentProps {
  src: string;
  altText: string;
  caption: string;
  width: number | 'inherit';
  alignment: ImageAlignment;
  rounded: boolean;
  nodeKey: NodeKey;
}

function ImageComponent({
  src,
  altText,
  caption,
  width,
  alignment,
  rounded,
  nodeKey,
}: ImageComponentProps): React.ReactElement {
  const [editor] = useLexicalComposerContext();
  const imageRef = useRef<HTMLImageElement>(null);
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [isResizing, setIsResizing] = useState(false);
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [captionText, setCaptionText] = useState(caption);
  const isEditable = editor.isEditable();

  // ── Click to select ─────────────────────────────────────────
  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (isResizing) return false;
      
      // If clicking on caption input, don't trigger node selection
      if ((event.target as HTMLElement).tagName === 'INPUT') {
        return false;
      }

      if (event.target === imageRef.current) {
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

  // ── Delete selected image ──────────────────────────────────
  const handleDelete = useCallback(
    (event: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection()) && !isEditingCaption) {
        event.preventDefault();
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if ($isImageNode(node)) {
            editor.dispatchCommand(ON_IMAGE_DELETE_COMMAND, node.getSrc());
            node.remove();
          }
        });
        return true;
      }
      return false;
    },
    [editor, isSelected, nodeKey, isEditingCaption],
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(CLICK_COMMAND, handleClick, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_BACKSPACE_COMMAND, handleDelete, COMMAND_PRIORITY_LOW),
      editor.registerCommand(KEY_DELETE_COMMAND, handleDelete, COMMAND_PRIORITY_LOW),
    );
  }, [editor, handleClick, handleDelete]);

  // ── Resize handlers (Locks Aspect Ratio via CSS) ────────────
  const handleResizeMouseDown = useCallback(
    (event: React.MouseEvent, direction: 'e' | 'se' | 'nw' | 'ne' | 'sw') => {
      if (!isEditable) return;
      event.preventDefault();
      event.stopPropagation();

      const startX = event.clientX;
      const startWidth = width !== 'inherit' ? width : imageRef.current?.naturalWidth || 300;

      setIsResizing(true);

      const handleMouseMove = (e: MouseEvent) => {
        const diff = e.clientX - startX;
        // If dragging from the left side (west), moving left increases width.
        // If dragging from the right side (east), moving right increases width.
        const multiplier = direction.includes('w') ? -1 : 1;
        // Aspect ratio is naturally maintained by CSS height: auto
        const newWidth = Math.max(50, startWidth + diff * multiplier);
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if ($isImageNode(node)) {
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

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCaptionText(e.target.value);
  };
  
  const handleCaptionBlur = () => {
    setIsEditingCaption(false);
    if (captionText !== caption) {
      editor.update(() => {
        const node = $getNodeByKey(nodeKey);
        if ($isImageNode(node)) {
          node.setCaption(captionText);
        }
      });
    }
  };

  const handleCaptionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  const imgStyle: React.CSSProperties = {
    width: width !== 'inherit' ? `${width}px` : undefined,
    height: 'auto', // Maintain aspect ratio natively
    maxWidth: '100%',
  };

  return (
    <span
      className={`rte-image-container rte-image-align-${alignment}`}
      draggable={false}
    >
      <span className={`rte-image-inner ${isSelected ? 'rte-image-selected' : ''}`}>
        <img
          ref={imageRef}
          src={src}
          alt={altText}
          style={{
            ...imgStyle,
            borderRadius: rounded ? '8px' : '0px',
          }}
          className="rte-image-element"
          draggable={false}
        />

        {isSelected && isEditable && (
          <>
            <div
              className="rte-image-resize-handle rte-image-resize-nw"
              onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
              title="Drag to resize"
            />
            <div
              className="rte-image-resize-handle rte-image-resize-ne"
              onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
              title="Drag to resize"
            />
            <div
              className="rte-image-resize-handle rte-image-resize-sw"
              onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
              title="Drag to resize"
            />
            <div
              className="rte-image-resize-handle rte-image-resize-se"
              onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
              title="Drag to resize"
            />
          </>
        )}
        
        {/* Caption Input */}
        {(caption || (isSelected && isEditable)) && (
          <span className="rte-image-caption-wrapper">
            <input
              type="text"
              className="rte-image-caption-input"
              placeholder="Add a caption..."
              value={captionText}
              onChange={handleCaptionChange}
              onFocus={() => setIsEditingCaption(true)}
              onBlur={handleCaptionBlur}
              onKeyDown={handleCaptionKeyDown}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              disabled={!isEditable}
            />
          </span>
        )}
      </span>
    </span>
  );
}
