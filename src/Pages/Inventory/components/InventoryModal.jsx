import { useState, useEffect } from "react";

const emptyForm = {
  name: "",
  category: "",
  unit: "",
  quantity: 0,
  reorderLevel: 10,
  costPrice: 0,
  expiryDate: "",
};

export default function InventoryModal({ show, onClose, onSave, currentItem }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentItem) {
      setForm({
        name: currentItem.name || "",
        category: currentItem.category || "",
        unit: currentItem.unit || "",
        quantity: currentItem.quantity || 0,
        reorderLevel: currentItem.reorderLevel || 10,
        costPrice: currentItem.costPrice || 0,
        expiryDate: currentItem.expiryDate
          ? new Date(currentItem.expiryDate).toISOString().slice(0, 10)
          : "",
      });
    } else {
      setForm(emptyForm);
    }
    setError("");
  }, [currentItem, show]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        name: form.name,
        category: form.category,
        unit: form.unit,
        quantity: Number(form.quantity),
        reorderLevel: Number(form.reorderLevel),
        costPrice: Number(form.costPrice),
      };

      if (form.expiryDate) {
        payload.expiryDate = form.expiryDate;
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
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {currentItem ? "تعديل صنف" : "إضافة صنف جديد"}
            </h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">الاسم</label>
                  <input
                    className="form-control"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">التصنيف</label>
                  <input
                    className="form-control"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">وحدة القياس</label>
                  <input
                    className="form-control"
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">الكمية</label>
                  <input
                    type="number"
                    className="form-control"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">حد الطلب</label>
                  <input
                    type="number"
                    className="form-control"
                    name="reorderLevel"
                    value={form.reorderLevel}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">سعر التكلفة</label>
                  <input
                    type="number"
                    className="form-control"
                    name="costPrice"
                    value={form.costPrice}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">تاريخ الصلاحية</label>
                  <input
                    type="date"
                    className="form-control"
                    name="expiryDate"
                    value={form.expiryDate}
                    onChange={handleChange}
                  />
                </div>
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
