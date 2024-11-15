import React, { useContext, useEffect, useRef, useState } from "react";
import Edge from "./entities/Edge";
import { AppContext, GraphContext, SelectedEntityContext } from "./Layout";
import Node from "./entities/Node";
import { getImage, insertImage, updateImage } from "../models/image";
import { getNode, insertNode, updateNode } from "../models/node";
import MyImage from "./entities/Image";
import { useLayers } from "../contexts/UseLayers.tsx";
import { emptyGraph } from "../models/graph.ts";
import { groupNodes as groupNodesFunction } from "../models/abstraction.ts";
import {AbstractionContext} from "../pages/MapCreationPage.tsx";


function getPointerCanvasCoordinates<T>(
    canvas: SVGSVGElement,
    event: React.MouseEvent<T>,
) {
  const bounds = canvas.getBoundingClientRect();
  return {
    x: Math.round(event.clientX - bounds.left),
    y: Math.round(event.clientY - bounds.top),
  };
}

type CanvasAction =
    | { kind: "drag"; nodeId: string }
    | { kind: "edge"; nodeId: string }
    | { kind: "dragGroup"; groupId: string }
    | { kind: "dragImg"; imgId: string; offsetX: number; offsetY: number };

interface CanvasHandler {
  ref: React.RefObject<SVGSVGElement>;
  action: CanvasAction | null;
  setAction: React.Dispatch<CanvasAction | null>;
}

const CanvasContext = React.createContext<CanvasHandler>(undefined as any);

