const UserTable = ({ users, onEdit, onDelete, isAdmin }) => {
  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th>Username</th>
            <th>Full Name</th>
            <th>Role</th>
            <th>Status</th>
            <th>Created</th>

            {isAdmin && <th width="160">Actions</th>}
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={isAdmin ? "6" : "5"} className="text-center">
                No Users Found
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>

                <td>{user.fullname}</td>

                <td>
                  <span
                    className={`badge ${
                      user.role === "admin" ? "bg-danger" : "bg-primary"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                <td>
                  <span
                    className={`badge ${
                      user.isActive ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td>{new Date(user.createdAt).toLocaleDateString()}</td>

                {isAdmin && (
                  <td>
                    <button
                      className="
                            btn 
                            btn-warning 
                            btn-sm 
                            me-2
                          "
                      onClick={() => onEdit(user)}
                    >
                      <i className="bi bi-pencil"></i>
                    </button>

                    <button
                      className="
                            btn 
                            btn-danger 
                            btn-sm
                          "
                      onClick={() => onDelete(user._id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
