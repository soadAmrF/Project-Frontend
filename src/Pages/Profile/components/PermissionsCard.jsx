import { jwtDecode } from "jwt-decode";

export default function PermissionsCard() {
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;

  return (
    <div className="card border-0 shadow-sm rounded-4">

      <div className="card-body p-4">

        <h4 className="fw-bold mb-4">
          Permissions
        </h4>

        <div>

          {user?.permissions?.map((permission, index) => (
            <span
              key={index}
              className="badge bg-light text-dark border rounded-pill px-3 py-2 me-2 mb-2"
            >
              {permission}
            </span>
          ))}

        </div>

      </div>

    </div>
  );
}