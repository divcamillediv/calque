import React, { createContext, useState, ReactNode, useContext } from "react";
import { useLayers } from "../contexts/UseLayers.tsx";
import { groupNodes } from "../models/abstraction.ts";
import { GraphContext, SelectedEntityContext } from "../components/Layout.tsx";

interface AbstractionContextProps {
  isAbstractionActive: boolean;
  abstractionSelectionOpen: boolean;
  initiatingNodeId: string | null;
  startAbstraction: (initiatingNodeId: string) => void;
  cancelAbstraction: () => void;
  confirmAbstraction: (
    selectedNodeIds: string[],
    targetLayerId: string,
  ) => void;
  setAbstractionSelectionOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AbstractionContext = createContext<AbstractionContextProps>({
  isAbstractionActive: false,
  abstractionSelectionOpen: false,
  initiatingNodeId: null,
  startAbstraction: () => {},
  cancelAbstraction: () => {},
  confirmAbstraction: () => {},
  setAbstractionSelectionOpen: () => {},
});

export const UseAbstraction: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [abstractionSelectionOpen, setAbstractionSelectionOpen] =
    useState(false);
  const [initiatingNodeId, setInitiatingNodeId] = useState<string | null>(null);

  const { layers, setLayers, activeLayerId } = useLayers();
  const graphHandler = useContext(GraphContext);
  const { setSelectedEntity } = useContext(SelectedEntityContext);

  const startAbstraction = (nodeId: string) => {
    setInitiatingNodeId(nodeId);
    setAbstractionSelectionOpen(true);
  };

  const cancelAbstraction = () => {
    setInitiatingNodeId(null);
    setAbstractionSelectionOpen(false);
  };

  const confirmAbstraction = (
    selectedNodeIds: string[],
    targetLayerId: string,
  ) => {
    const completeSelectedNodeIds =
      initiatingNodeId && !selectedNodeIds.includes(initiatingNodeId)
        ? [...selectedNodeIds, initiatingNodeId]
        : selectedNodeIds;

    const targetLayer = layers.find((layer) => layer.id === targetLayerId);
    const activeLayer = layers.find((layer) => layer.id === activeLayerId);

    if (!targetLayer || !activeLayer) {
      console.error("Layer not found");
      return;
    }

    const isInitiatingNodeSelected =
      initiatingNodeId && completeSelectedNodeIds.includes(initiatingNodeId);

    const groupResult = groupNodes(
      completeSelectedNodeIds,
      targetLayer,
      activeLayer,
      graphHandler.graph,
      "#0000FF",
      "#FFFFFF",
      20,
      30,
      isInitiatingNodeSelected ? initiatingNodeId : undefined,
    );

    if (!groupResult) {
      console.error("Group creation failed");
      return;
    }

    const { newGroupNode, allNodesToGroup } = groupResult;

    const updatedTargetNodes = targetLayer.canvasState.nodes.map((node) => {
      if (
        completeSelectedNodeIds.includes(node.id) &&
        node.id !== initiatingNodeId
      ) {
        return { ...node, groupId: newGroupNode.id };
      }
      return node;
    });

    // If using the initiating node as the group, remove it from the active layer
    let updatedActiveLayer = activeLayer;
    if (isInitiatingNodeSelected) {
      updatedActiveLayer = {
        ...activeLayer,
        canvasState: {
          ...activeLayer.canvasState,
          nodes: activeLayer.canvasState.nodes.filter(
            (node) => node.id !== initiatingNodeId,
          ),
          groups:
            activeLayer.canvasState.groups?.filter(
              (group) => group.id !== initiatingNodeId,
            ) || [],
        },
      };
    }

    const updatedLayers = layers.map((layer) => {
      if (layer.id === targetLayer.id) {
        return {
          ...layer,
          canvasState: {
            ...layer.canvasState,
            nodes: [
              // Remove grouped nodes from target layer
              ...layer.canvasState.nodes.filter(
                (node) =>
                  !completeSelectedNodeIds.includes(node.id) ||
                  node.id === initiatingNodeId,
              ),
              // Add the new group node
              newGroupNode,
              // Add updated nodes with groupId
              ...updatedTargetNodes.filter(
                (node) =>
                  completeSelectedNodeIds.includes(node.id) &&
                  node.id !== initiatingNodeId,
              ),
            ],
            groups: [...(layer.canvasState.groups || []), newGroupNode],
          },
        };
      }
      if (layer.id === activeLayer.id && isInitiatingNodeSelected) {
        return updatedActiveLayer;
      }
      return layer;
    });

    setLayers(updatedLayers);
    setSelectedEntity({ kind: "node", id: newGroupNode.id });
    setAbstractionSelectionOpen(false);
    setInitiatingNodeId(null);
  };

  return (
    <AbstractionContext.Provider
      value={{
        isAbstractionActive: abstractionSelectionOpen,
        abstractionSelectionOpen,
        initiatingNodeId,
        startAbstraction,
        cancelAbstraction,
        confirmAbstraction,
        setAbstractionSelectionOpen,
      }}
    >
      {children}
    </AbstractionContext.Provider>
  );
};

export default UseAbstraction;
