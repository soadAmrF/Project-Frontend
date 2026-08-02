import { useEffect, useState } from "react";

const UserModal = ({ user, onClose, onSave, errorMessage }) => {
  const [formData, setFormData] = useState({
    name: "",
    fullname: "",
    phone: "",
    password: "",
    role: "receptionist",
    isActive: true,
    image: null,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        fullname: user.fullname || "",
        phone: user.phone || "",
        password: "",
        role: user.role || "receptionist",
        isActive: user.isActive,
      });
    } else {
      setFormData({
        name: "",
        fullname: "",
        phone: "",
        password: "",
        role: "receptionist",
        isActive: true,
        image: null,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        image: e.target.files[0],
      }));
      return;
    }

    if (type === "checkbox" && name === "isActive") {
      setFormData((prev) => ({
        ...prev,
        isActive: checked,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("name", formData.name);
    data.append("fullname", formData.fullname);
    data.append("phone", formData.phone);
    data.append("role", formData.role);
    data.append("isActive", formData.isActive);

    if (formData.password) {
      data.append("password", formData.password);
    }

    if (formData.image) {
      data.append("image", formData.image);
    }

    onSave(data);
  };

  return (
    <>
      <div
        className="modal fade show d-block"
        style={{ background: "rgba(0,0,0,.5)" }}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{user ? "Edit User" : "Add User"}</h5>

              <button className="btn-close" onClick={onClose}></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div
                className="modal-body"
                style={{ maxHeight: "70vh", overflowY: "auto" }}
              >
                {errorMessage && (
                  <div className="alert alert-danger">{errorMessage}</div>
                )}

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Username</label>

                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Full Name</label>

                    <input
                      type="text"
                      className="form-control"
                      name="fullname"
                      value={formData.fullname}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Phone</label>

                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Profile Image</label>

                    <input
                      type="file"
                      className="form-control"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                    />
                  </div>

                  {!user && (
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Password</label>

                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  )}

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Role</label>

                    <select
                      className="form-select"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="receptionist">Receptionist</option>
                      <option value="doctor">Doctor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                {user && (
                  <>
                    <hr />

                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                      />

                      <label className="form-check-label">Active User</label>
                    </div>
                  </>
                )}
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Cancel
                </button>

                <button type="submit" className="btn btn-primary">
                  {user ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserModal;
