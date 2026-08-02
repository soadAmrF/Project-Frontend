import React, { useState } from "react";
import PageHeader from "@/components/PageHeader";
import "./Patients.css";

const INITIAL_PATIENTS = [
  {
    id: "#PT-1001",
    name: "Ahmed Mohammed",
    phone: "01012345678",
    type: "Medical Record",
    doctor: "Dr. Mostafa Ali",
    diagnosis: "Root Canal",
    status: "Waiting",
  },
  {
    id: "#PT-1002",
    name: "Yassin Ali",
    phone: "01198765432",
    type: "Medical Record",
    doctor: "Dr. Ahmed Refaat",
    diagnosis: "Checkup",
    status: "In Progress",
  },
  {
    id: "#PT-1003",
    name: "Ahlam Salah",
    phone: "01255544332",
    type: "X-Ray",
    xrayType: "Panoramic",
    targetArea: "Upper Jaw",
    status: "Waiting",
  },
  {
    id: "#PT-1004",
    name: "Tareq Salim",
    phone: "01511223344",
    type: "X-Ray",
    xrayType: "Periapical",
    targetArea: "Tooth #14",
    status: "In Progress",
  },
  {
    id: "#PT-1005",
    name: "Nada Monir",
    phone: "01077889900",
    type: "Analysis",
    testName: "CBC Test",
    testResult: "13.5 g/dL",
    status: "Completed",
  },
];

const EMPTY_FORM = {
  name: "",
  phone: "",
  status: "Waiting",
  type: "Medical Record",
  doctor: "",
  diagnosis: "",
  xrayType: "",
  targetArea: "",
  testName: "",
  testResult: "",
};

