import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div>
      <div className="container-fluid px-3 px-lg-4 py-4">
        <Outlet />
      </div>
    </div>
  );
}
