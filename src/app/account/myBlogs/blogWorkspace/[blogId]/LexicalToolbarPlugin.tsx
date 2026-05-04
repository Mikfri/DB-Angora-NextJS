// src/app/account/myBlogs/blogWorkspace/[blogId]/LexicalToolbarPlugin.tsx

/**
 * Ansvar:
 * Leverer toolbar og hjælpefunktioner til formatering i blog-editoren.
 *
 * Funktion:
 * - Håndterer text/block-formattering (bold, headings, lister, citat)
 * - Åbner image-selector modal og indsætter valgte billeder
 * - Understøtter YouTube-indsættelse og højrekliksmenu
 */
'use client';

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
  $insertNodes,
} from "lexical";
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingTagType,
} from "@lexical/rich-text";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode
} from "@lexical/list";
import { useCallback, useEffect, useState } from "react";
import { Button, Modal } from "@heroui/react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaHeading,
  FaImage,
  FaYoutube
} from "react-icons/fa";
import { INSERT_IMAGE_COMMAND } from "./LexicalImagePlugin";
import {
  fetchBlogImageUploadConfigAction,
  registerCloudinaryBlogPhotoAction
} from '@/app/actions/blog/blogActions';
import type { CloudinaryUploadConfigDTO, CloudinaryPhotoRegistryRequestDTO, PhotoPrivateDTO } from '@/api/types/AngoraDTOs';
import CloudinaryUploadButton from '@/components/cloudinary/CloudinaryUploadButton';
import CloudinaryImage from '@/components/cloudinary/CloudinaryImage';
import { toast } from 'react-toastify';
import { ContextMenu } from "./LexicalContextMenu"; // Tilføj denne import
import { $createYouTubeNode } from "./LexicalYouTubeNode";

interface ImageSelectorProps {
  blogId: number;
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (src: string, alt: string) => void;
  existingPhotos: PhotoPrivateDTO[];
}

