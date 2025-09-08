// src/app/account/myBlogs/blogWorkspace/[blogId]/blogLexicalEditor.tsx
'use client';

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $getRoot, EditorState, LexicalEditor } from "lexical";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { useEffect, useRef } from "react";
import { ToolbarPlugin } from "./LexicalToolbarPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

interface Props {
  value: string;
  onChange: (html: string) => void;
}

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
  ],
  theme: {
    paragraph: "mb-2 text-zinc-300 leading-relaxed",
    heading: {
      h1: "text-2xl font-bold text-zinc-100 mb-4 mt-6",
      h2: "text-xl font-semibold text-zinc-100 mb-3 mt-5",
      h3: "text-lg font-medium text-zinc-100 mb-2 mt-4",
    },
    list: {
      ul: "list-disc ml-6 mb-4 space-y-1",
      ol: "list-decimal ml-6 mb-4 space-y-1",
      listitem: "text-zinc-300",
    },
    text: {
      bold: "font-bold text-zinc-100",
      italic: "italic text-zinc-300",
      underline: "underline",
      code: "bg-zinc-700 text-amber-300 px-1 rounded text-sm font-mono",
    },
    quote: "border-l-4 border-blue-500 pl-4 italic text-zinc-400 my-4",
    code: "bg-zinc-800 text-green-300 p-4 rounded font-mono text-sm overflow-x-auto my-4",
    link: "text-blue-400 hover:text-blue-300 underline",
  },
  onError(error: Error) {
    console.error('Lexical error:', error);
  },
  editorState: null,
};

export default function BlogLexicalEditor({ value, onChange }: Props) {
  const isInitialized = useRef(false);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="border rounded-lg bg-zinc-900 overflow-hidden">
        <ToolbarPlugin />
        
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable 
                className="min-h-[400px] p-4 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset" 
              />
            }
            placeholder={
              <div className="absolute top-4 left-4 text-zinc-500 pointer-events-none">
                Skriv dit blogindhold her...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>

        <HistoryPlugin />
        <ListPlugin />
        
        {/* HTML output */}
        <OnChangePlugin
          onChange={(editorState: EditorState, editor: LexicalEditor) => { // <-- RET HER
            editor.read(() => { // <-- BRUG editor
              const html = $generateHtmlFromNodes(editor, null); // <-- BRUG editor
              onChange(html);
            });
          }}
        />

        {/* Initialize with existing content */}
        <InitializeEditorPlugin initialHtml={value} isInitialized={isInitialized} />
      </div>
    </LexicalComposer>
  );
}

// Plugin to initialize editor with HTML content
function InitializeEditorPlugin({ 
  initialHtml, 
  isInitialized 
}: { 
  initialHtml: string;
  isInitialized: React.RefObject<boolean>;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (initialHtml && !isInitialized.current) {
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(initialHtml, 'text/html');
        const nodes = $generateNodesFromDOM(editor, dom);
        const root = $getRoot();
        root.clear();
        root.append(...nodes);
      });
      isInitialized.current = true;
    }
  }, [initialHtml, editor, isInitialized]);

  return null;
}