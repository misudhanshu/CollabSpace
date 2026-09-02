import { NavLink } from "react-router-dom";
import { GiExitDoor } from "react-icons/gi";

const Sidebar = ({ toggleHamburger, setToggleHamburger }) => {
  const closeMobileNav = () => {
    if (setToggleHamburger) {
      setToggleHamburger(false);
    }
  };

  const activeLink = ({ isActive }) => {
    return `my-2 px-4 py-3 rounded-xl text-sm lg:text-base font-semibold flex items-center justify-between transition-all ${
      isActive
        ? "bg-blue-600 text-white shadow-sm"
        : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
    }`;
  };

  return (
    <aside
      className={`h-full w-64 md:w-56 bg-white border-r border-blue-100 overflow-y-auto p-4 z-30 flex flex-col justify-between ${
        toggleHamburger ? "block fixed inset-y-0 left-0 shadow-2xl" : "hidden"
      } md:block md:relative`}
    >
      <div className="space-y-1">
        <NavLink onClick={closeMobileNav} className={activeLink} to="/home">
          <span>Home</span>
        </NavLink>
        <NavLink onClick={closeMobileNav} className={activeLink} to="/organizations">
          <span>All Organizations</span>
        </NavLink>
      </div>

      <div className="pt-4 border-t border-blue-100">
        <NavLink
          onClick={closeMobileNav}
          className="px-4 py-3 rounded-xl text-sm lg:text-base font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 flex items-center justify-between transition-all"
          to="/"
        >
          <span>Log out</span>
          <GiExitDoor className="text-lg" />
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
