import { useEffect, useState } from "react";
import {
  getAppointments,
  getPatients,
  getDoctors,
  createAppointment,
  updateAppointment,
} from "../../services/api";

import "./Appointments.css";
import PageHeader from "@/components/PageHeader";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    dateAndTime: "",
    reason: "",
    status: "scheduled",
  });

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await getAppointments();
      setAppointments(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await getPatients();
      setPatients(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await getDoctors();
      setDoctors(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const data = {
        ...formData,
        dateAndTime: new Date(formData.dateAndTime).toISOString(),
      };

      if (editingId) {
        await updateAppointment(editingId, data);
      } else {
        await createAppointment(data);
      }

      await fetchAppointments();

      setShowModal(false);
      setEditingId(null);

      setFormData({
        patientId: "",
        doctorId: "",
        dateAndTime: "",
        reason: "",
        status: "scheduled",
      });
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleEdit = (appointment) => {
    setEditingId(appointment.id);

    setFormData({
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      dateAndTime: new Date(appointment.dateAndTime).toISOString().slice(0, 16),
      reason: appointment.reason || "",
      status: appointment.status,
    });

    setShowModal(true);
  };

  const filteredAppointments = appointments.filter((item) => {
    const matchesSearch =
      item.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      item.phone?.includes(search);

    const matchesStatus = statusFilter === "" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="appointments-page">
      <PageHeader />
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">
            <i className="bi bi-calendar-event-fill"></i>
          </div>

          <div className="stat-info">
            <span>Total Appointments</span>
            <h3>{appointments.length}</h3>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">
            <i className="bi bi-check-circle-fill"></i>
          </div>

          <div className="stat-info">
            <span>Scheduled</span>
            <h3>
              {appointments.filter((a) => a.status === "scheduled").length}
            </h3>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">
            <i className="bi bi-clock-fill"></i>
          </div>

          <div className="stat-info">
            <span>Completed</span>
            <h3>
              {appointments.filter((a) => a.status === "completed").length}
            </h3>
          </div>
        </div>

        <div className="stat-card red">
          <div className="stat-icon">
            <i className="bi bi-x-circle-fill"></i>
          </div>

          <div className="stat-info">
            <span>Cancelled</span>
            <h3>
              {appointments.filter((a) => a.status === "cancelled").length}
            </h3>
          </div>
        </div>
      </div>

      <div className="filter-card">
        <div className="filter-group">
          <input
            type="text"
            className="input-field search-input"
            placeholder="Search patient..."
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

        <button
          className="btn-add-new"
          onClick={() => {
            setEditingId(null);

            setFormData({
              patientId: "",
              doctorId: "",
              dateAndTime: "",
              reason: "",
              status: "scheduled",
            });

            setShowModal(true);
          }}
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
                <th>PHONE</th>
                <th>DATE & TIME</th>
                <th>REASON</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>

            <tbody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment, index) => (
                  <tr key={appointment.id}>
                    <td>{index + 1}</td>

                    <td>
                      <div className="user-cell">
                        <div className="avatar-icon">
                          <i className="bi bi-person-fill"></i>
                        </div>

                        <div className="user-details">
                          <strong>{appointment.patientName}</strong>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="doctor-cell">
                        <strong>{appointment.doctorName}</strong>
                      </div>
                    </td>

                    <td>{appointment.phone}</td>

                    <td>
                      <div className="date-cell">
                        <strong>
                          {new Date(
                            appointment.dateAndTime,
                          ).toLocaleDateString()}
                        </strong>

                        <small>
                          {new Date(appointment.dateAndTime).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                          )}
                        </small>
                      </div>
                    </td>

                    <td>
  {appointment.reason || "-"}
</td>

                    <td>
                      <span
                        className={`status-badge ${
                          appointment.status === "scheduled"
                            ? "confirmed"
                            : appointment.status === "completed"
                              ? "confirmed"
                              : appointment.status === "cancelled"
                                ? "cancelled"
                                : "pending"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="btn-action"
                        onClick={() => handleEdit(appointment)}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: 30 }}>
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3>{editingId ? "Edit Appointment" : "Add Appointment"}</h3>

              <button
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>

            <div className="form-group">
              <label>Patient</label>

              <select
                className="input-field"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
              >
                <option value="">Select Patient</option>

                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Doctor</label>

              <select
                className="input-field"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
              >
                <option value="">Select Doctor</option>

                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.userId.fullname}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Date & Time</label>

              <input
                type="datetime-local"
                className="input-field"
                name="dateAndTime"
                value={formData.dateAndTime}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Reason</label>

              <textarea
                rows="3"
                className="input-field"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Status</label>

              <select
                className="input-field"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="missed">Missed</option>
              </select>
            </div>

            <div className="modal-actions">
              <button className="btn-reset" onClick={() => setShowModal(false)}>
                Cancel
              </button>

              <button className="btn-add-new" onClick={handleSubmit}>
                {editingId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
