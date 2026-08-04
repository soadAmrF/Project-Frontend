import React from "react";

const badges = {
  completed: <span className="badge badge-completed">Completed</span>,
  pending: <span className="badge badge-pending">Pending</span>,
  active: <span className="badge badge-active">Active</span>,
};

export default function TreatmentTable({ treatments = [], onDelete, onEdit }) {
  return (
    <div className="table-container">
      <table className="custom-table">
        <thead>
          <tr>
            {[
              "Patient Name",
              "Medicine",
              "Dosage",
              "Duration",
              "Instructions",
              "Status",
              "Actions",
            ].map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {treatments.length > 0 ? (
            treatments.map((t) => (
              <tr key={t._id || t.id}>
                <td style={{ fontWeight: 600 }}>{t.patientName || "N/A"}</td>
                <td>{t.medicineName}</td>
                <td>{t.dosage}</td>
                <td>{t.duration}</td>
                <td>{t.instructions || "-"}</td>
                <td>{badges[t.status] || badges.active}</td>
                <td>
                  <div className="actions-cell">
                    {/* زر التعديل */}
                    <button
                      className="action-btn edit"
                      title="Edit"
                      onClick={() => onEdit(t)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </button>
                    {/* زر الحذف */}
                    <button
                      className="action-btn delete"
                      title="Delete"
                      onClick={() => onDelete(t._id || t.id)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
                style={{
                  textAlign: "center",
                  color: "#9ca3af",
                  padding: "24px",
                }}
              >
                No treatments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
