
export default function DoctorTable({doctors}) {
  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>Doctor</th>
            <th>Specialization</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Working Days</th>
            <th>Status</th>
            <th>Patients</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {doctors.map((doctor, index) => (
            <tr key={index}>
              <td>
                <div className="doctor-name">
                  <div className="avatar">{doctor.userId?.name.charAt(4)}</div>

                  <div>
                    <strong>{doctor.userId?.name}</strong>
                    <br />
                    <small>Dentist</small>
                  </div>
                </div>
              </td>

              <td>
                <span className="badge bg-primary-subtle text-primary">
                  {doctor.specialization}
                </span>
              </td>

              <td>{doctor.phone}</td>

              <td>
                <span className="badge bg-success-subtle text-success">
                  ● {doctor.status}
                </span>
              </td>

              <td className="text-primary fw-bold">{doctor.patients}</td>

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
