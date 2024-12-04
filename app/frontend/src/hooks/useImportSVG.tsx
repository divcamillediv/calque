import { useRef } from 'react';
import * as d3 from 'd3';
import { BaseType } from 'd3';
import { v4 as uuidv4 } from "uuid";

// Hook to handle SVG importing logic
const useImportSVG = (setLayers) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to trigger the file input
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  interface IDMapping {
    [oldId: string]: string;
  }

  const generateNewIDs = (layers: Layer[]): Layer[] => {
    const layerIdMap: IDMapping = {};
    const nodeIdMap: IDMapping = {};
    const edgeIdMap: IDMapping = {};
    const groupIdMap: IDMapping = {};

    const newLayers = layers.map(layer => {
      const newLayerId = uuidv4();
      layerIdMap[layer.id.toString()] = newLayerId;

      const newNodes = layer.canvasState.nodes.map(node => {
        const newNodeId = uuidv4();
        nodeIdMap[node.id] = newNodeId;
        return { ...node, id: newNodeId };
      });

      const newEdges = layer.canvasState.edges.map(edge => {
        const newEdgeId = uuidv4();
        edgeIdMap[edge.id] = newEdgeId;
        const updatedEdge = {
          ...edge,
          id: newEdgeId,
          source: nodeIdMap[edge.source] || edge.source,
          target: nodeIdMap[edge.target] || edge.target,
        };
        return updatedEdge;
      });

      const newGroups = layer.canvasState.groups.map(group => {
        const newGroupId = uuidv4();
        groupIdMap[group.id] = newGroupId;
        const updatedGroup = {
          ...group,
          id: newGroupId,
          nodeIds: group.nodeIds.map(nodeId => nodeIdMap[nodeId] || nodeId),
        };
        return updatedGroup;
      });

      return {
        ...layer,
        id: newLayerId,
        canvasState: {
          ...layer.canvasState,
          nodes: newNodes,
          edges: newEdges,
          groups: newGroups,
        },
      };
    });

    return newLayers;
  };

  // Function to handle file selection and read the content
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileName = file.name;
      if (fileName.includes('.calque')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          try {
            const importData = JSON.parse(content);
            setLayers(generateNewIDs(importData));
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
        };
        reader.readAsText(file);
      }
    }
  };

  return {
    fileInputRef,
    handleImportClick,
    handleFileChange,
  };
};

// Helper functions for mouse events (keep them separate for reuse)
const handleNodeMouseOver = (node: d3.Selection<BaseType, unknown, null, undefined>) => {
  node.transition().duration(200).attr('fill', 'orange').attr('stroke', 'red');
};

const handleEdgeMouseOver = (edge: d3.Selection<BaseType, unknown, null, undefined>) => {
  edge.transition().duration(200).attr('stroke', 'orange');
};

const handleImageMouseOver = (image: d3.Selection<BaseType, unknown, null, undefined>) => {
  image.transition().duration(200).attr('opacity', '0.5');
};

const handleNodeMouseOut = (node: d3.Selection<BaseType, unknown, null, undefined>) => {
  node
      .transition()
      .duration(200)
      .attr('fill', () => node.attr('og-fill'))
      .attr('stroke', () => node.attr('og-stroke'));
};

const handleEdgeMouseOut = (edge: d3.Selection<BaseType, unknown, null, undefined>) => {
  edge.transition().duration(200).attr('stroke', () => edge.attr('og-color'));
};

const handleImageMouseOut = (image: d3.Selection<BaseType, unknown, null, undefined>) => {
  image.transition().duration(200).attr('opacity', () => image.attr('og-opacity'));
};

export { useImportSVG };