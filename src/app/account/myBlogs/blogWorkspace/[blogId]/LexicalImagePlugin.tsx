// src/app/account/myBlogs/blogWorkspace/[blogId]/LexicalImagePlugin.tsx

/**
 * Ansvar:
 * Registrerer kommandoen der indsætter billeder i Lexical editoren.
 *
 * Funktion:
 * - Definerer INSERT_IMAGE_COMMAND payload-format
 * - Opretter ImageNode og indsætter ved aktiv selection
 * - Har fallback ved tabt selection (fx efter modal-fokus)
 */
'use client';

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $insertNodes,
  COMMAND_PRIORITY_EDITOR,
  $getSelection,
  $isRangeSelection,
  $getRoot,
  $createParagraphNode,
} from "lexical";
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
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $insertNodes([imageNode]);
          return true;
        }

        // If modal interaction moved focus away from the editor, append safely at root.
        const root = $getRoot();
        root.append(imageNode);

        const paragraphNode = $createParagraphNode();
        root.append(paragraphNode);
        paragraphNode.selectStart();
        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
