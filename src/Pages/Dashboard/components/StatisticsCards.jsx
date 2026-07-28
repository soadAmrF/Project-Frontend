export default function StatisticsCards() {
  return (
    <div className="row g-3">
      <div className="col-12 col-md-4">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-body">
            <h6 className="text-secondary fw-semibold">Today's Patients</h6>
            <h2 className="fw-bold text-dark m-0">24</h2>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-4">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-body">
            <h6 className="text-secondary fw-semibold">Total Patients</h6>
            <h2 className="fw-bold text-dark m-0">1,280</h2>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-4">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-body">
            <h6 className="text-secondary fw-semibold">Appointments</h6>
            <h2 className="fw-bold text-dark m-0">18</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
