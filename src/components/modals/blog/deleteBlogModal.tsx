'use client';
import { Modal, Button } from '@/components/ui/heroui';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    blogTitle: string;
    isDeleting: boolean;
}

export default function DeleteBlogModal({ isOpen, onClose, onConfirm, blogTitle, isDeleting }: Props) {
    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Modal.Backdrop variant="blur">
                <Modal.Container>
                    <Modal.Dialog className="dark">
                        <Modal.Header>
                            <Modal.Heading>Bekræft sletning</Modal.Heading>
                        </Modal.Header>
                        <Modal.Body>
                            <p className="text-gray-700 font-bold">
                                Er du sikker på, at du vil slette blogindlægget &quot;{blogTitle}&quot;?
                            </p>
                            <p className="text-danger font-bold">
                                Denne handling kan ikke fortrydes. Alle relaterede fotos vil også blive slettet.
                            </p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="ghost"
                                onPress={onClose}
                                isDisabled={isDeleting}
                            >
                                Annuller
                            </Button>
                            <Button
                                variant="danger"
                                onPress={onConfirm}
                                isPending={isDeleting}
                            >
                                {isDeleting ? 'Sletter...' : 'Slet blog'}
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}
