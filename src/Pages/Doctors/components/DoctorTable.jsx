export default function DoctorTable({ doctors }) {
  return (
    <div className="doctor-table-responsive">
      <table className="doctor-table">
        <thead>
          <tr>
            <th>Doctor</th>
            <th>Degree</th>
            <th>Specialization</th>
            <th>Phone</th>
            <th>Working Days</th>
            <th>Fees</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {doctors.map((doctor) => (
            <tr key={doctor._id}>
              <td>
                <div className="doctor-name">
                  <div className="doctor-avatar">
                    {doctor.userId?.name?.charAt(0).toUpperCase()}
                  </div>

                  <div className="doctor-name-text">
                    <strong>{doctor.userId?.name}</strong>
                  </div>
                </div>
              </td>

              <td>
                <strong className="degree-text">{doctor.degree}</strong>
              </td>

              <td>
                <span className="specialization-badge">
                  {doctor.specialization}
                </span>
              </td>

              <td className="phone-text">{doctor.userId?.phone}</td>

              <td>
                <div className="working-days-text">
                  {doctor.workingDays?.join(", ")}
                </div>
              </td>

              <td>
                <span className="fees-text">${doctor.fees}</span>
              </td>

              <td>
                <span
                  className={`doctor-status ${
                    doctor.isActive ? "active" : "inactive"
                  }`}
                >
                  <span className="status-dot"></span>
                  {doctor.isActive ? "Active" : "Inactive"}
                </span>
              </td>

              <td>
                <div className="doctor-actions">
                  <button className="action-btn view-btn">
                    <i className="bi bi-eye"></i>
                  </button>

                  <button className="action-btn more-btn">
                    <i className="bi bi-three-dots-vertical"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {doctors.length === 0 && (
            <tr>
              <td colSpan="8" className="empty-doctors">
                No doctors found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
