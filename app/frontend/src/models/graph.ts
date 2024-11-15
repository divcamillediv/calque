import { loadState } from "../redux/localStorage";
import { EdgeState } from "./edge";
import { ImageState } from "./image";
import { NodeState } from "./node";

interface GraphState {
  autoIncrement: number;
  nodes: NodeState[];
  edges: EdgeState[];
  images: ImageState[];
  groups: GroupNode[];
}

export interface GroupNode {
  id: string;
  name: string;
  sourceLayerId: number;
  targetLayerId: number;
  nodeIds: string[];
  x: number;
  y: number;
}

/* LIGNES

type Line = 'Continuous' | 'Broken' | 'Loop';

interface LineState {
  id: number;
  name: string;
  nodes: number[];
  nodeFill: string;
  nodeStroke: string;
  nodeStrokeWidth: number;
  edges: number[];
  edgeStroke: string;
  edgeStrokeWidth: number;
  duration: number;
  type: Line;
}

*/

const emptyGraph = {
  autoIncrement: 0,
  nodes: [],
  edges: [],
  images: [],
  groups: [],
};

const currentGraph = loadState()

export type { GraphState };
export { currentGraph, emptyGraph };
