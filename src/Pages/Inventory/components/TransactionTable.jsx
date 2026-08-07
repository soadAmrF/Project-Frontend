const typeMeta = {
  in: { label: "دخول", badge: "bg-success" },
  out: { label: "خروج", badge: "bg-warning text-dark" },
  adjustment: { label: "جرد", badge: "bg-secondary" },
  expired: { label: "منتهي", badge: "bg-danger" },
};

export default function TransactionTable({ transactions, loading }) {
  const txArray = Array.isArray(transactions) ? transactions : [];

  return (
    <div className="card">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>التاريخ</th>
              <th>الصنف</th>
              <th>النوع</th>
              <th>الكمية</th>
              <th>قبل</th>
              <th>بعد</th>
              <th>ملاحظات</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  <div className="spinner-border text-primary" role="status" />
                </td>
              </tr>
            ) : txArray.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-muted">
                  لا توجد حركات
                </td>
              </tr>
            ) : (
              txArray.map((tx) => (
                <tr key={tx._id}>
                  <td>{new Date(tx.createdAt).toLocaleDateString("ar-EG")}</td>

                  <td>{tx.inventoryItemId?.name || "-"}</td>

                  <td>
                    <span
                      className={`badge ${typeMeta[tx.type]?.badge || "bg-light text-dark"}`}
                    >
                      {typeMeta[tx.type]?.label || tx.type}
                    </span>
                  </td>

                  <td>{tx.quantity}</td>
                  <td>{tx.quantityBefore ?? "-"}</td>
                  <td>{tx.quantityAfter ?? "-"}</td>
                  <td>{tx.notes || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
