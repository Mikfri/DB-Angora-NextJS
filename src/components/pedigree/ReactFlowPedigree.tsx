'use client';

import { useMemo, useEffect } from 'react';
import ReactFlow, {
  Node, Edge, Position,
  Panel, Controls, Background,
  ConnectionLineType,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { PedigreeResultDTO, Rabbit_PedigreeDTO } from '@/api/types/AngoraDTOs';
import RabbitNode from './RabbitNode';
import { findInbreedingRabbits, generateUniqueNodeId, calculatePedigreeLayout, formatEdge } from './pedigreeUtils';

export interface RabbitNodeData {
  rabbit: Rabbit_PedigreeDTO;
  isInbreeding?: boolean;
}

export default function ReactFlowPedigree({ pedigreeResult, maxGenerations = 3 }: {
  pedigreeResult: PedigreeResultDTO;
  maxGenerations?: number;
}) {
  // Udpak data fra PedigreeResultDTO
  const { CalculatedInbreedingCoefficient, COIContributors, Pedigree: pedigree } = pedigreeResult;

  // Find indavl (kaniner der optræder flere gange)
  const inbreedingRabbits = useMemo(() =>
    findInbreedingRabbits(pedigree),
    [pedigree]
  );

  // Konverter stamtavledata til nodes og edges
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const positions = calculatePedigreeLayout(pedigree, maxGenerations);

    const nodes: Node<RabbitNodeData>[] = [];
    const edges: Edge[] = [];
    const nodePositions: Record<string, { x: number, y: number }> = {};

    function processNode(
      rabbit: Rabbit_PedigreeDTO | null,
      path: string = "root",
      parentId?: string,
      relation?: string
    ) {
      if (!rabbit || !rabbit.EarCombId) return;

      const generation = (path.match(/>/g) || []).length;
      if (generation > maxGenerations) return;

      const rabbitId = rabbit.EarCombId;
      const nodeId = generateUniqueNodeId(rabbitId, path);
      const isInbreeding = inbreedingRabbits.has(rabbitId);

      const position = positions.get(path) || { x: generation * 280, y: 0 };
      nodePositions[nodeId] = position;

      console.log(`Node: ${nodeId}, Position:`, position); // Debug: Tjek positioner

      nodes.push({
        id: nodeId,
        type: 'rabbitNode',
        position,
        data: { rabbit, isInbreeding },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      });

      if (parentId && nodePositions[parentId]) {
        const sourcePos = nodePositions[parentId];
        const targetPos = position;
        const isMotherEdge = relation === 'mother';
        const edgeFormat = formatEdge(sourcePos, targetPos, isMotherEdge);

        console.log(`Edge: ${parentId} -> ${nodeId}, Relation: ${relation}`); // Debug: Tjek edges

        edges.push({
          id: `${parentId}->${nodeId}`,
          source: parentId,
          target: nodeId,
          ...edgeFormat,
          label: isMotherEdge ? 'Mor' : 'Far',
          labelStyle: {
            fill: isMotherEdge ? '#ec4899' : '#3b82f6',
            fontWeight: 500,
            fontSize: 12
          },
          labelBgStyle: { fill: 'rgba(0, 0, 0, 0.7)' }
        });
      }

      if (rabbit.Father) {
        processNode(rabbit.Father, `${path} > father`, nodeId, 'father');
      }
      if (rabbit.Mother) {
        processNode(rabbit.Mother, `${path} > mother`, nodeId, 'mother');
      }
    }

    processNode(pedigree);
    return { nodes, edges };
  }, [pedigree, maxGenerations, inbreedingRabbits]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const nodeTypes = useMemo(() => ({ rabbitNode: RabbitNode }), []);

  return (
    <div className="flex flex-col h-[650px] w-full bg-zinc-900/20 rounded-lg border border-zinc-700/50">
      {/* Forbedret header med mere detaljeret COI-info */}
      <div className="mb-4 p-4 bg-gradient-to-r from-zinc-800/80 to-zinc-700/80 backdrop-blur-md rounded-t-lg border-b border-zinc-600/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-zinc-100">Indavlskoefficient</h3>
            <p className="text-3xl font-bold text-blue-400 mt-1">
              {(CalculatedInbreedingCoefficient * 100).toFixed(2)}%
            </p>
            <p className="text-sm text-zinc-400 mt-1">
              {CalculatedInbreedingCoefficient > 0.125
                ? "Højt niveau af indavl - overvej diversitet"
                : CalculatedInbreedingCoefficient > 0
                  ? "Moderat niveau af indavl"
                  : "Ingen registreret indavl"}
            </p>
          </div>
          {COIContributors && COIContributors.length > 0 && (
            <div className="text-right">
              <h4 className="text-sm font-medium text-zinc-300">Top-bidragydere</h4>
              <div className="mt-2 space-y-1">
                {COIContributors.slice(0, 3).map((contrib, idx) => (
                  <div key={idx} className="text-xs text-zinc-400 bg-zinc-800/50 px-2 py-1 rounded">
                    {contrib.NickName || contrib.EarCombId}: {(contrib.ContributionPercent).toFixed(1)}%
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 border border-zinc-700/50 rounded-b-lg overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{
            padding: 0.4,
            includeHiddenNodes: false,
            minZoom: 0.1,
            maxZoom: 1.2
          }}
          minZoom={0.05}
          maxZoom={3}
          connectionLineType={ConnectionLineType.SmoothStep}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: true,
            style: { strokeWidth: 2 }
          }}
          proOptions={{ hideAttribution: true }}
          zoomOnDoubleClick={false}
          className="bg-zinc-900/10"
        >
          <Background
            color="#374151"
            gap={20}
            size={1}
          //variant="lines"
          />
          <Controls
            className="bg-zinc-800/80 border-zinc-600"
            showZoom
            showFitView
            showInteractive={false}
          />
          <Panel position="top-right" className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 rounded-md p-2">
            <div className="text-xs text-zinc-300">
              <p>Generationer: {maxGenerations}</p>
              <p>Nodes: {nodes.length}</p>
            </div>
          </Panel>
          <Panel position="bottom-left" className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 rounded-md p-3">
            <div className="space-y-2">
              <div className="text-xs font-medium text-zinc-200 mb-2">Stamtræs-guide:</div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-blue-400 rounded"></div>
                <span className="text-xs text-zinc-300">Far-linjer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-pink-400 rounded"></div>
                <span className="text-xs text-zinc-300">Mor-linjer</span>
              </div>
              {inbreedingRabbits.size > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-600 rounded-full border-2 border-purple-300"></div>
                  <span className="text-xs text-zinc-300">Indavlsforekomst</span>
                </div>
              )}
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}