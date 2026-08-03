import React from "react";

export default function PatientStats({ patients, recordsCount = 0 }) {
  const total = patients.length;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon-wrapper blue-bg">
          <i className="bi bi-people-fill"></i>
        </div>
        <div className="stat-info">
          <span>Total Patients</span>
          <h3>{total}</h3>
          <small>Registered</small>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper green-bg">
          <i className="bi bi-person-plus-fill"></i>
        </div>
        <div className="stat-info">
          <span>New Patients</span>
          <h3>{total}</h3>
          <small>This Month</small>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper orange-bg">
          <i className="bi bi-file-earmark-medical-fill"></i>
        </div>
        <div className="stat-info">
          <span>Medical Records</span>
          <h3>{recordsCount || total}</h3>
          <small>Total Files</small>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon-wrapper purple-bg">
          <i className="bi bi-calendar-event-fill"></i>
        </div>
        <div className="stat-info">
          <span>Upcoming Visits</span>
          <h3>{total}</h3>
          <small>Follow-ups</small>
        </div>
      </div>
    </div>
  );
}
