import { useContext } from "react";
import { TiExport } from "react-icons/ti";
import {SelectedEntityContext} from "../Layout";
import { useLayers } from "../../contexts/UseLayers.tsx";
import { useImportSVG } from "../../hooks/useImportSVG.tsx";

const ExportButton = ({ layers }: { layers: any }) => {
  const { setSelectedEntity } = useContext(SelectedEntityContext);

  const exportMap = () => {
    setSelectedEntity(null);
    setTimeout(() => {
      const map = document
        .getElementById("canvas")
        ?.cloneNode(true) as SVGSVGElement;
      if (map) {
        // map.querySelectorAll('image').forEach(img => img.remove());
        //  const serializer = new XMLSerializer();
        // const svgString = serializer.serializeToString(map);
        const blob = new Blob([JSON.stringify(layers, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "map.calque";
        a.click();
        URL.revokeObjectURL(url);
      }
    }, 0);
  };


    const { setLayers } = useLayers();


  const { fileInputRef, handleImportClick, handleFileChange } =



    useImportSVG(setLayers);

  return (
    <div className="imp-exp-buttons-group">
      <button
        className="imp-exp-buttons flex items-center bg-blue-500 px-4 py-1 rounded-lg gap-2 text-lg hover:bg-blue-600"
        onClick={exportMap}
      >
        Export
        <TiExport className="w-6 h-6" />
      </button>
      <button onClick={handleImportClick}  className="imp-exp-buttons flex items-center bg-blue-500 px-4 py-1 rounded-lg gap-2 text-lg hover:bg-blue-600"
      >Import Calque</button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ExportButton;
