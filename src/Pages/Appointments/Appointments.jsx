import { useEffect, useState } from "react";
import {
  getAppointments,
  getPatients,
  getDoctors,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../../services/api";

import "./Appointments.css";
import PageHeader from "@/components/PageHeader";

const initialFormData = {
  patientId: "",
  doctorId: "",
  dateAndTime: "",
  reason: "",
  status: "scheduled",
};

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    fetchAllData();
  }, []);

  // ✅ جيب كل البيانات مع بعض عشان أسرع
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [apptRes, patRes, docRes] = await Promise.allSettled([
        getAppointments(),
        getPatients(),
        getDoctors(),
      ]);

      if (apptRes.status === "fulfilled") {
        setAppointments(apptRes.value.data?.data || []);
      }
      if (patRes.status === "fulfilled") {
        setPatients(patRes.value.data?.data || []);
      }
      if (docRes.status === "fulfilled") {
        setDoctors(docRes.value.data?.data || []);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ Validation قبل الحفظ
  const validateForm = () => {
    if (!formData.patientId) return "اختار المريض";
    if (!formData.doctorId) return "اختار الطبيب";
    if (!formData.dateAndTime) return "حدد التاريخ والوقت";
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    setIsSubmitting(true);
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

      await fetchAllData();
      closeModal();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ استخدام _id بدل id
  const handleEdit = (appointment) => {
    setEditingId(appointment._id);

    setFormData({
      patientId: appointment.patientId?._id || appointment.patientId || "",
      doctorId: appointment.doctorId?._id || appointment.doctorId || "",
      dateAndTime: appointment.dateAndTime
        ? new Date(appointment.dateAndTime).toISOString().slice(0, 16)
        : "",
      reason: appointment.reason || "",
      status: appointment.status || "scheduled",
    });

    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الموعد؟")) return;

    try {
      await deleteAppointment(id);
      await fetchAllData();
    } catch (err) {
      console.error(err);
      alert("فشل في حذف الموعد");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData(initialFormData);
  };

  const openNewModal = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setShowModal(true);
  };

  const filteredAppointments = appointments.filter((item) => {
    const matchesSearch =
      item.patientName?.toLowerCase().includes(search.toLowerCase()) ||
      item.phone?.includes(search);

    const matchesStatus = statusFilter === "" || item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // ✅ إحصائيات محسوبة مرة واحدة
  const stats = {
    total: appointments.length,
    scheduled: appointments.filter((a) => a.status === "scheduled").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
  };

  // ✅ Loading State
  if (isLoading) {
    return (
      <div className="appointments-page">
        <PageHeader />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{ color: "#666" }}>جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="appointments-page">
      <PageHeader />

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">
            <i className="bi bi-calendar-event-fill"></i>
          </div>
          <div className="stat-info">
            <span>Total Appointments</span>
            <h3>{stats.total}</h3>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">
            <i className="bi bi-check-circle-fill"></i>
          </div>
          <div className="stat-info">
            <span>Scheduled</span>
            <h3>{stats.scheduled}</h3>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">
            <i className="bi bi-clock-fill"></i>
          </div>
          <div className="stat-info">
            <span>Completed</span>
            <h3>{stats.completed}</h3>
          </div>
        </div>

        <div className="stat-card red">
          <div className="stat-icon">
            <i className="bi bi-x-circle-fill"></i>
          </div>
          <div className="stat-info">
            <span>Cancelled</span>
            <h3>{stats.cancelled}</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
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

        <button className="btn-add-new" onClick={openNewModal}>
          + New Appointment
        </button>
      </div>

      {/* Table */}
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
                  <tr key={appointment._id}>
                    <td>{index + 1}</td>

                    <td>
                      <div className="user-cell">
                        <div className="avatar-icon">
                          <i className="bi bi-person-fill"></i>
                        </div>
                        <div className="user-details">
                          <strong>
                            {appointment.patientName || "Unknown"}
                          </strong>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="doctor-cell">
                        <strong>{appointment.doctorName || "Unknown"}</strong>
                      </div>
                    </td>

                    <td>{appointment.phone || "-"}</td>

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
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </small>
                      </div>
                    </td>

                    <td>{appointment.reason || "-"}</td>

                    {/* ✅ Status Badge Logic - كل حالة ليها كلاس مختلف */}
                    <td>
                      <span
                        className={`status-badge ${
                          appointment.status === "scheduled"
                            ? "scheduled"
                            : appointment.status === "completed"
                              ? "completed"
                              : appointment.status === "cancelled"
                                ? "cancelled"
                                : appointment.status === "missed"
                                  ? "missed"
                                  : "pending"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>

                    {/* ✅ أزرار Edit + Delete */}
                    <td>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          className="btn-action"
                          onClick={() => handleEdit(appointment)}
                          title="Edit"
                        >
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                        <button
                          className="btn-action"
                          onClick={() => handleDelete(appointment._id)}
                          title="Delete"
                          style={{ color: "#dc3545" }}
                        >
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      </div>
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

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3>{editingId ? "Edit Appointment" : "Add Appointment"}</h3>
              <button className="btn-close" onClick={closeModal}></button>
            </div>

            <div className="form-group">
              <label>Patient *</label>
              <select
                className="input-field"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
              >
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient._id} value={patient._id}>
                    {patient.fullName || patient.name || "Unknown"}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Doctor *</label>
              <select
                className="input-field"
                name="doctorId"
                value={formData.doctorId}
                onChange={handleChange}
              >
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option
                    key={doctor._id || doctor.id}
                    value={doctor._id || doctor.id}
                  >
                    {doctor.userId?.name || doctor.name || "Unknown"}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Date & Time *</label>
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
              <button
                className="btn-reset"
                onClick={closeModal}
                disabled={isSubmitting}
              >
                Cancel
              </button>

              {/* ✅ Disabled أثناء الحفظ */}
              <button
                className="btn-add-new"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : editingId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
