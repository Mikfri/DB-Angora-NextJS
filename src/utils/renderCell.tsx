import React, { ReactNode } from "react";
import Image from "next/image";
import { PiRabbitFill, PiRabbit } from "react-icons/pi";
import { Input, Switch } from "@nextui-org/react";
import { Rabbit_ProfileDTO, Rabbit_UpdateDTO } from "@/Types/AngoraDTOs";
import EnumAutocomplete from "@/components/enumHandlers/enumAutocomplete";

/**
 * Hjælpefunktion:
 * Tjekker om “far/mor”-id (placeholderId) reelt findes i systemet
 */
function isParentValid(placeholderId: string | null, actualId: string | null): boolean {
  return !!placeholderId && placeholderId === actualId;
}

/**
 * Felter, der kan redigeres ved hjælp af tekst/autocomplete/switch
 */
const editableFields: Array<keyof Rabbit_UpdateDTO> = [
  "nickName",
  "race",
  "color",
  "gender",
  "forSale",
  "forBreeding",
];

/**
 * Hovedfunktion: returnerer JSX alt efter om vi er i vis-tilstand eller redigér-tilstand
 */
export function renderCell(
  key: keyof Rabbit_ProfileDTO,
  value: unknown,
  isEditing: boolean,
  editedData: Rabbit_ProfileDTO,
  setEditedData: (data: Rabbit_ProfileDTO) => void,
  rabbitProfile?: Rabbit_ProfileDTO
): ReactNode {
  // 1) Viser kun tekst, hvis IKKE vi redigerer
  if (!isEditing) {
    // - Datoer
    if (key === "dateOfBirth" || key === "dateOfDeath") {
      return value ? new Date(value as string).toLocaleDateString() : "Ikke angivet";
    }

    // - Forældre (viser ikon, hvis valid)
    if (key === "fatherId_Placeholder" || key === "motherId_Placeholder") {
      if (!rabbitProfile) return null;
      const actualId =
        key === "fatherId_Placeholder"
          ? rabbitProfile.father_EarCombId
          : rabbitProfile.mother_EarCombId;
      if (!value) return null; // ingen data
      const parentValid = isParentValid(value as string, actualId ?? null);
      return (
        <div className="flex items-center gap-2">
          {parentValid ? (
            <PiRabbitFill
              className="w-5 h-5 text-green-500"
              title="Forælder findes i systemet"
              aria-label="Forælder findes i systemet"
            />
          ) : (
            <PiRabbit
              className="w-5 h-5 text-zinc-400"
              title="Forælder findes ikke i systemet"
              aria-label="Forælder findes ikke i systemet"
            />
          )}
<span className={parentValid ? "text-green-500" : "text-zinc-400"}>{String(value)}</span>
</div>
      );
    }

    // - Origin (f.eks. opdrætternavn)
    if (key === "originFullName") {
      return value ? value.toString() : "Ikke fundet i systemet";
    }

    // - Boolean felter
    if (typeof value === "boolean") {
      return value ? "Ja" : "Nej";
    }

    // - Profilbillede
    if (key === "profilePicture") {
      return value ? (
        <Image
          src={value as string}
          alt="Profilbillede"
          width={50}
          height={50}
          className="rounded-full"
        />
      ) : (
        <Image
          src="/images/default-rabbit.jpg"
          alt="Default billede"
          width={50}
          height={50}
          className="rounded-full"
        />
      );
    }

    // - Default vis
    return value?.toString() || "Ikke angivet";
  }

  // 2) Hvis vi REDIGERER
  if (editableFields.includes(key as keyof Rabbit_UpdateDTO)) {
    // 2a) Tekstfelt (eksempel: "nickName")
    if (key === "nickName") {
      return (
        <Input
          size="sm"
          value={editedData.nickName || ""}
          onChange={(e) => setEditedData({ ...editedData, nickName: e.target.value })}
          aria-label="Navn"
        />
      );
    }

    // 2b) EnumAutocomplete: Race
    if (key === "race") {
      return (
        <EnumAutocomplete
          enumType="Race"
          value={editedData.race}
          onChange={(newVal) => setEditedData({ ...editedData, race: newVal })}
          label="Race"
        />
      );
    }

    // 2c) EnumAutocomplete: Farve
    if (key === "color") {
      return (
        <EnumAutocomplete
          enumType="Color"
          value={editedData.color}
          onChange={(newVal) => setEditedData({ ...editedData, color: newVal })}
          label="Farve"
        />
      );
    }

    // 2d) EnumAutocomplete: Køn
    if (key === "gender") {
      return (
        <EnumAutocomplete
          enumType="Gender"
          value={editedData.gender}
          onChange={(newVal) => setEditedData({ ...editedData, gender: newVal })}
          label="Køn"
        />
      );
    }

    // 2e) Boolean-felter på Switch (forSale, forBreeding)
    if (key === "forSale" || key === "forBreeding") {
      return (
        <Switch
          size="sm"
          isSelected={editedData[key] === "Ja"}
          onValueChange={(checked) =>
            setEditedData({
              ...editedData,
              [key]: checked ? "Ja" : "Nej",
            })
          }
          aria-label={key}
        />
      );
    }
  }

  // Hvis vi ikke har en specialhåndtering, returnér kun tekst
  return value?.toString() || "Ikke angivet";
}