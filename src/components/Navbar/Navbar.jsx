import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./navbar.css";

export default function Navbar({ setOpenSidebar, setSearchQuery }) {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;

  const [openMenu, setOpenMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);

  const notificationRef = useRef();
  const userMenuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setOpenNotifications(false);
      }

      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="main-navbar">
      <div className="navbar-left">
        <button
          className="menu-btn d-lg-none"
          onClick={() => setOpenSidebar(true)}
        >
          <i className="bi bi-list"></i>
        </button>
      </div>

      <div className="search-container">
        <div className="search-box d-none d-md-flex">
          <i className="bi bi-search"></i>

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onFocus={() => setShowResults(true)}
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchQuery(e.target.value);
            }}
          />

          {search && (
            <button className="clear-search" onClick={() => setSearch("")}>
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>

        {showResults && search && (
          <div className="global-search-results">
            <p>Search for: {search}</p>
          </div>
        )}
      </div>

      <div className="navbar-right">
        <div className="notification-box" ref={notificationRef}>
          <button
            className="icon-btn"
            onClick={() => setOpenNotifications(!openNotifications)}
          >
            <i className="bi bi-bell"></i>

            <span className="badge-count">3</span>
          </button>

          {openNotifications && (
            <div className="notification-dropdown">
              <h6>Notifications</h6>

              <div className="notification-item">New user created</div>

              <div className="notification-item">New appointment added</div>

              <div className="notification-item">System update</div>
            </div>
          )}
        </div>

        <div className="user-dropdown" ref={userMenuRef}>
          <button className="user-btn" onClick={() => setOpenMenu(!openMenu)}>
            <div className="avatar">{user?.name?.charAt(0).toUpperCase()}</div>

            <div className="d-none d-md-block">
              <h6>{user?.name}</h6>

              <small>{user?.role}</small>
            </div>

            <i className="bi bi-chevron-down"></i>
          </button>

          {openMenu && (
            <div className="dropdown-menu-custom">
              <Link to="/profile">
                <i className="bi bi-person"></i>
                Profile
              </Link>

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  navigate("/");
                }}
              >
                <i className="bi bi-box-arrow-right"></i>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
