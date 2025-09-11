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
import { Button, Modal, ModalContent, ModalHeader, ModalBody, Card, CardBody } from "@heroui/react";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaHeading,
  FaImage
} from "react-icons/fa";
import { INSERT_IMAGE_COMMAND } from "./LexicalImagePlugin";
import {
  fetchBlogImageUploadConfigAction,
  registerCloudinaryBlogPhotoAction
} from '@/app/actions/blog/blogActions';
import type { CloudinaryUploadConfigDTO, CloudinaryPhotoRegistryRequestDTO, PhotoPrivateDTO } from '@/api/types/AngoraDTOs';
import SimpleCloudinaryWidget from '@/components/cloudinary/SimpleCloudinaryWidget';
import CloudinaryImage from '@/components/cloudinary/CloudinaryImage';
import { toast } from 'react-toastify';

interface ImageSelectorProps {
  blogId: number;
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (src: string, alt: string) => void;
  existingPhotos: PhotoPrivateDTO[];
}

function ImageSelector({ blogId, isOpen, onClose, onImageSelect, existingPhotos }: ImageSelectorProps) {
  const [showUpload, setShowUpload] = useState(false);
  const [uploadConfig, setUploadConfig] = useState<CloudinaryUploadConfigDTO | null>(null);
  const [isLoadingConfig, setIsLoadingConfig] = useState(false);

  const handleUploadClick = async () => {
    setIsLoadingConfig(true);
    try {
      const result = await fetchBlogImageUploadConfigAction(blogId);
      if (result.success) {
        setUploadConfig(result.data);
        setShowUpload(true);
      } else {
        toast.error(`Kunne ikke hente upload konfiguration: ${result.error}`);
      }
    } catch {
      toast.error('Der skete en fejl ved forberedelse af upload');
    } finally {
      setIsLoadingConfig(false);
    }
  };

  const handlePhotoUploaded = async (photoData: CloudinaryPhotoRegistryRequestDTO) => {
    try {
      const result = await registerCloudinaryBlogPhotoAction(blogId, photoData);
      if (result.success) {
        const photo = result.data;
        const imageUrl = photo.filePath;

        onImageSelect(imageUrl, photo.fileName || 'Blog billede');
        setShowUpload(false);
        setUploadConfig(null);
        onClose();
        toast.success('Billede indsat i editor!');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error('Fejl ved registrering af billede');
      throw error;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader>Vælg eller Upload Billede</ModalHeader>
        <ModalBody className="pb-6">
          {!showUpload ? (
            <div className="space-y-4">
              {/* Upload knap */}
              <Button
                color="primary"
                onPress={handleUploadClick}
                isLoading={isLoadingConfig}
                startContent={<FaImage />}
                className="w-full"
              >
                Upload Nyt Billede
              </Button>

              {/* Eksisterende billeder */}
              {existingPhotos.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-zinc-100">Eksisterende Billeder</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                    {existingPhotos.map((photo) => (
                      <Card
                        key={photo.id}
                        className="cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all bg-zinc-800 border-zinc-700"
                        isPressable
                        onPress={() => {
                          // BRUG DIREKTE CLOUDINARY URL
                          const imageUrl = photo.filePath;
                          onImageSelect(imageUrl, photo.fileName || 'Blog billede');
                          onClose();
                        }}
                      >
                        <CardBody className="p-2">
                          <CloudinaryImage
                            publicId={photo.cloudinaryPublicId}
                            alt={photo.fileName || 'Blog billede'}
                            width={150}
                            height={100}
                            className="w-full h-20 object-cover rounded"
                            fallbackSrc={photo.filePath || photo.filePath}
                          />
                          <p className="text-xs text-zinc-400 mt-1 truncate">
                            {photo.fileName || 'Unavngivet'}
                          </p>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-zinc-100">Upload Nyt Billede</h4>
                <Button
                  size="sm"
                  variant="light"
                  onPress={() => setShowUpload(false)}
                >
                  Tilbage
                </Button>
              </div>

              {uploadConfig && (
                <SimpleCloudinaryWidget
                  uploadConfig={uploadConfig}
                  onPhotoUploaded={handlePhotoUploaded}
                  onComplete={() => {
                    setShowUpload(false);
                    setUploadConfig(null);
                  }}
                  onClose={() => {
                    setShowUpload(false);
                    setUploadConfig(null);
                  }}
                  widgetKey={`blog-editor-${blogId}-${Date.now()}`}
                  forceReload={true}
                />
              )}
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export function ToolbarPlugin({ blogId, existingPhotos = [] }: { blogId: number; existingPhotos?: PhotoPrivateDTO[] }) {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [blockType, setBlockType] = useState('paragraph');
  const [showImageSelector, setShowImageSelector] = useState(false);

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

  const insertImage = (src: string, alt: string) => {
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
      src,
      alt,
      width: 600,
      height: 400,
    });
  };

  return (
    <>
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

        {/* Billede knap */}
        <div className="flex items-center gap-1 mr-2">
          <Button
            size="sm"
            variant="light"
            onPress={() => setShowImageSelector(true)}
            startContent={<FaImage />}
            className="min-w-fit px-2"
          >
            Billede
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