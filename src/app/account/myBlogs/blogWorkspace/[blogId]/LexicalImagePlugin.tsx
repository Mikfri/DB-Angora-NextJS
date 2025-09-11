// src/app/account/myBlogs/blogWorkspace/[blogId]/LexicalImagePlugin.tsx
'use client';

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodes, COMMAND_PRIORITY_EDITOR } from "lexical";
import { useEffect } from "react";
import { createCommand, LexicalCommand } from "lexical";
import { $createImageNode, ImageNode } from "./LexicalImageNode";

export const INSERT_IMAGE_COMMAND: LexicalCommand<{
  src: string;
  alt: string;
  width?: number;
  height?: number;
}> = createCommand('INSERT_IMAGE_COMMAND');

export function ImagePlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagePlugin: ImageNode not registered on editor');
    }

    return editor.registerCommand<{
      src: string;
      alt: string;
      width?: number;
      height?: number;
    }>(
      INSERT_IMAGE_COMMAND,
      (payload) => {
        const imageNode = $createImageNode(payload);
        $insertNodes([imageNode]);
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}