import React, { useState } from "react";
import { Layer } from "../models/layer";

interface AbstractionSelectionProps {
    isOpen: boolean;
    onClose: () => void;
    layers: Layer[];
    activeLayerId: number;
    onConfirm: (selectedNodeIds: string[], targetLayerId: number) => void;
}

const AbstractionSelection: React.FC<AbstractionSelectionProps> = ({
                                                                       isOpen,
                                                                       onClose,
                                                                       layers,
    activeLayerId,
                                                                       onConfirm,
                                                                   }) => {
    const [selectedLayerId, setSelectedLayerId] = useState<number | null>(null);
    const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);

    const targetLayer = layers.find((layer) => layer.id === selectedLayerId);

    const handleLayerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const layerId = Number(e.target.value);
        setSelectedLayerId(layerId);
        setSelectedNodeIds([]);
    };

    const handleNodeSelection = (nodeId: string) => {
        setSelectedNodeIds((prev) =>
            prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
        );
    };

    const handleConfirm = () => {
        const uniqueNodeIds = Array.from(new Set(selectedNodeIds));
        if (selectedLayerId !== null && uniqueNodeIds.length > 0) {
            onConfirm(uniqueNodeIds, selectedLayerId);
            onClose();
        }
    };

    if (!isOpen) return null;

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
                        .filter((layer) => layer.id !== activeLayerId)
                        .map((layer) => (
                            <option key={layer.id} value={layer.id}>
                                {layer.name}
                            </option>
                        ))}
                </select>
            </div>
            {targetLayer && (
                <div className="mb-4">
                    <label className="block font-medium mb-2">Select Nodes to Group:</label>
                    <ul className="max-h-48 overflow-y-auto border p-2 rounded">
                        {targetLayer.canvasState.nodes
                            .filter((node) => !node.isGroup) // Exclude group nodes
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
