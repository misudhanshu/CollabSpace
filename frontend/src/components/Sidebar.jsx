import { NavLink } from "react-router-dom";
import { GiExitDoor } from "react-icons/gi";

const Sidebar = ({ toggleHamburger }) => {
  const activeLink = ({ isActive }) => {
    return `block my-[10%] mx-[5%] p-[3%] py-[4%] hover:text-red-500 text-sm lg:text-base flex gap-5 ${
      isActive ? "bg-black text-white rounded-lg" : ""
    }`;
  };

  return (
    <div
      className={`h-screen w-[70%] md:w-[15%] border-r border-gray-300 font-serif overflow-y-auto ${
        toggleHamburger ? "block" : "hidden"
      } md:block`}
    >
      <NavLink className={activeLink} to="/home">
        Home
      </NavLink>
      <NavLink className={activeLink} to="/organizations">
        All Organizations
      </NavLink>
      <NavLink className={activeLink} to="/">
        Dashboard
      </NavLink>
      <NavLink className={activeLink} to="/">
        Log out
        <GiExitDoor className="mt-1 text-black" />
      </NavLink>
    </div>
  );
};

export default Sidebar;
