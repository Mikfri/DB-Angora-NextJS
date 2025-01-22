// src/components/tables/genericDataTable.tsx
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input } from "@nextui-org/react";
import { TableConfig } from "./types";
import { ReactNode } from "react";
import { defaultStyling } from "./defaultStyling";

interface GenericDataTableProps<T extends object> {
  data: T;
  config: TableConfig<T>;
}

export default function GenericDataTable<T extends object>({ data, config }: GenericDataTableProps<T>) {
  const {
      propertyLabels,
      isEditing = false,
      onEdit,
      editableFields = [],
      customRenderers = {} as TableConfig<T>['customRenderers'],
      styling = defaultStyling
  } = config;

  const renderValue = (key: keyof T, value: T[keyof T]): ReactNode => {
      // Check for custom renderer first
      const renderer = customRenderers?.[key];
      if (renderer) {
          return renderer(value, isEditing);
      }

      // Default editing behavior
      if (isEditing && editableFields.includes(key)) {
          return (
              <Input
                  value={String(value)}
                  onChange={(e) => onEdit?.(key, e.target.value)}
              />
          );
      }

      return String(value ?? 'Ikke angivet');
  };

  return (
    <Table
      aria-label="Data table"
      removeWrapper
      className="p-0"
      classNames={styling}
    >
      <TableHeader>
        <TableColumn>FELT</TableColumn>
        <TableColumn>VÆRDI</TableColumn>
      </TableHeader>
      <TableBody>
        {(Object.entries(propertyLabels) as [keyof T, string][]).map(([key, label]) => (
          <TableRow key={String(key)}>
            <TableCell className="font-medium">{label}</TableCell>
            <TableCell>{renderValue(key, data[key])}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}