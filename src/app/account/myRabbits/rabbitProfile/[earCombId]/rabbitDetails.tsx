import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Button } from "@nextui-org/react";
import { Rabbit_ProfileDTO } from "@/Types/AngoraDTOs";
import { renderCell } from "@/utils/renderCell";

interface RabbitDetailsProps {
  rabbitProfile: Rabbit_ProfileDTO;
  isEditing: boolean;
  isSaving: boolean;
  setIsEditing: (isEditing: boolean) => void;
  handleSave: () => void;
  propertyLabels: Record<keyof Omit<Rabbit_ProfileDTO, "father_EarCombId" | "mother_EarCombId" | "children" | "profilePicture">, string>;
  editedData: Rabbit_ProfileDTO;
  setEditedData: (data: Rabbit_ProfileDTO) => void;
}

export default function RabbitDetails({
  rabbitProfile,
  isEditing,
  isSaving,
  setIsEditing,
  handleSave,
  propertyLabels,
  editedData,
  setEditedData
}: RabbitDetailsProps) {
  return (
    <div>
      {!isEditing ? (
        <Button size="sm" onPress={() => setIsEditing(true)}>
          Rediger
        </Button>
      ) : (
        <div className="space-x-2">
          <Button size="sm" color="success" onPress={handleSave} isDisabled={isSaving}>
            Gem
          </Button>
          <Button size="sm" color="secondary" onPress={() => setIsEditing(false)}>
            Annuller
          </Button>
        </div>
      )}

      <Table
        aria-label="Kanin detaljer"
        removeWrapper
        className="p-0"
        classNames={{
          table: "bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-lg border-zinc-700/50",
          th: "bg-zinc-900/50 text-zinc-300 border-zinc-700/50",
          td: "text-zinc-100",
          tr: "hover:bg-zinc-700/30 border-b border-zinc-700/30 last:border-0",
        }}
      >
        <TableHeader>
          <TableColumn>FELT</TableColumn>
          <TableColumn>VÆRDI</TableColumn>
        </TableHeader>
        <TableBody>
          {Object.entries(propertyLabels).map(([key, label]) => (
            <TableRow key={key}>
              <TableCell className="font-medium">{label}</TableCell>
              <TableCell>
                {renderCell(
                  key as keyof Rabbit_ProfileDTO,
                  rabbitProfile[key as keyof Rabbit_ProfileDTO],
                  isEditing,
                  editedData,
                  setEditedData,
                  rabbitProfile
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}