const Canvas = () => {
  const { mode, tool } = useContext(AppContext);
  const graphHandler = useContext(GraphContext);
  const { selectedEntity, setSelectedEntity } = useContext(SelectedEntityContext);
  const [action, setAction] = useState<CanvasAction | null>(null);
  const canvasRef = useRef<SVGSVGElement>(null);

  const { layers, activeLayerId, setLayers, setActiveLayer } = useLayers();
  const activeLayer = layers.find((layer) => layer.id === activeLayerId);
  const prevActiveLayerIdRef = useRef<number>(activeLayerId);

  const [selectedElements, setSelectedElements] = useState<CanvasAction[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isRectActive, setIsRectActive] = useState(false);
  const [rect, setRect] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
      null,
  );

  //const [image, setImage] = useState<string | null>(null);

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    console.log("canvas is clicked");
    if (mode === "edit" && tool === "node") {
      const coordinates = getPointerCanvasCoordinates(
          event.currentTarget,
          event,
      );
      const node = insertNode(
          graphHandler,
          coordinates.x,
          coordinates.y,
          activeLayerId,
      );
      setSelectedEntity({ kind: "node", id: node.id });
    }
    if (
        event.target === event.currentTarget ||
        event.target instanceof SVGImageElement
    ) {
      if (tool !== "node") {
        setSelectedEntity(null);
      }
    }
  };

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    const coords = getPointerCanvasCoordinates(event.currentTarget, event);

    if (isSelecting && selectionStart) {
      setSelectionEnd(coords);
    } else if (isDragging && dragStart && rect) {
      const deltaX = coords.x - dragStart.x;
      const deltaY = coords.y - dragStart.y;

      if (activeLayer) {
        const selectedNodeIds = selectedElements
            .filter((el) => el.kind === "drag")
            .map((el) => el.nodeId);

        // need to test that (img)
        const selectedImageIds = selectedElements
            .filter((el) => el.kind === "dragImg")
            .map((el) => el.imgId);

        const updatedNodes = activeLayer.canvasState.nodes.map((node) => {
          if (selectedNodeIds.includes(node.id)) {
            return {
              ...node,
              x: node.x + deltaX,
              y: node.y + deltaY,
            };
          } else {
            return node;
          }
        });

        const updatedImages = activeLayer.canvasState.images.map((image) => {
          if (selectedImageIds.includes(image.id)) {
            return {
              ...image,
              x: image.x + deltaX,
              y: image.y + deltaY,
            };
          } else {
            return image;
          }
        });

        const newGraph = {
          ...activeLayer.canvasState,
          nodes: updatedNodes,
          images: updatedImages,
        };

        graphHandler.setGraph(newGraph);
      }

      // TODO: Update edges if they have separate coordinates

      // move the rec along with the active layer
      setRect((prevRect) => {
        if (prevRect) {
          return {
            ...prevRect,
            x: prevRect.x + deltaX,
            y: prevRect.y + deltaY,
          };
        }
        return prevRect;
      });

      // ppdate dragStart for continuous dragging //TODO maybe need better logic?
      setDragStart(coords);
    }
    // Need to check if can move canva or only node/edge
    else if (action !== null) {
      switch (action.kind) {
        case "drag":
          const coordinates = getPointerCanvasCoordinates(
              event.currentTarget,
              event,
          );
          const node = getNode(graphHandler.graph, action.nodeId);

          if (node) {
            updateNode(graphHandler, {
              ...node,
              x: coordinates.x,
              y: coordinates.y,
            });
          }

          break;
        case "dragImg":
          const canvasCoordinates = getPointerCanvasCoordinates(
              event.currentTarget,
              event,
          );
          const newX = canvasCoordinates.x - action.offsetX;
          const newY = canvasCoordinates.y - action.offsetY;

          const image = getImage(graphHandler.graph, action.imgId);
          updateImage(graphHandler, {
            ...image,
            x: newX,
            y: newY,
          });
          break;
        case "edge":
          // TODO peut-être étirer un edge du node1 au prochain node?
          break;
        case "dragGroup": {
          // Handle group dragging
          if (!dragStart) break;

          const deltaX = coords.x - dragStart.x;
          const deltaY = coords.y - dragStart.y;

          const groupNode = graphHandler.graph.nodes.find(
              (n) => n.id === action.groupId && n.isGroup,
          );
          if (groupNode) {
            const updatedGroupNode = {
              ...groupNode,
              x: groupNode.x + deltaX,
              y: groupNode.y + deltaY,
            };

            // update contained nodes positions relative to group node
            const updatedNodes = graphHandler.graph.nodes.map((node) => {
              if (node.groupId === groupNode.id) {
                return {
                  ...node,
                  x: node.x + deltaX,
                  y: node.y + deltaY,
                };
              }
              return node;
            });

            graphHandler.setGraph({
              ...graphHandler.graph,
              nodes:   updatedNodes.map((n) =>
                  n.id === groupNode.id ? updatedGroupNode : n
              ),
            });

            // for continuous dragging
            setDragStart(coords);
          }
          break;
        }
        default:
          break;
      }
    }
  };

  const handleMouseLeave = () => {
    if (action !== null) {
      setAction(null);
    }
    if (isDragging) {
      setIsDragging(false);
      setDragStart(null);
    }
    if (isSelecting) {
      setIsSelecting(false);
      setSelectionStart(null);
      setSelectionEnd(null);
    }
  };

  const handleMouseDown = (event: React.MouseEvent<SVGSVGElement>) => {
    // we should 1st determine if click is on active layer's element
    const coords = getPointerCanvasCoordinates(event.currentTarget, event);

    if (isRectActive && rect && isPointInRect(coords, rect)) {
      // click is inside active region, start dragging
      setIsDragging(true);
      setDragStart(coords);
    } else {
      if (isRectActive) {
        // Click is outside rect, should now deactivate it
        setIsRectActive(false);
        setRect(null);
      }
      setIsSelecting(true);
      setSelectionStart(coords);
      setSelectionEnd(coords);
    }
  };

  function getElementsInActiveLayer(rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) {
    if (!activeLayer) return [];

    const elementsInRect: CanvasAction[] = [];

    activeLayer.canvasState.nodes.forEach((node) => {
      if (
          node.x >= rect.x &&
          node.x <= rect.x + rect.width &&
          node.y >= rect.y &&
          node.y <= rect.y + rect.height
      ) {
        elementsInRect.push({ kind: "drag", nodeId: node.id });
      }
    });

    return elementsInRect;
  }

  const handleMouseUp = () => {
    if (isSelecting && selectionStart && selectionEnd) {
      setIsSelecting(false);
      const selectionRect = getSelectionRectangle(selectionStart, selectionEnd);
      setRect(selectionRect);
      setIsRectActive(true);

      // check if there is elements within the selection
      const elementsInSelection = getElementsInActiveLayer(selectionRect);
      if (elementsInSelection.length > 0) {
        setSelectedElements(elementsInSelection);
      } else {
        setSelectedElements([]);
      }
    } else if (isDragging) {
      setIsDragging(false);
      setDragStart(null);
      setIsRectActive(false);
      setRect(null);
    } else if (action !== null) {
      switch (action.kind) {
        case "drag":
          setAction(null);
          break;
        case "dragImg":
          setAction(null);
          break;
        case "edge":
          // TODO supprimer la "demi-edge" qui suivait le curseur si on n'est pas sur un node, sinon créer le edge?? maybe??
          break;
        case "dragGroup":
          setAction(null);
          break;
        default:
          break;
      }
    }
  };

  function getSelectionRectangle(
      start: { x: number; y: number },
      end: { x: number; y: number },
  ) {
    return {
      x: Math.min(start.x, end.x),
      y: Math.min(start.y, end.y),
      width: Math.abs(end.x - start.x),
      height: Math.abs(end.y - start.y),
    };
  }

  function isPointInRect(
      point: { x: number; y: number },
      rect: { x: number; y: number; width: number; height: number },
  ): boolean {
    return (
        point.x >= rect.x &&
        point.x <= rect.x + rect.width &&
        point.y >= rect.y &&
        point.y <= rect.y + rect.height
    );
  }

  const handlePaste = (event: React.ClipboardEvent<SVGSVGElement>) => {
    console.log("Ctrl + V used");
    const clipboardData = event.clipboardData;
    if (mode !== "edit" || !clipboardData) {
      console.log("Item cannot be pasted");
      return;
    }

    const items = clipboardData.items;
    if (items) {
      for (const item of items) {
        if (item.type.includes("image")) {
          const file = item.getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onloadend = (e: ProgressEvent<FileReader>) => {
              const imageData = e.target?.result;
              if (typeof imageData === "string") {
                const img = new Image();
                img.onload = () => {
                  //setImage(imageData);
                  const newImage = insertImage(
                      graphHandler,
                      imageData,
                      img.width,
                      img.height,
                      activeLayerId,
                  );
                  setSelectedEntity({ kind: "image", id: newImage.id });
                };
                img.src = imageData;
              }
            };
            reader.readAsDataURL(file);
          }
          break;
        }
      }
    }
  };

