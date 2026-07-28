export default function DashboardHeader() {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 className="fw-bold mb-1">Dashboard overview</h2>
      </div>

      <div className="d-flex gap-2">
        <button className="btn btn-outline-primary">
          + Make an Appointment
        </button>

        <button className="btn btn-primary">+ Add Patient</button>
      </div>
    </div>
  );
}
