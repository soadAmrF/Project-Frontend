import { useEffect, useState } from "react";

const permissionsList = [
  "dashboard.view",
  "users.view",
  "users.create",
  "users.update",
  "users.delete",
];

const UserModal = ({ user, onClose, onSave, errorMessage }) => {
  const [formData, setFormData] = useState({
    name: "",
    fullname: "",
    password: "",
    role: "employee",
    permissions: [],
    isActive: true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        fullname: user.fullname || "",
        password: "",
        role: user.role || "employee",
        permissions: user.permissions || [],
        isActive: user.isActive,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

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

  const handlePermission = (permission) => {
    if (formData.permissions.includes(permission)) {
      setFormData((prev) => ({
        ...prev,
        permissions: prev.permissions.filter((p) => p !== permission),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        permissions: [...prev.permissions, permission],
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = { ...formData };

    if (!data.password) {
      delete data.password;
    }

    onSave(data);
  };

  return (
    <>
      <div
        className="modal fade show d-block"
        style={{ background: "rgba(0,0,0,.5)" }}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
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
                    <label className="form-label">Password</label>

                    <input
                      type="password"
                      className="form-control"
                      name="password"
                      placeholder={
                        user ? "Leave blank to keep password" : "Password"
                      }
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">Role</label>

                    <select
                      className="form-select"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="employee">Employee</option>

                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <hr />

                <h6 className="mb-3">Permissions</h6>

                <div className="row">
                  {permissionsList.map((permission) => (
                    <div className="col-md-6" key={permission}>
                      <div className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={formData.permissions.includes(permission)}
                          onChange={() => handlePermission(permission)}
                        />

                        <label className="form-check-label">{permission}</label>
                      </div>
                    </div>
                  ))}
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