//use of a ref to prevent infinite loops during synchronization
  const isUpdatingRef = useRef(false);
  const isGroupingRef = useRef(false);

// synchronize graphHandler.graph with active layer's canvasState
  useEffect(() => {
    if (isUpdatingRef.current || isGroupingRef.current) {
      return;
    }

    isUpdatingRef.current = true;

    setLayers((prevLayers) =>
        prevLayers.map((layer) =>
            layer.id === activeLayerId
                ? { ...layer, canvasState: graphHandler.graph }
                : layer
        )
    );

    isUpdatingRef.current = false;
  }, [graphHandler.graph, activeLayerId, setLayers]);



// handle layer switching
  useEffect(() => {
    const prevActiveLayerId = prevActiveLayerIdRef.current;

    if (prevActiveLayerId !== activeLayerId) {
      setLayers((prevLayers) =>
          prevLayers.map((layer) =>
              layer.id === prevActiveLayerId
                  ? { ...layer, canvasState: graphHandler.graph }
                  : layer
          )
      );

      isUpdatingRef.current = true;

      graphHandler.setGraph(
          activeLayer?.canvasState ? activeLayer.canvasState : emptyGraph
      );

      isUpdatingRef.current = false;
    }

    setSelectedEntity(null);

    prevActiveLayerIdRef.current = activeLayerId;
  }, [activeLayerId]);

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      console.log(items);
    };

    const canvasElem = canvasRef.current;
    canvasElem?.addEventListener("paste", handlePaste);

    canvasElem?.focus();

    return () => {
      canvasElem?.removeEventListener("paste", handlePaste);
    };
  }, []);

  const [selectedTargetLayerId, setSelectedTargetLayerId] = useState<
      number | null
  >(null);



  const [pendingSelectedNodeId, setPendingSelectedNodeId] = useState<string | null>(null);


  useEffect(() => {
    if (pendingSelectedNodeId && activeLayer) {
      const nodeExists = activeLayer.canvasState.nodes.find(
          (node) => node.id === pendingSelectedNodeId
      );
      if (nodeExists) {
        setSelectedEntity({ kind: "node", id: pendingSelectedNodeId });
        setPendingSelectedNodeId(null);
      } else {
        console.warn(
            `Selected node ${pendingSelectedNodeId} not found in the active layer.`
        );
        setPendingSelectedNodeId(null);
      }
    }
  }, [activeLayer, pendingSelectedNodeId, setSelectedEntity]);


  const handleAbstractGroup = () => {
    if (selectedElements.length === 0 || selectedTargetLayerId === null) return;

    const selectedNodeIds = selectedElements
        .filter((action) => action.kind === "drag")
        .map((action) => action.nodeId);

    if (selectedNodeIds.length === 0) return;

    const targetLayer = layers.find((layer) => layer.id === selectedTargetLayerId);
    if (!targetLayer) {
      console.error("Target layer not found");
      return;
    }

    const { newGroupNode } = groupNodesFunction(
        selectedNodeIds,
        targetLayer,
        activeLayer,
        graphHandler.graph
    );

    if (!newGroupNode) {
      console.error("Group node creation failed.");
      return;
    }

    // move nodes from activeLayer to targetLayer
    const updatedLayers = layers.map((layer) => {
      if (layer.id === activeLayer.id) {
        // Remove grouped nodes from active layer
        return {
          ...layer,
          canvasState: {
            ...layer.canvasState,
            nodes: layer.canvasState.nodes.filter(
                (node) => !selectedNodeIds.includes(node.id)
            ),
            // Remove groups if necessary
            groups: layer.canvasState.groups?.filter(
                (group) => group.id !== newGroupNode.id
            ) || [],
          },
        };
      }
      if (layer.id === targetLayer.id) {
        // Add grouped nodes with groupId to target layer
        const groupedNodes = graphHandler.graph.nodes
            .filter((node) => selectedNodeIds.includes(node.id))
            .map((node) => ({ ...node, groupId: newGroupNode.id }));

        return {
          ...layer,
          canvasState: {
            ...layer.canvasState,
            nodes: [...layer.canvasState.nodes, ...groupedNodes, newGroupNode],
            groups: [...(layer.canvasState.groups || []), newGroupNode],
          },
        };
      }
      return layer;
    });

    graphHandler.setGraph({
      ...graphHandler.graph,
      nodes: graphHandler.graph.nodes.map((node) => {
        if (selectedNodeIds.includes(node.id)) {
          return { ...node, groupId: newGroupNode.id };
        }
        return node;
      }),
      groups: [...(graphHandler.graph.groups || []), newGroupNode],
    });

    setLayers(updatedLayers);

    setActiveLayer(selectedTargetLayerId);

    setPendingSelectedNodeId(newGroupNode.id);

    setSelectedElements([]);
  };

  const { abstractionSelectionOpen, setAbstractionSelectionOpen, initiatingNodeId, setInitiatingNodeId } = useContext(AbstractionContext);

  // replace local state and functions with context
  const openAbstractionModal = (nodeId) => {
    console.log(`Initiating abstraction for node ID: ${nodeId}`);
    setInitiatingNodeId(nodeId);
    setAbstractionSelectionOpen(true);
  };


  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  /*  D3 zoom function *

  function initializeZoom() {
    d3.select("svg")
      .call(zoom);
  }

  const zoom = d3.zoom().on("zoom", handleZoom);
  function handleZoom(e) {
    const { x, y, k } = e.transform;

    d3.select("svg g")
      .attr("transform", () => `scale(${k})`)
  }*/

  return (
      <div className="flex flex-col items-center bg-slate-400 p-4 canva-container">
        {/* Abstraction Controls */}
        <div className="controls mb-4 flex items-center">
          {/* Layer Selection Dropdown */}
          <select
              value={selectedTargetLayerId || ""}
              onChange={(e) => setSelectedTargetLayerId(Number(e.target.value))}
              className="mr-2 p-2 border rounded"
          >
            <option value="" disabled>
              Select Target Layer
            </option>
            {layers
                .filter((layer) => layer.id !== activeLayerId) // Exclude active layer
                .map((layer) => (
                    <option key={layer.id} value={layer.id}>
                      {layer.name}
                    </option>
                ))}
          </select>
          {/* Abstract Group Button */}
          <button
              onClick={handleAbstractGroup}
              disabled={
                  selectedElements.length === 0 || selectedTargetLayerId === null
              }
              className={`p-2 border rounded ${
                  selectedElements.length === 0 || selectedTargetLayerId === null
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
          >
            Abstract Group
          </button>
        </div>
        {/* Canvas SVG */}
        <div className="bg-slate-100">
          <CanvasContext.Provider value={{ ref: canvasRef, action, setAction }}>
            <svg
                ref={canvasRef}
                id="canvas"
                width="1100"
                height="980"
                viewBox="0 0 1100 980"
                fill="#FFFFFF"
                xmlns="http://www.w3.org/2000/svg"
                onClick={handleClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onPaste={handlePaste}
                style={{
                  cursor:
                      isRectActive && rect
                          ? isDragging
                              ? "grabbing"
                              : "grab"
                          : "default",
                }}
            >
              {layers.sort((a, b) => a.order - b.order).map(
                  (layer) =>
                      layer.visible && (
                          <g
                              key={layer.id}
                              data-layer-id={layer.id}
                              opacity={layer.opacity}
                          >
                            {/* Render Images */}
                            {layer.canvasState.images.map((image) => (
                                <MyImage key={image.id} image={image} />
                            ))}
                            {/* Render Edges */}
                            {layer.canvasState.edges.map((edge) => (
                                <Edge
                                    key={edge.id}
                                    edge={edge}
                                    graph={layer.canvasState}
                                />
                            ))}

                            {/* Render Non-Grouped Nodes */}
                            {layer.canvasState.nodes
                                .filter(node => !node.groupId)
                                .map((node) => (
                                    <Node
                                        key={node.id}
                                        node={node}
                                        isSelected={
                                            selectedEntity?.kind === "node" && selectedEntity.id === node.id
                                        }
                                        toggleGroupExpansion={toggleGroupExpansion}
                                        onInitiateAbstraction={openAbstractionModal}
                                    />
                                ))}

                            /* Render Group Nodes */
                            {layer.canvasState.nodes
                                .filter((node) => node.isGroup)
                                .map((groupNode) => (
                                    <Node
                                        key={groupNode.id}
                                        node={groupNode}
                                        isSelected={
                                            selectedEntity?.kind === "node" && selectedEntity.id === groupNode.id
                                        }
                                        toggleGroupExpansion={toggleGroupExpansion}
                                        onInitiateAbstraction={openAbstractionModal}
                                    />
                                ))}

                            /* Render Grouped Nodes if Group is Expanded */
                            {layer.canvasState.groups?.map((group) => {
                              if (!expandedGroups.has(group.id)) return null;

                              const groupNode = layer.canvasState.nodes.find((n) => n.id === group.id);
                              if (!groupNode) {
                                console.warn(`Group node with ID ${group.id} not found in layer ${layer.id}.`);
                                return null;
                              }

                              return group.nodeIds.map((nodeId, index) => {
                                const node = layer.canvasState.nodes.find((n) => n.id === nodeId);
                                if (!node) {
                                  console.warn(`Node with ID ${nodeId} not found in layer ${layer.id}.`);
                                  return null;
                                }

                                // Calculate position around the group node
                                const total = group.nodeIds.length;
                                const angle = (2 * Math.PI * index) / total;
                                const distance = 80; // Adjust as needed
                                const offsetX = groupNode.x + distance * Math.cos(angle);
                                const offsetY = groupNode.y + distance * Math.sin(angle);

                                return (
                                    <Node
                                        key={node.id}
                                        node={{ ...node, x: offsetX, y: offsetY }}
                                        isSelected={
                                            selectedEntity?.kind === "node" && selectedEntity.id === node.id
                                        }
                                        toggleGroupExpansion={toggleGroupExpansion}
                                        onInitiateAbstraction={openAbstractionModal}
                                    />
                                );
                              });
                            })}



                            {/* Render Selection Rectangle */}
                            {isRectActive && rect && (
                                <rect
                                    x={rect.x}
                                    y={rect.y}
                                    width={rect.width}
                                    height={rect.height}
                                    fill="rgba(0, 120, 215, 0.3)"
                                    stroke="rgba(0, 120, 215, 0.8)"
                                    strokeWidth="1"
                                    pointerEvents="none" // allows underlying elements to receive events
                                />
                            )}
                          </g>
                      ),
                      )
              }

            </svg>
            </CanvasContext.Provider>
        </div>
      </div>
  );
};

export default Canvas;
export { CanvasContext, getPointerCanvasCoordinates };
