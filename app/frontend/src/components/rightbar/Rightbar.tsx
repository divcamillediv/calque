import React, { ChangeEvent, ReactNode, useContext } from "react";
import NodeEditor from "./NodeEditor";
import { AppContext, Entity, SelectedEntityContext } from "../Layout";
import EdgeEditor from "./EdgeEditor";
import ImageEditor from "./ImageEditor";
import { useLayers } from "../../contexts/UseLayers.tsx";
import {handleDescriptionChange, handleNameChange, handleOrderChange, handleVisibilityToggle} from "../helperLayer.ts";
import {AbstractionContext} from "../../pages/MapCreationPage.tsx";
import {groupNodes} from "../../models/abstraction.ts";
import AbstractionSelection from "../../models/abstractionSelection.tsx";

interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  type?: "text" | "number" | "color";
}

interface TutoProps {
  children: ReactNode;
  strong?: string;
}

const InputField: React.FC<InputFieldProps> = ({
                                                 label,
                                                 value,
                                                 onChange,
                                                 type = "text",
                                               }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    const inputValue = e.target.value;
    // onChange(inputValue);
    if (type === "number" && label === "Opacity") {
      onChange(parseFloat(inputValue));
    } else if (type === "number") {
      onChange(parseInt(inputValue));
    } else {
      onChange(inputValue);
    }
  };

  return (
      <div className="p-2 grid gap-4">
        <label className="font-bold">{label}</label>
        <input type={type} value={value} onChange={handleChange} />
      </div>
  );
};

const RBTutorial = (props: TutoProps) => {
  return (
      <div className="m-4">
        {props.strong && <strong>{props.strong}</strong>}
        {props.children}
      </div>
  );
};

const RBTutorials: React.FC = () => {
  const { layers, activeLayerId, setLayers, setError } = useLayers();
  const activeLayer = layers.find((layer) => layer.id === activeLayerId);

  return (
      <>
        {/*
          <RBTutorial> Clique sur l'icone Rond pour ajouter des noeuds. </RBTutorial>
          <RBTutorial> Clique sur un noeud pour modifier ses propriétés.</RBTutorial>
          <RBTutorial> Clique sur la barre diagonale pour relier les noeuds en cliquant sur les noeuds à relier.</RBTutorial>
       */}
        {/*<RBTutorial>Click on the circle icon to add nodes.</RBTutorial>*/}
        {/*<RBTutorial>Click on a node to edit its properties.</RBTutorial>*/}
        {/*<RBTutorial>*/}
        {/*  Click on the diagonal line to link the nodes by clicking on the nodes*/}
        {/*  that you want to link.*/}
        {/*</RBTutorial>*/}
        {/*<RBTutorial>Ctrl + V (or Cmd + V on Mac) to add images.</RBTutorial>*/}
        {/*<RBTutorial strong="Chromium users: ">*/}
        {/*  {" "}*/}
        {/*  (Google Chrome, Edge...) Add a node before pasting an image.*/}
        {/*</RBTutorial>*/}
        {/*<RBTutorial strong="Export: ">*/}
        {/*  Keep the .calque in the name so you can import that map on the website.*/}
        {/*</RBTutorial>*/}
        {activeLayer && (
            <div className="active-layer-data">
              <h4 className="active-layer-data-title active-layer-data-main-title">Active Layer Data</h4>
              <h5 className="active-layer-data-title">Data: </h5>
              <p className="active-layer-data-list">
                <strong>Name:</strong>{" "}
                <span className="active-layer-data-list-item">
              <input
                  type="text"
                  value={activeLayer.name}
                  onChange={(e) =>
                      handleNameChange(setLayers)(
                          activeLayer.id,
                          e.target.value,
                      )
                  }
              />
            </span>
              </p>
              <p className="active-layer-data-list">
                <strong>Description: </strong>{" "}
                <span>
              <textarea
                  value={activeLayer.description}
                  onChange={(e) =>
                      handleDescriptionChange(setLayers)(
                          activeLayer.id,
                          e.target.value,
                      )
                  }
              />
            </span>
              </p>
              <p className="active-layer-data-list">
                <strong>Order:</strong>{" "}
                <span className="active-layer-data-list-item">
              <input
                  type="number"
                  value={activeLayer.order}
                  onChange={(e) =>
                      handleOrderChange(
                          layers,
                          setLayers,
                          setError,
                      )(activeLayer.id, parseInt(e.target.value, 10))
                  }
              />
            </span>
              </p>
              <p className="active-layer-data-list">
                <strong>Visible:</strong>{" "}
                <span className="active-layer-data-list-item">
              <button
                  onClick={() =>
                      handleVisibilityToggle(setLayers)(activeLayer.id)
                  }
              >
                {activeLayer.visible ? "Hide" : "Show"}
              </button>
            </span>
              </p>
              <p className="active-layer-data-list">
                <strong>Opacity:</strong>{" "}
                <span className="active-layer-data--none">
              {activeLayer.opacity}
            </span>
              </p>
              <h5 className="active-layer-data-title">Canvas State</h5>
              <div>
                <h6 className="active-layer-data-subtitle">Nodes:</h6>
                <ul className="active-layer-data-list">
                  {activeLayer.canvasState.nodes.length === 0 ? (
                      <li className="active-layer-data--none">None</li>
                  ) : (
                      activeLayer.canvasState.nodes.map((node, index) => (
                          <li className="active-layer-data-list-item" key={index}>
                            <p>
                              <strong>ID:</strong> {node.id}
                            </p>
                            <p>
                              <strong>Position:</strong> ({node.x}, {node.y})
                            </p>
                          </li>
                      ))
                  )}
                </ul>
              </div>
              <div>
                <h6 className="active-layer-data-subtitle">Images:</h6>
                <ul className="active-layer-data-list">
                  {activeLayer.canvasState.images.length === 0 ? (
                      <li className="active-layer-data--none">None</li>
                  ) : (
                      activeLayer.canvasState.images.map((image, index) => (
                          <li className="active-layer-data-list-item" key={index}>
                            <p>
                              <strong>ID:</strong> {image.id}
                            </p>
                            <p>
                              <strong>Source:</strong> {image.src}
                            </p>
                            <p>
                              <strong>Position:</strong> ({image.x}, {image.y})
                            </p>
                          </li>
                      ))
                  )}
                </ul>
              </div>
              <div>
                <h6 className="active-layer-data-subtitle">Edges:</h6>
                <ul className="active-layer-data-list">
                  {activeLayer.canvasState.edges.length === 0 ? (
                      <li className="active-layer-data--none">None</li>
                  ) : (
                      activeLayer.canvasState.edges.map((edge, index) => (
                          <li className="active-layer-data-list-item" key={index}>
                            <p>
                              <strong>ID:</strong> {edge.id}
                            </p>
                          </li>
                      ))
                  )}
                </ul>
              </div>
            </div>
        )}
      </>
  );
};

