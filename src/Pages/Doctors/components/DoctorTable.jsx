export default function DoctorTable({ doctors }) {
  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>Doctor</th>
            <th>degree</th>
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
                  <div className="avatar">
                    {doctor.userId?.name?.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <strong>{doctor.userId?.name}</strong>
                  </div>
                </div>
              </td>

              <td>
                <span>
                  <strong>{doctor.degree}</strong>
                </span>
              </td>

              <td>
                <span className="badge bg-primary-subtle text-primary">
                  {doctor.specialization}
                </span>
              </td>

              <td>{doctor.userId?.phone}</td>
              <td>{doctor.workingDays?.join(", ")}</td>

              <td className="text-primary fw-bold">${doctor.fees}</td>

              <td>
                <span
                  className={`badge ${
                    doctor.isActive
                      ? "bg-success-subtle text-success"
                      : "bg-danger-subtle text-danger"
                  }`}
                >
                  {doctor.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              
              <td>
                <button className="btn btn-light btn-sm">
                  <i className="bi bi-eye"></i>
                </button>

                <button className="btn btn-light btn-sm ms-2">
                  <i className="bi bi-three-dots-vertical"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
