import Canvas from "../components/Canvas";
// import Leftbar from "../components/leftbar/Leftbar"
import Rightbar from "../components/rightbar/Rightbar";
import LayerPanel from "../components/LayerPanel.tsx";
import {createContext, useState} from "react";
export const AbstractionContext = createContext();

// import { AppContext } from "../components/Layout"

function MapCreationPage() {
    const [abstractionSelectionOpen, setAbstractionSelectionOpen] = useState(false);
    const [initiatingNodeId, setInitiatingNodeId] = useState(null);

    return (
    <div className="flex flex-row">
    <AbstractionContext.Provider
        value={{
            abstractionSelectionOpen,
            setAbstractionSelectionOpen,
            initiatingNodeId,
            setInitiatingNodeId,
        }}
    >
        {/*<Leftbar />*/}
        <LayerPanel />
        <Canvas />
        <Rightbar />
    </AbstractionContext.Provider>
    </div>
  );
}

export default MapCreationPage;
