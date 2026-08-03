import React, { useState, useEffect } from "react";
import { getMedicalRecords } from "@/services/api";

export default function PatientMedicalSection({ patients, onDeletePatient }) {
  const [activeTab, setActiveTab] = useState("records");
  const [records, setRecords] = useState([]);

  useEffect(() => {
    if (activeTab === "records") {
      fetchRecords();
    }
  }, [activeTab]);

  const fetchRecords = async () => {
    try {
      const res = await getMedicalRecords();
      if (res?.data?.data) {
        setRecords(res.data.data);
      }
    } catch (err) {
      console.log("Error fetching records");
    }
  };

  return (
    <div className="section-tabs-container">
      <div className="tabs-header-spaced">
        <button
          className={`tab-btn-spaced ${activeTab === "records" ? "active" : ""}`}
          onClick={() => setActiveTab("records")}
        >
          <i className="bi bi-file-earmark-medical"></i> Medical Records
        </button>
        <button
          className={`tab-btn-spaced ${activeTab === "labs" ? "active" : ""}`}
          onClick={() => setActiveTab("labs")}
        >
          <i className="bi bi-droplet"></i> Laboratory Tests
        </button>
        <button
          className={`tab-btn-spaced ${activeTab === "radiology" ? "active" : ""}`}
          onClick={() => setActiveTab("radiology")}
        >
          <i className="bi bi-activity"></i> Radiology & X-Rays
        </button>
      </div>

      <div className="table-responsive">
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
              {records.length > 0
                ? records.map((item, index) => (
                    <tr key={item._id || index}>
                      <td>{index + 1}</td>
                      <td>
                        <strong>
                          {item.patientId?.fullName ||
                            item.patientName ||
                            "N/A"}
                        </strong>
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
                          <button className="btn-action edit">
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn-action delete"
                            onClick={() => onDeletePatient(item._id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                : patients.map((p, index) => (
                    <tr key={p._id || index}>
                      <td>{index + 1}</td>
                      <td>
                        <strong>{p.fullName}</strong>
                      </td>
                      <td>{p.medicalNotes || "Dental pain"}</td>
                      <td>Acute Pulpitis</td>
                      <td>Root Canal Treatment</td>
                      <td>Follow up in 2 weeks</td>
                      <td>2026-08-10</td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-action edit">
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn-action delete"
                            onClick={() => onDeletePatient(p._id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        )}

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
              {patients.map((p, index) => (
                <tr key={p._id || index}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{p.fullName}</strong>
                  </td>
                  <td>Complete Blood Count (CBC)</td>
                  <td>Normal</td>
                  <td>2026-08-01</td>
                  <td>
                    <span className="status-pill completed">Completed</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-action edit">
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn-action delete"
                        onClick={() => onDeletePatient(p._id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

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
              {patients.map((p, index) => (
                <tr key={p._id || index}>
                  <td>{index + 1}</td>
                  <td>
                    <strong>{p.fullName}</strong>
                  </td>
                  <td>Panoramic Dental X-Ray</td>
                  <td>Lower Left Molar Caries</td>
                  <td>2026-08-02</td>
                  <td>
                    <span className="status-pill completed">Completed</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-action edit">
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn-action delete"
                        onClick={() => onDeletePatient(p._id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
