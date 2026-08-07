import { NavLink, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import "./sidebar.css";

export default function Sidebar({ openSidebar, setOpenSidebar }) {
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;
  const location = useLocation();

  
  const [settingsOpen, setSettingsOpen] = useState(false);

  
  useEffect(() => {
    if (location.pathname.startsWith("/settings")) {
      setSettingsOpen(true);
    }
  }, [location.pathname]);

  const menu = [
    {
      title: "Dashboard",
      icon: "bi-grid",
      path: "/dashboard",
    },
    {
      title: "Reception",
      icon: "bi-calendar-check",
      path: "/reception",
    },
    {
      title: "Appointments",
      icon: "bi-calendar2-week",
      path: "/appointments",
    },
    {
      title: "Patients",
      icon: "bi-people",
      path: "/patients",
    },
    {
      title: "Doctors",
      icon: "bi-person-badge",
      path: "/doctors",
    },
    {
      title: "Treatments",
      icon: "bi-heart-pulse",
      path: "/treatments",
    },
    {
      title: "Invoices",
      icon: "bi-receipt",
      path: "/invoices",
    },
    {
      title: "Reports",
      icon: "bi-bar-chart",
      path: "/reports",
    },
    {
      title: "Inventory",
      icon: "bi-box-seam",
      path: "/inventory",
    },
    {
      title: "Laboratory",
      icon: "bi-eyedropper",
      path: "/laboratory",
    },
    
    {
      title: "Settings",
  icon: "bi-gear",
  path: "/settings",
  submenu: [
    {
      title: "Clinic Info",
      icon: "bi-building",
      path: "/settings/clinic-info",  
    },
    {
      title: "Users",
      icon: "bi-person-gear",
      path: "/settings/users",
          }
       ],
    },
  ];

  return (
    <>
      {openSidebar && (
        <div
          className="sidebar-overlay"
          onClick={() => setOpenSidebar(false)}
        ></div>
      )}

      <aside className={`sidebar ${openSidebar ? "show" : ""}`}>
        <div className="sidebar-logo">
          <div className="logo">
            <i className="bi bi-heart-pulse-fill"></i>

            <div>
              <h5>SmileSuite</h5>

              <small>Clinic Management</small>
            </div>
          </div>

          <button
            className="close-sidebar d-lg-none"
            onClick={() => setOpenSidebar(false)}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="sidebar-menu">
          {menu.map((item) => {
            
            if (item.submenu) {
              const isSubmenuActive = location.pathname.startsWith(item.path);

              return (
                <div key={item.path} className="menu-item-wrapper">
                  <div
                    className={`menu-item ${isSubmenuActive ? "active" : ""}`}
                    onClick={() => setSettingsOpen(!settingsOpen)}
                  >
                    <i className={`bi ${item.icon}`}></i>
                    <span>{item.title}</span>
                    <i
                      className={`bi bi-chevron-down submenu-arrow ${
                        settingsOpen ? "open" : ""
                      }`}
                    ></i>
                  </div>

                  {}
                  <div
                    className={`submenu-items ${settingsOpen ? "open" : ""}`}
                  >
                    {item.submenu.map((subItem) => (
                      <NavLink
                        key={subItem.path}
                        to={subItem.path}
                        onClick={() => setOpenSidebar(false)}
                        className={({ isActive }) =>
                          isActive ? "submenu-link active" : "submenu-link"
                        }
                      >
                        <i className={`bi ${subItem.icon}`}></i>
                        <span>{subItem.title}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              );
            }

            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setOpenSidebar(false)}
                className={({ isActive }) =>
                  isActive ? "menu-item active" : "menu-item"
                }
              >
                <i className={`bi ${item.icon}`}></i>
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </div>

        <div className="sidebar-user">
          <div className="avatar">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="w-100 h-100"
                style={{ objectFit: "cover", borderRadius: "50%" }}
              />
            ) : (
              user?.name?.charAt(0)?.toUpperCase()
            )}
          </div>

          <div>
            <h6>{user?.name}</h6>
            <small>{user?.role}</small>
          </div>
        </div>
      </aside>
    </>
  );
}
