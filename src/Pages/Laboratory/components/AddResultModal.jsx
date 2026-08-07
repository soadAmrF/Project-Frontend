import { useState, useEffect } from "react";

export default function AddResultModal({ show, onClose, onSave, order }) {
  const [pendingTests, setPendingTests] = useState([]);
  const [results, setResults] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (order && show) {
      
      const pending = order.tests.filter(
        (t, index) => t.status !== "completed",
      );
      setPendingTests(
        pending.map((t, i) => ({
          ...t,
          originalIndex: order.tests.indexOf(t),
        })),
      );

      
      const initialResults = {};
      pending.forEach((t) => {
        initialResults[t.originalIndex] = {
          value: "",
          unit: t.result?.unit || "",
          isNormal: true,
          notes: "",
        };
      });
      setResults(initialResults);
      setError("");
    }
  }, [order, show]);

  const handleResultChange = (index, field, value) => {
    setResults((prev) => ({
      ...prev,
      [index]: {
        ...prev[index],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      
      
      for (const test of pendingTests) {
        const resultData = results[test.originalIndex];

        if (!resultData.value.trim()) {
          throw new Error(`يرجى إدخال قيمة النتيجة لتحليل: ${test.testName}`);
        }

        await onSave(order._id, {
          testIndex: test.originalIndex,
          result: resultData,
        });
      }

      onClose();
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء حفظ النتائج");
    } finally {
      setLoading(false);
    }
  };

  if (!show || !order) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">إدخال نتائج التحاليل</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mb-3">
                <h6 className="text-muted">
                  المريض: {order.patientId?.fullName}
                </h6>
              </div>

              {pendingTests.map((test) => {
                const idx = test.originalIndex;
                return (
                  <div key={idx} className="card mb-3 border-primary">
                    <div className="card-header bg-primary text-white d-flex justify-content-between">
                      <span>{test.testName}</span>
                      <small>
                        المعدل الطبيعي:{" "}
                        {test.labTestId?.normalRange || "غير محدد"}
                      </small>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-4">
                          <label className="form-label">القيمة (Value)</label>
                          <input
                            type="text"
                            className="form-control"
                            value={results[idx]?.value || ""}
                            onChange={(e) =>
                              handleResultChange(idx, "value", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="col-md-3">
                          <label className="form-label">الوحدة (Unit)</label>
                          <input
                            type="text"
                            className="form-control"
                            value={results[idx]?.unit || ""}
                            onChange={(e) =>
                              handleResultChange(idx, "unit", e.target.value)
                            }
                            placeholder="مثال: mg/dL"
                          />
                        </div>
                        <div className="col-md-5 d-flex align-items-end">
                          <div className="form-check form-switch">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`normal-${idx}`}
                              checked={results[idx]?.isNormal}
                              onChange={(e) =>
                                handleResultChange(
                                  idx,
                                  "isNormal",
                                  e.target.checked,
                                )
                              }
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`normal-${idx}`}
                            >
                              النتيجة ضمن المعدل الطبيعي
                            </label>
                          </div>
                        </div>
                        <div className="col-12">
                          <label className="form-label">
                            ملاحظات الفني (اختياري)
                          </label>
                          <textarea
                            className="form-control"
                            rows="2"
                            value={results[idx]?.notes || ""}
                            onChange={(e) =>
                              handleResultChange(idx, "notes", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "جاري الحفظ..." : "حفظ النتائج"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
