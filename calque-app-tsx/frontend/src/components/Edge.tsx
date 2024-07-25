import { useContext, useEffect } from 'react';
import { AppContext, GraphContext, SelectedEntityContext } from './Layout';
import { deleteEdge, EdgeState, getNode } from '../models/State';
import { CanvasContext } from './Canvas';

interface EdgeProps {
  edge: EdgeState;
}

const Edge = (props: EdgeProps)  => {
  const { mode, tool } = useContext(AppContext)
  const graphHandler = useContext(GraphContext)
  const { selectedEntity, setSelectedEntity } = useContext(SelectedEntityContext);
  const { setAction } = useContext(CanvasContext);

  const node1 = getNode(graphHandler.graph, props.edge.node1id);
  const node2 = getNode(graphHandler.graph, props.edge.node2id);

  const isSelected = selectedEntity && selectedEntity.kind === 'edge' && selectedEntity.edgeId === props.edge.id;

  const handleMouseDown = () => {
    if (mode === "edit" && tool === "select") {
      setSelectedEntity({ kind: 'edge', edgeId: props.edge.id });
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => { // Typing the event as KeyboardEvent
      if (isSelected && (event.key === 'Delete' || event.key === 'Backspace')) {
        event.preventDefault(); // Prevent the default backspace action (navigate back)
        deleteEdge(graphHandler, props.edge.id);
        setSelectedEntity(null);
        setAction(null);
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isSelected, props.edge.id, graphHandler, setSelectedEntity, setAction]);

  return (
    <g>
      <line
        x1={node1.x}
        y1={node1.y}
        x2={node2.x}
        y2={node2.y}
        stroke={props.edge.stroke}
        strokeWidth={props.edge.strokeWidth}
        onMouseDown={handleMouseDown}
      />
    
    {mode === 'edit' && (isSelected ? (
      <line
        x1={node1.x}
        y1={node1.y}
        x2={node2.x}
        y2={node2.y}
        stroke="blue"
        strokeWidth={props.edge.strokeWidth + 3}
        opacity={0.5}
        onMouseDown={handleMouseDown}
      />
    ) : (
      <g/>
    ))}
    </g>
    
  );
};

export default Edge;
