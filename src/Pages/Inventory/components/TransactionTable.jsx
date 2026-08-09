const typeMeta = {
  in: {
    label: "Stock In",
    className: "transaction-in",
  },

  out: {
    label: "Stock Out",
    className: "transaction-out",
  },

  adjustment: {
    label: "Adjustment",
    className: "transaction-adjustment",
  },

  expired: {
    label: "Expired",
    className: "transaction-expired",
  },
};

export default function TransactionTable({ transactions, loading }) {
  const txArray = Array.isArray(transactions) ? transactions : [];

  return (
    <div className="inventory-table-card">
      {" "}
      <div className="inventory-table-wrapper">
        {" "}
        <table className="inventory-table transaction-table">
          {" "}
          <thead>
            {" "}
            <tr>
              {" "}
              <th>Date</th> <th>Item</th> <th>Type</th> <th>Quantity</th>{" "}
              <th>Before</th> <th>After</th> <th>Notes</th>{" "}
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
            ) : txArray.length === 0 ? (
              <tr>
                <td colSpan={7} className="inventory-empty">
                  <i className="bi bi-arrow-left-right"></i>

                  <div>No transactions found</div>
                </td>
              </tr>
            ) : (
              txArray.map((tx) => {
                const meta = typeMeta[tx.type] || {
                  label: tx.type || "Unknown",
                  className: "transaction-default",
                };

                return (
                  <tr key={tx._id}>
                    {/* Date */}
                    <td>
                      {tx.createdAt
                        ? new Date(tx.createdAt).toLocaleDateString("en-GB")
                        : "-"}
                    </td>

                    {/* Item */}
                    <td>
                      <span className="inventory-item-name">
                        {tx.inventoryItemId?.name ||
                          tx.inventoryItem?.name ||
                          "-"}
                      </span>
                    </td>

                    {/* Type */}
                    <td>
                      <span className={`transaction-badge ${meta.className}`}>
                        {meta.label}
                      </span>
                    </td>

                    {/* Quantity */}
                    <td>{tx.quantity ?? "-"}</td>

                    {/* Before */}
                    <td>{tx.quantityBefore ?? "-"}</td>

                    {/* After */}
                    <td>{tx.quantityAfter ?? "-"}</td>

                    {/* Notes */}
                    <td className="transaction-notes-cell">
                      {tx.notes || "-"}
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
