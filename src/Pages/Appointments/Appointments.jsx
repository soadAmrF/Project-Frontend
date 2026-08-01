import React, { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import "./Appointments.css";

const defaultData = [
  {
    id: 1,
    patientName: "Assem Monir",
    patientPhone: "145269741254",
    doctorName: "Dr. Sarah Ahmed",
    doctorSpecialty: "General Dentist",
    date: "2026-12-02",
    day: "Monday",
    time: "10:00 pm",
    status: "Pending",
  },
  {
    id: 2,
    patientName: "Ahmed Mohamed",
    patientPhone: "01123456789",
    doctorName: "Dr. Sarah Ahmed",
    doctorSpecialty: "General Dentist",
    date: "2025-05-26",
    day: "Monday",
    time: "10:00 AM",
    status: "Pending",
  },
  {
    id: 3,
    patientName: "Mona Ali",
    patientPhone: "01098765432",
    doctorName: "Dr. Ahmed Hassan",
    doctorSpecialty: "Orthodontist",
    date: "2025-05-26",
    day: "Monday",
    time: "11:30 AM",
    status: "Confirmed",
  },
  {
    id: 4,
    patientName: "Omar Adel",
    patientPhone: "01234567890",
    doctorName: "Dr. Sarah Ahmed",
    doctorSpecialty: "General Dentist",
    date: "2025-05-26",
    day: "Monday",
    time: "01:00 PM",
    status: "Pending",
  },
];

const doctors = [
  "Dr. Sarah Ahmed",
  "Dr. Ahmed Hassan",
  "Dr. Mostafa Elsayad",
  "Dr. Sheimaa Ismail",
];

export default function Appointments() {
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem("appointments_data");
    return saved ? JSON.parse(saved) : defaultData;
  });

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    localStorage.setItem("appointments_data", JSON.stringify(appointments));
  }, [appointments]);

  const filtered = appointments.filter((item) => {
    const matchesSearch =
      item.patientName.toLowerCase().includes(search.toLowerCase()) ||
      item.patientPhone.includes(search);
    const matchesStatus = status === "" || item.status === status;
    return matchesSearch && matchesStatus;
  });

  const itemsPerPage = 4;
  const startIndex = (page - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;

  const handleSave = (e) => {
    e.preventDefault();
    if (modalData.id) {
      setAppointments(
        appointments.map((item) =>
          item.id === modalData.id ? modalData : item,
        ),
      );
    } else {
      setAppointments([
        { ...modalData, id: Date.now(), day: "Monday" },
        ...appointments,
      ]);
    }
    setModalData(null);
  };

  return (
    <div className="appointments-page">
      <PageHeader title="Appointments" breadcrumb="Home / Appointments" />

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">
            <i className="bi bi-calendar-event-fill" />
          </div>
          <div className="stat-info">
            <span>Total Appointments</span>
            <h3>{appointments.length}</h3>
            <small>This Month</small>
          </div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">
            <i className="bi bi-check-circle-fill" />
          </div>
          <div className="stat-info">
            <span>Confirmed</span>
            <h3>
              {appointments.filter((a) => a.status === "Confirmed").length}
            </h3>
            <small>This Month</small>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">
            <i className="bi bi-clock-fill" />
          </div>
          <div className="stat-info">
            <span>Pending</span>
            <h3>{appointments.filter((a) => a.status === "Pending").length}</h3>
            <small>This Month</small>
          </div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon">
            <i className="bi bi-x-circle-fill" />
          </div>
          <div className="stat-info">
            <span>Cancelled</span>
            <h3>
              {appointments.filter((a) => a.status === "Cancelled").length}
            </h3>
            <small>This Month</small>
          </div>
        </div>
      </div>

      <div className="filter-card">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search..."
            className="input-field search-input"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <select
            className="input-field select-input"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Status</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button
            className="btn-reset"
            onClick={() => {
              setSearch("");
              setStatus("");
              setPage(1);
            }}
          >
            Reset
          </button>
        </div>
        <button
          className="btn-add-new"
          onClick={() =>
            setModalData({
              patientName: "",
              patientPhone: "",
              doctorName: "Dr. Sarah Ahmed",
              date: "",
              time: "",
              status: "Confirmed",
            })
          }
        >
          + New Appointment
        </button>
      </div>

      <div className="table-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>#</th>
                <th>PATIENT</th>
                <th>DOCTOR</th>
                <th>DATE</th>
                <th>TIME</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, idx) => (
                <tr key={item.id}>
                  <td>{startIndex + idx + 1}</td>
                  <td>
                    <div className="user-cell">
                      <div className="avatar-icon">
                        <i className="bi bi-person-fill" />
                      </div>
                      <div className="user-details">
                        <strong>{item.patientName}</strong>
                        <span className="phone-number">
                          {item.patientPhone}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="doctor-cell">
                      <strong>{item.doctorName}</strong>
                      <small>{item.doctorSpecialty || "General Dentist"}</small>
                    </div>
                  </td>
                  <td>
                    <div className="date-cell">
                      <strong>{item.date}</strong>
                      <small>{item.day}</small>
                    </div>
                  </td>
                  <td>{item.time}</td>
                  <td>
                    <span
                      className={`status-badge ${item.status.toLowerCase()}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-action edit"
                      onClick={() => setModalData(item)}
                    >
                      <i className="bi bi-pencil" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <span>
            Showing {currentItems.length} of {filtered.length}
          </span>
          <div className="pagination">
            <button
              className="page-btn"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`page-btn ${page === i + 1 ? "active" : ""}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="page-btn"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {modalData && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{modalData.id ? "Edit Appointment" : "Add Appointment"}</h3>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label>Patient Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={modalData.patientName}
                  onChange={(e) =>
                    setModalData({ ...modalData, patientName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  className="input-field"
                  value={modalData.patientPhone}
                  onChange={(e) =>
                    setModalData({ ...modalData, patientPhone: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={modalData.date}
                  onChange={(e) =>
                    setModalData({ ...modalData, date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input
                  type="text"
                  className="input-field"
                  value={modalData.time}
                  onChange={(e) =>
                    setModalData({ ...modalData, time: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Doctor</label>
                <select
                  className="input-field"
                  value={modalData.doctorName}
                  onChange={(e) =>
                    setModalData({ ...modalData, doctorName: e.target.value })
                  }
                >
                  {doctors.map((d, i) => (
                    <option key={i} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-reset"
                  onClick={() => setModalData(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-add-new">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
