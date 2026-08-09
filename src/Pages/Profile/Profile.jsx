import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import PageHeader from "@/components/PageHeader";
import "./Profile.css";

export default function Profile() {
  const [showImage, setShowImage] = useState(false);

  const token = localStorage.getItem("token");

  let user = null;

  try {
    user = token ? jwtDecode(token) : null;
  } catch (error) {
    console.error("Invalid token:", error);
  }

  const getInitial = () => {
    return (
      user?.fullname?.charAt(0)?.toUpperCase() ||
      user?.name?.charAt(0)?.toUpperCase() ||
      "U"
    );
  };

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "-";
    }
  };

  return (
    <div className="profile-page">
      <PageHeader />

      <div className="profile-content">
        {/* ==================== Profile Card ==================== */}
        <div className="profile-main-card">
          <div
            className={`profile-avatar ${user?.image ? "has-image" : ""}`}
            onClick={() => {
              if (user?.image) {
                setShowImage(true);
              }
            }}
          >
            {user?.image ? (
              <img
                src={user.image}
                alt={user?.fullname || user?.name || "User"}
              />
            ) : (
              <span>{getInitial()}</span>
            )}
          </div>

          <h2>{user?.fullname || user?.name || "User"}</h2>

          <span className="profile-role">{user?.role || "User"}</span>

          <div className="profile-status">
            <span
              className={`status-dot ${
                user?.isActive === false ? "inactive" : ""
              }`}
            ></span>

            {user?.isActive === false ? "Inactive" : "Active"}
          </div>
        </div>

        {/* ==================== Personal Information ==================== */}
        <div className="profile-info-card">
          <div className="profile-card-header">
            <div>
              <h3>
                <i className="bi bi-person-vcard me-2"></i>
                Personal Information
              </h3>

              <small>Your account information</small>
            </div>
          </div>

          <div className="profile-info-grid">
            <div className="profile-info-item">
              <span>Full Name</span>

              <strong>{user?.fullname || "-"}</strong>
            </div>

            <div className="profile-info-item">
              <span>Username</span>

              <strong>{user?.name || "-"}</strong>
            </div>

            <div className="profile-info-item">
              <span>Email</span>

              <strong>{user?.email || "-"}</strong>
            </div>

            <div className="profile-info-item">
              <span>Phone</span>

              <strong>{user?.phone || "-"}</strong>
            </div>

            <div className="profile-info-item">
              <span>Role</span>

              <strong className="role-text">{user?.role || "-"}</strong>
            </div>

            <div className="profile-info-item">
              <span>Department</span>

              <strong>Dental Clinic</strong>
            </div>

            <div className="profile-info-item">
              <span>Status</span>

              <strong
                className={
                  user?.isActive === false ? "inactive-text" : "active-text"
                }
              >
                {user?.isActive === false ? "Inactive" : "Active"}
              </strong>
            </div>

            <div className="profile-info-item">
              <span>Join Date</span>

              <strong>{formatDate(user?.createdAt)}</strong>
            </div>
          </div>
        </div>

        {/* ==================== Account Information ==================== */}
        <div className="profile-account-card">
          <div className="profile-card-header">
            <div>
              <h3>
                <i className="bi bi-person-gear me-2"></i>
                Account Information
              </h3>

              <small>Basic account details</small>
            </div>
          </div>

          <div className="account-details">
            <div className="account-detail">
              <div className="account-icon">
                <i className="bi bi-person"></i>
              </div>

              <div>
                <span>Username</span>

                <strong>{user?.name || "-"}</strong>
              </div>
            </div>

            <div className="account-detail">
              <div className="account-icon">
                <i className="bi bi-calendar3"></i>
              </div>

              <div>
                <span>Created At</span>

                <strong>{formatDate(user?.createdAt)}</strong>
              </div>
            </div>

            <div className="account-detail">
              <div className="account-icon">
                <i className="bi bi-shield-check"></i>
              </div>

              <div>
                <span>Account Status</span>

                <strong
                  className={
                    user?.isActive === false ? "inactive-text" : "active-text"
                  }
                >
                  {user?.isActive === false ? "Inactive" : "Active"}
                </strong>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== Image Viewer ==================== */}
        {showImage && user?.image && (
          <div className="image-viewer" onClick={() => setShowImage(false)}>
            <div
              className="image-viewer-box"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="image-viewer-close"
                onClick={() => setShowImage(false)}
                aria-label="Close image"
              >
                <i className="bi bi-x-lg"></i>
              </button>

              <img
                src={user.image}
                alt={user?.fullname || user?.name || "User"}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
