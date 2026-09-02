import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Layout = () => {
  const [toggleHamburger, setToggleHamburger] = useState(false);
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50">
      <Navbar
        toggleHamburger={toggleHamburger}
        setToggleHamburger={setToggleHamburger}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* Mobile Backdrop Overlay */}
        {toggleHamburger && (
          <div
            onClick={() => setToggleHamburger(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-20 md:hidden transition-all"
          />
        )}

        <Sidebar
          toggleHamburger={toggleHamburger}
          setToggleHamburger={setToggleHamburger}
        />

        <main className="flex-1 min-h-0 flex flex-col overflow-auto lg:overflow-hidden bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
