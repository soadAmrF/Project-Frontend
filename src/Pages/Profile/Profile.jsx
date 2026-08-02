import { jwtDecode } from "jwt-decode";

export default function Profile() {
  const token = localStorage.getItem("token");
  const user = token ? jwtDecode(token) : null;
  console.log(user)

  return (
    <div className="container-fluid py-4">
      <h2 className="fw-bold mb-4">Profile</h2>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body text-center p-4">
              <div
                className="mx-auto mb-3 rounded-circle overflow-hidden bg-primary d-flex align-items-center justify-content-center text-white fw-bold"
                style={{
                  width: "120px",
                  height: "120px",
                  fontSize: "40px",
                }}
              >
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  user?.name?.charAt(0)?.toUpperCase()
                )}
              </div>

              <h4 className="fw-bold mb-1">{user?.name || "Admin User"}</h4>

              <p className="text-muted mb-3">{user?.role || "Administrator"}</p>

              <button className="btn btn-primary rounded-pill px-4">
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4">Personal Information</h5>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <label className="text-muted small">Full Name</label>

                  <h6 className="fw-semibold">{user?.fullname || "-"}</h6>
                </div>

                <div className="col-md-6 mb-4">
                  <label className="text-muted small">Email</label>

                  <h6 className="fw-semibold">{user?.email || "-"}</h6>
                </div>

                <div className="col-md-6 mb-4">
                  <label className="text-muted small">Role</label>

                  <h6 className="fw-semibold">{user?.role || "-"}</h6>
                </div>

                <div className="col-md-6 mb-4">
                  <label className="text-muted small">Phone</label>

                  <h6 className="fw-semibold">01012345678</h6>
                </div>

                <div className="col-md-6 mb-4">
                  <label className="text-muted small">Department</label>

                  <h6 className="fw-semibold">Dental Clinic</h6>
                </div>

                <div className="col-md-6 mb-4">
                  <label className="text-muted small">Join Date</label>

                  <h6 className="fw-semibold">01 Jan 2026</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
