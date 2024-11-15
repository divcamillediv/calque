// UseAbstraction.tsx

import React, { createContext, useState, ReactNode } from "react";

interface AbstractionContextProps {
    isAbstractionActive: boolean;
    initiatingNodeId: string | null;
    selectedNodeIds: string[];
    targetLayerId: number | null;
    startAbstraction: (initiatingNodeId: string, selectedNodeIds: string[]) => void;
    cancelAbstraction: () => void;
    confirmAbstraction: (targetLayerId: number) => void;
    setSelectedNodeIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export const AbstractionContext = createContext<AbstractionContextProps>({
    isAbstractionActive: false,
    initiatingNodeId: null,
    selectedNodeIds: [],
    targetLayerId: null,
    startAbstraction: () => {},
    cancelAbstraction: () => {},
    confirmAbstraction: () => {},
    setSelectedNodeIds: () => {},
});

export const UseAbstraction: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAbstractionActive, setIsAbstractionActive] = useState(false);
    const [initiatingNodeId, setInitiatingNodeId] = useState<string | null>(null);
    const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
    const [targetLayerId, setTargetLayerId] = useState<number | null>(null);

    const startAbstraction = (nodeId: string, nodesToGroup: string[]) => {
        setInitiatingNodeId(nodeId);
        setSelectedNodeIds(nodesToGroup);
        setIsAbstractionActive(true);
    };

    const cancelAbstraction = () => {
        setInitiatingNodeId(null);
        setSelectedNodeIds([]);
        setTargetLayerId(null);
        setIsAbstractionActive(false);
    };

    const confirmAbstraction = (layerId: number) => {
        setTargetLayerId(layerId);
        // the actual confirmation logic is handled in Rightbar
    };

    return (
        <AbstractionContext.Provider
            value={{
                isAbstractionActive,
                initiatingNodeId,
                selectedNodeIds,
                targetLayerId,
                startAbstraction,
                cancelAbstraction,
                confirmAbstraction,
                setSelectedNodeIds,
            }}
        >
            {children}
        </AbstractionContext.Provider>
    );
};
