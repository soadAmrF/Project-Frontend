export default function InventoryStats({ items }) {
  const itemsArray = Array.isArray(items) ? items : [];

  const lowCount = itemsArray.filter(
    (item) => item.quantity <= item.reorderLevel,
  ).length;

  const expiredCount = itemsArray.filter(
    (item) => item.expiryDate && new Date(item.expiryDate) <= new Date(),
  ).length;

  return (
    <div className="row g-3 mb-4">
      <div className="col-md-4">
        <div className="card stat-card h-100 border-primary">
          <div className="card-body">
            <h6 className="text-muted mb-1">إجمالي الأصناف</h6>
            <h3 className="mb-0 text-primary">{itemsArray.length}</h3>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card stat-card h-100 border-warning">
          <div className="card-body">
            <h6 className="text-muted mb-1">أصناف قرب تخلص</h6>
            <h3 className="mb-0 text-warning">{lowCount}</h3>
          </div>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card stat-card h-100 border-danger">
          <div className="card-body">
            <h6 className="text-muted mb-1">أصناف منتهية الصلاحية</h6>
            <h3 className="mb-0 text-danger">{expiredCount}</h3>
          </div>
        </div>
      </div>
    </div>
  );
}
