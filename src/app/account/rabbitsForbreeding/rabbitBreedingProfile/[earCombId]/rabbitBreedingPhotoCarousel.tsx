// src/app/account/rabbitsForbreeding/rabbitBreedingProfile/[earCombId]/rabbitBreedingPhotoCarousel.tsx
import { useState } from "react";
import { PhotoPublicDTO } from "@/api/types/AngoraDTOs";
import { Button } from "@heroui/react";
import Image from 'next/image';
import { RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";

export default function RabbitBreedingPhotoCarousel({ photos }: { photos: PhotoPublicDTO[] }) {
  const [current, setCurrent] = useState(0);

  if (!photos || photos.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-center p-4 bg-zinc-900/50 rounded-lg">
        <div className="w-16 h-16 mb-4 text-zinc-500">
          {/* ...SVG eller ikon... */}
        </div>
        <p className="text-zinc-400">
          Der er endnu ikke uploadet billeder til denne kanin.
        </p>
      </div>
    );
  }

  const handlePrev = () => setCurrent((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  const handleNext = () => setCurrent((prev) => (prev === photos.length - 1 ? 0 : prev + 1));

  const photo = photos[current];

  return (
    <div className="relative aspect-square bg-zinc-900/50 rounded-lg overflow-hidden flex items-center justify-center">
      <Image
        src={photo.filePath}
        alt={photo.fileName || "Kanin billede"}
        width={400}
        height={400}
        className="w-full h-full object-cover"
        draggable={false}
      />
      {/* Carousel controls */}
      {photos.length > 1 && (
        <>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10"
            onPress={handlePrev}
            aria-label="Forrige billede"
          >
            <RiArrowLeftSLine className="text-xl" />
          </Button>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10"
            onPress={handleNext}
            aria-label="Næste billede"
          >
            <RiArrowRightSLine className="text-xl" />
          </Button>
        </>
      )}
      {/* Index indicator */}
      {photos.length > 1 && (
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {current + 1} / {photos.length}
        </div>
      )}
    </div>
  );
}