// src/app/account/mySales/_shared/saleWorkspaceBase.tsx

/**
 * Genbrugelig base-komponent for "salgsarbejdsplads" i brugerens annoncer (Mine Salg).
 * - Viser redigerbare base-felter (titel, pris, beskrivelse, kan leveres) med always-visible inputs.
 * - Inputs er låste (pointer-events-none opacity-50) når !isEditing, live når isEditing.
 * - Håndterer edit/save/cancel/slet-knapper i headeren.
 * - Entity-specifikke felter (rabbit, yarn osv.) injiceres via children-prop (children modtager isEditing via props).
 * - Ikke-redigerbare felter (ID, slug, datoer, visninger etc.) vises i SaleWorkspaceNav (side nav).
 */

'use client';
import { ReactNode } from 'react';
import { Button, Input, TextArea, Switch } from '@/components/ui/heroui';
import { SaleDetailsBasePostPutDTO, SaleDetailsPrivateDTO } from '@/api/types/SaleDetailsDTOs';
import { PropertyTable, PropertyTableItem } from '@/components/ui/custom/tables';
import { FaEdit } from 'react-icons/fa';
import SalePhotoManager from './salePhotoManager';

interface SaleWorkspaceBaseProps {
  profile: SaleDetailsPrivateDTO;
  formData: SaleDetailsBasePostPutDTO;
  setFormData: (data: SaleDetailsBasePostPutDTO) => void;
  isEditing: boolean;
  isSaving: boolean;
  hasChanges: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  children?: ReactNode;
}

export default function SaleWorkspaceBase({
  profile,
  formData,
  setFormData,
  isEditing,
  isSaving,
  hasChanges,
  onEdit,
  onSave,
  onCancel,
  children,
}: SaleWorkspaceBaseProps) {
  const set = <K extends keyof SaleDetailsBasePostPutDTO>(key: K, val: SaleDetailsBasePostPutDTO[K]) =>
    setFormData({ ...formData, [key]: val });

  const baseItems: PropertyTableItem[] = [
    {
      label: 'Titel',
      editNode: (
        <Input
          variant="secondary"
          value={formData.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="Salgstitel..."
          maxLength={200}
          aria-label="Titel"
        />
      ),
    },
    {
      label: 'Pris (DKK)',
      editNode: (
        <Input
          variant="secondary"
          type="number"
          value={formData.price.toString()}
          onChange={(e) => set('price', Number(e.target.value))}
          min="0"
          aria-label="Pris"
        />
      ),
    },
    {
      label: 'Kan leveres',
      editNode: (
        <Switch
          size="md"
          isSelected={formData.canBeShipped}
          onChange={(v) => set('canBeShipped', v)}
          aria-label="Kan leveres"
        >
          <Switch.Control><Switch.Thumb /></Switch.Control>
          <span className="text-sm">{formData.canBeShipped ? 'Ja' : 'Nej'}</span>
        </Switch>
      ),
    },
  ];

  return (
    <div className="main-content-container">
      {/* Header med redigerings-knapper */}
      <div className="flex justify-between items-center p-4 border-b border-divider">
        <h3 className="text-foreground font-medium">Salgsdetaljer</h3>
        <div className="flex items-center gap-2">
          {hasChanges && isEditing && (
            <span className="text-amber-400 text-sm animate-pulse mr-4">
              Der er ændringer som ikke er gemt
            </span>
          )}
          {!isEditing ? (
            <Button size="sm" variant="ghost" className="text-warning" onPress={onEdit}>
              <FaEdit size={16} /> Rediger
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                variant="secondary"
                className="text-success-foreground bg-success"
                onPress={onSave}
                isDisabled={isSaving || !hasChanges}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                {isSaving ? 'Gemmer...' : 'Gem'}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onPress={onCancel}
                isDisabled={isSaving}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
                Annuller
              </Button>
            </>
          )}
        </div>
      </div>

      {/* To-kolonne layout: billeder til venstre, base-felter til højre */}
      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* VENSTRE: Billeder — sticky */}
          <div className="sticky top-20 self-start">
            <SalePhotoManager />
          </div>

          {/* HØJRE: Titel, pris, levering, beskrivelse */}
          <div className="space-y-4">
            <PropertyTable items={baseItems} useCard={false} isEditing={isEditing} />

            <div className={`space-y-1.5 border-t border-divider pt-3 ${!isEditing ? 'pointer-events-none opacity-50' : ''}`}>
              <p className="px-3 text-xs font-medium text-foreground/60">Beskrivelse</p>
              <TextArea
                fullWidth
                variant="secondary"
                value={formData.description}
                onChange={(e) => set('description', e.target.value)}
                placeholder="Beskriv annoncen..."
                rows={8}
                aria-label="Beskrivelse"
              />
            </div>
          </div>
        </div>

        {/* Entity-specifikke felter (garn, kanin osv.) — fuld bredde under grid */}
        {children && (
          <div className="space-y-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

