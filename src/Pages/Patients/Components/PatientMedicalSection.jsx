import React, { useEffect, useState } from "react";
import { getMedicalRecords } from "@/services/api";

export default function PatientMedicalSection({
  patients = [],
  allPatients = [],
  onDeletePatient,
  onEditPatient,
  isLoading,
  activeTab,
  setActiveTab,
}) {
  const [records, setRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(false);

  // ==================== Get Medical Records ====================

  const fetchRecords = async () => {
    setRecordsLoading(true);

    try {
      const res = await getMedicalRecords();

      const data = res?.data?.data || res?.data || [];

      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching medical records:", err);
      setRecords([]);
    } finally {
      setRecordsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // ==================== Loading ====================

  if (isLoading || recordsLoading) {
    return (
      <div className="section-tabs-container">
        <div className="empty-table">
          <i className="bi bi-hourglass-split"></i>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // ==================== Patient Name ====================

  const getPatientName = (item) => {
    return (
      item?.patientId?.fullName ||
      item?.patientName ||
      item?.fullName ||
      item?.name ||
      "N/A"
    );
  };

  // ==================== Patient ID ====================

  const getPatientId = (item) => {
    return item?.patientId?._id || item?.patientId?.id || item?._id || item?.id;
  };

  // ==================== Render ====================

  return (
    <div className="section-tabs-container">
      {/* ==================== Tabs ==================== */}

      <div className="tabs-header-spaced">
        <button
          type="button"
          className={`tab-btn-spaced ${
            activeTab === "records" ? "active" : ""
          }`}
          onClick={() => setActiveTab("records")}
        >
          <i className="bi bi-file-earmark-medical"></i>
          Medical Records
        </button>

        <button
          type="button"
          className={`tab-btn-spaced ${activeTab === "labs" ? "active" : ""}`}
          onClick={() => setActiveTab("labs")}
        >
          <i className="bi bi-eyedropper"></i>
          Laboratory Tests
        </button>

        <button
          type="button"
          className={`tab-btn-spaced ${
            activeTab === "radiology" ? "active" : ""
          }`}
          onClick={() => setActiveTab("radiology")}
        >
          <i className="bi bi-x-ray"></i>
          Radiology & X-Rays
        </button>
      </div>

      {/* ==================== Table ==================== */}

      <div className="table-responsive">
        {/* ===================================================== */}
        {/* MEDICAL RECORDS */}
        {/* ===================================================== */}

        {activeTab === "records" && (
          <table className="custom-table">
            <thead>
              <tr>
                <th># ID</th>
                <th>PATIENT</th>
                <th>CHIEF COMPLAINT</th>
                <th>DIAGNOSIS</th>
                <th>TREATMENT PLAN</th>
                <th>NOTES</th>
                <th>NEXT VISIT</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {records.length > 0 ? (
                records.map((item, index) => {
                  const patientId = getPatientId(item);

                  return (
                    <tr key={item._id || item.id || index}>
                      <td>{index + 1}</td>

                      <td>
                        <strong>{getPatientName(item)}</strong>
                      </td>

                      <td>{item.chiefComplaint || "-"}</td>

                      <td>{item.diagnosis || "-"}</td>

                      <td>{item.treatmentPlan || "-"}</td>

                      <td>{item.notes || "-"}</td>

                      <td>
                        {item.nextVisit
                          ? new Date(item.nextVisit).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="btn-action edit"
                            onClick={() => onEditPatient?.(item)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>

                          <button
                            type="button"
                            className="btn-action delete"
                            onClick={() => onDeletePatient?.(patientId)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : patients.length > 0 ? (
                patients.map((patient, index) => (
                  <tr key={patient._id || patient.id || index}>
                    <td>{index + 1}</td>

                    <td>
                      <strong>
                        {patient.fullName || patient.name || "N/A"}
                      </strong>
                    </td>

                    <td>{patient.medicalNotes || "-"}</td>

                    <td>-</td>

                    <td>-</td>

                    <td>-</td>

                    <td>-</td>

                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="btn-action edit"
                          onClick={() => onEditPatient?.(patient)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>

                        <button
                          type="button"
                          className="btn-action delete"
                          onClick={() =>
                            onDeletePatient?.(patient._id || patient.id)
                          }
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-table">
                    <i className="bi bi-search"></i>
                    No patients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* ===================================================== */}
        {/* LABORATORY */}
        {/* ===================================================== */}

        {activeTab === "labs" && (
          <table className="custom-table">
            <thead>
              <tr>
                <th># ID</th>
                <th>PATIENT</th>
                <th>TEST NAME</th>
                <th>RESULT</th>
                <th>DATE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {patients.length > 0 ? (
                patients.map((patient, index) => (
                  <tr key={patient._id || patient.id || index}>
                    <td>{index + 1}</td>

                    <td>
                      <strong>
                        {patient.fullName || patient.name || "N/A"}
                      </strong>
                    </td>

                    <td>{patient.testName || "Complete Blood Count (CBC)"}</td>

                    <td>{patient.result || "Normal"}</td>

                    <td>
                      {patient.testDate
                        ? new Date(patient.testDate).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>
                      <span
                        className={`status-pill ${
                          patient.testStatus === "Pending"
                            ? "pending"
                            : "completed"
                        }`}
                      >
                        {patient.testStatus || "Completed"}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="btn-action edit"
                          onClick={() => onEditPatient?.(patient)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>

                        <button
                          type="button"
                          className="btn-action delete"
                          onClick={() =>
                            onDeletePatient?.(patient._id || patient.id)
                          }
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-table">
                    <i className="bi bi-search"></i>
                    No patients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* ===================================================== */}
        {/* RADIOLOGY */}
        {/* ===================================================== */}

        {activeTab === "radiology" && (
          <table className="custom-table">
            <thead>
              <tr>
                <th># ID</th>
                <th>PATIENT</th>
                <th>X-RAY TYPE</th>
                <th>FINDINGS</th>
                <th>DATE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {patients.length > 0 ? (
                patients.map((patient, index) => (
                  <tr key={patient._id || patient.id || index}>
                    <td>{index + 1}</td>

                    <td>
                      <strong>
                        {patient.fullName || patient.name || "N/A"}
                      </strong>
                    </td>

                    <td>{patient.xrayType || "Panoramic Dental X-Ray"}</td>

                    <td>{patient.findings || "No findings"}</td>

                    <td>
                      {patient.xrayDate
                        ? new Date(patient.xrayDate).toLocaleDateString()
                        : "-"}
                    </td>

                    <td>
                      <span
                        className={`status-pill ${
                          patient.xrayStatus === "Pending"
                            ? "pending"
                            : "completed"
                        }`}
                      >
                        {patient.xrayStatus || "Completed"}
                      </span>
                    </td>

                    <td>
                      <div className="action-buttons">
                        <button
                          type="button"
                          className="btn-action edit"
                          onClick={() => onEditPatient?.(patient)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>

                        <button
                          type="button"
                          className="btn-action delete"
                          onClick={() =>
                            onDeletePatient?.(patient._id || patient.id)
                          }
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-table">
                    <i className="bi bi-search"></i>
                    No patients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
