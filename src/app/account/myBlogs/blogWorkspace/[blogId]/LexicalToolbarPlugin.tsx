// src/app/account/myBlogs/blogWorkspace/[blogId]/LexicalToolbarPlugin.tsx
'use client';

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { 
  $getSelection, 
  $isRangeSelection, 
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  $createParagraphNode
} from "lexical";
import { 
  $createHeadingNode,
  $createQuoteNode,
  HeadingTagType
} from "@lexical/rich-text";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  $isListNode
} from "@lexical/list";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { 
  FaBold, 
  FaItalic, 
  FaUnderline, 
  FaListUl, 
  FaListOl, 
  FaQuoteLeft,
  FaHeading
} from "react-icons/fa";

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [blockType, setBlockType] = useState('paragraph');

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));

      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();

      if ($isListNode(element)) {
        const listType = element.getListType();
        setBlockType(listType);
      } else {
        const type = element.getType();
        setBlockType(type);
      }
    }
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      1,
    );
  }, [editor, updateToolbar]);

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();
        element.replace($createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();
          element.replace($createHeadingNode(headingSize));
        }
      });
    }
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          const element = anchorNode.getKey() === 'root' ? anchorNode : anchorNode.getTopLevelElementOrThrow();
          element.replace($createQuoteNode());
        }
      });
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-zinc-700 bg-zinc-800">
      {/* Text formatting */}
      <div className="flex items-center gap-1 mr-2">
        <Button
          size="sm"
          variant={isBold ? "solid" : "light"}
          color={isBold ? "primary" : "default"}
          onPress={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
          isIconOnly
        >
          <FaBold />
        </Button>
        <Button
          size="sm"
          variant={isItalic ? "solid" : "light"}
          color={isItalic ? "primary" : "default"}
          onPress={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
          isIconOnly
        >
          <FaItalic />
        </Button>
        <Button
          size="sm"
          variant={isUnderline ? "solid" : "light"}
          color={isUnderline ? "primary" : "default"}
          onPress={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
          isIconOnly
        >
          <FaUnderline />
        </Button>
      </div>

      <div className="w-px h-6 bg-zinc-600 mx-2" />

      {/* Block formatting */}
      <div className="flex items-center gap-1 mr-2">
        <Button size="sm" variant="light" onPress={formatParagraph} className="min-w-fit px-2">
          Normal
        </Button>
        <Button size="sm" variant="light" onPress={() => formatHeading('h1')} startContent={<FaHeading />} className="min-w-fit px-2">
          H1
        </Button>
        <Button size="sm" variant="light" onPress={() => formatHeading('h2')} startContent={<FaHeading />} className="min-w-fit px-2">
          H2
        </Button>
        <Button size="sm" variant="light" onPress={() => formatHeading('h3')} startContent={<FaHeading />} className="min-w-fit px-2">
          H3
        </Button>
      </div>

      <div className="w-px h-6 bg-zinc-600 mx-2" />

      {/* Lists */}
      <div className="flex items-center gap-1 mr-2">
        <Button size="sm" variant="light" onPress={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)} isIconOnly>
          <FaListUl />
        </Button>
        <Button size="sm" variant="light" onPress={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)} isIconOnly>
          <FaListOl />
        </Button>
        <Button size="sm" variant="light" onPress={formatQuote} isIconOnly>
          <FaQuoteLeft />
        </Button>
      </div>
    </div>
  );
}