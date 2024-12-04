import React, { useState, useContext, useEffect } from "react";
import { Layer } from "../models/layer";
import { AbstractionContext } from "../../contexts/UseAbstraction";

interface AbstractionSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  layers: Layer[];
  activeLayerId: string;
  onConfirm: (selectedNodeIds: string[], targetLayerId: string) => void;
}

const AbstractionSelection: React.FC<AbstractionSelectionProps> = ({
  isOpen,
  onClose,
  layers,
  activeLayerId,
  onConfirm,
}) => {
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  const { initiatingNodeId } = useContext(AbstractionContext);

  useEffect(() => {
    console.log("AbstractionSelection - Active Layer ID:", activeLayerId);
  }, [activeLayerId]);

  // Reset selectedLayerId and selectedNodeIds when the modal opens or activeLayerId changes
  useEffect(() => {
    if (isOpen) {
      console.log("AbstractionSelection - Modal opened. Resetting selections.");
      setSelectedLayerId(null);
      setSelectedNodeIds([]);
    }
  }, [isOpen, activeLayerId]);

  // Reset selectedNodeIds when targetLayer changes
  useEffect(() => {
    setSelectedNodeIds([]);
    if (selectedLayerId !== null) {
      console.log(
        "AbstractionSelection - Target Layer ID changed to:",
        selectedLayerId,
      );
    }
  }, [selectedLayerId]);

  const handleLayerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const layerId = (e.target.value);
    console.log(`AbstractionSelection - Target Layer selected: ${layerId}`);
    setSelectedLayerId(layerId);
    setSelectedNodeIds([]);
  };

  const handleNodeSelection = (nodeId: string) => {
    setSelectedNodeIds((prev) => {
      const newSelectedNodeIds = prev.includes(nodeId)
        ? prev.filter((id) => id !== nodeId)
        : [...prev, nodeId];
      console.log(
        `AbstractionSelection - Node ${nodeId} selection toggled. Current selection:`,
        newSelectedNodeIds,
      );
      return newSelectedNodeIds;
    });
  };

  const handleConfirm = () => {
    const uniqueNodeIds = Array.from(new Set(selectedNodeIds));
    console.log("AbstractionSelection - Confirming abstraction with:", {
      uniqueNodeIds,
      selectedLayerId,
    });
    if (selectedLayerId !== null && uniqueNodeIds.length > 0) {
      onConfirm(uniqueNodeIds, selectedLayerId);
      onClose();
    } else {
      console.warn(
        "AbstractionSelection - Cannot confirm abstraction. Either target layer is not selected or no nodes are selected.",
      );
    }
  };

  if (!isOpen) return null;

  const targetLayer = layers.find((layer) => layer.id === selectedLayerId);

  return (
    <div className="abstraction-selection-container p-4">
      <h2 className="text-xl font-bold mb-4">Abstraction</h2>
      <div className="mb-4">
        <label className="block font-medium mb-2">Select Target Layer:</label>
        <select
          value={selectedLayerId || ""}
          onChange={handleLayerChange}
          className="w-full p-2 border rounded"
        >
          <option value="" disabled>
            Select Layer
          </option>
          {layers
            .filter((layer) => layer.id !== activeLayerId) // Exclude active layer from target options
            .map((layer) => (
              <option key={layer.id} value={layer.id}>
                {layer.name}
              </option>
            ))}
        </select>
      </div>
      {targetLayer && (
        <div className="mb-4">
          <label className="block font-medium mb-2">
            Select Nodes to Group:
          </label>
          <ul className="max-h-48 overflow-y-auto border p-2 rounded">
            {targetLayer.canvasState.nodes
              .filter(
                (node) =>
                  !node.isGroup &&
                  node.id !== initiatingNodeId &&
                  !targetLayer.canvasState.groups.some((group) =>
                    group.nodeIds.includes(node.id),
                  ),
              )
              .map((node) => (
                <li key={node.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedNodeIds.includes(node.id)}
                    onChange={() => handleNodeSelection(node.id)}
                    className="mr-2"
                  />
                  <span>{node.name || node.id}</span>
                </li>
              ))}
          </ul>
        </div>
      )}
      <div className="flex justify-between">
        <button
          onClick={handleConfirm}
          className={`px-4 py-2 rounded ${
            selectedLayerId !== null && selectedNodeIds.length > 0
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 cursor-not-allowed"
          }`}
          disabled={selectedLayerId === null || selectedNodeIds.length === 0}
        >
          Confirm
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AbstractionSelection;
