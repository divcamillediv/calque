import Canvas from "../components/Canvas";
// import Leftbar from "../components/leftbar/Leftbar"
import Rightbar from "../components/rightbar/Rightbar";
import LayerPanel from "../components/LayerPanel.tsx";
import { createContext, useState } from "react";
import { UseAbstraction } from "../contexts/UseAbstraction";

// import { AppContext } from "../components/Layout"

function MapCreationPage() {
  const [abstractionSelectionOpen, setAbstractionSelectionOpen] =
    useState(false);
  const [initiatingNodeId, setInitiatingNodeId] = useState(null);

  return (
    <div className="flex flex-row">
      <UseAbstraction
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
      </UseAbstraction>
    </div>
  );
}

export default MapCreationPage;
