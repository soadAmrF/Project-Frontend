import React from "react";

export default function AppointmentStats({ appointments }) {
  const scheduledCount = appointments.filter(
    (a) => a.status === "scheduled",
  ).length;
  const completedCount = appointments.filter(
    (a) => a.status === "completed",
  ).length;
  const cancelledCount = appointments.filter(
    (a) => a.status === "cancelled",
  ).length;

  return (
    <div className="stats-grid">
      <div className="stat-card blue">
        <div className="stat-icon-wrapper blue-bg">
          <i className="bi bi-people-fill"></i>
        </div>
        <div className="stat-info">
          <span>Total Appointments</span>
          <h3>{appointments.length}</h3>
        </div>
      </div>
      <div className="stat-card green">
        <div className="stat-icon-wrapper green-bg">
          <i className="bi bi-person-plus-fill"></i>
        </div>
        <div className="stat-info">
          <span>Scheduled</span>
          <h3>{scheduledCount}</h3>
        </div>
      </div>
      <div className="stat-card orange">
        <div className="stat-icon-wrapper orange-bg">
          <i className="bi bi-person-check-fill"></i>
        </div>
        <div className="stat-info">
          <span>Completed</span>
          <h3>{completedCount}</h3>
        </div>
      </div>
      <div className="stat-card red">
        <div className="stat-icon-wrapper purple-bg">
          <i className="bi bi-person-x-fill"></i>
        </div>
        <div className="stat-info">
          <span>Cancelled</span>
          <h3>{cancelledCount}</h3>
        </div>
      </div>
    </div>
  );
}
