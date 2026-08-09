import React, { useEffect, useState } from "react";

const PATIENTS_URL = "http://localhost:7000/api/v1/patient";
const DOCTORS_URL = "http://localhost:7000/api/v1/doctors";

export default function NewInvoiceDrawer({
  isOpen,
  onClose,
  onSave,
  clinicInfo,
}) {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  const clinic = {
    name: clinicInfo?.nameEn || "SmileSuite",
    subtitle: "Clinic Management",
    address: clinicInfo?.address || "123 Smile Street, Dental City",
    phone: clinicInfo?.phone1 || "+20 100 000 0000",
    email: clinicInfo?.email || "info@smilesuite.com",
  };

  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    patientStatus: "Regular",
    paymentMethod: "cash",
    status: "unpaid",
    items: [
      {
        name: "",
        price: "",
        qty: 1,
      },
    ],
  });

  // =========================
  // GET PATIENTS + DOCTORS
  // =========================

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        setLoadingData(true);

        const token = localStorage.getItem("token");

        const [patientsResponse, doctorsResponse] = await Promise.all([
          fetch(PATIENTS_URL, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          fetch(DOCTORS_URL, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        const patientsResult = await patientsResponse.json();
        const doctorsResult = await doctorsResponse.json();

        if (patientsResponse.ok) {
          setPatients(patientsResult.data || patientsResult || []);
        }

        if (doctorsResponse.ok) {
          setDoctors(doctorsResult.data || doctorsResult || []);
        }
      } catch (error) {
        console.error("Fetch invoice data error:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [isOpen]);

  // =========================
  // CALCULATIONS
  // =========================

  const subtotal = formData.items.reduce(
    (sum, item) =>
      sum +
      (Number(item.price) || 0) * (Number(item.qty) || 0),
    0
  );

  const tax = subtotal * 0.06;
  const grandTotal = subtotal + tax;

  // =========================
  // ADD ITEM
  // =========================

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          name: "",
          price: "",
          qty: 1,
        },
      ],
    }));
  };

  // =========================
  // CHANGE ITEM
  // =========================

  const handleItemChange = (index, field, value) => {
    const updated = [...formData.items];

    updated[index][field] =
      field === "name"
        ? value
        : value === ""
        ? ""
        : Number(value);

    setFormData((prev) => ({
      ...prev,
      items: updated,
    }));
  };

  // =========================
  // REMOVE ITEM
  // =========================

  const handleRemoveItem = (index) => {
    if (formData.items.length === 1) return;

    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.patientId) {
      alert("Please select a patient");
      return;
    }

    if (!formData.doctorId) {
      alert("Please select a doctor");
      return;
    }

    const services = formData.items.map((item) => ({
      serviceName: item.name,
      price: Number(item.price),
      quantity: Number(item.qty),
    }));

    const invoiceData = {
      patientId: formData.patientId,
      doctorId: formData.doctorId,
      services,
      patientStatus: formData.patientStatus,
      subtotal,
      tax,
      total: grandTotal,
      status: formData.status,
      paymentMethod: formData.paymentMethod,
    };

    await onSave(invoiceData);

    setFormData({
      patientId: "",
      doctorId: "",
      patientStatus: "Regular",
      paymentMethod: "cash",
      status: "unpaid",
      items: [
        {
          name: "",
          price: "",
          qty: 1,
        },
      ],
    });
  };

  // =========================
  // CLOSE ON OVERLAY
  // =========================

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="invoice-modal-overlay"
      onMouseDown={handleOverlayClick}
    >
      <div
        className="invoice-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* ================= HEADER ================= */}

        <div className="invoice-modal-header">
          <div className="invoice-modal-title">
            <div className="invoice-modal-icon">
              <i className="bi bi-receipt-cutoff"></i>
            </div>

            <div>
              <h2>New Invoice</h2>
              <p>Create a new patient invoice</p>
            </div>
          </div>

          <button
            type="button"
            className="invoice-modal-close"
            onClick={onClose}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* ================= FORM ================= */}

        <form
          onSubmit={handleSubmit}
          className="invoice-modal-form"
        >
          {/* ================= BODY ================= */}

          <div className="invoice-modal-body">

            {/* ================= INVOICE INFORMATION ================= */}

            <div className="invoice-section">
              <div className="invoice-section-title">
                <i className="bi bi-file-earmark-text"></i>
                <span>Invoice Information</span>
              </div>

              <div className="invoice-meta-card">
                <div className="invoice-clinic-info">
                  <div className="clinic-mini-logo">
                    <i className="bi bi-heart-pulse"></i>
                  </div>

                  <div>
                    <strong>{clinic.name}</strong>
                    <span>{clinic.subtitle}</span>
                  </div>
                </div>

                <div className="invoice-meta-right">
                  <span className="invoice-label">
                    INVOICE
                  </span>

                  <strong>Auto Generated</strong>

                  <small>
                    {new Date().toLocaleDateString()}
                  </small>
                </div>
              </div>
            </div>

            {/* ================= PATIENT + DOCTOR ================= */}

            <div className="invoice-section">
              <div className="invoice-section-title">
                <i className="bi bi-people"></i>
                <span>Patient & Doctor</span>
              </div>

              <div className="invoice-form-grid">

                {/* PATIENT */}

                <div className="invoice-field-card">
                  <label>
                    <i className="bi bi-person"></i>
                    Patient
                  </label>

                  <select
                    value={formData.patientId}
                    required
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        patientId: e.target.value,
                      })
                    }
                  >
                    <option value="">
                      {loadingData
                        ? "Loading patients..."
                        : "Select Patient"}
                    </option>

                    {patients.map((patient) => (
                      <option
                        key={patient._id}
                        value={patient._id}
                      >
                        {patient.fullName}
                        {patient.phone
                          ? ` - ${patient.phone}`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* DOCTOR */}

                <div className="invoice-field-card">
                  <label>
                    <i className="bi bi-person-badge"></i>
                    Doctor
                  </label>

                  <select
                    value={formData.doctorId}
                    required
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        doctorId: e.target.value,
                      })
                    }
                  >
                    <option value="">
                      {loadingData
                        ? "Loading doctors..."
                        : "Select Doctor"}
                    </option>

                    {doctors.map((doctor) => (
                      <option
                        key={doctor._id}
                        value={doctor._id}
                      >
                        {doctor.userId?.fullname ||
                          doctor.fullname ||
                          "Doctor"}

                        {doctor.specialization
                          ? ` - ${doctor.specialization}`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* PATIENT STATUS */}

                <div className="invoice-field-card">
                  <label>
                    <i className="bi bi-person-check"></i>
                    Patient Status
                  </label>

                  <select
                    value={formData.patientStatus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        patientStatus: e.target.value,
                      })
                    }
                  >
                    <option value="Regular">
                      Regular
                    </option>

                    <option value="New">
                      New
                    </option>

                    <option value="VIP">
                      VIP
                    </option>
                  </select>
                </div>

                {/* INVOICE STATUS */}

                <div className="invoice-field-card">
                  <label>
                    <i className="bi bi-circle-half"></i>
                    Invoice Status
                  </label>

                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="unpaid">
                      Unpaid
                    </option>

                    <option value="paid">
                      Paid
                    </option>

                    <option value="cancelled">
                      Cancelled
                    </option>
                  </select>
                </div>

              </div>
            </div>

            {/* ================= SERVICES ================= */}

            <div className="invoice-section">

              <div className="invoice-section-title services-title-row">

                <div>
                  <i className="bi bi-list-check"></i>
                  <span>Services & Treatments</span>
                </div>

                <span className="required-label">
                  * Required
                </span>

              </div>

              <div className="invoice-items-wrapper">

                <table className="invoice-items-table">

                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Service / Treatment</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Total</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>

                    {formData.items.map((item, idx) => (
                      <tr key={idx}>

                        <td className="item-number">
                          {idx + 1}
                        </td>

                        <td>
                          <input
                            type="text"
                            placeholder="Enter service name"
                            required
                            value={item.name}
                            onChange={(e) =>
                              handleItemChange(
                                idx,
                                "name",
                                e.target.value
                              )
                            }
                          />
                        </td>

                        <td>
                          <div className="price-input">

                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0"
                              required
                              value={item.price}
                              onChange={(e) =>
                                handleItemChange(
                                  idx,
                                  "price",
                                  e.target.value
                                )
                              }
                            />

                            <span>EGP</span>

                          </div>
                        </td>

                        <td>
                          <input
                            className="qty-input"
                            type="number"
                            min="1"
                            required
                            value={item.qty}
                            onChange={(e) =>
                              handleItemChange(
                                idx,
                                "qty",
                                e.target.value
                              )
                            }
                          />
                        </td>

                        <td className="line-total">
                          {(
                            (Number(item.price) || 0) *
                            (Number(item.qty) || 0)
                          ).toFixed(2)}{" "}
                          EGP
                        </td>

                        <td>
                          <button
                            type="button"
                            className="remove-item-btn"
                            onClick={() =>
                              handleRemoveItem(idx)
                            }
                            disabled={
                              formData.items.length === 1
                            }
                          >
                            <i className="bi bi-trash3"></i>
                          </button>
                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

              <button
                type="button"
                className="add-item-btn"
                onClick={handleAddItem}
              >
                <i className="bi bi-plus-lg"></i>
                Add Service
              </button>

            </div>

            {/* ================= PAYMENT + SUMMARY ================= */}

            <div className="invoice-bottom-grid">

              {/* PAYMENT */}

              <div className="payment-card">

                <div className="invoice-section-title">
                  <i className="bi bi-wallet2"></i>
                  <span>Payment Method</span>
                </div>

                <div className="payment-methods">

                  {/* CASH */}

                  <button
                    type="button"
                    className={
                      formData.paymentMethod === "cash"
                        ? "payment-method active"
                        : "payment-method"
                    }
                    onClick={() =>
                      setFormData({
                        ...formData,
                        paymentMethod: "cash",
                      })
                    }
                  >
                    <i className="bi bi-cash-stack"></i>

                    <div>
                      <strong>Cash</strong>
                      <span>Cash payment</span>
                    </div>

                    {formData.paymentMethod === "cash" && (
                      <i className="bi bi-check-circle-fill check-icon"></i>
                    )}
                  </button>

                  {/* CARD */}

                  <button
                    type="button"
                    className={
                      formData.paymentMethod === "creditCard"
                        ? "payment-method active"
                        : "payment-method"
                    }
                    onClick={() =>
                      setFormData({
                        ...formData,
                        paymentMethod: "creditCard",
                      })
                    }
                  >
                    <i className="bi bi-credit-card"></i>

                    <div>
                      <strong>Card / Visa</strong>
                      <span>Card payment</span>
                    </div>

                    {formData.paymentMethod === "creditCard" && (
                      <i className="bi bi-check-circle-fill check-icon"></i>
                    )}
                  </button>

                </div>

              </div>

              {/* SUMMARY */}

              <div className="invoice-summary-card">

                <div className="summary-line">
                  <span>Subtotal</span>
                  <strong>
                    {subtotal.toFixed(2)} EGP
                  </strong>
                </div>

                <div className="summary-line">
                  <span>Tax (6%)</span>
                  <strong>
                    {tax.toFixed(2)} EGP
                  </strong>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-total">

                  <div>
                    <span>Grand Total</span>

                    <small>
                      Including tax
                    </small>
                  </div>

                  <strong>
                    {grandTotal.toFixed(2)} EGP
                  </strong>

                </div>

              </div>

            </div>

          </div>

          {/* ================= FOOTER ================= */}

          <div className="invoice-modal-footer">

            <button
              type="button"
              className="modal-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="modal-save-btn"
            >
              <i className="bi bi-check2-circle"></i>
              Save Invoice
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}
