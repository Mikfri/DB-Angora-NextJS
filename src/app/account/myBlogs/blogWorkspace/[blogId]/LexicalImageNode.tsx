// src/app/account/myBlogs/blogWorkspace/[blogId]/LexicalImageNode.tsx
'use client';

import {
  $applyNodeReplacement,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
} from 'lexical';
import { DecoratorNode } from 'lexical';
import Image from 'next/image';
import { JSX, useState, useEffect, useCallback } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import { FaTrash, FaExpand, FaCompress } from 'react-icons/fa';

export interface ImagePayload {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  key?: NodeKey;
}

export type SerializedImageNode = Spread<
  {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  },
  SerializedLexicalNode
>;

function ImageNodeComponent({ node, nodeKey }: { node: ImageNode; nodeKey: NodeKey }) {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] = useLexicalNodeSelection(nodeKey);
  const [width, setWidth] = useState(node.__width);
  const [showControls, setShowControls] = useState(false);
  
  const aspectRatio = node.__width / node.__height;
  const height = Math.round(width / aspectRatio);

  // Håndter sletning af billedet
  const handleDelete = useCallback(() => {
    editor.update(() => {
      const nodeToRemove = node.getLatest();
      nodeToRemove.remove();
    });
  }, [editor, node]);

  // Håndter Delete/Backspace når billedet er valgt
  useEffect(() => {
    return mergeRegister(
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (event) => {
          const target = event.target as HTMLElement;
          // Tjek om klikket var på dette billede
          if (target.closest(`[data-image-key="${nodeKey}"]`)) {
            if (!event.shiftKey) {
              clearSelection();
            }
            setSelected(true);
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        () => {
          if (isSelected) {
            handleDelete();
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        () => {
          if (isSelected) {
            handleDelete();
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [editor, isSelected, nodeKey, clearSelection, setSelected, handleDelete]);

  // Opdater størrelse
  const updateSize = (newWidth: number) => {
    setWidth(newWidth);
    editor.update(() => {
      const writableNode = node.getWritable();
      writableNode.__width = newWidth;
      writableNode.__height = Math.round(newWidth / aspectRatio);
    });
  };

  // Preset størrelser
  const presetSizes = [
    { label: 'S', width: 300 },
    { label: 'M', width: 500 },
    { label: 'L', width: 800 },
    { label: 'XL', width: 1000 },
  ];

  return (
    <div 
      data-image-key={nodeKey}
        className={`blog-image-container flex flex-col items-center relative group ${
        isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background rounded-lg' : ''
      }`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Billede */}
      <div className="relative">
        <Image
          src={node.__src}
          alt={node.__alt}
          width={width}
          height={height}
          className={`max-w-full h-auto rounded-lg shadow-lg mx-auto block cursor-pointer transition-all duration-200 ${
            isSelected ? 'brightness-95' : 'hover:brightness-95'
          }`}
          style={{ width, height: 'auto' }}
          priority={false}
          unoptimized={node.__src.startsWith('data:') || !node.__src.includes('res.cloudinary.com')}
          onClick={() => setSelected(!isSelected)}
        />

        {/* Overlay controls - vises ved hover eller selection */}
        {(showControls || isSelected) && (
          <div className="absolute top-2 right-2 flex gap-1">
            {/* Slet knap */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="p-2 bg-danger/90 hover:bg-danger text-white rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
              title="Slet billede (Delete/Backspace)"
            >
              <FaTrash className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Selection indicator */}
        {isSelected && (
          <div className="absolute bottom-2 left-2 bg-primary/90 text-white text-xs px-2 py-1 rounded">
            Valgt - tryk Delete for at slette
          </div>
        )}
      </div>

      {/* Resize controls - kun synlige når valgt eller hover */}
      {(showControls || isSelected) && (
        <div className="w-full flex flex-col items-center mt-3 p-3 bg-content2/80 backdrop-blur-sm rounded-lg border border-divider">
          {/* Preset størrelser */}
          <div className="flex gap-2 mb-2">
            {presetSizes.map((preset) => (
              <button
                key={preset.label}
                type="button"  // <-- TILFØJ DETTE for at undgå form submission
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  updateSize(preset.width);
                }}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                  Math.abs(width - preset.width) < 50
                    ? 'bg-primary text-white'
                    : 'bg-content1 text-foreground/70 hover:bg-content1/80'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Slider */}
          <div className="w-full flex items-center gap-3">
            <FaCompress className="text-foreground/50 w-3 h-3" />
            <input
              type="range"
              min={Math.max(100, Math.round(node.__width * 0.2))}
              max={Math.min(1200, Math.round(node.__width * 2))}
              value={width}
              onChange={(e) => updateSize(Number(e.target.value))}
              className="flex-1 accent-primary"
            />
            <FaExpand className="text-foreground/50 w-3 h-3" />
            <span className="text-xs text-foreground/60 min-w-[50px] text-right">
              {width}px
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __alt: string;
  __width: number;
  __height: number;

  static getType(): string {
    return 'image';
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__alt,
      node.__width,
      node.__height,
      node.__key,
    );
  }

  constructor(
    src: string,
    alt: string,
    width = 600,
    height = 400,
    key?: NodeKey,
  ) {
    super(key);
    this.__src = src;
    this.__alt = alt;
    this.__width = width;
    this.__height = height;
  }

  exportDOM(): DOMExportOutput {
    // Opret wrapper div til centrering (matcher editor-mode styling)
    const wrapper = document.createElement('div');
    wrapper.className = 'blog-image-wrapper flex justify-center';
    
    // Opret img element
    const img = document.createElement('img');
    img.setAttribute('src', this.__src);
    img.setAttribute('alt', this.__alt);
    img.setAttribute('width', this.__width.toString());
    img.setAttribute('height', this.__height.toString());
    img.className = 'blog-image max-w-full h-auto rounded-lg shadow-lg cursor-pointer';
    
    // Tilføj img til wrapper
    wrapper.appendChild(img);
    
    return { element: wrapper };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: convertImageElement,
        priority: 0,
      }),
      // Håndter wrapper divs der indeholder billeder
      div: (domNode: HTMLElement) => {
        if (domNode.classList.contains('blog-image-wrapper')) {
          const img = domNode.querySelector('img');
          if (img) {
            return {
              conversion: () => convertImageElement(img),
              priority: 1,
            };
          }
        }
        return null;
      },
    };
  }

  exportJSON(): SerializedImageNode {
    return {
      src: this.__src,
      alt: this.__alt,
      width: this.__width,
      height: this.__height,
      type: 'image',
      version: 1,
    };
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { src, alt, width = 600, height = 400 } = serializedNode;
    return $createImageNode({ src, alt, width, height });
  }

  getSrc(): string {
    return this.__src;
  }

  getAlt(): string {
    return this.__alt;
  }

  getWidth(): number {
    return this.__width;
  }

  getHeight(): number {
    return this.__height;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span');
    const className = config.theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM(): false {
    return false;
  }

  decorate(): JSX.Element {
    return <ImageNodeComponent node={this} nodeKey={this.__key} />;
  }
}

export function $createImageNode(payload: ImagePayload): ImageNode {
  const { src, alt, width = 600, height = 400, key } = payload;
  return $applyNodeReplacement(new ImageNode(src, alt, width, height, key));
}

export function $isImageNode(
  node: LexicalNode | null | undefined,
): node is ImageNode {
  return node instanceof ImageNode;
}

function convertImageElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLImageElement) {
    const { src, alt } = domNode;
    const width = domNode.width || 600;
    const height = domNode.height || 400;
    
    return { 
      node: $createImageNode({ src, alt, width, height }) 
    };
  }
  return null;
}