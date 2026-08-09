import { useEffect, useState } from "react";

const initialForm = {
  inventoryItemId: "",
  type: "in",
  quantity: 1,
  quantityAfter: "",
  notes: "",
};

export default function TransactionModal({ show, onClose, onSave, items }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!show) {
      setError("");
      return;
    }

    if (items?.length > 0) {
      setForm((prev) => ({
        ...prev,
        inventoryItemId: prev.inventoryItemId || items[0]._id,
      }));
    }
  }, [show, items]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.inventoryItemId) {
      setError("Please select an inventory item.");
      return;
    }

    if (form.type !== "adjustment") {
      if (!form.quantity || Number(form.quantity) <= 0) {
        setError("Quantity must be greater than 0.");
        return;
      }
    }

    if (form.type === "adjustment") {
      if (form.quantityAfter === "" || Number(form.quantityAfter) < 0) {
        setError("The new quantity must be 0 or greater.");
        return;
      }
    }

    try {
      setSaving(true);

      const payload = {
        inventoryItemId: form.inventoryItemId,
        type: form.type,
        quantity: Number(form.quantity) || 0,
        notes: form.notes.trim(),
      };

      if (form.type === "adjustment") {
        payload.quantityAfter = Number(form.quantityAfter);
      }

      await onSave(payload);

      setForm({
        ...initialForm,
        inventoryItemId: items?.[0]?._id || "",
      });

      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Something went wrong.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (!show) return null;

  return (
    <div
      className="inventory-modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !saving) {
          onClose();
        }
      }}
    >
      <div
        className="inventory-modal transaction-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="inventory-modal-header">
          <div className="inventory-modal-heading">
            <div className="inventory-modal-icon">
              <i className="bi bi-arrow-left-right"></i>
            </div>

            <div>
              <h4>Add Inventory Transaction</h4>
              <p>Record a stock movement</p>
            </div>
          </div>

          <button
            type="button"
            className="inventory-modal-close"
            onClick={onClose}
            disabled={saving}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="inventory-modal-body">
            {error && (
              <div className="inventory-modal-error">
                <i className="bi bi-exclamation-circle-fill"></i>
                <span>{error}</span>
              </div>
            )}

            {/* Item */}
            <div className="inventory-form-group full-width mb-3">
              <label htmlFor="transaction-item">
                Inventory Item <span>*</span>
              </label>

              <div className="inventory-input-wrapper">
                <i className="bi bi-box-seam"></i>

                <select
                  id="transaction-item"
                  className="inventory-select"
                  name="inventoryItemId"
                  value={form.inventoryItemId}
                  onChange={handleChange}
                  required
                  disabled={saving || items.length === 0}
                >
                  <option value="">Select an item</option>

                  {items.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Type */}
            <div className="inventory-form-group full-width mb-3">
              <label htmlFor="transaction-type">
                Transaction Type <span>*</span>
              </label>

              <div className="inventory-input-wrapper">
                <i className="bi bi-arrow-left-right"></i>

                <select
                  id="transaction-type"
                  className="inventory-select"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  disabled={saving}
                >
                  <option value="in">Stock In</option>
                  <option value="out">Stock Out</option>
                  <option value="expired">Expired</option>
                  <option value="adjustment">Stock Adjustment</option>
                </select>
              </div>
            </div>

            {/* Quantity */}
            {form.type === "adjustment" ? (
              <div className="inventory-form-group full-width">
                <label htmlFor="quantity-after">
                  New Quantity <span>*</span>
                </label>

                <div className="inventory-input-wrapper">
                  <i className="bi bi-123"></i>

                  <input
                    id="quantity-after"
                    type="number"
                    name="quantityAfter"
                    value={form.quantityAfter}
                    onChange={handleChange}
                    min="0"
                    required
                    disabled={saving}
                    placeholder="Enter the new quantity"
                  />
                </div>
              </div>
            ) : (
              <div className="inventory-form-group full-width">
                <label htmlFor="transaction-quantity">
                  Quantity <span>*</span>
                </label>

                <div className="inventory-input-wrapper">
                  <i className="bi bi-stack"></i>

                  <input
                    id="transaction-quantity"
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    min="1"
                    required
                    disabled={saving}
                  />
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="inventory-form-group full-width transaction-notes">
              <label htmlFor="transaction-notes">Notes</label>

              <textarea
                id="transaction-notes"
                className="inventory-textarea"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Add any additional notes..."
                disabled={saving}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="inventory-modal-footer">
            <button
              type="button"
              className="inventory-btn inventory-btn-cancel"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inventory-btn inventory-btn-save"
              disabled={saving || items.length === 0}
            >
              {saving ? (
                <>
                  <span className="spinner-border spinner-border-sm"></span>
                  Saving...
                </>
              ) : (
                <>
                  <i className="bi bi-check2-circle"></i>
                  Save Transaction
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
