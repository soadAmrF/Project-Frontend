import React, { useState } from "react";

export default function EditAppointmentModal({
  appointment,
  onClose,
  onSaveSuccess,
}) {
  const [patientName, setPatientName] = useState(
    appointment.patientId?.name || appointment.patientName || "",
  );
  const [doctorName, setDoctorName] = useState(
    appointment.doctorId?.name || appointment.doctorName || "",
  );

  const initialDate = new Date(appointment.dateAndTime)
    .toISOString()
    .split("T")[0];
  const initialTime = new Date(appointment.dateAndTime)
    .toTimeString()
    .substring(0, 5);

  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime);
  const [reason, setReason] = useState(appointment.reason || "");
  const [status, setStatus] = useState(appointment.status || "scheduled");

  const handleSubmit = (e) => {
    e.preventDefault();

    const combinedDateAndTime = new Date(`${date}T${time}`).toISOString();

    const updatedData = {
      ...appointment,
      patientId: {
        ...appointment.patientId,
        name: patientName,
      },
      doctorId: {
        ...appointment.doctorId,
        name: doctorName,
      },
      dateAndTime: combinedDateAndTime,
      reason,
      status,
    };

    onSaveSuccess(updatedData);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Appointment</h3>

        <form onSubmit={handleSubmit}>
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
            <label>Doctor Name</label>
            <input
              type="text"
              className="input-field"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
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
              type="time"
              className="input-field"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Reason</label>
            <input
              type="text"
              className="input-field"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              className="input-field"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="missed">Missed</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-reset" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-add-new">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
