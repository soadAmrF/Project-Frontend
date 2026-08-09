import React, { useState, useEffect } from "react";

const FIELDS_BY_CATEGORY = {
  records: [
    {
      label: "Chief Complaint",
      name: "chiefComplaint",
    },
    {
      label: "Diagnosis",
      name: "diagnosis",
    },
    {
      label: "Treatment Plan",
      name: "treatmentPlan",
    },
    {
      label: "Notes",
      name: "notes",
      isTextarea: true,
    },
    {
      label: "Next Visit",
      name: "nextVisit",
      type: "date",
    },
  ],

  labs: [
    {
      label: "Test Name *",
      name: "testName",
      required: true,
      placeholder: "e.g. CBC",
    },
    {
      label: "Result",
      name: "result",
      placeholder: "e.g. Normal",
    },
    {
      label: "Date",
      name: "testDate",
      type: "date",
    },
    {
      label: "Status",
      name: "testStatus",
      isSelect: true,
      options: ["Completed", "Pending"],
    },
  ],

  radiology: [
    {
      label: "X-Ray Type *",
      name: "xrayType",
      required: true,
      placeholder: "e.g. Panoramic X-Ray",
    },
    {
      label: "Findings",
      name: "findings",
      placeholder: "Findings summary",
    },
    {
      label: "Date",
      name: "xrayDate",
      type: "date",
    },
    {
      label: "Status",
      name: "xrayStatus",
      isSelect: true,
      options: ["Completed", "Pending"],
    },
  ],
};

export default function PatientModal({
  patient,
  onClose,
  onSave,
  isSubmitting,
  activeTab,
}) {
  const [category, setCategory] = useState(activeTab || "records");

  const [formData, setFormData] = useState({
    patientName: "",
    phone: "",
    testStatus: "Completed",
    xrayStatus: "Completed",
  });

  // ==================== Load Patient ====================

  useEffect(() => {
    setCategory(activeTab || "records");

    if (patient) {
      setFormData({
        ...patient,

        patientName:
          patient.patientName ||
          patient.fullName ||
          patient.name ||
          patient.patientId?.fullName ||
          "",

        phone: patient.phone || patient.patientId?.phone || "",
      });
    } else {
      setFormData({
        patientName: "",
        phone: "",
        testStatus: "Completed",
        xrayStatus: "Completed",
      });
    }
  }, [patient, activeTab]);

  // ==================== Change ====================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==================== Submit ====================

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({
      ...formData,
      category,
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* ==================== Header ==================== */}

        <div className="modal-header">
          <h3>{patient ? "Edit Entry" : "Add New Entry"}</h3>

          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        {/* ==================== Form ==================== */}

        <form className="modal-form" onSubmit={handleSubmit}>
          {/* Category */}

          <div className="form-group">
            <label>Select Category / القسم</label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="records">Medical Records</option>

              <option value="labs">Laboratory Tests</option>

              <option value="radiology">Radiology & X-Rays</option>
            </select>
          </div>

          {/* Patient */}

          <div className="form-row">
            <div className="form-group">
              <label>Patient Name *</label>

              <input
                type="text"
                name="patientName"
                required
                value={formData.patientName || ""}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label>Phone *</label>

              <input
                type="text"
                name="phone"
                required
                value={formData.phone || ""}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Dynamic Fields */}

          <div className="form-row" style={{ flexWrap: "wrap" }}>
            {FIELDS_BY_CATEGORY[category]?.map((field) => (
              <div
                key={field.name}
                className="form-group"
                style={{ minWidth: "45%" }}
              >
                <label>{field.label}</label>

                {/* Select */}

                {field.isSelect ? (
                  <select
                    name={field.name}
                    value={formData[field.name] || field.options[0]}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  >
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : field.isTextarea ? (
                  /* Textarea */

                  <textarea
                    name={field.name}
                    rows="3"
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                ) : (
                  /* Input */

                  <input
                    type={field.type || "text"}
                    name={field.name}
                    required={field.required}
                    placeholder={field.placeholder || ""}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                )}
              </div>
            ))}
          </div>

          {/* ==================== Actions ==================== */}

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button type="submit" className="btn-save" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : patient ? "Update" : "Save Entry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
