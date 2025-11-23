// src/app/account/myBlogs/blogWorkspace/[blogId]/LexicalYouTubeNode.tsx

'use client';

import {
  DecoratorNode,
  DOMConversionMap,
  DOMExportOutput,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';
import { JSX, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export interface YouTubeNodePayload {
  videoId: string;
  width?: number;
  key?: NodeKey;
}

export type SerializedYouTubeNode = Spread<
  {
    videoId: string;
    width: number;
  },
  SerializedLexicalNode
>;

function YouTubeNodeComponent({ node }: { node: YouTubeNode }) {
  const [editor] = useLexicalComposerContext();
  const [width, setWidth] = useState(node.__width);

  // Opdater både React state og node-data i Lexical
  const updateSize = (newWidth: number) => {
    setWidth(newWidth);
    editor.update(() => {
      // ✅ Brug getWritable() i stedet for getLatest()
      const writableNode = node.getWritable();
      writableNode.__width = newWidth;
    });
  };

  return (
    <div className="youtube-embed-wrapper my-4 flex flex-col items-center">
      <div
        style={{
          position: 'relative',
          paddingBottom: '56.25%' /* 16:9 aspect ratio */,
          height: 0,
          overflow: 'hidden',
          maxWidth: '100%',
          width: `${width}px`,
        }}
        className="rounded-lg shadow-lg mx-auto"
      >
        <iframe
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          src={`https://www.youtube.com/embed/${node.__videoId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video"
        />
      </div>

      {/* Width slider */}
      <div className="w-full flex flex-col items-center mt-2">
        <label className="text-xs text-zinc-400 mb-1">Video bredde: {width}px</label>
        <input
          type="range"
          min={320}
          max={1200}
          value={width}
          onChange={e => {
            const newWidth = Number(e.target.value);
            updateSize(newWidth);
          }}
          className="w-48"
        />
      </div>
    </div>
  );
}

export class YouTubeNode extends DecoratorNode<JSX.Element> {
  __videoId: string;
  __width: number;

  static getType(): string {
    return 'youtube';
  }

  static clone(node: YouTubeNode): YouTubeNode {
    return new YouTubeNode(node.__videoId, node.__width, node.__key);
  }

  constructor(videoId: string, width = 640, key?: NodeKey) {
    super(key);
    this.__videoId = videoId;
    this.__width = width;
  }

  createDOM(): HTMLElement {
    const div = document.createElement('div');
    div.className = 'youtube-embed-container';
    return div;
  }

  updateDOM(): false {
    return false;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('div');
    element.setAttribute('data-lexical-youtube', this.__videoId);
    element.setAttribute('data-width', this.__width.toString());
    element.className = 'youtube-embed';

    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.paddingBottom = '56.25%';
    wrapper.style.height = '0';
    wrapper.style.overflow = 'hidden';
    wrapper.style.maxWidth = '100%';
    wrapper.style.width = `${this.__width}px`;
    wrapper.style.margin = '0 auto';

    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.setAttribute('src', `https://www.youtube.com/embed/${this.__videoId}`);
    iframe.setAttribute('frameBorder', '0');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    iframe.setAttribute('allowFullScreen', 'true');

    wrapper.appendChild(iframe);
    element.appendChild(wrapper);
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      div: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-youtube')) {
          return null;
        }
        return {
          conversion: convertYouTubeElement,
          priority: 1,
        };
      },
    };
  }

  exportJSON(): SerializedYouTubeNode {
    return {
      type: 'youtube',
      version: 1,
      videoId: this.__videoId,
      width: this.__width,
    };
  }

  static importJSON(serializedNode: SerializedYouTubeNode): YouTubeNode {
    return $createYouTubeNode({
      videoId: serializedNode.videoId,
      width: serializedNode.width || 640,
    });
  }

  decorate(): JSX.Element {
    return <YouTubeNodeComponent node={this} />;
  }

  getVideoId(): string {
    return this.__videoId;
  }

  getWidth(): number {
    return this.__width;
  }
}

function convertYouTubeElement(domNode: HTMLElement): null | { node: YouTubeNode } {
  const videoId = domNode.getAttribute('data-lexical-youtube');
  const width = parseInt(domNode.getAttribute('data-width') || '640', 10);

  if (videoId) {
    const node = $createYouTubeNode({ videoId, width });
    return { node };
  }
  return null;
}

export function $createYouTubeNode({ videoId, width = 640, key }: YouTubeNodePayload): YouTubeNode {
  return new YouTubeNode(videoId, width, key);
}

export function $isYouTubeNode(node: LexicalNode | null | undefined): node is YouTubeNode {
  return node instanceof YouTubeNode;
}