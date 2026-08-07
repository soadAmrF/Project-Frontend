export default function LabStats({ orders }) {
  const ordersArray = Array.isArray(orders) ? orders : [];

  const pendingCount = ordersArray.filter(
    (o) => o.orderStatus === "pending",
  ).length;
  const inProgressCount = ordersArray.filter(
    (o) => o.orderStatus === "in-progress",
  ).length;
  const completedCount = ordersArray.filter(
    (o) => o.orderStatus === "completed",
  ).length;

  return (
    <div className="row g-3 mb-4">
      <div className="col-md-4">
        <div className="card stat-card h-100 border-warning">
          <div className="card-body">
            <h6 className="text-muted mb-1">قيد الانتظار</h6>
            <h3 className="mb-0 text-warning">{pendingCount}</h3>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card stat-card h-100 border-info">
          <div className="card-body">
            <h6 className="text-muted mb-1">قيد التنفيذ</h6>
            <h3 className="mb-0 text-info">{inProgressCount}</h3>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card stat-card h-100 border-success">
          <div className="card-body">
            <h6 className="text-muted mb-1">مكتملة اليوم</h6>
            <h3 className="mb-0 text-success">{completedCount}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
