import { Layer } from "../contexts/UseLayers";

export const handleOrderChange = (layers: Layer[], setLayers: Function, setError: Function) => (id: number, newOrder: number) => {
    if (layers.some((layer) => layer.order === newOrder && layer.id !== id)) {
        setError(`Order ${newOrder} is already taken.`);
        return;
    }
    setError(null);
    setLayers((prevLayers: Layer[]) =>
        prevLayers.map((layer) =>
            layer.id === id ? { ...layer, order: newOrder } : layer,
        ),
    );
};

export const handleVisibilityToggle = (setLayers: any) => (id: number) => {
    setLayers((prevLayers: Layer[]) =>
        prevLayers.map((layer) =>
            layer.id === id ? { ...layer, visible: !layer.visible } : layer,
        ),
    );
};

export const handleNameChange = (setLayers: Function) => (id: number, newName: string) => {
    setLayers((prevLayers: Layer[]) =>
        prevLayers.map((layer) =>
            layer.id === id ? { ...layer, name: newName } : layer,
        ),
    );
};

export const handleDescriptionChange = (setLayers: Function) => (id: number, newDescription: string) => {
    setLayers((prevLayers: Layer[]) =>
        prevLayers.map((layer) =>
            layer.id === id ? { ...layer, description: newDescription } : layer,
        ),
    );
};
