// src/components/pedigree/pedigreeTable/pedigreeTable.tsx

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
  pedigree: Rabbit_PedigreeDTO | null,
  numColumns: number
) {
  const totalRows = 2 ** (numColumns - 1);

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

  fillTable(pedigree, 0, 0, totalRows);

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
            className="border border-zinc-700 align-middle text-center px-2 py-2 bg-zinc-800"
          >
            <RabbitPedigreeCard rabbit={rabbit} />
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
              className="border border-zinc-700 align-middle text-center px-2 py-2 bg-zinc-900 text-zinc-500"
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

  // API returnerer generations + 1 kolonner (inkl. afkom som generation 0)
  const actualColumns = generations + 1;
  const columns = Array.from({ length: actualColumns }, (_, index) => 
    index === 0 ? 'Afkom' : `Generation ${index}`
  );

  return (
    <div className="space-y-4">
      {/* Generation input removed from here — parent (rabbitPedigree.tsx) controls it */}

      <div className="overflow-auto rounded-lg bg-zinc-800/50 border border-zinc-700/30 p-2">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col} className="border border-zinc-700 px-4 py-2 bg-zinc-900 text-zinc-400 text-center font-semibold">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {buildPedigreeRows(pedigree, actualColumns)}
          </tbody>
        </table>
      </div>
    </div>
  );
}