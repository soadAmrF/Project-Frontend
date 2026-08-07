const statusMeta = {
  pending: { label: "قيد الانتظار", badge: "bg-warning text-dark" },
  "in-progress": { label: "قيد التنفيذ", badge: "bg-info text-dark" },
  completed: { label: "مكتمل", badge: "bg-success" },
  cancelled: { label: "ملغي", badge: "bg-danger" },
};

export default function LabOrderTable({
  orders,
  loading,
  onView,
  onAddResult,
}) {
  const ordersArray = Array.isArray(orders) ? orders : [];

  return (
    <div className="card">
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>رقم الطلب</th>
              <th>المريض</th>
              <th>الدكتور</th>
              <th>عدد التحاليل</th>
              <th>الإجمالي</th>
              <th>الحالة</th>
              <th>التاريخ</th>
              <th>إجراءات</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-4">
                  <div className="spinner-border text-primary" role="status" />
                </td>
              </tr>
            ) : ordersArray.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-4 text-muted">
                  لا توجد طلبات معمل
                </td>
              </tr>
            ) : (
              ordersArray.map((order) => {
                const status = statusMeta[order.orderStatus] || {
                  label: order.orderStatus,
                  badge: "bg-secondary",
                };
                const patientName = order.patientId?.fullName || "غير معروف";
                const doctorName =
                  order.doctorId?.specialization || "غير معروف";

                return (
                  <tr key={order._id}>
                    <td className="fw-bold">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td>{patientName}</td>
                    <td>{doctorName}</td>
                    <td>
                      <span className="badge bg-light text-dark border">
                        {order.tests?.length || 0} تحليل
                      </span>
                    </td>
                    <td>{order.totalPrice} ج.م</td>
                    <td>
                      <span className={`badge status-badge ${status.badge}`}>
                        {status.label}
                      </span>
                    </td>
                    <td>
                      {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() => onView(order)}
                        >
                          عرض
                        </button>
                        {order.orderStatus !== "completed" &&
                          order.orderStatus !== "cancelled" && (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => onAddResult(order)}
                            >
                              إضافة نتيجة
                            </button>
                          )}
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
