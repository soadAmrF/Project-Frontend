import React, { useState } from "react";
import { createAppointment } from "@/services/api";

export default function AppointmentModal({
  doctorsList,
  onClose,
  onSaveSuccess,
}) {
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState("scheduled");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const combinedDateAndTime = new Date(`${date}T${time}`);

    const payload = {
      patientId: "650000000000000000000000", // ID افتراضي متوافق مع ObjectId للـ Backend
      doctorId: doctorId || (doctorsList[0]?._id ?? "650000000000000000000001"),
      dateAndTime: combinedDateAndTime,
      reason: reason || "General Checkup",
      status,
    };

    const localNewItem = {
      _id: Date.now().toString(),
      patientId: { name: patientName, phone: patientPhone },
      doctorId: {
        name:
          doctorsList.find((d) => d._id === doctorId)?.name ||
          "Dr. Sarah Ahmed",
      },
      dateAndTime: combinedDateAndTime.toISOString(),
      reason: reason || "-",
      status: status,
    };

    try {
      await createAppointment(payload);
    } catch (err) {
      console.log("Backend Offline / using local update fallback");
    }

    onSaveSuccess(localNewItem);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add New Appointment</h3>
        {errorMsg && (
          <p style={{ color: "red", marginBottom: "10px" }}>{errorMsg}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Patient Name *</label>
            <input
              type="text"
              className="input-field"
              placeholder="Enter patient name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="text"
              className="input-field"
              placeholder="Enter phone number"
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Select Doctor</label>
            <select
              className="input-field"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
            >
              <option value="">Dr. Sarah Ahmed</option>
              {doctorsList.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name || doc.username}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              className="input-field"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Time *</label>
            <input
              type="time"
              className="input-field"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Reason (Max 30 chars)</label>
            <input
              type="text"
              maxLength={30}
              className="input-field"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-reset" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-add-new">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
