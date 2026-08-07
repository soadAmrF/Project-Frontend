import React, { useState, useEffect, useCallback } from "react";
import PageHeader from "@/components/PageHeader";
import "./MedicalRecords.css";
import {
  getAllMedicalRecords,
  getPatients,
  getDoctors,
  getAppointments,
  createMedicalRecord,
  updateMedicalRecordNotes,
  deleteMedicalRecord,
} from "@/services/api";

// ==================== Component: Stats Cards ====================
function StatsCards({ records }) {
  const todayStr = new Date().toDateString();
  const todayRecords = records.filter(
    (r) => new Date(r.createdAt).toDateString() === todayStr,
  );

  const uniquePatients = new Set(
    records.map((r) => r.patientId?._id || r.patientId),
  ).size;

  const uniqueDoctors = new Set(
    records.map((r) => r.doctorId?._id || r.doctorId),
  ).size;

  return (
    <div className="stats-container">
      <div className="stat-card">
        <div className="icon-box blue-card">
          <i className="bi bi-journal-medical"></i>
        </div>
        <div className="stat-info">
          <span>Total Records</span>
          <h3>{records.length}</h3>
          <small>All medical records</small>
        </div>
      </div>

      <div className="stat-card">
        <div className="icon-box green-card">
          <i className="bi bi-calendar-check-fill"></i>
        </div>
        <div className="stat-info">
          <span>Today's Records</span>
          <h3>{todayRecords.length}</h3>
          <small>Created today</small>
        </div>
      </div>

      <div className="stat-card">
        <div className="icon-box purple-card">
          <i className="bi bi-people-fill"></i>
        </div>
        <div className="stat-info">
          <span>Patients Treated</span>
          <h3>{uniquePatients}</h3>
          <small>Unique patients</small>
        </div>
      </div>

      <div className="stat-card">
        <div className="icon-box orange-card">
          <i className="bi bi-person-badge-fill"></i>
        </div>
        <div className="stat-info">
          <span>Doctors Involved</span>
          <h3>{uniqueDoctors}</h3>
          <small>Unique doctors</small>
        </div>
      </div>
    </div>
  );
}

