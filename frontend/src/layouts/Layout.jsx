import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Layout = () => {
  const [toggleHamburger, setToggleHamburger] = useState(false);
  return (
    <div className="h-screen h-[100%] overflow-hidden">
      <Navbar
        toggleHamburger={toggleHamburger}
        setToggleHamburger={setToggleHamburger}
      />

      <div className="flex">
        <Sidebar toggleHamburger={toggleHamburger} />

        <main className="flex-1 overflow-auto h-[100%]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
