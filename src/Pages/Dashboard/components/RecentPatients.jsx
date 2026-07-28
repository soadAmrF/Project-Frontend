export default function RecentPatients() {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-header bg-white d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Latest Patients</h5>

        <button className="btn btn-primary btn-sm">View All</button>
      </div>

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Patient ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Doctor</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>P001</td>
                <td>Ahmed Mohamed</td>
                <td>28 July 2026</td>
                <td>Dr. Ahmed</td>
                <td>
                  <span className="badge bg-success">Completed</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
