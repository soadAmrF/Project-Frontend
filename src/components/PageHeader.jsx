import { Link, useLocation } from "react-router-dom";

export default function PageHeader() {
  const location = useLocation();

  const page = location.pathname.split("/")[1] || "dashboard";

  const title = page.charAt(0).toUpperCase() + page.slice(1);

  return (
    <div className="mb-1">
      <h2 className="fw-bold">{title}</h2>

      <nav>
        <ol className="breadcrumb">
          
          <li className="breadcrumb-item">
            <Link to="/dashboard">Home</Link>
          </li>

          <li className="breadcrumb-item active">{title}</li>

        </ol>
      </nav>
    </div>
  );
}
