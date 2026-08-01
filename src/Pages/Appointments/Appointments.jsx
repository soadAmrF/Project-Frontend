import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import "./Appointments.css";

const initialData = [
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
    day: "Friday",
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
    day: "Tuesday",
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
    day: "Sunday",
    time: "01:00 PM",
    status: "Pending",
  },
];

export default function Appointments() {
  const [appointments, setAppointments] = useState(() => {
    const saved = localStorage.getItem("my_appointments");
    return saved ? JSON.parse(saved) : initialData;
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [doctorName, setDoctorName] = useState("Dr. Sarah Ahmed");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const filteredAppointments = appointments.filter((item) => {
    const matchesSearch =
      item.patientName.toLowerCase().includes(search.toLowerCase()) ||
      item.patientPhone.includes(search);
    const matchesStatus = statusFilter === "" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddAppointment = (e) => {
    e.preventDefault();

    const newAppointment = {
      id: Date.now(),
      patientName: patientName,
      patientPhone: patientPhone,
      doctorName: doctorName,
      doctorSpecialty: "General Dentist",
      date: date,
      day: "Monday",
      time: time,
      status: "Confirmed",
    };

    const updatedAppointments = [newAppointment, ...appointments];

    setAppointments(updatedAppointments);
    localStorage.setItem(
      "my_appointments",
      JSON.stringify(updatedAppointments),
    );

    setShowModal(false);
    setPatientName("");
    setPatientPhone("");
    setDate("");
    setTime("");
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
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">
            <i className="bi bi-clock-fill" />
          </div>
          <div className="stat-info">
            <span>Pending</span>
            <h3>{appointments.filter((a) => a.status === "Pending").length}</h3>
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
          </div>
        </div>
      </div>

      <div className="filter-card">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search by name or phone..."
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
            <option value="Confirmed">Confirmed</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <button
            className="btn-reset"
            onClick={() => {
              setSearch("");
              setStatusFilter("");
            }}
          >
            Reset
          </button>
        </div>
        <button className="btn-add-new" onClick={() => setShowModal(true)}>
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
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
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
                      <small>{item.doctorSpecialty}</small>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Appointment</h3>
            <form onSubmit={handleAddAppointment}>
              <div className="form-group">
                <label>Patient Name</label>
                <input
                  type="text"
                  className="input-field"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  className="input-field"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Time</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. 10:00 AM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Doctor</label>
                <select
                  className="input-field"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                >
                  <option value="Dr. Sarah Ahmed">Dr. Sarah Ahmed</option>
                  <option value="Dr. Ahmed Hassan">Dr. Ahmed Hassan</option>
                  <option value="Dr. Mostafa Elsayad">
                    Dr. Mostafa Elsayad
                  </option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-reset"
                  onClick={() => setShowModal(false)}
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
