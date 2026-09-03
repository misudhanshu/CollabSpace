import React from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaUser } from "react-icons/fa";
import CollabSpace from "./../assets/CollabSpace.png";
import Hero from "./../assets/Hero-bg.svg";
import { useNavigate } from "react-router-dom";

const Navbar = ({ toggleHamburger, setToggleHamburger }) => {
  const handleHamburger = () => {
    setToggleHamburger((prev) => !prev);
  };

  const navigator = useNavigate();

  return (
    <header className="bg-white border-b border-blue-100 shadow-xs px-4 sm:px-6 py-3.5 flex items-center justify-between text-slate-800 z-10">
      <div className="flex items-center gap-3">
        <RxHamburgerMenu
          onClick={handleHamburger}
          className="text-xl cursor-pointer md:hidden text-slate-600 hover:text-blue-600 transition-all"
        />
        <div
          onClick={() => navigator("/home")}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <img
            src={CollabSpace}
            className="h-8 w-auto object-contain"
            alt="CollabSpace Logo"
          />
          <h1 className="font-bold text-lg sm:text-xl tracking-tight text-slate-900">
            CollabSpace
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div
          onClick={() => navigator("/profile")}
          className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 p-2.5 rounded-full border border-blue-200 transition-all shadow-xs"
          title="User Profile"
        >
          <FaUser className="text-base" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
