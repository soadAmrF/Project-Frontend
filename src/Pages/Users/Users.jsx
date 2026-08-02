import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import "./users.css";

import SearchBar from "./components/SearchBar";
import UserStats from "./components/UserStats";
import UserTable from "./components/UserTable";
import UserModal from "./components/UserModal";


import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../../services/api";

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

  const { searchQuery } = useOutletContext();

// console.log(searchQuery);

  return (
    <div className="container-fluid users-page">
      <div className=" d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <h2 className="fw-bold mb-0">User Management</h2>

        {isAdmin && (
          <button className="btn btn-primary" onClick={handleAdd}>
            <i
              className="
                bi bi-plus-circle me-2
              "
            ></i>
            Add User
          </button>
        )}
      </div>

      {errorMessage && (
        <div className="alert alert-danger">
          <i
            className="
              bi bi-exclamation-triangle me-2
            "
          ></i>

          {errorMessage}
        </div>
      )}

      <UserStats users={users} />

      <SearchBar search={search} setSearch={setSearch} />

      <UserTable
        users={filteredUsers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isAdmin={isAdmin}
      />

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