// ==================== Component: Add/Edit Record Modal ====================
function RecordModal({
  patients,
  doctors,
  appointments,
  editingRecord,
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState({
    patientId: editingRecord?.patientId?._id || editingRecord?.patientId || "",
    doctorId: editingRecord?.doctorId?._id || editingRecord?.doctorId || "",
    appointmentId:
      editingRecord?.appointmentId?._id || editingRecord?.appointmentId || "",
    chiefComplaint: editingRecord?.chiefComplaint || "",
    diagnosis: editingRecord?.diagnosis || "",
    treatmentPlan: editingRecord?.treatmentPlan || "",
    notes: editingRecord?.notes || "",
    nextVisit: editingRecord?.nextVisit
      ? new Date(editingRecord.nextVisit).toISOString().slice(0, 16)
      : "",
    prescription: editingRecord?.prescription || [],
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
    if (!formData.patientId) newErrors.patientId = "Patient is required";
    if (!formData.doctorId) newErrors.doctorId = "Doctor is required";
    if (!formData.appointmentId)
      newErrors.appointmentId = "Appointment is required";
    if (!formData.chiefComplaint.trim())
      newErrors.chiefComplaint = "Chief complaint is required";
    if (!formData.diagnosis.trim())
      newErrors.diagnosis = "Diagnosis is required";
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
      if (editingRecord) {
        // تحديث الملاحظات فقط
        await updateMedicalRecordNotes(editingRecord._id, {
          notes: formData.notes,
          treatmentPlan: formData.treatmentPlan,
          prescription: formData.prescription,
        });
      } else {
        // إنشاء سجل جديد
        const data = {
          ...formData,
          nextVisit: formData.nextVisit
            ? new Date(formData.nextVisit).toISOString()
            : null,
        };
        await createMedicalRecord(data);
      }
      onSave();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save record");
    } finally {
      setIsSubmitting(false);
    }
  };

  // فلترة المواعيد حسب المريض المختار
  const filteredAppointments = formData.patientId
    ? appointments.filter(
        (a) => (a.patientId?._id || a.patientId) === formData.patientId,
      )
    : appointments;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card modal-large"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>
            <i className="bi bi-journal-plus me-2"></i>
            {editingRecord ? "Edit Medical Record" : "New Medical Record"}
          </h2>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="field">
              <label>Patient *</label>
              <select
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                disabled={!!editingRecord}
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
                disabled={!!editingRecord}
                className={errors.doctorId ? "error" : ""}
              >
                <option value="">Select Doctor</option>
                {doctors.map((d) => (
                  <option key={d._id || d.id} value={d._id || d.id}>
                    {d.userId?.name || d.userId?.fullname || "Doctor"}
                    {d.specialization ? ` (${d.specialization})` : ""}
                  </option>
                ))}
              </select>
              {errors.doctorId && (
                <span className="error-text">{errors.doctorId}</span>
              )}
            </div>
          </div>

          <div className="field">
            <label>Appointment *</label>
            <select
              name="appointmentId"
              value={formData.appointmentId}
              onChange={handleChange}
              disabled={!!editingRecord}
              className={errors.appointmentId ? "error" : ""}
            >
              <option value="">Select Appointment</option>
              {filteredAppointments.map((a) => (
                <option key={a._id || a.id} value={a._id || a.id}>
                  {new Date(a.dateAndTime).toLocaleString()} - {a.status}
                </option>
              ))}
            </select>
            {errors.appointmentId && (
              <span className="error-text">{errors.appointmentId}</span>
            )}
          </div>

          <div className="field">
            <label>Chief Complaint *</label>
            <textarea
              name="chiefComplaint"
              rows="2"
              value={formData.chiefComplaint}
              onChange={handleChange}
              disabled={!!editingRecord}
              placeholder="Patient's main complaint..."
              className={errors.chiefComplaint ? "error" : ""}
            />
            {errors.chiefComplaint && (
              <span className="error-text">{errors.chiefComplaint}</span>
            )}
          </div>

          <div className="field">
            <label>Diagnosis *</label>
            <textarea
              name="diagnosis"
              rows="2"
              value={formData.diagnosis}
              onChange={handleChange}
              disabled={!!editingRecord}
              placeholder="Medical diagnosis..."
              className={errors.diagnosis ? "error" : ""}
            />
            {errors.diagnosis && (
              <span className="error-text">{errors.diagnosis}</span>
            )}
          </div>

          <div className="field">
            <label>Treatment Plan</label>
            <textarea
              name="treatmentPlan"
              rows="2"
              value={formData.treatmentPlan}
              onChange={handleChange}
              placeholder="Planned treatment..."
            />
          </div>

          <div className="field">
            <label>Notes</label>
            <textarea
              name="notes"
              rows="2"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes..."
            />
          </div>

          <div className="form-row">
            <div className="field">
              <label>Next Visit</label>
              <input
                type="datetime-local"
                name="nextVisit"
                value={formData.nextVisit}
                onChange={handleChange}
                disabled={!!editingRecord}
              />
            </div>
          </div>

          <div className="modal-btns">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : editingRecord
                  ? "Update Record"
                  : "Create Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==================== Component: View Record Modal ====================
function ViewRecordModal({ record, onClose }) {
  if (!record) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card modal-large"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>
            <i className="bi bi-journal-medical me-2"></i>
            Medical Record Details
          </h2>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <div className="record-details">
          {/* Patient & Doctor Info */}
          <div className="details-section">
            <h3>
              <i className="bi bi-people-fill me-2"></i>
              Patient & Doctor
            </h3>
            <div className="details-grid">
              <div className="detail-item">
                <label>Patient</label>
                <span>
                  {record.patientId?.fullName ||
                    record.patientId?.name ||
                    "N/A"}
                </span>
              </div>
              <div className="detail-item">
                <label>Phone</label>
                <span>{record.patientId?.phone || "-"}</span>
              </div>
              <div className="detail-item">
                <label>Doctor</label>
                <span>
                  {record.doctorId?.userId?.fullname ||
                    record.doctorId?.userId?.name ||
                    "N/A"}
                </span>
              </div>
              <div className="detail-item">
                <label>Specialization</label>
                <span>{record.doctorId?.specialization || "-"}</span>
              </div>
            </div>
          </div>

          {/* Medical Info */}
          <div className="details-section">
            <h3>
              <i className="bi bi-heart-pulse-fill me-2"></i>
              Medical Information
            </h3>
            <div className="detail-block">
              <label>Chief Complaint</label>
              <p>{record.chiefComplaint}</p>
            </div>
            <div className="detail-block">
              <label>Diagnosis</label>
              <p>{record.diagnosis}</p>
            </div>
            {record.treatmentPlan && (
              <div className="detail-block">
                <label>Treatment Plan</label>
                <p>{record.treatmentPlan}</p>
              </div>
            )}
            {record.notes && (
              <div className="detail-block">
                <label>Notes</label>
                <p>{record.notes}</p>
              </div>
            )}
          </div>

          {/* Prescription */}
          {record.prescription && record.prescription.length > 0 && (
            <div className="details-section">
              <h3>
                <i className="bi bi-capsule me-2"></i>
                Prescription
              </h3>
              <ul className="prescription-list">
                {record.prescription.map((item, idx) => (
                  <li key={idx}>
                    {typeof item === "string"
                      ? item
                      : `${item.name} - ${item.dosage}`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Dates */}
          <div className="details-section">
            <h3>
              <i className="bi bi-calendar-fill me-2"></i>
              Dates
            </h3>
            <div className="details-grid">
              <div className="detail-item">
                <label>Created At</label>
                <span>{new Date(record.createdAt).toLocaleString()}</span>
              </div>
              {record.nextVisit && (
                <div className="detail-item">
                  <label>Next Visit</label>
                  <span>{new Date(record.nextVisit).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="modal-btns">
          <button className="btn-cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== Main Component: MedicalRecords ====================
export default function MedicalRecords() {
  // Data States
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  // ==================== Fetch Data ====================
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [recordsRes, patientsRes, doctorsRes, appointmentsRes] =
        await Promise.allSettled([
          getAllMedicalRecords(),
          getPatients(),
          getDoctors(),
          getAppointments(),
        ]);

      if (recordsRes.status === "fulfilled") {
        setRecords(recordsRes.value.data?.data || []);
      }
      if (patientsRes.status === "fulfilled") {
        setPatients(patientsRes.value.data?.data || []);
      }
      if (doctorsRes.status === "fulfilled") {
        setDoctors(doctorsRes.value.data?.data || []);
      }
      if (appointmentsRes.status === "fulfilled") {
        setAppointments(appointmentsRes.value.data?.data || []);
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

  // ==================== Handlers ====================
  const handleAddNew = () => {
    setEditingRecord(null);
    setShowModal(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setShowModal(true);
  };

  const handleView = (record) => {
    setViewingRecord(record);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      await deleteMedicalRecord(id);
      setRecords((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete record");
    }
  };

  const handleSaveComplete = async () => {
    setShowModal(false);
    setEditingRecord(null);
    await fetchAllData();
  };

  // ==================== Filtering ====================
  const filteredRecords = records.filter((record) => {
    // البحث بالاسم
    const patientName = (
      record.patientId?.fullName ||
      record.patientId?.name ||
      ""
    ).toLowerCase();
    const doctorName = (
      record.doctorId?.userId?.fullname ||
      record.doctorId?.userId?.name ||
      ""
    ).toLowerCase();
    const diagnosis = (record.diagnosis || "").toLowerCase();

    const matchesSearch =
      patientName.includes(search.toLowerCase()) ||
      doctorName.includes(search.toLowerCase()) ||
      diagnosis.includes(search.toLowerCase());

    // الفلترة حسب الطبيب
    const matchesDoctor =
      doctorFilter === "" ||
      (record.doctorId?._id || record.doctorId) === doctorFilter;

    // الفلترة حسب التاريخ
    const matchesDate =
      dateFilter === "" ||
      new Date(record.createdAt).toISOString().split("T")[0] === dateFilter;

    return matchesSearch && matchesDoctor && matchesDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage) || 1;
  const displayedRecords = filteredRecords.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage,
  );

  // ==================== Loading ====================
  if (isLoading) {
    return (
      <div className="medical-records-page">
        <PageHeader />
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status"></div>
          <p>Loading medical records...</p>
        </div>
      </div>
    );
  }

  // ==================== Render ====================
  return (
    <div className="medical-records-page">
      <PageHeader />

      {/* Stats */}
      <StatsCards records={records} />

      {/* Filters */}
      <div className="filter-card">
        <div className="filter-group">
          <div className="search-wrapper">
            <i className="bi bi-search search-icon"></i>
            <input
              type="text"
              className="input-field search-input"
              placeholder="Search by patient, doctor, or diagnosis..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <select
            className="input-field select-input"
            value={doctorFilter}
            onChange={(e) => {
              setDoctorFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Doctors</option>
            {doctors.map((d) => (
              <option key={d._id || d.id} value={d._id || d.id}>
                {d.userId?.name || d.userId?.fullname || "Doctor"}
              </option>
            ))}
          </select>

          <input
            type="date"
            className="input-field"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setCurrentPage(1);
            }}
          />

          {(search || doctorFilter || dateFilter) && (
            <button
              className="btn-reset"
              onClick={() => {
                setSearch("");
                setDoctorFilter("");
                setDateFilter("");
                setCurrentPage(1);
              }}
            >
              Reset
            </button>
          )}
        </div>

        <button className="btn-add-new" onClick={handleAddNew}>
          + New Record
        </button>
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Diagnosis</th>
                <th>Date</th>
                <th>Next Visit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedRecords.length > 0 ? (
                displayedRecords.map((record, index) => (
                  <tr key={record._id}>
                    <td>
                      <span className="record-number">
                        {(currentPage - 1) * recordsPerPage + index + 1}
                      </span>
                    </td>

                    <td>
                      <div className="patient-cell">
                        <div className="patient-avatar">
                          <i className="bi bi-person-fill"></i>
                        </div>
                        <div>
                          <strong>
                            {record.patientId?.fullName ||
                              record.patientId?.name ||
                              "Deleted Patient"}
                          </strong>
                          <small>{record.patientId?.phone || "-"}</small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="doctor-cell">
                        <strong>
                          {record.doctorId?.userId?.fullname ||
                            record.doctorId?.userId?.name ||
                            "Deleted Doctor"}
                        </strong>
                        <small>{record.doctorId?.specialization || "-"}</small>
                      </div>
                    </td>

                    <td>
                      <span className="diagnosis-text">
                        {record.diagnosis?.length > 40
                          ? record.diagnosis.substring(0, 40) + "..."
                          : record.diagnosis}
                      </span>
                    </td>

                    <td>
                      <div className="date-cell">
                        <strong>
                          {new Date(record.createdAt).toLocaleDateString()}
                        </strong>
                        <small>
                          {new Date(record.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </small>
                      </div>
                    </td>

                    <td>
                      {record.nextVisit ? (
                        <span className="next-visit-badge">
                          {new Date(record.nextVisit).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="no-visit">-</span>
                      )}
                    </td>

                    <td>
                      <div className="actions-cell">
                        <button
                          className="btn-action view"
                          title="View Details"
                          onClick={() => handleView(record)}
                        >
                          <i className="bi bi-eye-fill"></i>
                        </button>
                        <button
                          className="btn-action edit"
                          title="Edit Notes"
                          onClick={() => handleEdit(record)}
                        >
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                        <button
                          className="btn-action delete"
                          title="Delete"
                          onClick={() => handleDelete(record._id)}
                        >
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state">
                    <i
                      className="bi bi-journal-x"
                      style={{ fontSize: "3rem", color: "#ccc" }}
                    ></i>
                    <p>No medical records found</p>
                    <button className="btn-add-new" onClick={handleAddNew}>
                      + Create First Record
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-bar">
            <span className="pagination-info">
              Showing {displayedRecords.length} of {filteredRecords.length}{" "}
              records
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
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <RecordModal
          patients={patients}
          doctors={doctors}
          appointments={appointments}
          editingRecord={editingRecord}
          onClose={() => {
            setShowModal(false);
            setEditingRecord(null);
          }}
          onSave={handleSaveComplete}
        />
      )}

      {/* View Modal */}
      {showViewModal && viewingRecord && (
        <ViewRecordModal
          record={viewingRecord}
          onClose={() => {
            setShowViewModal(false);
            setViewingRecord(null);
          }}
        />
      )}
    </div>
  );
}
