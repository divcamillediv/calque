import React, { useContext, useState } from "react";
import NodeEditor from "./NodeEditor";
import {
  AppContext,
  Entity,
  GraphContext,
  SelectedEntityContext,
} from "../Layout";
import EdgeEditor from "./EdgeEditor";
import ImageEditor from "./ImageEditor";
import { useLayers } from "../../contexts/UseLayers.tsx";
import {
  handleDescriptionChange,
  handleNameChange,
  handleOrderChange,
  handleVisibilityToggle,
} from "../helperLayer.ts";
import { AbstractionContext } from "../../contexts/UseAbstraction";
import { NodeState, GroupNode, CanvasAction } from "../../models/types"; // Adjust import paths as necessary
import AbstractionSelection from "./AbstractionSelection.tsx";

interface InputFieldProps {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  type?: "text" | "number" | "color";
}

interface TutoProps {
  children: React.ReactNode;
  strong?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  type = "text",
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(`${label} changed to: ${e.target.value}`);
    const inputValue = e.target.value;
    if (type === "number") {
      onChange(parseFloat(inputValue));
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
  const { mode, tool } = useContext(AppContext);
  return (
    <>
      {tool === "select" && (
        <div className="active-layer-data">
          {/* Active layer data */}
          {activeLayer && (
            <div className="active-layer-data">
              <h4 className="active-layer-data-title active-layer-data-main-title">
                Active Layer Data
              </h4>
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
              {/*            <p className="active-layer-data-list">*/}
              {/*                <strong>Order:</strong>{" "}*/}
              {/*                <span className="active-layer-data-list-item">*/}
              {/*  <input*/}
              {/*      type="number"*/}
              {/*      value={activeLayer.order}*/}
              {/*      onChange={(e) =>*/}
              {/*          handleOrderChange(*/}
              {/*              layers,*/}
              {/*              setLayers,*/}
              {/*              setError,*/}
              {/*          )(activeLayer.id, parseInt(e.target.value, 10))*/}
              {/*      }*/}
              {/*  />*/}
              {/*</span>*/}
              {/*            </p>*/}
              {/*            <p className="active-layer-data-list">*/}
              {/*                <strong>Visible:</strong>{" "}*/}
              {/*                <span className="active-layer-data-list-item">*/}
              {/*  <button*/}
              {/*      onClick={() =>*/}
              {/*          handleVisibilityToggle(setLayers)(activeLayer.id)*/}
              {/*      }*/}
              {/*  >*/}
              {/*    {activeLayer.visible ? "Hide" : "Show"}*/}
              {/*  </button>*/}
              {/*</span>*/}
              {/*            </p>*/}
              {/*            <p className="active-layer-data-list">*/}
              {/*                <strong>Opacity:</strong>{" "}*/}
              {/*                <span className="active-layer-data--none">*/}
              {/*  {activeLayer.opacity}*/}
              {/*</span>*/}
              {/*            </p>*/}
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
                          <strong>Name:</strong> {node.name}
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
                          <strong>Name:</strong> {edge.name}
                        </p>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

interface EntityEditorProps {
  entity: Entity;
}

const Editor = (props: { children: React.ReactNode }) => {
  const divclasses = "mx-auto p-4 overflow-y-auto";
  return <div className={divclasses}>{props.children}</div>;
};

const EditorTitle = (props: { children: React.ReactNode }) => {
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

  return null;
};

const Rightbar = () => {
  const { selectedEntity } = useContext(SelectedEntityContext);
  const { mode } = useContext(AppContext);
  const { graphHandler } = useContext(GraphContext);
  const {
    abstractionSelectionOpen,
    setAbstractionSelectionOpen,
    initiatingNodeId,
    confirmAbstraction,
  } = useContext(AbstractionContext);
  const { layers, setLayers, activeLayerId } = useLayers();

  const handleAbstractionConfirmLocal = (
    selectedNodeIds: string[],
    targetLayerId: string,
  ) => {
    console.log("handleAbstractionConfirmLocal called with:", {
      selectedNodeIds,
      targetLayerId,
    });
    confirmAbstraction(selectedNodeIds, targetLayerId);
  };

  return (
    <>
      {mode === "edit" && (
        <div className="sticky basis-1/6 w-64 top-0 bg-secondary z-40 h-screen sm:translate-x-0 overflow-y-scroll">
          {abstractionSelectionOpen ? (
            <AbstractionSelection
              isOpen={abstractionSelectionOpen}
              onClose={() => {
                console.log("Rightbar - Closing AbstractionSelection");
                setAbstractionSelectionOpen(false);
              }}
              layers={layers}
              activeLayerId={activeLayerId}
              onConfirm={handleAbstractionConfirmLocal}
            />
          ) : selectedEntity !== null ? (
            <EntityEditor entity={selectedEntity} />
          ) : (
            <RBTutorials />
          )}
        </div>
      )}
    </>
  );
};

export default Rightbar;
export type { InputFieldProps };
export { InputField, Editor, EditorTitle };
