import { Rabbit_ProfileDTO } from "@/Types/AngoraDTOs";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

interface RabbitChildrenProps {
    children: Rabbit_ProfileDTO["children"];
}

export default function RabbitChildren({ children }: RabbitChildrenProps) {
    return (
        <Table
            aria-label="Afkom liste"
            removeWrapper
            className="p-0"
            classNames={{
                table: "bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-lg border-zinc-700/50",
                th: "bg-zinc-900/50 text-zinc-300 border-b border-zinc-700/50",
                td: "text-zinc-100",
                tr: "hover:bg-zinc-700/30 border-b border-zinc-700/30 last:border-0",
            }}
        >
            <TableHeader>
                <TableColumn>ØREMÆRKE ID</TableColumn>
                <TableColumn>ANDEN FORÆLDER ID</TableColumn>
                <TableColumn>NAVN</TableColumn>
                <TableColumn>KØN</TableColumn>
                <TableColumn>FARVE</TableColumn>
                <TableColumn>FØDSELSDATO</TableColumn>
            </TableHeader>
            <TableBody>
                {children?.map((child) => (
                    <TableRow key={child.earCombId}>
                        <TableCell>{child.earCombId}</TableCell>
                        <TableCell>{child.otherParentId}</TableCell>
                        <TableCell>{child.nickName}</TableCell>
                        <TableCell>{child.gender}</TableCell>
                        <TableCell>{child.color}</TableCell>
                        <TableCell>{child.dateOfBirth ? new Date(child.dateOfBirth).toLocaleDateString() : '-'}</TableCell>
                    </TableRow>
                )) ?? (
                    <TableRow>
                        <TableCell colSpan={6} className="text-center">Ingen afkom registreret</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}