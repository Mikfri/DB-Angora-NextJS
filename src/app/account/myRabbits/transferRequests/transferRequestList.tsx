'use client';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import React from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Tooltip,
    Button,
} from "@heroui/react";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import { useTransferRequests } from "@/hooks/transferRequests/useTransferRequest";
import { TransferRequestPreviewDTO } from "@/api/types/AngoraDTOs";
import { toast } from "react-toastify";
import { RiUserReceivedLine, RiUserSharedLine } from "react-icons/ri";

const baseColumns = [
    { name: "Status", uid: "status" },
    { name: "Navn", uid: "rabbit_NickName" },
    { name: "Øremærke", uid: "rabbit_EarCombId" },
];

const receivedColumns = [
    ...baseColumns,
    { name: "Udsteder (regnr)", uid: "issuer_BreederRegNo" },
    { name: "Udsteder (navn)", uid: "issuer_FirstName" },
    { name: "Handling", uid: "actions" },
];

const sentColumns = [
    ...baseColumns,
    { name: "Modtager (regnr)", uid: "recipent_BreederRegNo" },
    { name: "Modtager (navn)", uid: "recipent_FirstName" },
    { name: "Handling", uid: "actions" },
];

const statusColorMap: Record<string, "success" | "danger" | "warning" | "default"> = {
    Accepted: "success",
    Pending: "warning",
    Rejected: "danger",
};

export default function TransferRequestList() {
    const { received, sent, isLoading, error, load, respond, remove } = useTransferRequests();
    const [tab, setTab] = React.useState<"received" | "sent">("received");
    const [confirm, setConfirm] = React.useState<{ id: number, accept: boolean } | null>(null);

    React.useEffect(() => {
        load();
    }, [load]);

    const list = tab === "received" ? received : sent;
    const columns = tab === "received" ? receivedColumns : sentColumns;

    const handleRespond = React.useCallback(
        async (id: number, accept: boolean) => {
            const result = await respond(id, accept);
            if (result.success) {
                toast.success(result.message);
                load();
            } else {
                toast.error(result.error);
            }
        },
        [respond, load]
    );

    const handleDelete = React.useCallback(
        async (id: number) => {
            const result = await remove(id);
            if (result.success) {
                toast.success("Anmodning annulleret");
                load();
            } else {
                toast.error(result.error);
            }
        },
        [remove, load]
    );

    // Modal handler - skal være udenfor renderCell!
    const handleConfirm = React.useCallback(async () => {
        if (confirm) {
            await handleRespond(confirm.id, confirm.accept);
            setConfirm(null);
        }
    }, [confirm, handleRespond]);

    const renderCell = React.useCallback(
        (item: TransferRequestPreviewDTO, columnKey: string) => {
            const cellValue = item[columnKey as keyof TransferRequestPreviewDTO];
            switch (columnKey) {
                case "status":
                    return (
                        <Chip
                            className="capitalize"
                            color={statusColorMap[item.status ?? ""] || "default"}
                            size="sm"
                            variant="flat"
                        >
                            {cellValue}
                        </Chip>
                    );
                case "actions":
                    if (tab === "received") {
                        const isPending = item.status === "Pending";
                        return (
                            <div className="flex gap-2 justify-center">
                                <Tooltip className="bg-success-300" content="Acceptér">
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        color="success"
                                        onPress={() => setConfirm({ id: item.id, accept: true })}
                                        isDisabled={!isPending}
                                    >
                                        <FaCheck />
                                    </Button>
                                </Tooltip>
                                <Tooltip className="bg-danger-300" content="Afvis">
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        color="danger"
                                        onPress={() => setConfirm({ id: item.id, accept: false })}
                                        isDisabled={!isPending}
                                    >
                                        <FaTimes />
                                    </Button>
                                </Tooltip>
                            </div>
                        );
                    } else {
                        // "Sent" tab: disable slet hvis ikke Pending
                        const isPending = item.status === "Pending";
                        return (
                            <div className="flex gap-2 justify-center">
                                <Tooltip color="danger" content="Annullér">
                                    <Button
                                        isIconOnly
                                        size="sm"
                                        color="danger"
                                        onPress={() => handleDelete(item.id)}
                                        isDisabled={!isPending}
                                    >
                                        <FaTrash />
                                    </Button>
                                </Tooltip>
                            </div>
                        );
                    }
                default:
                    return cellValue ?? <span className="text-zinc-500 italic">-</span>;
            }
        },
        [tab, handleDelete]
    );

    return (
        <div>
            <div className="flex gap-2 mb-4">
                <Button
                    size="sm"
                    color={tab === "received" ? "primary" : "default"}
                    onPress={() => setTab("received")}
                    startContent={<RiUserReceivedLine className="text-large" />}
                >
                    Modtaget
                </Button>
                <Button
                    size="sm"
                    color={tab === "sent" ? "primary" : "default"}
                    onPress={() => setTab("sent")}
                    startContent={<RiUserSharedLine className="text-large" />}
                >
                    Sendt
                </Button>
            </div>
            {isLoading && <div className="py-8"><span>Indlæser...</span></div>}
            {error && <div className="text-red-400">{error}</div>}
            {!isLoading && !error && (
                <Table
                    aria-label="Overførselsanmodninger"
                    className="bg-zinc-800 text-zinc-100 rounded-lg dark"
                >
                    <TableHeader columns={columns}>
                        {(column) => (
                            <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                                {column.name}
                            </TableColumn>
                        )}
                    </TableHeader>
                    <TableBody items={list}>
                        {(item) => (
                            <TableRow key={item.id}>
                                {(columnKey) => <TableCell>{renderCell(item, columnKey as string)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            )}
            {!isLoading && !error && list.length === 0 && (
                <div className="text-zinc-400 mt-4">Ingen anmodninger fundet.</div>
            )}

            {/* Modal skal kun renderes én gang! */}
            <Modal className="dark" isOpen={!!confirm} onClose={() => setConfirm(null)}>
                <ModalContent>
                    <ModalHeader>Bekræft handling</ModalHeader>
                    <ModalBody>
                        Er du sikker på, at du vil {confirm?.accept ? "acceptere" : "afvise"} denne anmodning?
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onPress={() => setConfirm(null)}>
                            Annuller
                        </Button>
                        <Button color={confirm?.accept ? "success" : "danger"} onPress={handleConfirm}>
                            Bekræft
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}