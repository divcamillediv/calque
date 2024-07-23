import React, { useContext } from 'react';
import { GraphContext } from './Layout';
import { getNode, updateNode } from '../models/State';
import { InputField, Editor } from './InputField'

interface NodeEditorProps {
  nodeId: number;
}

const NodeEditor: React.FC<NodeEditorProps> = ({ nodeId }) => {
  const graphHandler = useContext(GraphContext);
  const node = getNode(graphHandler.graph, nodeId);

  const updateField = (fieldName: keyof typeof node, value: string | number) => {
    updateNode(graphHandler, { ...node, [fieldName]: value });
  };

  return (
    <Editor>
        <InputField label="Name" value={node.name} onChange={(value) => updateField('name', value)} />
        <InputField label="Size" value={node.size} onChange={(value) => updateField('size', value)} type="number" />
        <InputField label="Color" value={node.color} onChange={(value) => updateField('color', value)} type="color" />
        <InputField label="X" value={node.x} onChange={(value) => updateField('x', value)} type="number" />
        <InputField label="Y" value={node.y} onChange={(value) => updateField('y', value)} type="number" />
        <InputField label="Stroke" value={node.stroke} onChange={(value) => updateField('stroke', value)} type="color" />
        <InputField label="Stroke Width" value={node.strokeWidth} onChange={(value) => updateField('strokeWidth', value)} type="number" />
    </Editor>
  );
};

export default NodeEditor;
