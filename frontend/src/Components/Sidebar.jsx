import React, { useState } from "react";
import { Menu, ShieldCheck, House, LetterText, View } from "lucide-react";
import { useRecoilState } from "recoil";
import { activePageState } from "../Atoms/Atoms";

const Sidebar = () => {
  const [menuclicked, setMenuClicked] = useState(false);

  const [activePage, setActivePage] = useRecoilState(activePageState);

  const toggleMenu = () => {
    setMenuClicked(!menuclicked);
  };

  return (
    <div
      className={`text-white bg-secondary h-full ${
        menuclicked ? "md:w-16" : "md:w-48"
      }  flex flex-col gap-10 p-2 rounded-tr-lg rounded-br-lg w-16`}
    >
      <div className="flex items-center justify-center w-full gap-5 p-3">
        <button onClick={toggleMenu} className="hidden md:block w-full">
          <Menu />
        </button>
        <button  className="block md:hidden w-full">
          <Menu />
        </button>
        {!menuclicked && (
          <div className="hidden md:flex text-accent">
            <ShieldCheck />
            <h1 className="text-white font-bold">TraceGuard</h1>
          </div>
        )}
      </div>
      <ul className="flex items-center flex-col gap-10 w-full ">
        <button
          className={`flex w-full items-center justify-start gap-5 hover:bg-accent rounded-lg p-3 cursor-pointer ${
            activePage === "dashboard" ? "bg-accent" : "bg-transparent"
          }`}
          onClick={()=>{setActivePage("dashboard")}}
        >
          <House />
          {!menuclicked && <h1 className="hidden md:block">Dashboard</h1>}
        </button>

        <button
          className={`flex w-full items-center justify-start gap-5 hover:bg-accent rounded-lg p-3 cursor-pointer ${
            activePage === "keyword" ? "bg-accent" : "bg-transparent"
          }`}
          onClick={()=>{setActivePage("keyword")}}
        >
          <LetterText />
          {!menuclicked && <h1  className="hidden md:block">Keyword Log</h1>}
        </button>

        <button
          className={`flex w-full items-center justify-start gap-5 hover:bg-accent rounded-lg p-3 cursor-pointer ${
            activePage === "image" ? "bg-accent" : "bg-transparent"
          }`}
          onClick={()=>{setActivePage("image")}}
        >
          <View />
          {!menuclicked && <h1  className="hidden md:block">Image Log</h1>}
        </button>
      </ul>
    </div>
  );
};

export default Sidebar;