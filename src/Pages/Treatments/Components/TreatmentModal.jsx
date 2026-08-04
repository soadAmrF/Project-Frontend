import React, { useState, useEffect } from "react";

const initialForm = {
  patientName: "",
  medicineName: "",
  dosage: "",
  duration: "",
  instructions: "",
  status: "active",
};

export default function TreatmentModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}) {
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    setFormData(initialData || initialForm);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const fields = [
    { name: "patientName", label: "Patient Name", req: true },
    { name: "medicineName", label: "Medicine Name", req: true },
    { name: "dosage", label: "Dosage", req: true },
    { name: "duration", label: "Duration", req: true },
    { name: "instructions", label: "Instructions", req: false },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>{initialData ? "Edit Treatment" : "Add Treatment"}</h3>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          {fields.map((f) => (
            <div key={f.name} className="form-group">
              <label>{f.label}</label>
              <input
                type="text"
                name={f.name}
                className="form-control"
                value={formData[f.name] || ""}
                onChange={handleChange}
                required={f.req}
              />
            </div>
          ))}

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              className="form-control"
              value={formData.status || "active"}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
