export default function OrderDetailsModal({ show, onClose, order }) {
  if (!show || !order) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">تفاصيل طلب المعمل</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <p className="text-muted mb-1">المريض</p>
                <h6>{order.patientId?.fullName}</h6>
                <small className="text-muted">{order.patientId?.phone}</small>
              </div>
              <div className="col-md-6">
                <p className="text-muted mb-1">الدكتور المحول</p>
                <h6>{order.doctorId?.specialization || "غير محدد"}</h6>
              </div>
            </div>

            {order.doctorNotes && (
              <div className="alert alert-light border mb-3">
                <strong>ملاحظات الدكتور:</strong>
                <p className="mb-0 mt-1">{order.doctorNotes}</p>
              </div>
            )}

            <h6 className="border-bottom pb-2 mb-3">التحاليل المطلوبة</h6>
            <div className="table-responsive">
              <table className="table table-sm table-bordered">
                <thead className="table-light">
                  <tr>
                    <th>اسم التحليل</th>
                    <th>السعر</th>
                    <th>الحالة</th>
                    <th>النتيجة</th>
                  </tr>
                </thead>
                <tbody>
                  {order.tests?.map((test, index) => (
                    <tr key={index}>
                      <td>{test.testName}</td>
                      <td>{test.price} ج.م</td>
                      <td>
                        <span
                          className={`badge ${test.status === "completed" ? "bg-success" : "bg-warning text-dark"}`}
                        >
                          {test.status === "completed"
                            ? "مكتمل"
                            : "قيد الانتظار"}
                        </span>
                      </td>
                      <td>
                        {test.result?.value ? (
                          <span className="text-success fw-bold">
                            {test.result.value} {test.result.unit}
                            {test.result.isNormal === false && (
                              <span className="text-danger ms-1">
                                (غير طبيعي)
                              </span>
                            )}
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
