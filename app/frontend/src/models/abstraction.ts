import { v4 as uuidv4 } from 'uuid';
import { GroupNode } from "../models/groupNode";
import { Layer } from "../models/layer";
import { GraphState } from "./graph.ts";

export const groupNodes = (
    selectedNodeIds: string[],
    targetLayer: Layer,
    color?: string,
    stroke?: string,
    strokeWidth?: number,
    size?: number,
): { newGroupNode: GroupNode | null } => {
    console.log("groupNodes called with:", { selectedNodeIds, targetLayerId: targetLayer.id });

    if (selectedNodeIds.length === 0) {
        console.warn("No nodes selected for grouping.");
        return { newGroupNode: null };
    }

    // retrieve the selected nodes from the target layer
    const selectedNodes = targetLayer.canvasState.nodes.filter((node) =>
        selectedNodeIds.includes(node.id) && !node.isGroup, // Exclude group nodes
    );

    console.log("Selected Nodes for Grouping:", selectedNodes);

    if (selectedNodes.length === 0) {
        console.warn("Selected node IDs do not match any existing nodes in the target layer.");
        return { newGroupNode: null };
    }

    const avgX =
        selectedNodes.reduce((sum, node) => sum + node.x, 0) / selectedNodes.length;
    const avgY =
        selectedNodes.reduce((sum, node) => sum + node.y, 0) / selectedNodes.length;

    console.log(`Average Position for Group Node: (${avgX}, ${avgY})`);

    const defaultGroupSize = 30;

    const newGroupNode: GroupNode = {
        id: uuidv4(),
        name: `Group ${targetLayer.canvasState.groups.length + 1}`,
        sourceLayerId: targetLayer.id,
        targetLayerId: targetLayer.id,
        nodeIds: selectedNodeIds,
        x: avgX + 10,
        y: avgY + 10,
        fill: "#FFFFFF",
        color: color || "#FFFFFF",
        stroke: stroke || "#0000FF",
        strokeWidth: strokeWidth || 10,
        size: size || defaultGroupSize,
        isGroup: true,
    };

    console.log("New Group Node Created:", newGroupNode);

    return { newGroupNode };
};
