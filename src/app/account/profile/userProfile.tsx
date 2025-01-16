// src/account/userProfile.tsx
'use client';
import { User_ProfileDTO } from "@/Types/backendTypes";
import { useUserProfile } from "@/hooks/users/useUserProfile";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input, Switch } from "@nextui-org/react";

type Props = {
    userProfile: User_ProfileDTO;
};

export default function UserProfile({ userProfile }: Props) {
    const { isEditing, isSaving, editedData, setEditedData, setIsEditing, handleSave } = useUserProfile(userProfile);

    const propertyLabels: Record<keyof User_ProfileDTO, string> = {
        breederRegNo: "BreederRegNo",
        firstName: "Fornavn",
        lastName: "Efternavn",
        publicProfile: "Public profil",
        roadNameAndNo: "Adresse",
        city: "By",
        zipCode: "Postnummer",
        email: "Email",
        phone: "Tlf nummer"
    };

    const renderCell = (key: keyof User_ProfileDTO, value: unknown) => {
        if (!isEditing) {
            return value?.toString() || "Ikke angivet";
        }

        if (key === "breederRegNo" || key === "firstName" || 
            key === "lastName" || key === "roadNameAndNo" || 
            key === "city" || key === "email" || 
            key === "phone") {
            return (
                <Input
                    value={editedData[key] || ""}
                    onChange={(e) => setEditedData({ ...editedData, [key]: e.target.value })}
                    aria-label={propertyLabels[key]}
                />
            );
        }

        if (key === "publicProfile") {
            return (
                <Switch
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
                type="number"
                    value={editedData[key] !== null ? editedData[key]?.toString() : ""}
                    onChange={(e) => setEditedData({ ...editedData, [key]: e.target.value === "" ? null : parseInt(e.target.value, 10), })}
                    aria-label={propertyLabels[key]}
                />
            );
        }

        return value?.toString() || "Ikke angivet";
    };

    return (
        <div className="w-full max-w-5xl mx-auto p-4">
            <div className="content-card mb-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-zinc-100">
                        {userProfile.firstName || userProfile.lastName}
                    </h1>
                    {!isEditing ? (
                        <Button onPress={() => setIsEditing(true)}>Rediger</Button>
                    ) : (
                        <div className="space-x-2">
                            <Button color="success" onPress={handleSave} isLoading={isSaving} disabled={isSaving}>
                                {isSaving ? "Gemmer..." : "Gem"}
                            </Button>
                            <Button color="danger" onPress={() => setIsEditing(false)} disabled={isSaving}>
                                Annuller
                            </Button>
                        </div>
                    )}
                </div>
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
                    <TableColumn>FELT</TableColumn>
                    <TableColumn>VÆRDI</TableColumn>
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
