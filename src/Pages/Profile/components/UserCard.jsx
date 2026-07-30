import { jwtDecode } from "jwt-decode";

export default function UserCard() {
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;

  return (
    <div className="card border-0 shadow-sm rounded-4">
      <div className="card-body text-center p-5">
        <h3 className="fw-bold">{user?.fullname}</h3>

        <span className="badge bg-primary px-3 py-2 rounded-pill mt-2">
          {user?.role}
        </span>

        <hr className="my-4" />

        <div className="text-start">
          <div className="mb-3">
            <small className="text-muted d-block">Username</small>

            <strong>{user?.name}</strong>
          </div>

          <div className="mb-3">
            <small className="text-muted d-block">Status</small>

            <span
              className={`badge ${user?.isActive ? "bg-success" : "bg-danger"}`}
            >
              {user?.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div>
            <small className="text-muted d-block">Created At</small>

            <strong>
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "-"}
            </strong>
          </div>
        </div>

        <button className="btn btn-primary w-100 rounded-pill mt-4">
          Edit Profile
        </button>
      </div>
    </div>
  );
}
