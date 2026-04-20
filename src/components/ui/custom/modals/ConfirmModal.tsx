// src/components/ui/custom/modals/ConfirmModal.tsx

/**
 * Generisk bekræftelsesdialog bygget på AlertDialog.
 *
 * Bruger HeroUI's AlertDialog (ikke Modal) for korrekt WAI-ARIA semantik:
 * - Blokerer backdrop-klik (isDismissable=false som default)
 * - ESC deaktiveret som default (kræver eksplicit handling)
 * - role="alertdialog" for skærmlæsere
 *
 * `status` prop styrer ikon-farve OG confirm-knap-variant:
 *   - 'danger'  → rød ikon + danger-knap  (sletning, irreversible handlinger)
 *   - 'warning' → orange ikon + danger-knap (advarsel)
 *   - 'success' → grøn ikon + primary-knap
 *   - 'accent'  → blå ikon + primary-knap
 *   - 'default' → grå ikon + primary-knap
 *
 * Tema arves automatisk via next-themes (<html class="dark">) — ingen
 * dialogClassName="dark" nødvendig.
 *
 * Eksempel:
 *   <ConfirmModal
 *     isOpen={isOpen}
 *     onClose={onClose}
 *     onConfirm={handleDelete}
 *     title="Slet kanin"
 *     status="danger"
 *     isPending={isDeleting}
 *   >
 *     <p>Er du sikker på, at du vil slette &quot;{name}&quot;?</p>
 *   </ConfirmModal>
 */

'use client';

import { type ReactNode } from 'react';
import { AlertDialog, Button } from '@/components/ui/heroui';

export type ConfirmModalStatus = 'default' | 'accent' | 'success' | 'warning' | 'danger';

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  children: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Styrer ikon-farve og confirm-knap variant */
  status?: ConfirmModalStatus;
  isPending?: boolean;
}

function buttonVariantFromStatus(status: ConfirmModalStatus): 'danger' | 'primary' {
  return status === 'danger' || status === 'warning' ? 'danger' : 'primary';
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmLabel = 'Bekræft',
  cancelLabel = 'Annuller',
  status = 'default',
  isPending = false,
}: ConfirmModalProps) {
  return (
    <AlertDialog>
      <AlertDialog.Backdrop
        variant="blur"
        isOpen={isOpen}
        onOpenChange={(open) => { if (!open) onClose(); }}
        isDismissable={false}
      >
        <AlertDialog.Container>
          <AlertDialog.Dialog>
            <AlertDialog.Header>
              <AlertDialog.Icon status={status} />
              <AlertDialog.Heading>{title}</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              {children}
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button
                variant="ghost"
                onPress={onClose}
                isDisabled={isPending}
              >
                {cancelLabel}
              </Button>
              <Button
                variant={buttonVariantFromStatus(status)}
                onPress={onConfirm}
                isPending={isPending}
                isDisabled={isPending}
              >
                {confirmLabel}
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>
  );
}

