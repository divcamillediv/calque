import * as d3 from "d3";
import React, { useContext, useRef, useState } from 'react';
import Edge from './Edge';
import { AppContext, GraphContext, SelectedEntityContext } from './Layout';
import Node from './Node';
import { getNode, insertNode, updateNode } from '../models/State';

function getPointerCanvasCoordinates<T>(canvas: SVGSVGElement, event: React.MouseEvent<T>) {
  const bounds = canvas.getBoundingClientRect();
  return {
    x: Math.round(event.clientX - bounds.left),
    y: Math.round(event.clientY - bounds.top),
  };
}

type CanvasAction =
  | { kind: 'drag', nodeId: number }
  | { kind: 'edge', nodeId: number }

interface CanvasHandler {
  ref: React.RefObject<SVGSVGElement>;
  action: CanvasAction | null,
  setAction: React.Dispatch<CanvasAction | null>;
}

const CanvasContext = React.createContext<CanvasHandler>(undefined as any);

const Canvas = () => {
  const { mode, tool } = useContext(AppContext);
  const graphHandler = useContext(GraphContext);
  const { setSelectedEntity } = useContext(SelectedEntityContext);
  const [action, setAction] = useState<CanvasAction | null>(null);
  const canvasRef = useRef<SVGSVGElement>(null);
  const [image, setImage] = useState<string | null>(null);

  const handleClick = (event: React.MouseEvent<SVGSVGElement>) => {
    if (mode === 'edit' && tool === 'node') {
      const coordinates = getPointerCanvasCoordinates(event.currentTarget, event);
      const node = insertNode(graphHandler, coordinates.x, coordinates.y);
      setSelectedEntity({ kind: 'node', nodeId: node.id });
    } 
    if (event.target === event.currentTarget || event.target instanceof SVGImageElement) {
      if (tool !== 'node') {
        setSelectedEntity(null);
      }
    }
  }

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (action !== null && action.kind === 'drag') {
      const coordinates = getPointerCanvasCoordinates(event.currentTarget, event);
      const node = getNode(graphHandler.graph, action.nodeId);
      updateNode(graphHandler, {
        ...node,
        x: coordinates.x,
        y: coordinates.y,
      });
    }
  };

  const handleMouseLeave = () => {
    if (action !== null) {
      setAction(null);
    }
  };

  const handleMouseUp = () => {
    if (action !== null && action.kind === 'drag') {
      setAction(null);
    }
  };

  const handlePaste = (event: React.ClipboardEvent<SVGSVGElement>) => {
    let clipboardData = event.clipboardData /*|| window.clipboardData*/;
    if (!clipboardData) return;

    // Check if there is an image in the clipboard
    let items = clipboardData.items;
    if (items) {
      for (const item of items) {
        if (item.type.includes('image')){
          handleImagePaste(item);
          break;
        }
      }
    }
  };
  

  const handleImagePaste = (item: DataTransferItem) => {
    let file = item.getAsFile();
    if (!file) return;

    let reader = new FileReader();
    reader.onload = (event) => {
        let imageData = event.target?.result as string;
        setImage(imageData)
    };
    reader.readAsDataURL(file);
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
    <div className="flex basis-4/6 justify-center bg-slate-400">
      <div className="bg-slate-100">
        <CanvasContext.Provider value={{ ref: canvasRef, action, setAction }}>
          <svg
            ref={canvasRef}
            width="920"
            height="938"
            viewBox="0 0 920 938"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
            onClick={handleClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onPaste={handlePaste}
          >
            {image !== null && <image href={image} x='0' y='0' opacity='0.3' />}
            <g>
              {graphHandler.graph.edges.map(edge => (
                <Edge key={edge.id} edge={edge} />
              ))}
              {graphHandler.graph.nodes.map(node => (
                <Node key={node.id} node={node} />
              ))}
            </g> 
          </svg>
        </CanvasContext.Provider>
      </div>
    </div>
  );
};

export default Canvas;
export { CanvasContext, getPointerCanvasCoordinates };
