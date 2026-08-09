import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/api";

import SearchBar from "./components/SearchBar";
import UserStats from "./components/UserStats";
import UserTable from "./components/UserTable";
import UserModal from "./components/UserModal";

import "./users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const isAdmin = currentUser?.role === "admin";

  const fetchUsers = async () => {
    try {
      const res = await getUsers();

      setUsers(res.data.users);
    } catch (error) {
      console.log(error.response);
      setErrorMessage(error.response?.data?.message || "Cannot fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = () => {
    setErrorMessage("");

    setEditingUser(null);

    setShowModal(true);
  };

  const handleEdit = (user) => {
    setErrorMessage("");

    setEditingUser(user);

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      setErrorMessage("");

      await deleteUser(id);

      fetchUsers();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Cannot delete user");
    }
  };

  const handleSave = async (data) => {
    try {
      setErrorMessage("");

      if (editingUser) {
        await updateUser(editingUser._id, data);
      } else {
        await createUser(data);
      }

      await fetchUsers();

      setShowModal(false);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Something went wrong");
    }
  };

  const filteredUsers = users.filter((user) => {
    const keyword = search.toLowerCase();

    return (
      user.name.toLowerCase().includes(keyword) ||
      user.fullname.toLowerCase().includes(keyword) ||
      user.role.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="users-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="users-page-header">
          <div>
            <h1>Users</h1>

            <nav>
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">Home</Link>
                </li>

                <li className="breadcrumb-item">
                  <Link to="/settings">Settings</Link>
                </li>

                <li className="breadcrumb-item active">Users</li>
              </ol>
            </nav>
          </div>

        </div>

        {isAdmin && (
          <button className="add-user-btn" onClick={handleAdd}>
            <i className="bi bi-plus-lg"></i>
            Add User
          </button>
        )}
      </div>

      {/* Error */}
      {errorMessage && (
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {errorMessage}
        </div>
      )}

      {/* Stats */}
      <UserStats users={users} />

      {/* Search */}
      <SearchBar search={search} setSearch={setSearch} />

      {/* Table */}
      <UserTable
        users={filteredUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isAdmin={isAdmin}
      />

      {/* Modal */}
      {showModal && (
        <UserModal
          user={editingUser}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          errorMessage={errorMessage}
        />
      )}
    </div>
  );
};

export default Users;
