// src/app/account/myBlogs/blogWorkspace/[blogId]/LexicalEditor.tsx
/**
 * LexicalEditor.tsx
 * 
 * Ansvar:
 * Konfigurerer og renderer Lexical rich text editor til blog content.
 * Håndterer initialisering af editor med eksisterende HTML-indhold.
 * 
 * Funktioner:
 * - Initialiserer Lexical editor med custom nodes (heading, list, image, YouTube, etc.)
 * - Konverterer HTML til Lexical nodes ved indlæsning
 * - Konverterer Lexical nodes til HTML ved ændringer
 * - Tilbyder toolbar med formateringsmuligheder (bold, italic, headings, lists, etc.)
 * - Understøtter billede-indsættelse fra blog's photo gallery
 * 
 * Plugins:
 * - InitializeContentPlugin: Indlæser eksisterende HTML-content
 * - ToolbarPlugin: Formateringsværktøjer
 * - ImagePlugin: Håndterer billeder i content
 * - HistoryPlugin: Undo/redo funktionalitet
 * - OnChangePlugin: Synkroniserer ændringer til parent component
 * 
 * Bruges af: BlogContentEditor.tsx
 */

'use client';

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";  // ✅ Named import, ikke default
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListNode, ListItemNode } from "@lexical/list";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ImageNode } from "./LexicalImageNode";
import { ImagePlugin } from "./LexicalImagePlugin";
import { YouTubeNode } from "./LexicalYouTubeNode";
import type { EditorState, LexicalEditor } from "lexical";
import { $generateHtmlFromNodes } from "@lexical/html";
import { useRef } from "react";
import { ToolbarPlugin } from "./LexicalToolbarPlugin";
import type { PhotoPrivateDTO } from "@/api/types/AngoraDTOs";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateNodesFromDOM } from "@lexical/html";
import { $getRoot } from "lexical";
import { useEffect } from "react";

const initialConfig = {
  namespace: "BlogEditor",
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    CodeNode,
    CodeHighlightNode,
    AutoLinkNode,
    LinkNode,
    ImageNode,
    YouTubeNode,
  ],
  theme: {
    paragraph: "mb-2 text-body leading-relaxed",
    heading: {
      h1: "text-2xl font-bold text-heading mb-4 mt-6",
      h2: "text-xl font-semibold text-heading mb-3 mt-5",
      h3: "text-lg font-medium text-heading mb-2 mt-4",
    },
    list: {
      ul: "list-disc ml-6 mb-4 space-y-1",
      ol: "list-decimal ml-6 mb-4 space-y-1",
      listitem: "text-body",
    },
    text: {
      bold: "font-bold text-heading",
      italic: "italic text-body",
      underline: "underline",
      code: "bg-content2 text-foreground px-1 rounded text-sm font-mono",
    },
    quote: "border-l-4 border-primary pl-4 italic text-muted my-4",
    code: "bg-content2 text-foreground p-4 rounded font-mono text-sm overflow-x-auto my-4",
    link: "text-primary hover:text-primary/80 underline",
    image: "blog-image-container",
  },
  onError(error: Error) {
    console.error('Lexical error:', error);
  },
  editorState: null,
};

interface Props {
  value: string;
  onChange: (html: string) => void;
  blogId: number;
  existingPhotos?: PhotoPrivateDTO[];
}

// Opret en ny plugin til at initialisere content
function InitializeContentPlugin({ html }: { html: string }) {
  const [editor] = useLexicalComposerContext();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current || !html) return;

    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(html, 'text/html');
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();
      root.clear();
      root.append(...nodes);
    });

    isInitialized.current = true;
  }, [editor, html]);

  return null;
}

export default function BlogLexicalEditor({ value, onChange, blogId, existingPhotos = [] }: Props) {
  const editorContainerRef = useRef<HTMLDivElement>(null);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div 
        ref={editorContainerRef} 
        className="border border-divider rounded-lg bg-content2 overflow-hidden"
        style={{ position: "relative" }}
      >
        <ToolbarPlugin 
          blogId={blogId} 
          existingPhotos={existingPhotos} 
          editorContainerRef={editorContainerRef}
        />
        
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable 
                className="min-h-[400px] p-4 outline-none focus:ring-2 focus:ring-primary focus:ring-inset text-body" 
              />
            }
            placeholder={
              <div className="absolute top-4 left-4 text-muted pointer-events-none">
                Skriv dit blogindhold her...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>

        <HistoryPlugin />
        <ListPlugin />
        <ImagePlugin />
        
        <OnChangePlugin
          onChange={(editorState: EditorState, editor: LexicalEditor) => {
            editor.read(() => {
              const html = $generateHtmlFromNodes(editor, null);
              onChange(html);
            });
          }}
        />

        {/* Tilføj denne plugin til at initialisere content */}
        <InitializeContentPlugin html={value} />
      </div>
    </LexicalComposer>
  );
}