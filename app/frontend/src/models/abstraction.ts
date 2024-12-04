import { v4 as uuidv4 } from "uuid";
import { NodeState, GroupNode } from "./types"; // Adjust import paths as necessary

interface GroupNodesResult {
  newGroupNode: GroupNode;
  allNodesToGroup: NodeState[];
}

export function groupNodes(
  selectedNodeIds: string[],
  targetLayer: any,
  activeLayer: any,
  graph: any,
  groupColor: string,
  borderColor: string,
  borderWidth: number,
  padding: number,
  initiatingNodeId?: string,
): GroupNodesResult | null {
  const allNodesToGroup = selectedNodeIds
    .map((id) => {
      const nodeInActive = activeLayer.canvasState.nodes.find(
        (n) => n.id === id,
      );
      const nodeInTarget = targetLayer.canvasState.nodes.find(
        (n) => n.id === id,
      );
      return nodeInActive || nodeInTarget;
    })
    .filter(Boolean) as NodeState[];

  if (initiatingNodeId) {
    // Find initiating node to use as the group node
    const initiatingNode = allNodesToGroup.find(
      (node) => node.id === initiatingNodeId,
    );
    if (!initiatingNode) {
      console.error("Initiating node not found among selected nodes.");
      return null;
    }
    initiatingNode.isGroup = true;

    const otherNodes = allNodesToGroup.filter(
      (node) => node.id !== initiatingNodeId && node.isGroup !== true,
    );
    const avgX =
      otherNodes.reduce((sum, node) => sum + node.x, 0) / otherNodes.length;
    const avgY =
      otherNodes.reduce((sum, node) => sum + node.y, 0) / otherNodes.length;

    const newGroupNode: GroupNode = {
      ...initiatingNode,
      id: initiatingNode.id,
      name: `Group ${targetLayer.canvasState.groups.length + 1}`,
      isGroup: true,
      groupColor: groupColor,
      borderColor: borderColor,
      padding: padding,
      nodeIds: selectedNodeIds.filter((id) => id !== initiatingNodeId),
      x: avgX,
      y: avgY,
    };

    return { newGroupNode, allNodesToGroup };
  } else {
    const avgX =
      allNodesToGroup.reduce((sum, node) => sum + node.x, 0) /
      allNodesToGroup.length;
    const avgY =
      allNodesToGroup.reduce((sum, node) => sum + node.y, 0) /
      allNodesToGroup.length;

    const newGroupNode: GroupNode = {
      id: uuidv4(),
      name: `Group ${targetLayer.canvasState.groups.length + 1}`,
      x: avgX,
      y: avgY,
      size: 30,
      stroke: "#0000FF",
      strokeWidth: 10,
      color: "#FFFFFF",
      padding: padding,
      isGroup: true,
      nodeIds: selectedNodeIds,
      groupColor: groupColor,
    };

    return { newGroupNode, allNodesToGroup };
  }
}
