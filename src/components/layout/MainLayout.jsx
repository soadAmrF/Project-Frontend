import { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";

import "./layout.css";

export default function MainLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="layout">
      <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />

      <div className="layout-content">
        <Navbar
          setOpenSidebar={setOpenSidebar}
          setSearchQuery={setSearchQuery}
        />

        <main className="page-content">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  );
}
