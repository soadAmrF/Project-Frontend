import React, { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import { getAppointments, getDoctors, updateAppointment } from "@/services/api";
import AppointmentStats from "./Components/AppointmentStats";
import AppointmentModal from "./Components/AppointmentModal";
import "./Appointments.css";

const dummyAppointments = [
  {
    _id: "1",
    patientId: { name: "Assem Monir", phone: "145269741254" },
    doctorId: { name: "Dr. Sarah Ahmed" },
    dateAndTime: "2026-12-02T22:00:00.000Z",
    reason: "Checkup",
    status: "scheduled",
  },
  {
    _id: "2",
    patientId: { name: "Ahmed Mohamed", phone: "01123456789" },
    doctorId: { name: "Dr. Sarah Ahmed" },
    dateAndTime: "2026-05-26T10:00:00.000Z",
    reason: "Root Canal",
    status: "scheduled",
  },
  {
    _id: "3",
    patientId: { name: "Mona Ali", phone: "01098765432" },
    doctorId: { name: "Dr. Ahmed Hassan" },
    dateAndTime: "2026-05-26T11:30:00.000Z",
    reason: "Consultation",
    status: "completed",
  },
];

export default function Appointments() {
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem("my_appointments");
    return saved ? JSON.parse(saved) : dummyAppointments;
  });

  const [doctorsList, setDoctorsList] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointmentsData();
    fetchDoctorsData();
  }, []);

  const fetchAppointmentsData = async () => {
    try {
      const res = await getAppointments();
      if (res?.data?.data && res.data.data.length > 0) {
        setAppointments(res.data.data);
      }
    } catch (err) {
      console.log("Using local/fallback data");
    }
  };

  const fetchDoctorsData = async () => {
    try {
      const res = await getDoctors();
      if (res?.data) {
        setDoctorsList(res.data.data || res.data);
      }
    } catch (err) {
      console.log("Doctors API offline");
    }
  };

  const handleAddNewAppointment = (newItem) => {
    const updated = [newItem, ...appointments];
    setAppointments(updated);
    localStorage.setItem("my_appointments", JSON.stringify(updated));
  };

  const handleUpdateAppointment = async (updatedItem) => {
    try {
      await updateAppointment(updatedItem._id, updatedItem);
    } catch (err) {
      console.log("Backend offline, saving locally");
    }

    const updatedList = appointments.map((item) =>
      item._id === updatedItem._id ? updatedItem : item,
    );
    setAppointments(updatedList);
    localStorage.setItem("my_appointments", JSON.stringify(updatedList));
  };

  // حذف مباشر بدون رسالة confirmation
  const handleDeleteAppointment = (id) => {
    const updatedList = appointments.filter((item) => item._id !== id);
    setAppointments(updatedList);
    localStorage.setItem("my_appointments", JSON.stringify(updatedList));
  };

  const filteredAppointments = appointments.filter((item) => {
    const pName = item.patientId?.name || item.patientName || "";
    const pPhone = item.patientId?.phone || item.patientPhone || "";
    const matchesSearch =
      pName.toLowerCase().includes(search.toLowerCase()) ||
      pPhone.includes(search);
    const matchesStatus = statusFilter === "" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="appointments-page">
      <PageHeader />

      <AppointmentStats appointments={appointments} />

      <div className="filter-card">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search by patient name or phone..."
            className="input-field search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="input-field select-input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="missed">Missed</option>
          </select>
        </div>
        <button className="btn-add-new" onClick={() => setShowAddModal(true)}>
          + New Appointment
        </button>
      </div>

      <div className="table-card table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th># ID</th>
              <th>PATIENT</th>
              <th>DOCTOR</th>
              <th>DATE & TIME</th>
              <th>REASON</th>
              <th>STATUS</th>
              <th style={{ textAlign: "center" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((row, index) => (
                <tr key={row._id || index}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="patient-user-cell">
                      <div className="patient-icon-avatar">
                        <i className="bi bi-person-fill"></i>
                      </div>
                      <span className="patient-name">
                        {row.patientId?.name || row.patientName || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <strong>
                      {row.doctorId?.name ||
                        row.doctorName ||
                        "Dr. Sarah Ahmed"}
                    </strong>
                  </td>
                  <td>{new Date(row.dateAndTime).toLocaleString()}</td>
                  <td>{row.reason || "-"}</td>
                  <td>
                    <span
                      className={`status-pill ${row.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        justifyContent: "center",
                      }}
                    >
                      <button
                        onClick={() => setSelectedAppointment(row)}
                        style={{
                          backgroundColor: "#e8f2ff",
                          color: "#1877f2",
                          border: "none",
                          borderRadius: "8px",
                          padding: "8px 10px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>

                      <button
                        onClick={() => handleDeleteAppointment(row._id)}
                        style={{
                          backgroundColor: "#fde8e8",
                          color: "#e02424",
                          border: "none",
                          borderRadius: "8px",
                          padding: "8px 10px",
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <AppointmentModal
          doctorsList={doctorsList}
          onClose={() => setShowAddModal(false)}
          onSaveSuccess={handleAddNewAppointment}
        />
      )}
    </div>
  );
}
