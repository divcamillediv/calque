import React, { createContext, useContext, useState } from "react";
import { GroupNode } from "../models/graph.ts";

interface CanvasState {
  images: any[];
  nodes: any[];
  edges: any[];
  autoIncrement: number;
  groups: GroupNode[];
}

interface Layer {
  id: number;
  name: string;
  description?: string;
  order: number;
  visible: boolean;
  canvasState: CanvasState;
  opacity: number;
}

interface LayerContextType {
  layers: Layer[];
  activeLayerId: number;
  addLayer: () => void;
  setActiveLayer: (id: number) => void;
  updateCanvasState: (state: CanvasState) => void;
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>;
}

const LayerContext = createContext<LayerContextType | undefined>(undefined);

export const UseLayers = (props: { children: React.ReactNode }) => {
  const [layers, setLayers] = useState<Layer[]>([
    {
      id: 1,
      name: "Layer 1",
      description: "",
      order: 1,
      opacity: 1,
      visible: true,
      canvasState: {
        images: [],
        nodes: [],
        edges: [],
        autoIncrement: 0,
        groups: [],
      },
    },
  ]);
  const [activeLayerId, setActiveLayerId] = useState(1);

  const updateLayerOpacities = (layers: Layer[], activeLayerId: number): Layer[] => {
    const activeLayer = layers.find((layer) => layer.id === activeLayerId);
    if (!activeLayer) return layers;

    const activeOrder = activeLayer.order;

    return layers.map((layer) => {
      if (layer.id === activeLayerId) {
        return { ...layer, opacity: 1 };
      } else if (layer.order > activeOrder) {
        const opacityDecrement = 0.1;
        const layersAbove = layer.order - activeOrder;
        const newOpacity = Math.max(1 - layersAbove * opacityDecrement, 0.2);
        console.log(`Layer ${layer.id} opacity set to ${newOpacity}`);
        return { ...layer, opacity: newOpacity };
      } else {
        // Layers below the active layer: maintain full opacity or define another logic
        return { ...layer, opacity: 1 };
      }
    });
  };

  const addLayer = () => {
    setLayers((prevLayers) => {
      const newOrder = Math.max(...prevLayers.map((l) => l.order)) + 1;
      const newId = prevLayers.length + 1;
      const newLayer: Layer = {
        id: newId,
        name: `Layer ${newId}`,
        description: ``,
        order: newOrder,
        opacity: 0.7,
        visible: true,
        canvasState: {
          images: [],
          nodes: [],
          edges: [],
          autoIncrement: 0,
          groups: [],
        },
      };
      const updatedLayers = updateLayerOpacities([...prevLayers, newLayer], newId);
      setActiveLayerId(newId);
      return updatedLayers;
    });
  };

  const setActiveLayer = (id: number) => {
    setActiveLayerId(id);
    setLayers((prevLayers) => updateLayerOpacities(prevLayers, id));
  };

  const updateCanvasState = (state: CanvasState) => {
    setLayers((prevLayers) =>
        prevLayers.map((layer) =>
            layer.id === activeLayerId ? { ...layer, canvasState: state } : layer,
        ),
    );
  };

  return (
      <LayerContext.Provider
          value={{
            layers,
            activeLayerId,
            addLayer,
            setActiveLayer,
            updateCanvasState,
            setLayers,
          }}
      >
        {props.children}
      </LayerContext.Provider>
  );
};

export const useLayers = () => {
  const context = useContext(LayerContext);
  if (!context) throw new Error("useLayers must be used within a LayerProvider");
  return context;
};
