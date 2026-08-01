import React, { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import "./Reception.css";
import { Link } from "react-router-dom";

const defaultPatients = [
  {
    id: "PT-1001",
    name: "Ahmed Mohammed",
    doctor: "Dr. Mostafa Ali",
    time: "09:00 AM",
    status: "Waiting",
  },
  {
    id: "PT-1002",
    name: "Yassin Ali",
    doctor: "Dr. Ahmed Refaat",
    time: "09:30 AM",
    status: "In Progress",
  },
  {
    id: "PT-1003",
    name: "Ahlam Salah",
    doctor: "Dr. Sheimaa Ismail",
    time: "11:00 AM",
    status: "Waiting",
  },
  {
    id: "PT-1004",
    name: "Tareq Salim",
    doctor: "Dr. Mostafa Ali",
    time: "11:40 AM",
    status: "In Progress",
  },
  {
    id: "PT-1005",
    name: "Nada Monir",
    doctor: "Dr. Sheimaa Ismail",
    time: "12:20 PM",
    status: "Completed",
  },
];

export default function Reception() {
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem("my_patients_v2");
    return saved ? JSON.parse(saved) : defaultPatients;
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    doctor: "Dr. Mostafa Ali",
    time: "",
  });

  useEffect(() => {
    localStorage.setItem("my_patients_v2", JSON.stringify(patients));
  }, [patients]);

  const waiting = patients.filter((p) => p.status === "Waiting").length;
  const checkedIn = patients.filter((p) => p.status !== "Waiting").length;

  const handleAdd = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.time) return;

    const newPatient = {
      id: `PT-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formData.name,
      doctor: formData.doctor,
      time: formData.time,
      status: "Waiting",
    };

    setPatients([newPatient, ...patients]);
    setShowModal(false);
    setFormData({ name: "", doctor: "Dr. Mostafa Ali", time: "" });
  };

  const updateStatus = (id, newStatus) => {
    setPatients(
      patients.map((p) => (p.id === id ? { ...p, status: newStatus } : p)),
    );
    setActiveMenu(null);
  };

  const deletePatient = (id) =>
    setPatients(patients.filter((p) => p.id !== id));

  const filteredList = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === "All" || p.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  const patientsPerPage = 3;
  const totalPages = Math.ceil(filteredList.length / patientsPerPage) || 1;
  const displayedPatients = filteredList.slice(
    (currentPage - 1) * patientsPerPage,
    currentPage * patientsPerPage,
  );

  return (
    <div className="reception-page">
      <PageHeader />

      <div className="stats-container">
        <div className="stat-card">
          <div className="icon-box blue-card">
            <i className="bi bi-calendar-event-fill"></i>
          </div>
          <div>
            <span className="stat-title">Today's Appointments</span>
            <h3>{patients.length + 20}</h3>
            <span className="stat-sub link">
              <Link to="/appointments">View all appointments</Link>
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon-box yellow-card">
            <i className="bi bi-people-fill"></i>
          </div>
          <div>
            <span className="stat-title">Waiting Patients</span>
            <h3>{waiting}</h3>
            <span className="stat-sub">Currently waiting</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon-box green-card">
            <i className="bi bi-check-circle-fill"></i>
          </div>
          <div>
            <span className="stat-title">Checked In</span>
            <h3>{checkedIn}</h3>
            <span className="stat-sub">Today</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon-box purple-card">
            <i className="bi bi-person-badge-fill"></i>
          </div>
          <div>
            <span className="stat-title">Available Doctors</span>
            <h3>6</h3>
            <span className="stat-sub">Ready to see patients</span>
          </div>
        </div>
      </div>

      <div className="table-section">
        {/* شريط الفلترة والأزرار المعدل */}
        <div className="table-header-tools">
          <div className="left-tools">
            <div className="search-wrapper">
              <i className="bi bi-search search-icon"></i>
              <input
                type="text"
                className="search-input"
                placeholder="Search patients by name or ID..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Waiting">Waiting</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <button className="btn-add" onClick={() => setShowModal(true)}>
            + New Check-In
          </button>
        </div>

        <div className="table-responsive">
          <table className="patients-table">
            <thead>
              <tr>
                <th>Patient Details</th>
                <th>Assigned Doctor</th>
                <th>Appointment Time</th>
                <th>Check-In Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedPatients.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="patient-cell">
                      <div className="avatar-icon">
                        <i className="bi bi-person-fill"></i>
                      </div>
                      <div>
                        <strong>{p.name}</strong>
                        <div className="patient-id">{p.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>{p.doctor}</td>
                  <td>{p.time}</td>
                  <td>
                    <span
                      className={`status-tag ${p.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn-icon"
                      onClick={() => deletePatient(p.id)}
                      title="Delete"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() =>
                        setActiveMenu(activeMenu === p.id ? null : p.id)
                      }
                    >
                      <i className="bi bi-three-dots"></i>
                    </button>
                    {activeMenu === p.id && (
                      <div className="menu-dropdown">
                        <div onClick={() => updateStatus(p.id, "Waiting")}>
                          Waiting
                        </div>
                        <div onClick={() => updateStatus(p.id, "In Progress")}>
                          In Progress
                        </div>
                        <div onClick={() => updateStatus(p.id, "Completed")}>
                          Completed
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination-bar">
          <span className="pagination-info">
            Showing {displayedPatients.length} of {filteredList.length} patients
          </span>
          <div className="pagination-btns">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={currentPage === index + 1 ? "active" : ""}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <form className="modal-card" onSubmit={handleAdd}>
            <h2 className="modal-title">New Check-In</h2>
            <div className="field">
              <label>Patient Name</label>
              <input
                type="text"
                placeholder="Enter full name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="field">
              <label>Doctor</label>
              <select
                value={formData.doctor}
                onChange={(e) =>
                  setFormData({ ...formData, doctor: e.target.value })
                }
              >
                <option value="Dr. Mostafa Ali">Dr. Mostafa Ali</option>
                <option value="Dr. Ahmed Refaat">Dr. Ahmed Refaat</option>
                <option value="Dr. Sheimaa Ismail">Dr. Sheimaa Ismail</option>
              </select>
            </div>
            <div className="field">
              <label>Time</label>
              <input
                type="text"
                placeholder="e.g. 10:30 AM"
                required
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
              />
            </div>
            <div className="modal-btns">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn-save">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
