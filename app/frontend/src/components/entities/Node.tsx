import { useContext, useEffect } from "react";
import { AppContext, GraphContext, SelectedEntityContext } from "../Layout";
import { CanvasContext } from "../Canvas";
import { NodeState, deleteNode } from "../../models/node";
import { insertEdge } from "../../models/edge";

interface NodeProps {
  node: NodeState;
  isSelected: boolean;
  toggleGroupExpansion: (groupId: string) => void;
  onInitiateAbstraction: (nodeId: string) => void;
}

const Node = ({ node, isSelected, toggleGroupExpansion, onInitiateAbstraction }: NodeProps) => {
  const { mode, tool } = useContext(AppContext);
  const graphHandler = useContext(GraphContext);
  const { selectedEntity, setSelectedEntity } = useContext(
    SelectedEntityContext,
  );
  const { action, setAction } = useContext(CanvasContext);

  const handleClick = (event: React.MouseEvent<SVGElement, MouseEvent>) => {
    event.stopPropagation();

    if (mode === "edit" && tool === "abstract") {
      // Initiate abstraction from this node
      onInitiateAbstraction(node.id);
    }

    if (node.isGroup) {
      toggleGroupExpansion(node.id);
      return;
    }
    if (action && action.kind === "drag" && action.nodeId === node.id) {
      // Stop dragging
      setAction(null);
    } else {
      // Start dragging
      setAction({ kind: "drag", nodeId: node.id });
    }
    if (mode === "edit" && tool === "edge") {
      if (action === null) {
        setSelectedEntity({ kind: "node", id: node.id });
        setAction({ kind: "edge", nodeId: node.id });
      } else if (action.kind === "edge" && action.nodeId !== node.id) {
        const edge = insertEdge(graphHandler, action.nodeId, node.id);
        setSelectedEntity({
          kind: "edge",
          id: !(edge && edge.id) ? 0 : edge.id,
        });
        setAction(null);
      }
    }
  };

  const handleMouseDown = () => {
    if (mode === "edit" && (tool === "select")) {
      if (node.isGroup) {
        setAction({ kind: "dragGroup", groupId: node.id });
      } else{
      setAction({ kind: "drag", nodeId: node.id });
      }
      setSelectedEntity({ kind: "node", id: node.id });
    }

    if (mode === "edit" && tool === "abstract") {

        setAction({ kind: "drag", nodeId: node.id });

      setSelectedEntity({ kind: "node", id: node.id });
    }

  };

  // DELETE NODE

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (mode === "edit" && isSelected && event.key === "Delete") {
        deleteNode(graphHandler, node.id);
        setSelectedEntity(null);
        setAction(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSelected, node.id, graphHandler, setSelectedEntity, setAction]);

  return (
    <g>
      <circle
        stroke={node.stroke}
        strokeWidth={node.strokeWidth}
        cx={node.x}
        cy={node.y}
        r={node.size}
        fill={node.color}
        data-id={node.id}
        data-description={node.description}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
      />
      {mode === "edit" &&
        (isSelected ? (
          <circle
            stroke="#0000FF"
            fill="#FFFFFF"
            fillOpacity={0}
            strokeWidth={6}
            cx={node.x}
            cy={node.y}
            r={node.size + node.strokeWidth / 2}
            opacity="0.3"
            onClick={handleClick}
            onMouseDown={handleMouseDown}
          />
        ) : (
          <g />
        ))}
      <text x={node.x + node.size + 2} y={node.y + node.size + 2} fill="black">
        {node.name}
      </text>
      {node.isGroup && (
        <text
          x={node.x}
          y={node.y + (node.size || 15) + 12}
          textAnchor="middle"
          dy=".3em"
          fontSize="8"
          fill="black"
        >
          Group
        </text>
      )}
    </g>
  );
};

export default Node;
