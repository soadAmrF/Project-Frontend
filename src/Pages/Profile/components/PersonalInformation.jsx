import { jwtDecode } from "jwt-decode";

export default function PersonalInformation() {
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;

  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4">
      <div className="card-body p-4">
        <h4 className="fw-bold mb-4">Personal Information</h4>

        <div className="row">
          <div className="col-md-6 mb-4">
            <small className="text-muted">Full Name</small>

            <h6>{user?.fullname}</h6>
          </div>

          <div className="col-md-6 mb-4">
            <small className="text-muted">Username</small>

            <h6>{user?.name}</h6>
          </div>

          <div className="col-md-6">
            <small className="text-muted">Role</small>

            <h6>{user?.role}</h6>
          </div>

          <div className="col-md-6">
            <small className="text-muted">Status</small>

            <h6>{user?.isActive ? "Active" : "Inactive"}</h6>
          </div>
        </div>
      </div>
    </div>
  );
}
