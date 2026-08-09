import { useEffect, useState } from "react";

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
  const [saving, setSaving] = useState(false);

  const isEdit = Boolean(currentItem);

  useEffect(() => {
    if (!show) return;

    if (currentItem) {
      setForm({
        name: currentItem.name || "",
        category: currentItem.category || "",
        unit: currentItem.unit || "",
        quantity: currentItem.quantity ?? 0,
        reorderLevel: currentItem.reorderLevel ?? 10,
        costPrice: currentItem.costPrice ?? 0,
        expiryDate: currentItem.expiryDate
          ? new Date(currentItem.expiryDate).toISOString().slice(0, 10)
          : "",
      });
    } else {
      setForm({ ...emptyForm });
    }

    setError("");
    setSaving(false);
  }, [currentItem, show]);

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

    if (!form.name.trim()) {
      setError("Please enter the item name.");
      return;
    }

    if (!form.category.trim()) {
      setError("Please enter the category.");
      return;
    }

    if (!form.unit.trim()) {
      setError("Please enter the measurement unit.");
      return;
    }

    if (Number(form.quantity) < 0) {
      setError("Quantity cannot be negative.");
      return;
    }

    if (Number(form.reorderLevel) < 0) {
      setError("Reorder level cannot be negative.");
      return;
    }

    if (Number(form.costPrice) < 0) {
      setError("Cost price cannot be negative.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        name: form.name.trim(),
        category: form.category.trim(),
        unit: form.unit.trim(),
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
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message ||
          "Something went wrong. Please try again.",
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
      <div className="inventory-modal" onMouseDown={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="inventory-modal-header">
          <div className="inventory-modal-heading">
            <div className="inventory-modal-icon">
              <i
                className={isEdit ? "bi bi-pencil-square" : "bi bi-box-seam"}
              ></i>
            </div>

            <div>
              <h4>{isEdit ? "Edit Inventory Item" : "Add Inventory Item"}</h4>

              <p>
                {isEdit
                  ? "Update the inventory item information"
                  : "Add a new item to your inventory"}
              </p>
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

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="inventory-modal-body">
            {error && (
              <div className="inventory-modal-error">
                <i className="bi bi-exclamation-circle-fill"></i>
                <span>{error}</span>
              </div>
            )}

            <div className="inventory-form-grid">
              {/* Item Name */}
              <div className="inventory-form-group full-width">
                <label htmlFor="inventory-name">
                  Item Name <span>*</span>
                </label>

                <div className="inventory-input-wrapper">
                  <i className="bi bi-box"></i>

                  <input
                    id="inventory-name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Dental Gloves"
                    required
                    disabled={saving}
                  />
                </div>
              </div>

              {/* Category */}
              <div className="inventory-form-group">
                <label htmlFor="inventory-category">
                  Category <span>*</span>
                </label>

                <div className="inventory-input-wrapper">
                  <i className="bi bi-tags"></i>

                  <input
                    id="inventory-category"
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="e.g. Medical Supplies"
                    required
                    disabled={saving}
                  />
                </div>
              </div>

              {/* Unit */}
              <div className="inventory-form-group">
                <label htmlFor="inventory-unit">
                  Measurement Unit <span>*</span>
                </label>

                <div className="inventory-input-wrapper">
                  <i className="bi bi-rulers"></i>

                  <input
                    id="inventory-unit"
                    type="text"
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    placeholder="e.g. Box, Piece"
                    required
                    disabled={saving}
                  />
                </div>
              </div>

              {/* Quantity */}
              <div className="inventory-form-group">
                <label htmlFor="inventory-quantity">
                  Quantity <span>*</span>
                </label>

                <div className="inventory-input-wrapper">
                  <i className="bi bi-stack"></i>

                  <input
                    id="inventory-quantity"
                    type="number"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    min="0"
                    required
                    disabled={saving}
                  />
                </div>
              </div>

              {/* Reorder Level */}
              <div className="inventory-form-group">
                <label htmlFor="inventory-reorder">
                  Reorder Level <span>*</span>
                </label>

                <div className="inventory-input-wrapper">
                  <i className="bi bi-arrow-repeat"></i>

                  <input
                    id="inventory-reorder"
                    type="number"
                    name="reorderLevel"
                    value={form.reorderLevel}
                    onChange={handleChange}
                    min="0"
                    required
                    disabled={saving}
                  />
                </div>

                <small>Alert when stock reaches this level.</small>
              </div>

              {/* Cost */}
              <div className="inventory-form-group">
                <label htmlFor="inventory-cost">
                  Cost Price <span>*</span>
                </label>

                <div className="inventory-input-wrapper price-wrapper">
                  <i className="bi bi-cash-stack"></i>

                  <input
                    id="inventory-cost"
                    type="number"
                    name="costPrice"
                    value={form.costPrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                    disabled={saving}
                  />

                  <span className="currency">EGP</span>
                </div>
              </div>

              {/* Expiry */}
              <div className="inventory-form-group">
                <label htmlFor="inventory-expiry">Expiry Date</label>

                <div className="inventory-input-wrapper">
                  <i className="bi bi-calendar3"></i>

                  <input
                    id="inventory-expiry"
                    type="date"
                    name="expiryDate"
                    value={form.expiryDate}
                    onChange={handleChange}
                    disabled={saving}
                  />
                </div>

                <small>Optional field.</small>
              </div>
            </div>

            <div className="inventory-modal-info">
              <i className="bi bi-info-circle"></i>

              <span>
                {isEdit
                  ? "Changes will be applied to this inventory item."
                  : "Make sure all item information is correct before saving."}
              </span>
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
              disabled={saving}
            >
              {saving ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                  ></span>
                  Saving...
                </>
              ) : (
                <>
                  <i
                    className={
                      isEdit ? "bi bi-check2-circle" : "bi bi-plus-circle"
                    }
                  ></i>

                  {isEdit ? "Save Changes" : "Add Item"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
