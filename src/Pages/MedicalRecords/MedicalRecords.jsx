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
    xrays: editingRecord?.xrays || [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.patientId) {
      newErrors.patientId = "Patient is required";
    }

    if (!formData.doctorId) {
      newErrors.doctorId = "Doctor is required";
    }

    if (!formData.appointmentId) {
      newErrors.appointmentId = "Appointment is required";
    }

    if (!formData.chiefComplaint.trim()) {
      newErrors.chiefComplaint = "Chief complaint is required";
    }

    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = "Diagnosis is required";
    }

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
        await updateMedicalRecordNotes(editingRecord._id, {
          notes: formData.notes,
          treatmentPlan: formData.treatmentPlan,
          prescription: formData.prescription,
          xrays: formData.xrays,
        });
      } else {
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

  const handleAddPrescription = () => {
    setFormData((prev) => ({
      ...prev,
      prescription: [
        ...prev.prescription,
        {
          medicineName: "",
          dosage: "",
          duration: "",
          instructions: "",
        },
      ],
    }));
  };

  const handlePrescriptionChange = (index, field, value) => {
    const updated = [...formData.prescription];

    updated[index][field] = value;

    setFormData((prev) => ({
      ...prev,
      prescription: updated,
    }));
  };

  const handleRemovePrescription = (index) => {
    setFormData((prev) => ({
      ...prev,
      prescription: prev.prescription.filter((_, i) => i !== index),
    }));
  };

  const handleAddXray = () => {
    setFormData((prev) => ({
      ...prev,
      xrays: [
        ...prev.xrays,
        {
          xrayType: "",
          status: "Pending",
          price: 0,
          notes: "",
        },
      ],
    }));
  };

  const handleXrayChange = (index, field, value) => {
    const updated = [...formData.xrays];

    updated[index][field] = value;

    setFormData((prev) => ({
      ...prev,
      xrays: updated,
    }));
  };

  const handleRemoveXray = (index) => {
    setFormData((prev) => ({
      ...prev,
      xrays: prev.xrays.filter((_, i) => i !== index),
    }));
  };

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
          <div className="modal-title">
            <div className="modal-title-icon">
              <i className="bi bi-journal-plus"></i>
            </div>

            <div>
              <h2>
                {editingRecord ? "Edit Medical Record" : "New Medical Record"}
              </h2>

              <p>
                {editingRecord
                  ? "Update medical record information"
                  : "Create a new medical record"}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-section-title">
              <i className="bi bi-person-vcard"></i>
              <span>Basic Information</span>
            </div>

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
          </div>

          <div className="form-section">
            <div className="form-section-title">
              <i className="bi bi-heart-pulse"></i>
              <span>Medical Information</span>
            </div>

            <div className="field">
              <label>Chief Complaint *</label>

              <textarea
                name="chiefComplaint"
                rows="3"
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
                rows="3"
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

            <div className="form-row">
              <div className="field">
                <label>Treatment Plan</label>

                <textarea
                  name="treatmentPlan"
                  rows="3"
                  value={formData.treatmentPlan}
                  onChange={handleChange}
                  placeholder="Planned treatment..."
                />
              </div>

              <div className="field">
                <label>Notes</label>

                <textarea
                  name="notes"
                  rows="3"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Additional notes..."
                />
              </div>
            </div>

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

          <div className="section-box">
            <div className="section-header">
              <div className="section-heading">
                <div className="section-icon prescription-icon">
                  <i className="bi bi-capsule"></i>
                </div>

                <div>
                  <h4>Prescription</h4>
                  <span>Add prescribed medicines</span>
                </div>
              </div>

              <button
                type="button"
                className="btn-add-section"
                onClick={handleAddPrescription}
                disabled={!!editingRecord}
              >
                <i className="bi bi-plus-lg"></i>
                <span>Add Medicine</span>
              </button>
            </div>

            {formData.prescription.length === 0 && (
              <div className="empty-section">
                <i className="bi bi-capsule"></i>
                <p>No medicines added yet</p>
              </div>
            )}

            {formData.prescription.map((med, idx) => (
              <div key={idx} className="dynamic-row">
                <div className="field">
                  <label>Medicine Name</label>

                  <input
                    type="text"
                    value={med.medicineName}
                    onChange={(e) =>
                      handlePrescriptionChange(
                        idx,
                        "medicineName",
                        e.target.value,
                      )
                    }
                    disabled={!!editingRecord}
                    placeholder="e.g. Panadol"
                  />
                </div>

                <div className="field">
                  <label>Dosage</label>

                  <input
                    type="text"
                    value={med.dosage}
                    onChange={(e) =>
                      handlePrescriptionChange(idx, "dosage", e.target.value)
                    }
                    disabled={!!editingRecord}
                    placeholder="e.g. 500mg"
                  />
                </div>

                <div className="field">
                  <label>Duration</label>

                  <input
                    type="text"
                    value={med.duration}
                    onChange={(e) =>
                      handlePrescriptionChange(idx, "duration", e.target.value)
                    }
                    disabled={!!editingRecord}
                    placeholder="e.g. 7 days"
                  />
                </div>

                <div className="field">
                  <label>Instructions</label>

                  <input
                    type="text"
                    value={med.instructions}
                    onChange={(e) =>
                      handlePrescriptionChange(
                        idx,
                        "instructions",
                        e.target.value,
                      )
                    }
                    disabled={!!editingRecord}
                    placeholder="e.g. After meals"
                  />
                </div>

                {!editingRecord && (
                  <button
                    type="button"
                    className="btn-action delete dynamic-delete"
                    onClick={() => handleRemovePrescription(idx)}
                    title="Remove medicine"
                  >
                    <i className="bi bi-trash-fill"></i>
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="section-box">
            <div className="section-header">
              <div className="section-heading">
                <div className="section-icon xray-icon">
                  <i className="bi bi-image"></i>
                </div>

                <div>
                  <h4>X-Rays</h4>
                  <span>Add X-Ray requests</span>
                </div>
              </div>

              <button
                type="button"
                className="btn-add-section"
                onClick={handleAddXray}
                disabled={!!editingRecord}
              >
                <i className="bi bi-plus-lg"></i>
                <span>Add X-Ray</span>
              </button>
            </div>

            {formData.xrays.length === 0 && (
              <div className="empty-section">
                <i className="bi bi-image"></i>
                <p>No X-rays added yet</p>
              </div>
            )}

            {formData.xrays.map((xray, idx) => (
              <div key={idx} className="dynamic-row xray-row">
                <div className="field">
                  <label>X-Ray Type</label>

                  <input
                    type="text"
                    value={xray.xrayType}
                    onChange={(e) =>
                      handleXrayChange(idx, "xrayType", e.target.value)
                    }
                    disabled={!!editingRecord}
                    placeholder="e.g. Dental X-Ray"
                  />
                </div>

                <div className="field">
                  <label>Price</label>

                  <input
                    type="number"
                    value={xray.price}
                    onChange={(e) =>
                      handleXrayChange(idx, "price", Number(e.target.value))
                    }
                    disabled={!!editingRecord}
                    placeholder="0"
                  />
                </div>

                <div className="field">
                  <label>Status</label>

                  <select
                    value={xray.status}
                    onChange={(e) =>
                      handleXrayChange(idx, "status", e.target.value)
                    }
                    disabled={!!editingRecord}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="field">
                  <label>Notes</label>

                  <input
                    type="text"
                    value={xray.notes}
                    onChange={(e) =>
                      handleXrayChange(idx, "notes", e.target.value)
                    }
                    disabled={!!editingRecord}
                    placeholder="Optional notes..."
                  />
                </div>

                {!editingRecord && (
                  <button
                    type="button"
                    className="btn-action delete dynamic-delete"
                    onClick={() => handleRemoveXray(idx)}
                    title="Remove X-ray"
                  >
                    <i className="bi bi-trash-fill"></i>
                  </button>
                )}
              </div>
            ))}
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

function ViewRecordModal({ record, onClose }) {
  if (!record) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card modal-large"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title">
            <div className="modal-title-icon">
              <i className="bi bi-journal-medical"></i>
            </div>

            <div>
              <h2>Medical Record Details</h2>
              <p>Complete medical record information</p>
            </div>
          </div>

          <button
            type="button"
            className="btn-close"
            onClick={onClose}
            aria-label="Close"
          ></button>
        </div>

        <div className="record-details">
          <div className="details-section">
            <h3>
              <i className="bi bi-people-fill"></i>
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

          <div className="details-section">
            <h3>
              <i className="bi bi-heart-pulse-fill"></i>
              Medical Information
            </h3>

            <div className="detail-block">
              <label>Chief Complaint</label>
              <p>{record.chiefComplaint || "-"}</p>
            </div>

            <div className="detail-block">
              <label>Diagnosis</label>
              <p>{record.diagnosis || "-"}</p>
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

          {record.prescription && record.prescription.length > 0 && (
            <div className="details-section">
              <h3>
                <i className="bi bi-capsule"></i>
                Prescription ({record.prescription.length} medicines)
              </h3>

              <ul className="prescription-list">
                {record.prescription.map((item, idx) => (
                  <li key={idx}>
                    <strong>{item.medicineName || "Medicine"}</strong>

                    <span className="prescription-detail">
                      {item.dosage || "-"} • {item.duration || "-"}
                    </span>

                    {item.instructions && (
                      <small className="prescription-instructions">
                        <i className="bi bi-info-circle"></i>{" "}
                        {item.instructions}
                      </small>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {record.xrays && record.xrays.length > 0 && (
            <div className="details-section">
              <h3>
                <i className="bi bi-image"></i>
                X-Rays ({record.xrays.length})
              </h3>

              <ul className="xray-list">
                {record.xrays.map((xray, idx) => (
                  <li key={idx}>
                    <div className="xray-header">
                      <strong>{xray.xrayType || "X-Ray"}</strong>

                      <span
                        className={`xray-status status-${xray.status?.toLowerCase()}`}
                      >
                        {xray.status}
                      </span>
                    </div>

                    <div className="xray-info">
                      <span>
                        <i className="bi bi-cash-stack"></i>
                        Price: {xray.price || 0}
                      </span>
                    </div>

                    {xray.notes && (
                      <small className="xray-notes">
                        <i className="bi bi-sticky"></i> {xray.notes}
                      </small>
                    )}

                    {xray.image && (
                      <a
                        href={xray.image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="xray-image-link"
                      >
                        <i className="bi bi-image"></i>
                        View Image
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="details-section">
            <h3>
              <i className="bi bi-calendar-fill"></i>
              Dates
            </h3>

            <div className="details-grid">
              <div className="detail-item">
                <label>Created At</label>
                <span>
                  {record.createdAt
                    ? new Date(record.createdAt).toLocaleString()
                    : "-"}
                </span>
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

export default function MedicalRecords() {
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

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
    if (!window.confirm("Are you sure you want to delete this record?")) {
      return;
    }

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

  const filteredRecords = records.filter((record) => {
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

    const searchValue = search.toLowerCase();

    const matchesSearch =
      patientName.includes(searchValue) ||
      doctorName.includes(searchValue) ||
      diagnosis.includes(searchValue);

    const matchesDoctor =
      doctorFilter === "" ||
      (record.doctorId?._id || record.doctorId) === doctorFilter;

    const matchesDate =
      dateFilter === "" ||
      new Date(record.createdAt).toISOString().split("T")[0] === dateFilter;

    return matchesSearch && matchesDoctor && matchesDate;
  });

  const totalPages = Math.ceil(filteredRecords.length / recordsPerPage) || 1;

  const displayedRecords = filteredRecords.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage,
  );

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

  return (
    <div className="medical-records-page">
      <PageHeader />

      <StatsCards records={records} />

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
            className="input-field date-filter"
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
              <i className="bi bi-arrow-counterclockwise"></i>
              Reset
            </button>
          )}
        </div>

        <button className="btn-add-new" onClick={handleAddNew}>
          <i className="bi bi-plus-lg"></i>
          New Record
        </button>
      </div>

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

                        <div className="person-info">
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
                        <div className="person-info">
                          <strong>
                            {record.doctorId?.userId?.fullname ||
                              record.doctorId?.userId?.name ||
                              "Deleted Doctor"}
                          </strong>

                          <small>
                            {record.doctorId?.specialization || "-"}
                          </small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="diagnosis-text">
                        {record.diagnosis?.length > 40
                          ? record.diagnosis.substring(0, 40) + "..."
                          : record.diagnosis || "-"}
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
                          <i className="bi bi-calendar-event"></i>
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
                    <div className="empty-state-icon">
                      <i className="bi bi-journal-x"></i>
                    </div>

                    <h4>No medical records found</h4>

                    <p>There are no records matching your current filters.</p>

                    <button className="btn-add-new" onClick={handleAddNew}>
                      <i className="bi bi-plus-lg"></i>
                      Create First Record
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
                <i className="bi bi-chevron-left"></i>
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
                <i className="bi bi-chevron-right"></i>
              </button>
            </div>
          </div>
        )}
      </div>

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
