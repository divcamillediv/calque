import { useContext } from 'react';
import { GraphContext } from './Layout';
import { getEdge, updateEdge } from '../models/State';
import { InputField, Editor } from './InputField'

interface EdgeEditorProps {
  edgeId: number;
}

const EdgeEditor = (props: EdgeEditorProps) => {
  const graphHandler = useContext(GraphContext);
  const edge = getEdge(graphHandler.graph, props.edgeId);

  const updateField = (fieldName: keyof typeof edge, value: string | number) => {
    updateEdge(graphHandler, { ...edge, [fieldName]: value });
  };

  return (
    <Editor>
        <InputField label="Name" value={edge.name} onChange={(value) => updateField('name', value)} />
        <InputField label="Stroke" value={edge.stroke} onChange={(value) => updateField('stroke', value)} type="color" />
        <InputField label="Stroke Width" value={edge.strokeWidth} onChange={(value) => updateField('strokeWidth', value)} type="number" />
    </Editor>
)
};

export default EdgeEditor;
