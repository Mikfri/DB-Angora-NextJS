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
} from 'lexical';
import { DecoratorNode } from 'lexical';
import Image from 'next/image';
import { JSX } from 'react';

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
    const element = document.createElement('img');
    element.setAttribute('src', this.__src);
    element.setAttribute('alt', this.__alt);
    element.setAttribute('width', this.__width.toString());
    element.setAttribute('height', this.__height.toString());
    element.className = 'blog-image';
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: convertImageElement,
        priority: 0,
      }),
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
    return (
      <div className="blog-image-container my-4">
        <Image
          src={this.__src}
          alt={this.__alt}
          width={this.__width}
          height={this.__height}
          className="max-w-full h-auto rounded-lg shadow-lg mx-auto block"
          style={{ width: 'auto', height: 'auto' }}
          priority={false}
          unoptimized={this.__src.startsWith('data:') || !this.__src.includes('res.cloudinary.com')}
        />
      </div>
    );
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