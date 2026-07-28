export default function ChartSection() {
  return (
    <div className="card shadow-sm border-0 mt-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Patients Overview</h5>

          <select className="form-select w-auto">
            <option>This Month</option>
            <option>This Week</option>
            <option>This Year</option>
          </select>
        </div>

        <div
          className="bg-light rounded d-flex justify-content-center align-items-center"
          style={{ height: "320px" }}
        >
           hello
        </div>
      </div>
    </div>
  );
}
