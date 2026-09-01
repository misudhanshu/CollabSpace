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
    <div>
      <div className="flex justify-between border border-gray-300 py-[2%]">
        <RxHamburgerMenu
          onClick={handleHamburger}
          className="text-lg ml-[3%] cursor-pointer md:hidden"
        />
        <div className="flex">
          <img src={CollabSpace} className="h-[2rem] mr-[2%]" alt="" />
          <h1 className="font-semibold top-0 text-base sm:text-xl">
            CollabSpace
          </h1>
        </div>
        <FaUser
          onClick={() => navigator("/profile")}
          className="cursor-pointer h-[1.3rem] w-[1.3rem] mx-[2%] text-lg"
        />
      </div>
    </div>
  );
};

export default Navbar;
