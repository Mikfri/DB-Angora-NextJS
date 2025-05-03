import { Rabbit_PedigreeDTO } from '@/api/types/AngoraDTOs';
import { MarkerType } from 'reactflow';

/**
 * Finder kaniner der optræder flere gange i stamtræet (indavl)
 */
export function findInbreedingRabbits(pedigree: Rabbit_PedigreeDTO) {
  const seen = new Map<string, string[]>(); // Map fra ID til sti i træet
  const duplicates = new Set<string>();
  
  const findDuplicates = (rabbit: Rabbit_PedigreeDTO | null, path: string = "root") => {
    if (!rabbit || !rabbit.EarCombId) return;
    const id = rabbit.EarCombId;
    
    if (seen.has(id)) {
      duplicates.add(id);
      // Gemmer stien for debugging
      const paths = seen.get(id) || [];
      paths.push(path);
      seen.set(id, paths);
    } else {
      seen.set(id, [path]);
      if (rabbit.Father) findDuplicates(rabbit.Father, `${path} > father`);
      if (rabbit.Mother) findDuplicates(rabbit.Mother, `${path} > mother`);
    }
  };
  
  findDuplicates(pedigree);
  return duplicates;
}

/**
 * Genererer et unikt node-ID for en kanin baseret på ID og sti
 */
export function generateUniqueNodeId(rabbitId: string, path: string) {
  return `${rabbitId}-${path.replace(/\s*>\s*/g, "-")}`;
}

/**
 * D3-inspireret træstruktur til brug i layoutalgoritmen
 */
interface TreeNode {
  id: string;
  path: string;
  generation: number;
  children: TreeNode[];
  parentNode?: TreeNode;
  x: number;
  y: number;
  isMotherSide?: boolean;
  width: number;
  height: number;
  rabbit: Rabbit_PedigreeDTO | null;
}

/**
 * Konverterer et Rabbit_PedigreeDTO til et tree layout der kan bruges af D3's træalgoritme
 */
function buildTreeStructure(
  rabbit: Rabbit_PedigreeDTO | null, 
  path: string = "root", 
  generation: number = 0, 
  isMotherSide: boolean = false,
  maxGenerations: number = 5
): TreeNode | null {
  if (!rabbit || !rabbit.EarCombId || generation > maxGenerations) return null;
  
  // Opret node for denne kanin
  const node: TreeNode = {
    id: rabbit.EarCombId,
    path,
    generation,
    children: [],
    x: 0,
    y: 0,
    isMotherSide,
    width: 200,   // Node width
    height: 100,  // Approx height
    rabbit
  };
  
  // Tilføj børn rekursivt
  if (rabbit.Father && generation < maxGenerations) {
    const fatherNode = buildTreeStructure(
      rabbit.Father, 
      `${path} > father`, 
      generation + 1,
      false,
      maxGenerations
    );
    
    if (fatherNode) {
      fatherNode.parentNode = node;
      node.children.push(fatherNode);
    }
  }
  
  if (rabbit.Mother && generation < maxGenerations) {
    const motherNode = buildTreeStructure(
      rabbit.Mother, 
      `${path} > mother`, 
      generation + 1,
      true,
      maxGenerations
    );
    
    if (motherNode) {
      motherNode.parentNode = node;
      node.children.push(motherNode);
    }
  }
  
  return node;
}

/**
 * Beregner plads brugt af et undertræ
 */
function calculateSubtreeSize(node: TreeNode): { width: number; height: number } {
  if (node.children.length === 0) {
    return { width: node.width, height: node.height };
  }

  let totalWidth = 0;
  let maxHeight = 0;
  
  node.children.forEach(child => {
    const { width, height } = calculateSubtreeSize(child);
    totalWidth += width;
    maxHeight = Math.max(maxHeight, height);
  });
  
  return {
    width: Math.max(node.width, totalWidth),
    height: node.height + maxHeight + 50 // 50px mellemrum
  };
}

/**
 * Distribuerer noderne jævnt i undertræet
 */
