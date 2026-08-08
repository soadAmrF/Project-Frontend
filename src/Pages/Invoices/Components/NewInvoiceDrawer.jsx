import React, { useState } from "react";

export default function NewInvoiceDrawer({
  isOpen,
  onClose,
  onSave,
  clinicInfo,
}) {
  if (!isOpen) return null;

  const clinic = {
    name: clinicInfo?.nameEn || "SmileSuite",
    subtitle: "Clinic Management",
    address:
      clinicInfo?.address || "123 Smile Street, Dental City, CA 90210, USA",
    phone: clinicInfo?.phone1 || "+1 (555) 123-4567",
    email: clinicInfo?.email || "info@smilesuite.com",
  };

  const [formData, setFormData] = useState({
    patientName: "",
    patientPhone: "",
    patientEmail: "",
    doctorName: "",
    doctorWork: "",
    paymentMethod: "cash",
    status: "unpaid",
    items: [{ name: "", price: "", qty: 1 }],
  });

  const subtotal = formData.items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty) || 0),
    0,
  );
  const tax = subtotal * 0.06;
  const grandTotal = subtotal + tax;

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { name: "", price: "", qty: 1 }],
    });
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...formData.items];
    updated[index][field] =
      field === "name" ? value : value === "" ? "" : Number(value);
    setFormData({ ...formData, items: updated });
  };

  const handleRemoveItem = (index) => {
    if (formData.items.length === 1) return;
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      subtotal,
      tax,
      total: grandTotal,
      createdAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="invoice-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div className="clinic-brand">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                fill="#2563eb"
              />
              <path
                d="M3.5 12h3.5l1.5-3 2.5 6 2-4 1.5 1h4"
                stroke="#fff"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <h3>{clinic.name}</h3>
              <span>{clinic.subtitle}</span>
            </div>
          </div>
          <button
            type="button"
            className="btn-close"
            onClick={onClose}
          ></button>
        </div>

        <form onSubmit={handleSubmit} className="drawer-form-wrapper">
          <div className="drawer-body">
            <div className="meta-grid">
              <div className="clinic-details">
                <p>📍 {clinic.address}</p>
                <p>📞 {clinic.phone}</p>
                <p>✉️ {clinic.email}</p>
              </div>
              <div className="invoice-meta">
                <h4>INVOICE</h4>
                <div className="inv-number">#INV-1003</div>
                <p>Created Date: Aug 08, 2026</p>

                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className={`custom-status-select ${formData.status}`}
                >
                  <option value="unpaid">UNPAID</option>
                  <option value="paid">PAID</option>
                  <option value="cancelled">CANCELLED</option>
                </select>
              </div>
            </div>

            <div className="info-columns">
              <div className="info-box">
                <h5>👤 Patient Information *</h5>
                <input
                  type="text"
                  placeholder="Patient Name *"
                  required
                  value={formData.patientName}
                  onChange={(e) =>
                    setFormData({ ...formData, patientName: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Phone Number *"
                  required
                  value={formData.patientPhone}
                  onChange={(e) =>
                    setFormData({ ...formData, patientPhone: e.target.value })
                  }
                />
                <input
                  type="email"
                  placeholder="Email Address *"
                  required
                  value={formData.patientEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, patientEmail: e.target.value })
                  }
                />
              </div>

              <div className="info-box">
                <h5>👨‍⚕️ Doctor Information *</h5>
                <input
                  type="text"
                  placeholder="Doctor Name *"
                  required
                  value={formData.doctorName}
                  onChange={(e) =>
                    setFormData({ ...formData, doctorName: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Doctor Work / Specialization *"
                  required
                  value={formData.doctorWork}
                  onChange={(e) =>
                    setFormData({ ...formData, doctorWork: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="services-section">
              <h5>Services / Treatments / Medicines *</h5>
              <table className="items-table">
                <thead>
                  <tr>
                    <th style={{ width: "30px" }}>#</th>
                    <th>Service Name</th>
                    <th style={{ width: "80px" }}>Price ($)</th>
                    <th style={{ width: "60px" }}>Qty</th>
                    <th style={{ width: "100px", whiteSpace: "nowrap" }}>
                      Line Total ($)
                    </th>
                    <th style={{ width: "40px" }}></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>
                        <input
                          type="text"
                          placeholder="Service / Medicine *"
                          required
                          value={item.name}
                          onChange={(e) =>
                            handleItemChange(idx, "name", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          placeholder="0"
                          min="0"
                          step="0.01"
                          required
                          value={item.price}
                          onChange={(e) =>
                            handleItemChange(idx, "price", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.qty}
                          onChange={(e) =>
                            handleItemChange(idx, "qty", e.target.value)
                          }
                        />
                      </td>
                      <td style={{ fontWeight: "700", color: "#0f172a" }}>
                        $
                        {(
                          (Number(item.price) || 0) * (Number(item.qty) || 0)
                        ).toFixed(2)}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-action btn-delete"
                          onClick={() => handleRemoveItem(idx)}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                type="button"
                className="btn-add-item"
                onClick={handleAddItem}
              >
                + Add Line Item
              </button>
            </div>

            <div className="summary-box">
              <div className="summary-row">
                <span>Payment Method:</span>
                <div className="payment-toggle">
                  <button
                    type="button"
                    className={
                      formData.paymentMethod === "cash" ? "active" : ""
                    }
                    onClick={() =>
                      setFormData({ ...formData, paymentMethod: "cash" })
                    }
                  >
                    💵 Cash
                  </button>
                  <button
                    type="button"
                    className={
                      formData.paymentMethod === "card" ? "active" : ""
                    }
                    onClick={() =>
                      setFormData({ ...formData, paymentMethod: "card" })
                    }
                  >
                    💳 Card / Visa
                  </button>
                </div>
              </div>
              <div className="summary-row">
                <span>Subtotal:</span>
                <strong>${subtotal.toFixed(2)}</strong>
              </div>
              <div className="summary-row">
                <span>Tax (6%):</span>
                <strong>${tax.toFixed(2)}</strong>
              </div>
              <div className="summary-row total-row">
                <span>Grand Total:</span>
                <h3>${grandTotal.toFixed(2)}</h3>
              </div>
            </div>
          </div>

          <div className="drawer-footer">
            <button
              type="button"
              className="btn-sec"
              onClick={() => window.print()}
            >
              🖨️ Print
            </button>
            <button type="submit" className="btn-pri">
              💾 Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
