export default function InventoryTable({ items, loading, onEdit, onDelete }) {
  const itemsArray = Array.isArray(items) ? items : [];

  return (
    <div className="card">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>الاسم</th>
              <th>التصنيف</th>
              <th>الكمية</th>
              <th>حد الطلب</th>
              <th>التكلفة</th>
              <th>الصلاحية</th>
              <th>إجراءات</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  <div className="spinner-border text-primary" role="status" />
                </td>
              </tr>
            ) : itemsArray.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-muted">
                  لا توجد أصناف
                </td>
              </tr>
            ) : (
              itemsArray.map((item) => {
                const isLow = item.quantity <= item.reorderLevel;
                const isExpired =
                  item.expiryDate && new Date(item.expiryDate) <= new Date();

                return (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {item.category}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`badge ${isLow ? "bg-warning text-dark" : "bg-success"}`}
                      >
                        {item.quantity} {item.unit}
                      </span>
                    </td>

                    <td>{item.reorderLevel}</td>
                    <td>{item.costPrice} ج.م</td>

                    <td>
                      {item.expiryDate ? (
                        <span
                          className={`badge ${isExpired ? "bg-danger" : "bg-light text-dark border"}`}
                        >
                          {new Date(item.expiryDate).toLocaleDateString(
                            "ar-EG",
                          )}
                        </span>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>

                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => onEdit(item)}
                        >
                          تعديل
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => onDelete(item)}
                        >
                          حذف
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
