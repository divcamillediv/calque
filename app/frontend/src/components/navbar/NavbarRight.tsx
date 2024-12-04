import ExportButton from "./ExportButton"
import ModeSwitcher from "./ModeSwitcher"
import SaveButton from "./SaveButton"
import { AppContext } from '../Layout';
import { useContext } from "react";
import {useLayers, UseLayers} from "../../contexts/UseLayers.tsx";

const NavbarRight = () => {
  const { page } = useContext(AppContext);
  const { layers } = useLayers();

  return (
    <div className="flex justify-end items-center gap-4">
      {page === "creation" && (
        <>
          <ModeSwitcher />
          <SaveButton />
          <ExportButton layers={layers} />
        </>
      )}
    </div>
  );
}

export default NavbarRight