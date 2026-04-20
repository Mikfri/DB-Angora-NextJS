// src/components/pedigree/pedigreeTable/pedigreeTable.tsx
/**
 * PedigreeTable — Tabelbaseret stamtavlevisning.
 * Ansvar: Renderer et rekursivt stamtræ som en HTML-tabel med rowSpan-logik,
 * hvor hver kolonne repræsenterer en generation. Bruger RabbitPedigreeCard
 * til at vise individuelle kaniner i cellerne.
 */

'use client';

import { JSX } from 'react';
import type { Rabbit_PedigreeDTO } from '@/api/types/AngoraDTOs';
import RabbitPedigreeCard from '@/components/cards/rabbitPedigreeCard';

interface PedigreeTableProps {
  pedigree: Rabbit_PedigreeDTO;
  generations?: number;
  onGenerationsChange?: (generations: number) => void;
}

function buildPedigreeRows(
  father: Rabbit_PedigreeDTO | null,
  mother: Rabbit_PedigreeDTO | null,
  numColumns: number,
  repeatColorMap: Map<string, number>
) {
  const totalRows = 2 ** numColumns;

  // 2D array: rows x columns, each cell is either a rabbit or null
  const table: (Rabbit_PedigreeDTO | null)[][] = Array.from(
    { length: totalRows },
    () => Array(numColumns).fill(null)
  );

  // Rekursiv funktion til at placere kaniner i tabellen
  function fillTable(
    rabbit: Rabbit_PedigreeDTO | null,
    col: number,
    rowStart: number,
    rowSpan: number
  ) {
    if (!rabbit || col >= numColumns) return;
    table[rowStart][col] = rabbit;
    if (col + 1 < numColumns) {
      fillTable(rabbit.Father ?? null, col + 1, rowStart, rowSpan / 2);
      fillTable(rabbit.Mother ?? null, col + 1, rowStart + rowSpan / 2, rowSpan / 2);
    }
  }

  fillTable(father, 0, 0, totalRows / 2);
  fillTable(mother, 0, totalRows / 2, totalRows / 2);

  const renderedRows: JSX.Element[] = [];
  const rendered: boolean[][] = Array.from(
    { length: totalRows },
    () => Array(numColumns).fill(false)
  );

  for (let rowIdx = 0; rowIdx < totalRows; rowIdx++) {
    const cells: JSX.Element[] = [];
    for (let colIdx = 0; colIdx < numColumns; colIdx++) {
      if (rendered[rowIdx][colIdx]) continue;
      const rabbit = table[rowIdx][colIdx];
      if (rabbit) {
        const span = 2 ** (numColumns - colIdx - 1);
        for (let i = 1; i < span; i++) {
          rendered[rowIdx + i][colIdx] = true;
        }
        cells.push(
          <td
            key={`col${colIdx}-row${rowIdx}`}
            rowSpan={span}
            className="border border-border align-middle text-center px-2 py-2 bg-surface"
          >
            <RabbitPedigreeCard rabbit={rabbit} repeatColorIndex={repeatColorMap.get(rabbit.EarCombId)} />
          </td>
        );
      } else {
        const span = 2 ** (numColumns - colIdx - 1);
        let showEmpty = true;
        for (let i = 0; i < span; i++) {
          if (table[rowIdx + i][colIdx]) {
            showEmpty = false;
            break;
          }
        }
        if (showEmpty) {
          for (let i = 1; i < span; i++) {
            rendered[rowIdx + i][colIdx] = true;
          }
          cells.push(
            <td
              key={`col${colIdx}-row${rowIdx}`}
              rowSpan={span}
              className="border border-border align-middle text-center px-2 py-2 bg-surface-secondary text-foreground/40"
            >
              <span className="italic">-</span>
            </td>
          );
        }
      }
    }
    renderedRows.push(<tr key={`row-${rowIdx}`}>{cells}</tr>);
  }
  return renderedRows;
}

export default function PedigreeTable({
  pedigree,
  generations = 3,
  //onGenerationsChange
}: PedigreeTableProps) {
  // const handleColumnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const num = parseInt(e.target.value, 10);
  //   if (!isNaN(num) && num >= 1 && num <= 10 && onGenerationsChange) {
  //     onGenerationsChange(num);
  //   }
  // };

  // API returnerer 'generations' kolonner (Afkom vises nu som separat kort ovenfor)
  const actualColumns = generations;
  const columns = Array.from({ length: actualColumns }, (_, index) =>
    `Generation ${index + 1}`
  );

  // Find EarCombIds der optræder mere end én gang i stamtræet
  function collectIds(rabbit: Rabbit_PedigreeDTO | null, ids: string[]) {
    if (!rabbit) return;
    ids.push(rabbit.EarCombId);
    collectIds(rabbit.Father ?? null, ids);
    collectIds(rabbit.Mother ?? null, ids);
  }
  const allIds: string[] = [];
  collectIds(pedigree, allIds);
  const seen = new Set<string>();
  const repeatColorMap = new Map<string, number>();
  let colorIdx = 0;
  for (const id of allIds) {
    if (seen.has(id)) {
      if (!repeatColorMap.has(id)) repeatColorMap.set(id, colorIdx++);
    } else {
      seen.add(id);
    }
  }

  return (
    <div className="space-y-4">
      {/* Generation input removed from here — parent (rabbitPedigree.tsx) controls it */}

      <div className="overflow-auto rounded-lg border border-border">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col} className="border border-border px-4 py-2 bg-surface-secondary text-foreground/60 text-center font-semibold">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {buildPedigreeRows(pedigree.Father ?? null, pedigree.Mother ?? null, actualColumns, repeatColorMap)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
