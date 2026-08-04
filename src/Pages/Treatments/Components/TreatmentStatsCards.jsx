import React from "react";

export default function TreatmentStatsCards({ treatments = [] }) {
  const stats = [
    {
      title: "Total Treatments",
      value: treatments.length,
      icon: "bi-capsule",
      bg: "blue-bg",
    },
    {
      title: "Treated Patients",
      value: new Set(treatments.map((t) => t.patientName)).size,
      icon: "bi-person-check",
      bg: "green-bg",
    },
    {
      title: "Active Plans",
      value: treatments.filter((t) => t.status === "active").length,
      icon: "bi-journal-medical",
      bg: "orange-bg",
    },
    {
      title: "Pending Plans",
      value: treatments.filter((t) => t.status === "pending").length,
      icon: "bi-clock-history",
      bg: "purple-bg",
    },
  ];

  return (
    <div className="stats-grid">
      {stats.map((s, i) => (
        <div key={i} className="stat-card">
          <div className={`stat-icon-wrapper ${s.bg}`}>
            <i className={`bi ${s.icon}`}></i>
          </div>
          <div className="stat-info">
            <span>{s.title}</span>
            <h3>{s.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
