import React from "react";

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-white rounded shadow-sm py-2 w-100 mb-4 br-2">
      <div className="container-fluid px-4">
        <a className="navbar-brand fw-bold text-primary fs-4 me-4" href="#">
          SmileSuite
        </a>

        <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-3">
          <li className="nav-item">
            <a className="nav-link active fw-bold" href="/dashboard">
              Dashboard
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-secondary" href="#">
              Patients
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-secondary" href="#">
              Appointments
            </a>
          </li>
        </ul>

        <form
          className=" my-2 my-lg-0"
          style={{ width: "100%", maxWidth: "400px" }}
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            className="form-control rounded-pill bg-light border-0 px-3 py-2 shadow-sm fs-6"
            type="search"
            placeholder="Search..."
          />
        </form>

        <div className="d-flex align-items-center gap-2 ms-auto">
          <div className="p-2 bg-light rounded-circle border">🦷</div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
