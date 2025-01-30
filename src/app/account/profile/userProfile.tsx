// src/app/account/profile/userProfile.tsx
'use client';
import { User_ProfileDTO } from "@/Types/AngoraDTOs";
import { useUserProfile } from "@/hooks/users/useUserProfile";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input, Switch } from "@nextui-org/react";

type Props = {
    userProfile: User_ProfileDTO;
};

export default function UserProfile({ userProfile }: Props) {
    const { isEditing, isSaving, editedData, setEditedData, setIsEditing, handleSave } = useUserProfile(userProfile);

    const propertyLabels: Record<keyof User_ProfileDTO, string> = {
        breederRegNo: "Avlernummer",
        firstName: "Fornavn",
        lastName: "Efternavn",
        publicProfile: "Public profil (endnu ikke funktionel)",
        roadNameAndNo: "Adresse",
        city: "By",
        zipCode: "Postnummer",
        email: "Email",
        phone: "Tlf nummer"
    };

    const renderCell = (key: keyof User_ProfileDTO, value: unknown) => {
        // Non-editable fields always show as plain text
        if (key === "breederRegNo" || key === "firstName" || key === "lastName") {
            return value?.toString() || "Ikke angivet";
        }

        // For editable fields, check if we're in edit mode
        if (!isEditing) {
            return value?.toString() || "Ikke angivet";
        }

        // Handle different input types for editable fields
        if (key === "roadNameAndNo" || key === "city" || key === "email" || key === "phone") {
            return (
                <Input
                    size="sm"
                    value={editedData[key] || ""}
                    onChange={(e) => setEditedData({ ...editedData, [key]: e.target.value })}
                    aria-label={propertyLabels[key]}
                    classNames={{
                        input: "bg-zinc-800/50 text-zinc-100",
                    }}
                />
            );
        }

        if (key === "publicProfile") {
            return (
                <Switch
                    size="sm"
                    isSelected={editedData[key] === "Ja"}
                    onValueChange={(checked) => setEditedData({
                        ...editedData,
                        [key]: checked ? "Ja" : "Nej"
                    })}
                    aria-label={propertyLabels[key]}
                >
                    {propertyLabels[key]}
                </Switch>
            );
        }

        if (key === "zipCode") {
            return (
                <Input
                    size="sm"
                    type="number"
                    value={editedData[key] !== null ? editedData[key]?.toString() : ""}
                    onChange={(e) => setEditedData({ 
                        ...editedData, 
                        [key]: e.target.value === "" ? null : parseInt(e.target.value, 10)
                    })}
                    aria-label={propertyLabels[key]}
                    classNames={{
                        input: "bg-zinc-800/50 text-zinc-100",
                    }}
                />
            );
        }

        return value?.toString() || "Ikke angivet";
    };

    return (
        <div className="bg-zinc-800/80 backdrop-blur-md backdrop-saturate-150 rounded-xl border border-zinc-700/50 p-6">
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-zinc-100">
                    {userProfile.firstName} {userProfile.lastName}
                </h1>
            </div>

            <Table
                aria-label="Bruger detaljer"
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
                    <TableColumn className="w-1/3">FELT</TableColumn>
                    <TableColumn className="w-2/3">
                        <div className="flex justify-between items-center">
                            <span>VÆRDI</span>
                            {!isEditing ? (
                                <Button size="sm" onPress={() => setIsEditing(true)}>Rediger</Button>
                            ) : (
                                <div className="space-x-2">
                                    <Button size="sm" color="success" onPress={handleSave} isLoading={isSaving}>
                                        {isSaving ? 'Gemmer...' : 'Gem'}
                                    </Button>
                                    <Button size="sm" color="danger" onPress={() => setIsEditing(false)}>
                                        Annuller
                                    </Button>
                                </div>
                            )}
                        </div>
                    </TableColumn>
                </TableHeader>
                <TableBody>
                    {Object.entries(propertyLabels).map(([key, label]) => (
                        <TableRow key={key}>
                            <TableCell className="font-medium">{label}</TableCell>
                            <TableCell>{renderCell(key as keyof User_ProfileDTO, userProfile[key as keyof User_ProfileDTO])}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}