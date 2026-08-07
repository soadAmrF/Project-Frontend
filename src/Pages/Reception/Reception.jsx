import React, { useState, useEffect, useCallback } from "react";
import PageHeader from "@/components/PageHeader";
import "./Reception.css";
import { Link, useNavigate } from "react-router-dom";
import {
  getAppointments,
  getPatients,
  getDoctors,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  addPatient,
} from "@/services/api";

// ==================== Component: Quick Add Patient Modal ====================
function QuickAddPatientModal({ onClose, onPatientAdded }) {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "male",
    phone: "",
    bloodGroup: "",
    medicalNotes: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim())
      newErrors.fullName = "Patient name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^01[0-9]{9}$/.test(formData.phone))
      newErrors.phone = "Phone number must be 01xxxxxxxxx";
    if (!formData.gender) newErrors.gender = "Gender is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await addPatient(formData);
      const newPatient = res.data?.data || res.data;
      onPatientAdded(newPatient);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add patient";
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className="bi bi-person-plus-fill me-2"></i>
            Add New Patient
          </h2>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="field">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                className={errors.fullName ? "error" : ""}
              />
              {errors.fullName && (
                <span className="error-text">{errors.fullName}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="01123456789"
                maxLength={11}
                className={errors.phone ? "error" : ""}
              />
              {errors.phone && (
                <span className="error-text">{errors.phone}</span>
              )}
            </div>

            <div className="field">
              <label>Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label>Blood Group (Optional)</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
              >
                <option value="">Unknown</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>Medical Notes (Optional)</label>
            <textarea
              name="medicalNotes"
              rows="2"
              value={formData.medicalNotes}
              onChange={handleChange}
              placeholder="Allergies, chronic conditions..."
            />
          </div>

          <div className="modal-btns">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Add Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==================== Component: Check-In Modal ====================
function CheckInModal({
  patients,
  doctors,
  onClose,
  onCheckIn,
  preSelectedPatient,
}) {
  const [formData, setFormData] = useState({
    patientId: preSelectedPatient?._id || preSelectedPatient?.id || "",
    doctorId: "",
    dateAndTime: "",
    reason: "",
    status: "scheduled",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.patientId) newErrors.patientId = "Please select a patient";
    if (!formData.doctorId) newErrors.doctorId = "Please select a doctor";
    if (!formData.dateAndTime)
      newErrors.dateAndTime = "Please select date and time";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const data = {
        patientId: formData.patientId,
        doctorId: formData.doctorId,
        dateAndTime: new Date(formData.dateAndTime).toISOString(),
        reason: formData.reason || "Reception check-in",
        status: formData.status,
      };
      await createAppointment(data);
      onCheckIn();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to check in";
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDefaultDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className="bi bi-calendar-check-fill me-2"></i>
            New Check-In
          </h2>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Patient *</label>
            <select
              name="patientId"
              value={formData.patientId}
              onChange={handleChange}
              className={errors.patientId ? "error" : ""}
            >
              <option value="">Select Patient</option>
              {patients.map((p) => (
                <option key={p._id || p.id} value={p._id || p.id}>
                  {p.fullName || p.name} - {p.phone}
                </option>
              ))}
            </select>
            {errors.patientId && (
              <span className="error-text">{errors.patientId}</span>
            )}
          </div>

          <div className="field">
            <label>Doctor *</label>
            <select
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              className={errors.doctorId ? "error" : ""}
            >
              <option value="">Select Doctor</option>
              {doctors.map((d) => (
                <option key={d._id || d.id} value={d._id || d.id}>
                  {d.userId?.name || d.userId?.fullname || d.name || "Doctor"}
                  {d.specialization ? ` - ${d.specialization}` : ""}
                </option>
              ))}
            </select>
            {errors.doctorId && (
              <span className="error-text">{errors.doctorId}</span>
            )}
          </div>

          <div className="form-row">
            <div className="field">
              <label>Date & Time *</label>
              <input
                type="datetime-local"
                name="dateAndTime"
                value={formData.dateAndTime || getDefaultDateTime()}
                onChange={handleChange}
                className={errors.dateAndTime ? "error" : ""}
              />
              {errors.dateAndTime && (
                <span className="error-text">{errors.dateAndTime}</span>
              )}
            </div>

            <div className="field">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="scheduled">Waiting</option>
                <option value="in-progress">In Progress</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label>Reason for Visit</label>
            <textarea
              name="reason"
              rows="2"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Routine checkup, tooth pain..."
            />
          </div>

          <div className="modal-btns">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Confirm Check-In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==================== Component: Search & Quick Actions ====================
function PatientSearchBar({ patients, onSelectPatient, onAddNew }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);

  const filteredPatients = searchTerm.trim()
    ? patients.filter((p) => {
        const name = (p.fullName || p.name || "").toLowerCase();
        const phone = String(p.phone || "");
        return (
          name.includes(searchTerm.toLowerCase()) || phone.includes(searchTerm)
        );
      })
    : [];

  const handleSelect = (patient) => {
    onSelectPatient(patient);
    setSearchTerm("");
    setShowResults(false);
  };

  return (
    <div className="patient-search-section">
      <div className="search-box-wrapper">
        <div className="search-input-group">
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Search patient by name or phone number..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
          />
          {searchTerm && (
            <button
              className="clear-btn"
              onClick={() => {
                setSearchTerm("");
                setShowResults(false);
              }}
            >
              <i className="bi bi-x"></i>
            </button>
          )}
        </div>

        {showResults && searchTerm.trim() && (
          <div className="search-results-dropdown">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((p) => (
                <div
                  key={p._id || p.id}
                  className="search-result-item"
                  onClick={() => handleSelect(p)}
                >
                  <div className="patient-avatar">
                    <i className="bi bi-person-fill"></i>
                  </div>
                  <div className="patient-info">
                    <strong>{p.fullName || p.name}</strong>
                    <small>{p.phone}</small>
                  </div>
                  <i className="bi bi-chevron-left"></i>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>No patient found with this name or phone number</p>
                <button className="btn-add-patient" onClick={onAddNew}>
                  <i className="bi bi-person-plus-fill me-2"></i>
                  Add New Patient
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="quick-actions">
        <button className="btn-quick-add" onClick={onAddNew}>
          <i className="bi bi-person-plus-fill"></i>
          New Patient
        </button>
        <button
          className="btn-quick-checkin"
          onClick={() => onSelectPatient(null)}
        >
          <i className="bi bi-calendar-check-fill"></i>
          Direct Check-In
        </button>
      </div>
    </div>
  );
}

// ==================== Main Component: Reception ====================
export default function Reception() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [preSelectedPatient, setPreSelectedPatient] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  const [statusFilter, setStatusFilter] = useState("All");

  const fetchAllData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const getPatientName = (patientId) => {
    const patient = patients.find((p) => (p._id || p.id) === patientId);
    return patient?.fullName || patient?.name || "Deleted Patient";
  };

  const getPatientPhone = (patientId) => {
    const patient = patients.find((p) => (p._id || p.id) === patientId);
    return patient?.phone || "-";
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find((d) => (d._id || d.id) === doctorId);
    return (
      doctor?.userId?.name ||
      doctor?.userId?.fullname ||
      doctor?.name ||
      "Deleted Doctor"
    );
  };

  const formatTime = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("en-US");
    } catch {
      return "-";
    }
  };

  const todayStr = new Date().toDateString();
  const todayAppointments = appointments.filter((a) => {
    if (!a.dateAndTime) return false;
    return new Date(a.dateAndTime).toDateString() === todayStr;
  });

  const stats = {
    total: todayAppointments.length,
    waiting: todayAppointments.filter((a) => a.status === "scheduled").length,
    inProgress: todayAppointments.filter(
      (a) => a.status === "in-progress" || a.status === "inProgress",
    ).length,
    completed: todayAppointments.filter((a) => a.status === "completed").length,
    doctorsAvailable: doctors.length,
  };

  const handleSelectPatient = (patient) => {
    if (patient) {
      setPreSelectedPatient(patient);
    } else {
      setPreSelectedPatient(null);
    }
    setShowCheckInModal(true);
  };

  const handlePatientAdded = async (newPatient) => {
    setShowAddPatientModal(false);
    try {
      const res = await getPatients();
      setPatients(res.data?.data || []);
    } catch (err) {
      console.error("Error refreshing patients:", err);
    }
    setPreSelectedPatient(newPatient);
    setShowCheckInModal(true);
  };

  const handleCheckInComplete = async () => {
    setShowCheckInModal(false);
    setPreSelectedPatient(null);
    await fetchAllData();
  };

  const updateStatus = async (appointmentId, newStatus) => {
    try {
      await updateAppointment(appointmentId, { status: newStatus });
      setAppointments((prev) =>
        prev.map((a) =>
          (a.id || a._id) === appointmentId ? { ...a, status: newStatus } : a,
        ),
      );
      setActiveMenu(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to delete this appointment?"))
      return;

    try {
      await deleteAppointment(appointmentId);
      await fetchAllData();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete appointment");
    }
  };

  const filteredAppointments = appointments.filter((a) => {
    if (statusFilter === "All") return true;
    return a.status === statusFilter;
  });

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    return new Date(b.dateAndTime) - new Date(a.dateAndTime);
  });

  const statusConfig = {
    scheduled: {
      label: "Waiting",
      class: "waiting",
      icon: "bi-hourglass-split",
    },
    "in-progress": {
      label: "In Progress",
      class: "in-progress",
      icon: "bi-arrow-repeat",
    },
    inProgress: {
      label: "In Progress",
      class: "in-progress",
      icon: "bi-arrow-repeat",
    },
    completed: {
      label: "Completed",
      class: "completed",
      icon: "bi-check-circle",
    },
    cancelled: { label: "Cancelled", class: "cancelled", icon: "bi-x-circle" },
    missed: {
      label: "Missed",
      class: "missed",
      icon: "bi-exclamation-triangle",
    },
  };

  const getStatusInfo = (status) => {
    return (
      statusConfig[status] || {
        label: status,
        class: "waiting",
        icon: "bi-question-circle",
      }
    );
  };

  if (isLoading) {
    return (
      <div className="reception-page">
        <PageHeader />
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status"></div>
          <p>Loading reception data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reception-page">
      <PageHeader />

      <div className="stats-container">
        <div className="stat-card">
          <div className="icon-box blue-card">
            <i className="bi bi-calendar-event-fill"></i>
          </div>
          <div className="stat-info">
            <span>Today's Appointments</span>
            <h3>{stats.total}</h3>
            <Link to="/appointments" className="stat-link">
              View All
            </Link>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon-box yellow-card">
            <i className="bi bi-hourglass-split"></i>
          </div>
          <div className="stat-info">
            <span>Waiting</span>
            <h3>{stats.waiting}</h3>
            <small>Currently in clinic</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon-box orange-card">
            <i className="bi bi-arrow-repeat"></i>
          </div>
          <div className="stat-info">
            <span>In Progress</span>
            <h3>{stats.inProgress}</h3>
            <small>With doctors now</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon-box green-card">
            <i className="bi bi-check-circle-fill"></i>
          </div>
          <div className="stat-info">
            <span>Completed Today</span>
            <h3>{stats.completed}</h3>
            <small>Seen by doctors</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="icon-box purple-card">
            <i className="bi bi-person-badge-fill"></i>
          </div>
          <div className="stat-info">
            <span>Available Doctors</span>
            <h3>{stats.doctorsAvailable}</h3>
            <Link to="/doctors" className="stat-link">
              View Doctors
            </Link>
          </div>
        </div>
      </div>

      <PatientSearchBar
        patients={patients}
        onSelectPatient={handleSelectPatient}
        onAddNew={() => setShowAddPatientModal(true)}
      />

      <div className="queue-section">
        <div className="section-header">
          <h3>
            <i className="bi bi-list-check me-2"></i>
            Queue
          </h3>
          <div className="queue-filters">
            <button
              className={`filter-btn ${statusFilter === "All" ? "active" : ""}`}
              onClick={() => setStatusFilter("All")}
            >
              All ({appointments.length})
            </button>
            <button
              className={`filter-btn ${statusFilter === "scheduled" ? "active" : ""}`}
              onClick={() => setStatusFilter("scheduled")}
            >
              Waiting ({stats.waiting})
            </button>
            <button
              className={`filter-btn ${statusFilter === "in-progress" ? "active" : ""}`}
              onClick={() => setStatusFilter("in-progress")}
            >
              In Progress ({stats.inProgress})
            </button>
            <button
              className={`filter-btn ${statusFilter === "completed" ? "active" : ""}`}
              onClick={() => setStatusFilter("completed")}
            >
              Completed ({stats.completed})
            </button>
          </div>
        </div>

        <div className="queue-table-wrapper">
          <table className="queue-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Patient</th>
                <th>Phone</th>
                <th>Doctor</th>
                <th>Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedAppointments.length > 0 ? (
                sortedAppointments.map((appointment, index) => {
                  const appointmentId = appointment.id || appointment._id;
                  const statusInfo = getStatusInfo(appointment.status);
                  return (
                    <tr key={appointmentId}>
                      <td>
                        <span className="queue-number">{index + 1}</span>
                      </td>
                      <td>
                        <div className="patient-cell">
                          <div className="patient-avatar">
                            <i className="bi bi-person-fill"></i>
                          </div>
                          <div>
                            <strong>
                              {getPatientName(appointment.patientId)}
                            </strong>
                            <small>
                              {appointment.reason || "General checkup"}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>{getPatientPhone(appointment.patientId)}</td>
                      <td>
                        <span className="doctor-name">
                          {getDoctorName(appointment.doctorId)}
                        </span>
                      </td>
                      <td>
                        <div className="time-cell">
                          <strong>{formatDate(appointment.dateAndTime)}</strong>
                          <small>{formatTime(appointment.dateAndTime)}</small>
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${statusInfo.class}`}>
                          <i className={`bi ${statusInfo.icon} me-1`}></i>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button
                            className="btn-action"
                            title="Change Status"
                            onClick={() =>
                              setActiveMenu(
                                activeMenu === appointmentId
                                  ? null
                                  : appointmentId,
                              )
                            }
                          >
                            <i className="bi bi-three-dots-vertical"></i>
                          </button>
                          <button
                            className="btn-action delete"
                            title="Delete"
                            onClick={() => handleDelete(appointmentId)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>

                          {activeMenu === appointmentId && (
                            <div className="status-dropdown">
                              <div
                                onClick={() =>
                                  updateStatus(appointmentId, "scheduled")
                                }
                              >
                                <i className="bi bi-hourglass-split me-2"></i>
                                Waiting
                              </div>
                              <div
                                onClick={() =>
                                  updateStatus(appointmentId, "in-progress")
                                }
                              >
                                <i className="bi bi-arrow-repeat me-2"></i>
                                In Progress
                              </div>
                              <div
                                onClick={() =>
                                  updateStatus(appointmentId, "completed")
                                }
                              >
                                <i className="bi bi-check-circle me-2"></i>
                                Completed
                              </div>
                              <div
                                onClick={() =>
                                  updateStatus(appointmentId, "cancelled")
                                }
                              >
                                <i className="bi bi-x-circle me-2"></i>
                                Cancelled
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state">
                    <i
                      className="bi bi-calendar-x"
                      style={{ fontSize: "3rem", color: "#ccc" }}
                    ></i>
                    <p>
                      No appointments{" "}
                      {statusFilter !== "All" ? "with this status" : "today"}
                    </p>
                    <button
                      className="btn-quick-checkin"
                      onClick={() => setShowCheckInModal(true)}
                    >
                      <i className="bi bi-plus-lg me-2"></i>
                      New Check-In
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddPatientModal && (
        <QuickAddPatientModal
          onClose={() => setShowAddPatientModal(false)}
          onPatientAdded={handlePatientAdded}
        />
      )}

      {showCheckInModal && (
        <CheckInModal
          patients={patients}
          doctors={doctors}
          preSelectedPatient={preSelectedPatient}
          onClose={() => {
            setShowCheckInModal(false);
            setPreSelectedPatient(null);
          }}
          onCheckIn={handleCheckInComplete}
        />
      )}
    </div>
  );
}