function layoutSubtree(node: TreeNode, xOffset: number = 0): void {
  // Gen-spacing (x-akse)
  const genSpacing = 280;
  
  // Sæt x-koordinat baseret på generation
  node.x = node.generation * genSpacing;
  
  if (node.children.length === 0) {
    // Leaf-node placeres ved x-offset
    node.y = xOffset;
    return;
  }
  
  // Beregn pladsbehov for hvert barn
  const childSizes = node.children.map(child => calculateSubtreeSize(child));
  const totalChildrenWidth = childSizes.reduce((sum, size) => sum + size.width, 0);
  
  // Y-spacing mellem søskendenoder (baseret på størrelsen af undertræet)
  let childYOffset = xOffset - totalChildrenWidth / 2;
  
  // Placer far-nodes over (negative y), mor-nodes under (positive y)
  node.children.forEach((child, index) => {
    // Beregn offset for dette barn
    const childSize = childSizes[index];
    childYOffset += childSize.width / 2;
    
    // Juster y-position baseret på om det er en far eller mor node
    const isMotherBranch = child.path.endsWith('mother');
    let offsetY = childYOffset;
    
    // Adskil far- og mor-grene på y-aksen
    if (isMotherBranch) {
      // Mor-grene går nedad med positive y-værdier
      offsetY = Math.max(node.y + 120, childYOffset);
    } else {
      // Far-grene går opad med negative y-værdier
      offsetY = Math.min(node.y - 120, childYOffset);
    }
    
    // Rekursiv placering af undertræer
    layoutSubtree(child, offsetY);
    
    childYOffset += childSize.width / 2;
  });
}

// En funktion til at justere layoutet for overlappende noder
function fixOverlaps(rootNode: TreeNode): void {
  // Saml alle noder i en flad liste, grupperet efter generation
  const nodesByGeneration: { [gen: number]: TreeNode[] } = {};
  
  function collectNodes(node: TreeNode) {
    if (!nodesByGeneration[node.generation]) {
      nodesByGeneration[node.generation] = [];
    }
    nodesByGeneration[node.generation].push(node);
    node.children.forEach(collectNodes);
  }
  
  collectNodes(rootNode);
  
  // For hver generation, check for overlaps og fiks dem
  Object.keys(nodesByGeneration).map(Number).sort().forEach(gen => {
    const nodes = nodesByGeneration[gen].sort((a, b) => a.y - b.y);
    
    // Minimum afstand mellem noder
    const minSeparation = 150;
    
    // Check for overlaps og juster
    for (let i = 1; i < nodes.length; i++) {
      const prevNode = nodes[i-1];
      const currNode = nodes[i];
      
      const overlap = (prevNode.y + minSeparation) - currNode.y;
      if (overlap > 0) {
        // Flyt den aktuelle node ned for at undgå overlap
        currNode.y += overlap;
        
        // Hvis noden flyttet er del af et undertræ, 
        // flyt også undertræets noder med samme afstand
        function moveSubtree(node: TreeNode, deltaY: number) {
          node.children.forEach(child => {
            child.y += deltaY;
            moveSubtree(child, deltaY);
          });
        }
        
        moveSubtree(currNode, overlap);
      }
    }
  });
}

/**
 * Beregn layout for et helt stamtræ
 */
export function calculatePedigreeLayout(pedigree: Rabbit_PedigreeDTO, maxGenerations: number) {
  // Build the tree structure
  const rootNode = buildTreeStructure(pedigree, "root", 0, false, maxGenerations);
  if (!rootNode) return new Map<string, { x: number, y: number }>();

  // Create the layout
  layoutSubtree(rootNode);
  
  // Fix any overlapping nodes
  fixOverlaps(rootNode);
  
  // Extract positions from the tree
  const positions = new Map<string, { x: number, y: number }>();
  
  function extractPositions(node: TreeNode) {
    positions.set(node.path, { x: node.x, y: node.y });
    node.children.forEach(extractPositions);
  }
  
  extractPositions(rootNode);
  
  return positions;
}

/**
 * Formaterer en kant for pæn visning
 */
export function formatEdge(source: { x: number, y: number }, target: { x: number, y: number }, isMotherEdge: boolean) {
  // Beregn afstanden mellem noderne
  //const dx = target.x - source.x;
  const dy = target.y - source.y;
  
  // Brug smart edge type baseret på afstanden og retning
  const edgeType = Math.abs(dy) > 100 ? 'smoothstep' : 'straight';
  
  return {
    type: edgeType,
    animated: false,
    style: { 
      stroke: isMotherEdge ? '#ec4899' : '#3b82f6', // Pink for mor, blå for far
      strokeWidth: 2.5,  // Mere tydelig linje
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: isMotherEdge ? '#ec4899' : '#3b82f6',
      width: 13,
      height: 13
    },
  };
}