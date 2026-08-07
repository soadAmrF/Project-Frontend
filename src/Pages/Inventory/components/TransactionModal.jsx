import { useState, useEffect } from "react";

export default function TransactionModal({ show, onClose, onSave, items }) {
  const [form, setForm] = useState({
    inventoryItemId: "",
    type: "in",
    quantity: 1,
    quantityAfter: "",
    notes: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (show && items.length > 0 && !form.inventoryItemId) {
      setForm((prev) => ({
        ...prev,
        inventoryItemId: items[0]._id,
      }));
    }
    if (!show) {
      setError("");
    }
  }, [show, items]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.inventoryItemId) {
      setError("لازم تختار الصنف");
      return;
    }

    if (form.type !== "adjustment") {
      if (!form.quantity || Number(form.quantity) <= 0) {
        setError("الكمية لازم تكون أكبر من 0");
        return;
      }
    }

    if (form.type === "adjustment") {
      if (form.quantityAfter === "" || Number(form.quantityAfter) < 0) {
        setError("الكمية الجديدة بعد الجرد لازم تكون 0 أو أكبر");
        return;
      }
    }

    try {
      const payload = {
        inventoryItemId: form.inventoryItemId,
        type: form.type,
        quantity: Number(form.quantity) || 0,
        notes: form.notes,
      };

      if (form.type === "adjustment") {
        payload.quantityAfter = Number(form.quantityAfter);
      }

      await onSave(payload);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">إضافة حركة مخزن</h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="mb-3">
                <label className="form-label">الصنف</label>
                <select
                  className="form-select"
                  name="inventoryItemId"
                  value={form.inventoryItemId}
                  onChange={handleChange}
                  required
                >
                  {items.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">نوع الحركة</label>
                <select
                  className="form-select"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                >
                  <option value="in">دخول</option>
                  <option value="out">خروج</option>
                  <option value="expired">منتهي الصلاحية</option>
                  <option value="adjustment">جرد</option>
                </select>
              </div>

              {form.type === "adjustment" ? (
                <div className="mb-3">
                  <label className="form-label">الكمية الجديدة بعد الجرد</label>
                  <input
                    type="number"
                    className="form-control"
                    name="quantityAfter"
                    value={form.quantityAfter}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
              ) : (
                <div className="mb-3">
                  <label className="form-label">الكمية</label>
                  <input
                    type="number"
                    className="form-control"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>
              )}

              <div className="mb-3">
                <label className="form-label">ملاحظات</label>
                <textarea
                  className="form-control"
                  name="notes"
                  rows={3}
                  value={form.notes}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                إلغاء
              </button>
              <button type="submit" className="btn btn-primary">
                حفظ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
