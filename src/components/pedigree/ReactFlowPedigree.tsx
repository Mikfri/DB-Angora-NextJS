'use client';

import { useMemo, useEffect } from 'react';
import ReactFlow, { 
  Node, Edge, Position, 
  Panel, Controls, Background,
  //MarkerType,
  ConnectionLineType,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Rabbit_PedigreeDTO } from '@/api/types/AngoraDTOs';
import RabbitNode from './RabbitNode';
import { findInbreedingRabbits, generateUniqueNodeId, calculatePedigreeLayout, formatEdge } from './pedigreeUtils';

export interface RabbitNodeData {
  rabbit: Rabbit_PedigreeDTO;
  isInbreeding?: boolean;
}

export default function ReactFlowPedigree({ pedigree, maxGenerations = 3 }: {
  pedigree: Rabbit_PedigreeDTO;
  maxGenerations?: number;
}) {
  // Tilstandsstyring for layouttype
  //const [layoutType, setLayoutType] = useState<'vertical' | 'horizontal'>('horizontal');
  
  // Find indavl (kaniner der optræder flere gange)
  const inbreedingRabbits = useMemo(() => 
    findInbreedingRabbits(pedigree),
    [pedigree]
  );

  // Konverter stamtavledata til nodes og edges med avanceret layout
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    // Brug avanceret D3-inspireret layoutalgoritme
    const positions = calculatePedigreeLayout(pedigree, maxGenerations);
    
    const nodes: Node<RabbitNodeData>[] = [];
    const edges: Edge[] = [];
    
    // Node positionsdata til brug for kantberegning
    const nodePositions: Record<string, { x: number, y: number }> = {};
    
    // Funktion til at oprette nodes og kanter
    function processNode(
      rabbit: Rabbit_PedigreeDTO | null, 
      path: string = "root",
      parentId?: string, 
      relation?: string
    ) {
      if (!rabbit || !rabbit.EarCombId) return;
      
      // Spring over hvis vi har nået maksimal dybde
      const generation = (path.match(/>/g) || []).length;
      if (generation > maxGenerations) return;
      
      const rabbitId = rabbit.EarCombId;
      const nodeId = generateUniqueNodeId(rabbitId, path);
      const isInbreeding = inbreedingRabbits.has(rabbitId);
      
      // Hent position fra layoutalgoritmen
      const position = positions.get(path) || { x: generation * 280, y: 0 };
      
      // Gem position til kantberegning
      nodePositions[nodeId] = position;
      
      // Tilføj node
      nodes.push({
        id: nodeId,
        type: 'rabbitNode',
        position,
        data: { rabbit, isInbreeding },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      });
      
      // Tilføj kant fra forælder til denne node
      if (parentId && nodePositions[parentId]) {
        const sourcePos = nodePositions[parentId];
        const targetPos = position;
        
        const isMotherEdge = relation === 'mother';
        
        // Brug formatEdge til at få dynamisk kantformat baseret på position
        const edgeFormat = formatEdge(sourcePos, targetPos, isMotherEdge);
        
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
          labelBgStyle: { 
            fill: 'rgba(0, 0, 0, 0.7)' 
          }
        });
      }
      
      // Rekursivt tilføj forældrenoder
      if (rabbit.Father) {
        processNode(
          rabbit.Father, 
          `${path} > father`, 
          nodeId, 
          'father'
        );
      }
      
      if (rabbit.Mother) {
        processNode(
          rabbit.Mother, 
          `${path} > mother`, 
          nodeId, 
          'mother'
        );
      }
    }
    
    // Start processering med hovedkaninen
    processNode(pedigree);
    
    return { nodes, edges };
  }, [pedigree, maxGenerations, inbreedingRabbits]);

  // Brug ReactFlow's hooks til at styre nodes og kanter
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  // Opdater når input data ændres
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);
  
  // Nodetyper dictionary
  const nodeTypes = useMemo(() => ({ rabbitNode: RabbitNode }), []);
  
  return (
    <div className="flex flex-col h-[650px] w-full">
      <div className="mb-2 flex justify-end space-x-2">
        <button
          className={`px-3 py-1 text-xs rounded-md ${maxGenerations === 3 ? 'bg-blue-600' : 'bg-zinc-700'}`}
          onClick={() => window.location.search = '?generations=3'}
        >
          3 Generationer
        </button>
        <button
          className={`px-3 py-1 text-xs rounded-md ${maxGenerations === 4 ? 'bg-blue-600' : 'bg-zinc-700'}`}
          onClick={() => window.location.search = '?generations=4'}
        >
          4 Generationer
        </button>
      </div>
      
      <div className="flex-1 border border-zinc-800 rounded-lg overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{
            padding: 0.3,
            includeHiddenNodes: false,
            minZoom: 0.2,
            maxZoom: 0.95
          }}
          minZoom={0.1}
          maxZoom={2}
          connectionLineType={ConnectionLineType.SmoothStep}
          defaultEdgeOptions={{
            type: 'smoothstep',
            animated: false
          }}
          proOptions={{ hideAttribution: true }}
          zoomOnDoubleClick={false}
        >
          <Background color="#444" gap={16} />
          <Controls />
          <Panel position="top-right">
            <div className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-md p-2">
              <p className="text-xs text-zinc-400">Viser {maxGenerations} generationer</p>
            </div>
          </Panel>
          <Panel position="bottom-left">
            <div className="flex flex-col gap-2 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-md p-2">
              <div className="text-xs text-zinc-300 mb-1 font-medium">Stamtræs-guide:</div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                <span className="text-xs text-zinc-300">Far-linjer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-400"></div>
                <span className="text-xs text-zinc-300">Mor-linjer</span>
              </div>
              {inbreedingRabbits.size > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                  <span className="text-xs text-zinc-300">Indavlsforekomst</span>
                </div>
              )}
              <div className="mt-2 text-zinc-400 text-xs">
                <p>Klik på en kanin for at se flere detaljer</p>
              </div>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}