function ImageSelector({ blogId, isOpen, onClose, onImageSelect, existingPhotos }: ImageSelectorProps) {
  const [uploadConfig, setUploadConfig] = useState<CloudinaryUploadConfigDTO | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);

  // Hent upload-config når modalen åbnes
  useEffect(() => {
    if (!isOpen) return;
    setIsLoadingConfig(true);
    fetchBlogImageUploadConfigAction(blogId)
      .then((result) => {
        if (result.success) {
          setUploadConfig(result.data);
        } else {
          toast.error(`Kunne ikke hente upload konfiguration: ${result.error}`);
        }
      })
      .catch(() => toast.error('Der skete en fejl ved forberedelse af upload'))
      .finally(() => setIsLoadingConfig(false));
  }, [isOpen, blogId]);

  const handlePhotoUploaded = async (photoData: CloudinaryPhotoRegistryRequestDTO) => {
    try {
      const result = await registerCloudinaryBlogPhotoAction(blogId, photoData);
      if (result.success) {
        const photo = result.data;
        onImageSelect(photo.filePath, photo.fileName || 'Blog billede');
        onClose();
        toast.success('Billede indsat i editor!');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error('Fejl ved registrering af billede');
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Heading>Vælg eller Upload Billede</Modal.Heading>
            </Modal.Header>
            <Modal.Body className="pb-6">
              <div className="space-y-4">
              {/* Upload knap */}
              {uploadConfig ? (
                <CloudinaryUploadButton
                  uploadConfig={uploadConfig}
                  onPhotoUploaded={handlePhotoUploaded}
                  onClose={onClose}
                >
                  {(open) => (
                    <Button
                      variant="primary"
                      onPress={() => open()}
                      className="w-full"
                    >
                      <FaImage /> Upload Nyt Billede
                    </Button>
                  )}
                </CloudinaryUploadButton>
              ) : (
                <Button
                  variant="primary"
                  isPending={isLoadingConfig}
                  isDisabled={isLoadingConfig}
                  className="w-full"
                >
                  <FaImage /> Upload Nyt Billede
                </Button>
              )}

              {/* Eksisterende billeder */}
              {existingPhotos.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-heading">Eksisterende Billeder</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                    {existingPhotos.map((photo) => (
                      <div
                        key={photo.id}
                        className="cursor-pointer hover:ring-2 hover:ring-primary transition-all bg-content2 border-divider rounded-lg"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          const imageUrl = photo.filePath;
                          onImageSelect(imageUrl, photo.fileName || 'Blog billede');
                          onClose();
                        }}
                      >
                        <div className="p-2">
                          <CloudinaryImage
                            publicId={photo.cloudinaryPublicId}
                            alt={photo.fileName || 'Blog billede'}
                            width={150}
                            height={100}
                            className="w-full h-20 object-cover rounded"
                            fallbackSrc={photo.filePath || photo.filePath}
                          />
                          <p className="text-xs text-muted mt-1 truncate">
                            {photo.fileName || 'Unavngivet'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              </div>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export function ToolbarPlugin({
  blogId,
  existingPhotos = [],
  editorContainerRef
}: {
  blogId: number;
  existingPhotos?: PhotoPrivateDTO[];
  editorContainerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [blockType, setBlockType] = useState('paragraph');
  const [showImageSelector, setShowImageSelector] = useState(false);

  // Context menu state
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

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
  }, []);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateToolbar();
        return false;
      },
      1,
    );
  }, [updateToolbar, editor]);

  const formatHeading = (headingSize: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        // FIX: Hvis anchorNode er root, gør ikke noget
        if (anchorNode.getKey() === 'root') return;
        const element = anchorNode.getTopLevelElementOrThrow();
        const heading = $createHeadingNode(headingSize);
        heading.append(...element.getChildren());
        element.replace(heading);
        heading.selectEnd();
      }
    });
  };

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        if (anchorNode.getKey() === 'root') return;
        const element = anchorNode.getTopLevelElementOrThrow();
        const paragraph = $createParagraphNode();
        paragraph.append(...element.getChildren());
        element.replace(paragraph);
        paragraph.selectEnd();
      }
    });
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        if (anchorNode.getKey() === 'root') return;
        const element = anchorNode.getTopLevelElementOrThrow();
        const quote = $createQuoteNode();
        quote.append(...element.getChildren());
        element.replace(quote);
        quote.selectEnd();
      }
    });
  };

  const insertImage = (src: string, alt: string) => {
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
      src,
      alt,
      width: 600,
      height: 400,
    });
  };

  const toggleList = (listType: 'bullet' | 'number') => {
    if (blockType === listType) {
      // Hvis allerede i listen, fjern den
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      // Ellers indsæt listen
      if (listType === 'bullet') {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      } else {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      }
    }
  };

  const insertYouTube = () => {
    const url = prompt('Indsæt YouTube URL:');
    if (!url) return;
    
    // Udtræk video ID fra URL
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (!match) {
      alert('Ugyldig YouTube URL');
      return;
    }
    
    const videoId = match[1];
    
    editor.update(() => {
      const youtubeNode = $createYouTubeNode({ videoId });
      $insertNodes([youtubeNode]);
    });
  };

  // Håndter højreklik i editoren
  useEffect(() => {
    const editorElem = editor.getRootElement();
    if (!editorElem) return;

    const handleContextMenu = (e: Event) => {
      e.preventDefault();
      const mouseEvent = e as MouseEvent;
      if (editorContainerRef.current) {
        const rect = editorContainerRef.current.getBoundingClientRect();
        setContextMenu({
          x: mouseEvent.clientX - rect.left,
          y: mouseEvent.clientY - rect.top,
        });
      }
    };

    editorElem.addEventListener("contextmenu", handleContextMenu as EventListener);
    return () => {
      editorElem.removeEventListener("contextmenu", handleContextMenu as EventListener);
    };
  }, [editor, editorContainerRef]);

  // Håndter valg i context menuen
  const handleFormat = (type: string) => {
    console.log("Format valgt:", type);
    if (type === "bold") editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
    if (type === "italic") editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
    if (type === "underline") editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
    if (type === "bullet") toggleList("bullet");
    if (type === "number") toggleList("number");
    if (type === "h1") formatHeading("h1");
    if (type === "h2") formatHeading("h2");
    if (type === "h3") formatHeading("h3");
    if (type === "normal") formatParagraph();
    if (type === "quote") formatQuote();
    if (type === "image") setShowImageSelector(true);
    setContextMenu(null);
  };

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-divider bg-content1">
        {/* Text formatting */}
        <div className="flex items-center gap-1 mr-2">
          <Button
            size="sm"
            variant={isBold ? "primary" : "ghost"}
            onPress={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
            isIconOnly
          >
            <FaBold />
          </Button>
          <Button
            size="sm"
            variant={isItalic ? "primary" : "ghost"}
            onPress={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
            isIconOnly
          >
            <FaItalic />
          </Button>
          <Button
            size="sm"
            variant={isUnderline ? "primary" : "ghost"}
            onPress={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
            isIconOnly
          >
            <FaUnderline />
          </Button>
        </div>

        <div className="w-px h-6 bg-zinc-600 mx-2" />

        {/* Block formatting */}
        <div className="flex items-center gap-1 mr-2">
          <Button size="sm" variant="ghost" onPress={formatParagraph} className="min-w-fit px-2">
            Normal
          </Button>
          <Button size="sm" variant="ghost" onPress={() => formatHeading('h1')} className="min-w-fit px-2">
            <FaHeading /> H1
          </Button>
          <Button size="sm" variant="ghost" onPress={() => formatHeading('h2')} className="min-w-fit px-2">
            <FaHeading /> H2
          </Button>
          <Button size="sm" variant="ghost" onPress={() => formatHeading('h3')} className="min-w-fit px-2">
            <FaHeading /> H3
          </Button>
        </div>

        <div className="w-px h-6 bg-zinc-600 mx-2" />

        {/* Billede knap */}
        <div className="flex items-center gap-1 mr-2">
          <Button
            size="sm"
            variant="ghost"
            onPress={() => setShowImageSelector(true)}
            className="min-w-fit px-2"
          >
            <FaImage /> Billede
          </Button>
        </div>

        <div className="w-px h-6 bg-zinc-600 mx-2" />

        {/* Lists */}
        <div className="flex items-center gap-1 mr-2">
          <Button
            size="sm"
            variant={blockType === 'bullet' ? "primary" : "ghost"}
            onPress={() => toggleList('bullet')}
            isIconOnly
          >
            <FaListUl />
          </Button>
          <Button
            size="sm"
            variant={blockType === 'number' ? "primary" : "ghost"}
            onPress={() => toggleList('number')}
            isIconOnly
          >
            <FaListOl />
          </Button>
          <Button size="sm" variant="ghost" onPress={formatQuote} isIconOnly>
            <FaQuoteLeft />
          </Button>
        </div>

        <div className="w-px h-6 bg-zinc-600 mx-2" />

        {/* YouTube knap */}
        <div className="flex items-center gap-1 mr-2">
          <Button
            size="sm"
            variant="ghost"
            onPress={insertYouTube}
            className="min-w-fit px-2"
          >
            <FaYoutube className="text-red-500" /> YouTube
          </Button>
        </div>
      </div>

      {/* Context menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onFormat={handleFormat}
          onClose={() => setContextMenu(null)}
        />
      )}

      <ImageSelector
        blogId={blogId}
        isOpen={showImageSelector}
        onClose={() => setShowImageSelector(false)}
        onImageSelect={insertImage}
        existingPhotos={existingPhotos}
      />
    </>
  );
}
