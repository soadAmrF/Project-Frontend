export default function InventoryStats({ items }) {
  const itemsArray = Array.isArray(items) ? items : [];

  const lowCount = itemsArray.filter(
    (item) => Number(item.quantity || 0) <= Number(item.reorderLevel || 0),
  ).length;

  const expiredCount = itemsArray.filter((item) => {
    if (!item.expiryDate) return false;

    return new Date(item.expiryDate) <= new Date();
  }).length;

  return (
    <div className="inventory-stats">
      {/* Total Items */}
      <div className="inventory-stat-card">
        <div className="inventory-stat-icon blue">
          <i className="bi bi-box-seam"></i>
        </div>

        <div className="inventory-stat-content">
          <span>Total Items</span>
          <strong>{itemsArray.length}</strong>
        </div>
      </div>

      {/* Low Stock */}
      <div className="inventory-stat-card">
        <div className="inventory-stat-icon orange">
          <i className="bi bi-exclamation-triangle"></i>
        </div>

        <div className="inventory-stat-content">
          <span>Low Stock</span>
          <strong>{lowCount}</strong>
        </div>
      </div>

      {/* Expired */}
      <div className="inventory-stat-card">
        <div className="inventory-stat-icon red">
          <i className="bi bi-calendar-x"></i>
        </div>

        <div className="inventory-stat-content">
          <span>Expired Items</span>
          <strong>{expiredCount}</strong>
        </div>
      </div>
    </div>
  );
}
