import React, { useState } from "react";
import { addPatient } from "@/services/api";

export default function PatientModal({ onClose, onSaveSuccess }) {
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "male",
    phone: "",
    bloodGroup: "",
    medicalNotes: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (formData.fullName.length < 10 || formData.fullName.length > 30) {
      setErrorMsg("Full Name must be between 10 and 30 characters.");
      return;
    }

    if (!formData.phone) {
      setErrorMsg("Phone number is required.");
      return;
    }

    setLoading(true);

    try {
      const res = await addPatient(formData);
      onSaveSuccess(res.data?.data || formData);
      onClose();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Failed to add patient");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-card">
        <div className="modal-header">
          <h3>+ Add New Patient</h3>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>

        {errorMsg && <div className="alert-error">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Full Name * (10-30 chars)</label>
            <input
              type="text"
              name="fullName"
              placeholder="e.g. Assem Monir Mahmoud"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="number"
                name="phone"
                placeholder="01123456789"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
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

          <div className="form-group">
            <label>Blood Group</label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
            >
              <option value="">Select Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          <div className="form-group">
            <label>Medical Notes</label>
            <textarea
              name="medicalNotes"
              rows="3"
              placeholder="Any medical notes or allergies..."
              value={formData.medicalNotes}
              onChange={handleChange}
              maxLength={50}
            ></textarea>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? "Saving..." : "Save Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
