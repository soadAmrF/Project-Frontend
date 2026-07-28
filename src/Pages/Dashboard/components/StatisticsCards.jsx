export default function StatisticsCards() {
  return (
    <div className="row g-3">
      <div className="col-lg-4">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h6 className="text-muted">Today's Patients</h6>
            <h2 className="fw-bold">24</h2>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h6 className="text-muted">Total Patients</h6>
            <h2 className="fw-bold">1,280</h2>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h6 className="text-muted">Appointments</h6>
            <h2 className="fw-bold">18</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
