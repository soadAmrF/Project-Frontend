export default function InventoryTable({ items, loading, onEdit, onDelete }) {
  const itemsArray = Array.isArray(items) ? items : [];

  return (
    <div className="inventory-table-card">
      {" "}
      <div className="inventory-table-wrapper">
        {" "}
        <table className="inventory-table">
          {" "}
          <thead>
            {" "}
            <tr>
              {" "}
              <th>Item Name</th> <th>Category</th> <th>Quantity</th>{" "}
              <th>Reorder Level</th> <th>Cost Price</th> <th>Expiry Date</th>{" "}
              <th>Actions</th>{" "}
            </tr>{" "}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="inventory-loading">
                  <div
                    className="spinner-border text-primary"
                    role="status"
                  ></div>
                </td>
              </tr>
            ) : itemsArray.length === 0 ? (
              <tr>
                <td colSpan={7} className="inventory-empty">
                  <i className="bi bi-inbox"></i>
                  <div>No inventory items found</div>
                </td>
              </tr>
            ) : (
              itemsArray.map((item) => {
                const quantity = Number(item.quantity || 0);
                const reorderLevel = Number(item.reorderLevel || 0);

                const isLow = quantity <= reorderLevel;

                const isExpired =
                  item.expiryDate && new Date(item.expiryDate) <= new Date();

                return (
                  <tr key={item._id}>
                    {/* Name */}
                    <td>
                      <span className="inventory-item-name">{item.name}</span>
                    </td>

                    {/* Category */}
                    <td>
                      <span className="inventory-category">
                        {item.category || "-"}
                      </span>
                    </td>

                    {/* Quantity */}
                    <td>
                      <span
                        className={`inventory-quantity ${
                          isLow ? "low" : "normal"
                        }`}
                      >
                        {quantity} {item.unit || ""}
                      </span>
                    </td>

                    {/* Reorder */}
                    <td>{reorderLevel}</td>

                    {/* Cost */}
                    <td>{Number(item.costPrice || 0).toFixed(2)} EGP</td>

                    {/* Expiry */}
                    <td>
                      {item.expiryDate ? (
                        <span
                          className={`inventory-expiry ${
                            isExpired ? "expired" : "normal"
                          }`}
                        >
                          {new Date(item.expiryDate).toLocaleDateString(
                            "en-GB",
                          )}
                        </span>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="inventory-actions">
                        <button
                          type="button"
                          className="inventory-action-btn edit"
                          title="Edit"
                          onClick={() => onEdit(item)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>

                        <button
                          type="button"
                          className="inventory-action-btn delete"
                          title="Delete"
                          onClick={() => onDelete(item)}
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
