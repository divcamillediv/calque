import React, { ReactNode, useContext, useState, FC } from "react";

// Icons
import { FiPlus } from "react-icons/fi";
import { MdLayers } from "react-icons/md";
import { IconType } from "react-icons";
import LineIcon from "./../assets/Line.asset";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { GoTriangleDown, GoTriangleRight } from "react-icons/go";

import { ModeContext } from "./Layout";

interface LbSecTitleProps {
  children: ReactNode;
  toggle: () => void;
  isOpen: boolean;
}

const LbSecTitle: FC<LbSecTitleProps> = ({ children, toggle, isOpen }) => {
  return (
    <div className="flex justify-between p-2 items-center font-bold" onClick={toggle}>
      <div className="flex gap-1 items-center">
        {isOpen ? <GoTriangleDown className="w-4 h-4"/> : <GoTriangleRight className="w-4 h-4"/>}
        <div>{children}</div>
      </div>
      <FiPlus className="w-5 h-5"/>
    </div>
  );
};

interface LbSubSectionProps {
  icon: IconType;
  children: ReactNode;
}

const LbSubSection: FC<LbSubSectionProps> = ({ icon: Icon, children }) => {
  return (
    <div className="flex justify-start p-2 ml-6 gap-2 items-center">
      <Icon className="w-6 h-6"/>
      <div>{children}</div>
    </div>
  );
};

interface LbGroupElementsProps {
  title: string;
  icon: IconType;
  children: string[];
}

const LbGroupElements: FC<LbGroupElementsProps> = ({ title, icon, children }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <LbSecTitle toggle={toggle} isOpen={isOpen}>{title}</LbSecTitle>
      {isOpen && children.map((child, index) => (
        <LbSubSection key={index} icon={icon}>{child}</LbSubSection>
      ))}
    </div>
  );
};

const Leftbar: FC = () => {
  const [mode] = useContext(ModeContext);

  const sections = [
    { title: "Etages", icon: MdLayers, items: ["Rez-de-chaussée", "Sous-sol", "Métro"] },
    { title: "Lignes", icon: LineIcon, items: ["Ligne Orange", "Ligne Bleue"] },
    { title: "Tags", icon: BiSolidPurchaseTag, items: ["Station de train", "Université"] }
  ];

  return (
    <div className="sticky top-0 bg-secondary text-primary left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0">
      {mode === "editor" && sections.map((section, index) => (
        <LbGroupElements key={index} title={section.title} icon={section.icon} children={section.items} />
      ))}
    </div>
  );
};

export default Leftbar;
