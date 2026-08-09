import { Link, useLocation } from "react-router-dom";

export default function PageHeader({ title: customTitle }) {
  const location = useLocation();

  const page = location.pathname.split("/")[1] || "dashboard";

  const title =
    customTitle ||
    (page.charAt(0).toUpperCase() + page.slice(1));

  return (
    <div>
      <h1>{title}</h1>

      <nav>
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/dashboard">Home</Link>
          </li>

          <li className="breadcrumb-item active">
            {title}
          </li>
        </ol>
      </nav>
    </div>
  );
}