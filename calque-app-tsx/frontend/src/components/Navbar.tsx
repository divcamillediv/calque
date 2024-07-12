import { FaPlay } from "react-icons/fa";
import Arrow from "../assets/Arrow.asset";
import { FaArrowPointer } from "react-icons/fa6";
import { ReactNode, useContext } from "react";
import ToolBar from "./ToolBar";
import { Link } from "react-router-dom";
import Logo from "../assets/Logo.asset";
import ModeSwitcher from "./ModeSwitcher";
import { ModeContext } from './Layout';


function NbLeft(props: {children: ReactNode}){
    return(
        <div className="flex gap-4 justify-start items-center">
            {props.children}
        </div>
    )
}


function NbCompDrop(props: {
    icon: React.FC<{className: string}>, 
    children: ReactNode,
    active: boolean,
    onClick: () => void;
}){
    const activeClass = props.active ? "bg-blue-500 rounded-lg" : "bg-primary";

    return(
        <button className={`flex flex-wrap items-center ${activeClass} hover:bg-blue-500 hover:rounded-lg active:bg-secondary px-2 py-2 mx-1`} onClick={props.onClick}>
                <props.icon className="w-6 h-6"/>
                <div>{props.children}</div>
                {/*<Arrow/>*/}
        </button>
    )
}

function NbTitle(props: {children: ReactNode}){
    return(
        <div className="text-white flex gap-2 items-center font-bold text-xl px-1">
            {props.children}
        </div>
    )
}



function Navbar() {
    const [mode, _] = useContext(ModeContext)

    return (
        <div className="bg-primary text-white flex flex-row grow justify-between mx-auto p-2">

            <NbLeft>
                <Logo/>
                {mode === "editor" && <ToolBar/>}
            </NbLeft>

            <NbTitle>
                <div>Carte-globale</div>
                <div>/</div>
                <div>Sous-carte-1</div>
            </NbTitle>

            <ModeSwitcher/>
        
        </div>
  )
}

export {Navbar, NbLeft, NbCompDrop, NbTitle }