export default function Patients() {
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem("smilesuite_patients_v6");
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [activeTab, setActiveTab] = useState("Medical Record");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const saveToStorage = (data) => {
    setPatients(data);
    localStorage.setItem("smilesuite_patients_v6", JSON.stringify(data));
  };

  const filteredPatients = patients.filter((p) => {
    const query = search.trim().toLowerCase();
    const matchSearch =
      !query ||
      [
        p.name,
        p.phone,
        p.id,
        p.doctor,
        p.diagnosis,
        p.xrayType,
        p.testName,
      ].some((item) => item?.toString().toLowerCase().includes(query));
    const matchStatus = !statusFilter || p.status === statusFilter;
    const matchTab = query ? true : p.type === activeTab;
    return matchSearch && matchStatus && matchTab;
  });

  const handleOpenModal = (patient = null) => {
    if (patient) {
      setEditId(patient.id);
      setFormData(patient);
    } else {
      setEditId(null);
      setFormData({ ...EMPTY_FORM, type: activeTab });
    }
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editId) {
      saveToStorage(
        patients.map((p) => (p.id === editId ? { ...p, ...formData } : p)),
      );
    } else {
      const newPatient = {
        id: `#PT-${Math.floor(1000 + Math.random() * 9000)}`,
        ...formData,
      };
      saveToStorage([newPatient, ...patients]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    saveToStorage(patients.filter((p) => p.id !== id));
  };

  const renderTabColumns = (row) => {
    if (activeTab === "Medical Record") {
      return (
        <>
          <td className="center-text">REC-{row.id.replace("#PT-", "")}</td>
          <td className="center-text">{row.doctor || "Dr. Mostafa Ali"}</td>
          <td className="center-text">{row.diagnosis || "-"}</td>
        </>
      );
    }
    if (activeTab === "X-Ray") {
      return (
        <>
          <td className="center-text">{row.xrayType || "Panoramic"}</td>
          <td className="center-text">{row.targetArea || "Upper Jaw"}</td>
        </>
      );
    }
    return (
      <>
        <td className="center-text">{row.testName || "CBC Test"}</td>
        <td className="center-text">{row.testResult || "Normal"}</td>
      </>
    );
  };

  return (
    <div className="patients-page">
      <PageHeader title="Patients" breadcrumb="Home / Patients" />

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue-bg">
            <i className="bi bi-people-fill"></i>
          </div>
          <div className="stat-info">
            <span className="stat-title">Total Patients</span>
            <div className="stat-value-group">
              <h3 className="stat-number">{patients.length}</h3>
              <small className="stat-subtitle">All Time</small>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper green-bg">
            <i className="bi bi-person-plus-fill"></i>
          </div>
          <div className="stat-info">
            <span className="stat-title">New Patients</span>
            <div className="stat-value-group">
              <h3 className="stat-number">28</h3>
              <small className="stat-subtitle">This Month</small>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper orange-bg">
            <i className="bi bi-cake2-fill"></i>
          </div>
          <div className="stat-info">
            <span className="stat-title">Today's Birthdays</span>
            <div className="stat-value-group">
              <h3 className="stat-number">3</h3>
              <small className="stat-subtitle">Today</small>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper purple-bg">
            <i className="bi bi-person-check-fill"></i>
          </div>
          <div className="stat-info">
            <span className="stat-title">Active Patients</span>
            <div className="stat-value-group">
              <h3 className="stat-number">
                {patients.filter((p) => p.status !== "Completed").length}
              </h3>
              <small className="stat-subtitle">Currently</small>
            </div>
          </div>
        </div>
      </div>

      <div className="filter-card">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search by name, phone, diagnosis..."
            className="input-field search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="input-field select-input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Waiting">Waiting</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <button
            className="btn-reset"
            onClick={() => {
              setSearch("");
              setStatusFilter("");
            }}
          >
            Reset Data
          </button>
        </div>
        <button className="btn-add-new" onClick={() => handleOpenModal()}>
          + Add Patient
        </button>
      </div>

      <div className="tabs-space-bar">
        <button
          className={`tab-btn-item ${activeTab === "Medical Record" ? "active" : ""}`}
          onClick={() => setActiveTab("Medical Record")}
        >
          📋 Medical Record (السجل الطبي)
        </button>
        <button
          className={`tab-btn-item ${activeTab === "X-Ray" ? "active" : ""}`}
          onClick={() => setActiveTab("X-Ray")}
        >
          🦴 X-Ray (الأشعة)
        </button>
        <button
          className={`tab-btn-item ${activeTab === "Analysis" ? "active" : ""}`}
          onClick={() => setActiveTab("Analysis")}
        >
          🧪 Lab Tests (التحاليل)
        </button>
      </div>

      <div className="table-card table-responsive">
        <table className="custom-table">
          <thead>
            <tr>
              <th className="center-text"># ID</th>
              <th className="left-text">اسم المريض</th>
              <th className="center-text">الهاتف</th>
              {activeTab === "Medical Record" && (
                <>
                  <th className="center-text">كود السجل</th>
                  <th className="center-text">الطبيب المعالج</th>
                  <th className="center-text">التشخيص / الخدمة</th>
                </>
              )}
              {activeTab === "X-Ray" && (
                <>
                  <th className="center-text">نوع الأشعة</th>
                  <th className="center-text">المنطقة المستهدفة</th>
                </>
              )}
              {activeTab === "Analysis" && (
                <>
                  <th className="center-text">اسم التحليل</th>
                  <th className="center-text">النتيجة / القيمة</th>
                </>
              )}
              <th className="center-text">الحالة</th>
              <th className="center-text">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length ? (
              filteredPatients.map((row) => (
                <tr key={row.id}>
                  <td className="font-bold center-text">{row.id}</td>
                  <td>
                    <div className="patient-user-cell">
                      <div className="patient-icon-avatar">
                        <i className="bi bi-person-fill"></i>
                      </div>
                      <span className="patient-name">{row.name}</span>
                    </div>
                  </td>
                  <td className="center-text ltr-dir">{row.phone}</td>
                  {renderTabColumns(row)}
                  <td className="center-text">
                    <span
                      className={`status-pill ${row.status.toLowerCase().replace(" ", "-")}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="center-text">
                    <div className="actions-cell">
                      <button className="action-btn view-btn" title="View">
                        <i className="bi bi-eye"></i>
                      </button>
                      <button
                        className="action-btn edit-btn"
                        title="Edit"
                        onClick={() => handleOpenModal(row)}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        className="action-btn delete-btn"
                        title="Delete"
                        onClick={() => handleDelete(row.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="empty-msg">
                  لا توجد نتائج مطابقة
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h3 className="modal-title">
                  {editId ? "Edit Patient Record" : "Add New Patient Record"}
                </h3>
                <p className="modal-subtitle">
                  Enter details to save to the system
                </p>
              </div>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="modal-form">
              <div className="flex-row">
                <div className="form-group">
                  <label>Patient Name *</label>
                  <input
                    type="text"
                    required
                    className="styled-input"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="text"
                    required
                    className="styled-input"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex-row">
                <div className="form-group">
                  <label>Category / Type</label>
                  <select
                    className="styled-input"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
                    <option value="Medical Record">
                      📋 Medical Record (سجل طبي)
                    </option>
                    <option value="X-Ray">🦴 X-Ray (أشعة)</option>
                    <option value="Analysis">🧪 Lab Tests (تحاليل)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    className="styled-input"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="Waiting">Waiting</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              {formData.type === "Medical Record" && (
                <div className="flex-row">
                  <div className="form-group">
                    <label>Doctor Name</label>
                    <input
                      type="text"
                      className="styled-input"
                      value={formData.doctor}
                      onChange={(e) =>
                        setFormData({ ...formData, doctor: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Diagnosis</label>
                    <input
                      type="text"
                      className="styled-input"
                      value={formData.diagnosis}
                      onChange={(e) =>
                        setFormData({ ...formData, diagnosis: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              {formData.type === "X-Ray" && (
                <div className="flex-row">
                  <div className="form-group">
                    <label>X-Ray Type</label>
                    <input
                      type="text"
                      className="styled-input"
                      value={formData.xrayType}
                      onChange={(e) =>
                        setFormData({ ...formData, xrayType: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Target Area</label>
                    <input
                      type="text"
                      className="styled-input"
                      value={formData.targetArea}
                      onChange={(e) =>
                        setFormData({ ...formData, targetArea: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              {formData.type === "Analysis" && (
                <div className="flex-row">
                  <div className="form-group">
                    <label>Test Name</label>
                    <input
                      type="text"
                      className="styled-input"
                      value={formData.testName}
                      onChange={(e) =>
                        setFormData({ ...formData, testName: e.target.value })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Test Result</label>
                    <input
                      type="text"
                      className="styled-input"
                      value={formData.testResult}
                      onChange={(e) =>
                        setFormData({ ...formData, testResult: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  {editId ? "Update Record" : "Save Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