const Rightbar = () => {
  const { selectedEntity } = useContext(SelectedEntityContext);
  const { mode } = useContext(AppContext);

    const { abstractionSelectionOpen, setAbstractionSelectionOpen, initiatingNodeId } = useContext(AbstractionContext);
    const { layers, setLayers, activeLayerId } = useLayers();
    const activeLayer = layers.find((layer) => layer.id === activeLayerId);

    const handleAbstractionConfirm = (selectedNodeIds: string[], targetLayerId: number) => {
        console.log("handleAbstractionConfirm called with:", { selectedNodeIds, targetLayerId });

        if (initiatingNodeId === null || selectedNodeIds.length === 0 || !targetLayerId) {
            console.warn("Abstraction Confirm: Missing initiatingNodeId, selectedNodeIds, or targetLayerId.");
            return;
        }

        const targetLayer = layers.find((layer) => layer.id === targetLayerId);
        if (!targetLayer) {
            console.warn(`Abstraction Confirm: Target layer with ID ${targetLayerId} not found.`);
            return;
        }

        if (!activeLayer) {
            console.warn("Abstraction Confirm: Active layer not found.");
            return;
        }

        const { newGroupNode } = groupNodes(
            selectedNodeIds,
            targetLayer,
            "#FFFFFF",
            "#0000FF",
            10,
            30
        );

        if (!newGroupNode) {
            console.error("Abstraction Confirm: Group node creation failed.");
            return;
        }

        const groupedNodes = selectedNodeIds.map((nodeId) => ({
            ...targetLayer.canvasState.nodes.find((node) => node.id === nodeId),
            groupId: newGroupNode.id,
        })).filter(node => node !== undefined) as NodeState[];

        console.log("Grouped Nodes with `groupId`:", groupedNodes);

        const updatedTargetNodes = [
            ...targetLayer.canvasState.nodes.filter((node) => !selectedNodeIds.includes(node.id)),
            ...groupedNodes,
            newGroupNode,
        ];

        console.log("Updated Target Layer Nodes:", updatedTargetNodes);

        const updatedLayers = layers.map((layer) => {
            if (layer.id === targetLayer.id) {
                return {
                    ...layer,
                    canvasState: {
                        ...layer.canvasState,
                        nodes: updatedTargetNodes, // Updated target layer nodes
                        groups: [...(layer.canvasState.groups || []), newGroupNode], // Add new group
                    },
                };
            } else {
                return layer;
            }
        });

        console.log("Updated Layers State:", updatedLayers);

        setLayers(updatedLayers);

        setAbstractionSelectionOpen(false);
    };


    return (
        <>
            {mode === 'edit' && (
                <div className="sticky basis-1/6 w-64 top-0 bg-secondary z-40 h-screen sm:translate-x-0 overflow-y-scroll">
                    {abstractionSelectionOpen && (
                        <AbstractionSelection
                            isOpen={abstractionSelectionOpen}
                            onClose={() => setAbstractionSelectionOpen(false)}
                            layers={layers}
                            activeLayerId={activeLayerId}
                            onConfirm={handleAbstractionConfirm}
                        />
                    )}
                    {selectedEntity !== null && <EntityEditor entity={selectedEntity} />}
                    {selectedEntity === null && !abstractionSelectionOpen && <RBTutorials />}
                </div>
            )}
        </>
    );
};

interface EntityEditorProps {
  entity: Entity;
}

const Editor = (props: { children: ReactNode }) => {
  const divclasses = "mx-auto p-4 overflow-y-auto";
  return <div className={divclasses}>{props.children}</div>;
};

const EditorTitle = (props: { children: ReactNode }) => {
  const editorTitle = "font-bold text-lg";
  return <h2 className={editorTitle}>{props.children}</h2>;
};

const EntityEditor = (props: EntityEditorProps) => {
  if (props.entity.kind === "node") {
    return <NodeEditor nodeId={props.entity.id} />;
  }

  if (props.entity.kind === "edge") {
    return <EdgeEditor edgeId={props.entity.id} />;
  }

  if (props.entity.kind === "image") {
    return <ImageEditor imageId={props.entity.id} />;
  }
};

export default Rightbar;
export type { InputFieldProps };
export { InputField, Editor, EditorTitle };
