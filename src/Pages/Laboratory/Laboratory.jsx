import React, { useState, useEffect, useCallback } from "react";
import PageHeader from "@/components/PageHeader";
import "./Laboratory.css";
import {
  getAllLabTests,
  createLabTest,
  updateLabTest,
  deleteLabTest,
  getAllLabOrders,
  getLabOrderById,
  createLabOrder,
  addTestResult,
  cancelLabOrder,
} from "@/services/api";
import { getPatients, getMedicalRecords } from "@/services/api";

// ==================== Helper Functions ====================
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "completed":
      return "status-completed";
    case "in-progress":
      return "status-in-progress";
    case "pending":
      return "status-pending";
    case "cancelled":
      return "status-cancelled";
    default:
      return "";
  }
};

// ==================== Component: Test Modal (Add/Edit) ====================
function TestModal({ editingTest, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: editingTest?.name || "",
    code: editingTest?.code || "",
    category: editingTest?.category || "",
    price: editingTest?.price || "",
    normalRange: editingTest?.normalRange || "",
    unit: editingTest?.unit || "",
    preparationInstructions: editingTest?.preparationInstructions || "",
    isActive: editingTest?.isActive ?? true,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Test name is required";
    if (!formData.code.trim()) newErrors.code = "Test code is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (formData.price === "" || Number(formData.price) < 0)
      newErrors.price = "Valid price is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = { ...formData, price: Number(formData.price) };
      if (editingTest) {
        await updateLabTest(editingTest._id, payload);
      } else {
        await createLabTest(payload);
      }
      onSave();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save lab test");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card modal-large"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>
            <i className="bi bi-clipboard2-plus me-2"></i>
            {editingTest ? "Edit Lab Test" : "New Lab Test"}
          </h2>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="field">
              <label>Test Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Complete Blood Count"
                className={errors.name ? "error" : ""}
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>
            <div className="field">
              <label>Code *</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g., CBC"
                className={errors.code ? "error" : ""}
              />
              {errors.code && <span className="error-text">{errors.code}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label>Category *</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Hematology"
                className={errors.category ? "error" : ""}
              />
              {errors.category && (
                <span className="error-text">{errors.category}</span>
              )}
            </div>
            <div className="field">
              <label>Price (EGP) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className={errors.price ? "error" : ""}
              />
              {errors.price && (
                <span className="error-text">{errors.price}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="field">
              <label>Normal Range</label>
              <input
                type="text"
                name="normalRange"
                value={formData.normalRange}
                onChange={handleChange}
                placeholder="e.g., 4.5-5.5 million/μL"
              />
            </div>
            <div className="field">
              <label>Unit</label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="e.g., mg/dL"
              />
            </div>
          </div>

          <div className="field">
            <label>Preparation Instructions</label>
            <textarea
              name="preparationInstructions"
              rows="3"
              value={formData.preparationInstructions}
              onChange={handleChange}
              placeholder="e.g., Fasting for 8-12 hours required..."
            />
          </div>

          <div className="field checkbox-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <span>Active (available for ordering)</span>
            </label>
          </div>

          <div className="modal-btns">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : editingTest
                  ? "Update Test"
                  : "Create Test"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==================== Component: Create Order Modal ====================
function CreateOrderModal({
  patients,
  medicalRecords,
  labTests,
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState({
    patientId: "",
    medicalRecordId: "",
    doctorNotes: "",
    selectedTests: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleTestToggle = (testId) => {
    setFormData((prev) => ({
      ...prev,
      selectedTests: prev.selectedTests.includes(testId)
        ? prev.selectedTests.filter((id) => id !== testId)
        : [...prev.selectedTests, testId],
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.patientId) newErrors.patientId = "Patient is required";
    if (!formData.medicalRecordId)
      newErrors.medicalRecordId = "Medical record is required";
    if (formData.selectedTests.length === 0)
      newErrors.selectedTests = "At least one test is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        patientId: formData.patientId,
        medicalRecordId: formData.medicalRecordId,
        doctorNotes: formData.doctorNotes,
        tests: formData.selectedTests.map((testId) => ({ labTestId: testId })),
      };
      await createLabOrder(payload);
      onSave();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create lab order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredRecords = formData.patientId
    ? medicalRecords.filter(
        (r) => (r.patientId?._id || r.patientId) === formData.patientId,
      )
    : [];

  const totalPrice = formData.selectedTests.reduce((sum, testId) => {
    const test = labTests.find((t) => t._id === testId);
    return sum + (test?.price || 0);
  }, 0);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card modal-large"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>
            <i className="bi bi-clipboard2-plus me-2"></i>
            New Lab Order
          </h2>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="field">
              <label>Patient *</label>
              <select
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                className={errors.patientId ? "error" : ""}
              >
                <option value="">Select Patient</option>
                {patients.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.fullName || p.name} - {p.phone}
                  </option>
                ))}
              </select>
              {errors.patientId && (
                <span className="error-text">{errors.patientId}</span>
              )}
            </div>
            <div className="field">
              <label>Medical Record *</label>
              <select
                name="medicalRecordId"
                value={formData.medicalRecordId}
                onChange={handleChange}
                disabled={!formData.patientId}
                className={errors.medicalRecordId ? "error" : ""}
              >
                <option value="">Select Medical Record</option>
                {filteredRecords.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.diagnosis} - {new Date(r.createdAt).toLocaleDateString()}
                  </option>
                ))}
              </select>
              {errors.medicalRecordId && (
                <span className="error-text">{errors.medicalRecordId}</span>
              )}
            </div>
          </div>

          <div className="field">
            <label>Doctor Notes</label>
            <textarea
              name="doctorNotes"
              rows="2"
              value={formData.doctorNotes}
              onChange={handleChange}
              placeholder="Additional notes for the lab..."
            />
          </div>

          <div className="field">
            <label>
              Select Tests * ({formData.selectedTests.length} selected - Total:{" "}
              {totalPrice} EGP)
            </label>
            {errors.selectedTests && (
              <span className="error-text">{errors.selectedTests}</span>
            )}
            <div className="tests-selection">
              {labTests
                .filter((t) => t.isActive)
                .map((test) => (
                  <label
                    key={test._id}
                    className={`test-option ${formData.selectedTests.includes(test._id) ? "selected" : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.selectedTests.includes(test._id)}
                      onChange={() => handleTestToggle(test._id)}
                    />
                    <div className="test-option-info">
                      <strong>{test.name}</strong>
                      <small>
                        {test.code} • {test.category}
                      </small>
                    </div>
                    <span className="test-price">{test.price} EGP</span>
                  </label>
                ))}
            </div>
          </div>

          <div className="modal-btns">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==================== Component: View Order Modal ====================
function ViewOrderModal({ orderId, onClose, onAddResult, onCancel }) {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getLabOrderById(orderId);
        setOrder(res.data?.data);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="modal-overlay">
        <div className="modal-card modal-large">
          <div className="loading-container">
            <div className="spinner-border text-primary" role="status"></div>
            <p>Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card modal-large"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>
            <i className="bi bi-clipboard2-pulse me-2"></i>
            Lab Order Details
          </h2>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <div className="order-details">
          <div className="details-section">
            <h3>
              <i className="bi bi-info-circle me-2"></i>Order Information
            </h3>
            <div className="details-grid">
              <div className="detail-item">
                <label>Status</label>
                <span
                  className={`status-badge ${getStatusColor(order.orderStatus)}`}
                >
                  {order.orderStatus}
                </span>
              </div>
              <div className="detail-item">
                <label>Patient</label>
                <span>
                  {order.patientId?.fullName || order.patientId?.name || "N/A"}
                </span>
              </div>
              <div className="detail-item">
                <label>Phone</label>
                <span>{order.patientId?.phone || "-"}</span>
              </div>
              <div className="detail-item">
                <label>Total Price</label>
                <span className="price-value">{order.totalPrice} EGP</span>
              </div>
              <div className="detail-item">
                <label>Created At</label>
                <span>{new Date(order.createdAt).toLocaleString()}</span>
              </div>
            </div>
            {order.doctorNotes && (
              <div className="detail-block" style={{ marginTop: "12px" }}>
                <label>Doctor Notes</label>
                <p>{order.doctorNotes}</p>
              </div>
            )}
          </div>

          <div className="details-section">
            <h3>
              <i className="bi bi-list-check me-2"></i>Tests (
              {order.tests?.length || 0})
            </h3>
            <div className="tests-results">
              {order.tests?.map((test, idx) => (
                <div key={idx} className="test-result-card">
                  <div className="test-result-header">
                    <div>
                      <strong>
                        {test.testName ||
                          test.labTestId?.name ||
                          "Unknown Test"}
                      </strong>
                      <small>
                        {test.labTestId?.code || ""} • {test.price} EGP
                      </small>
                    </div>
                    <span
                      className={`status-badge ${getStatusColor(test.status)}`}
                    >
                      {test.status}
                    </span>
                  </div>

                  {test.labTestId?.normalRange && (
                    <div className="test-normal-range">
                      <small>
                        Normal Range: {test.labTestId.normalRange}{" "}
                        {test.labTestId.unit || ""}
                      </small>
                    </div>
                  )}

                  {test.result && (
                    <div className="test-result-values">
                      <div className="result-value">
                        <label>Result:</label>
                        <span
                          className={
                            test.result.isNormal
                              ? "normal-value"
                              : "abnormal-value"
                          }
                        >
                          {test.result.value} {test.result.unit || ""}
                        </span>
                        {test.result.isNormal !== undefined && (
                          <span
                            className={`normal-indicator ${test.result.isNormal ? "normal" : "abnormal"}`}
                          >
                            {test.result.isNormal ? "✓ Normal" : "✗ Abnormal"}
                          </span>
                        )}
                      </div>
                      {test.result.notes && (
                        <div className="result-notes">
                          <small>Notes: {test.result.notes}</small>
                        </div>
                      )}
                    </div>
                  )}

                  {test.status !== "completed" &&
                    test.status !== "cancelled" && (
                      <button
                        className="btn-add-result"
                        onClick={() => onAddResult(order._id, idx, test)}
                      >
                        <i className="bi bi-plus-circle me-1"></i>
                        Add Result
                      </button>
                    )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="modal-btns">
          {order.orderStatus !== "completed" &&
            order.orderStatus !== "cancelled" && (
              <button
                className="btn-cancel-order"
                onClick={() => onCancel(order._id)}
              >
                <i className="bi bi-x-circle me-1"></i>
                Cancel Order
              </button>
            )}
          <button className="btn-cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ==================== Component: Add Result Modal ====================
function AddResultModal({ orderId, testIndex, test, onClose, onSave }) {
  const [formData, setFormData] = useState({
    value: test?.result?.value || "",
    unit: test?.result?.unit || test?.labTestId?.unit || "",
    isNormal: test?.result?.isNormal ?? true,
    notes: test?.result?.notes || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.value.trim()) {
      alert("Result value is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await addTestResult(orderId, { testIndex, result: formData });
      onSave();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add result");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className="bi bi-clipboard-data me-2"></i>Add Test Result
          </h2>
          <button className="btn-close" onClick={onClose}></button>
        </div>

        <div className="test-info-banner">
          <strong>{test?.testName || test?.labTestId?.name || "Test"}</strong>
          {test?.labTestId?.normalRange && (
            <small>
              Normal Range: {test.labTestId.normalRange}{" "}
              {test.labTestId.unit || ""}
            </small>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="field">
              <label>Result Value *</label>
              <input
                type="text"
                name="value"
                value={formData.value}
                onChange={handleChange}
                placeholder="e.g., 5.2"
                required
              />
            </div>
            <div className="field">
              <label>Unit</label>
              <input
                type="text"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                placeholder="e.g., mg/dL"
              />
            </div>
          </div>

          <div className="field checkbox-field">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isNormal"
                checked={formData.isNormal}
                onChange={handleChange}
              />
              <span>Result is within normal range</span>
            </label>
          </div>

          <div className="field">
            <label>Notes</label>
            <textarea
              name="notes"
              rows="2"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes..."
            />
          </div>

          <div className="modal-btns">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Result"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==================== Main Component: Laboratory ====================
export default function Laboratory() {
  const [activeTab, setActiveTab] = useState("tests"); // "tests" or "orders"

  // ==================== Lab Tests State ====================
  const [tests, setTests] = useState([]);
  const [testsLoading, setTestsLoading] = useState(true);
  const [testSearch, setTestSearch] = useState("");
  const [testCategoryFilter, setTestCategoryFilter] = useState("");
  const [showTestModal, setShowTestModal] = useState(false);
  const [editingTest, setEditingTest] = useState(null);

  // ==================== Lab Orders State ====================
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [orderStatusFilter, setOrderStatusFilter] = useState("");
  const [patients, setPatients] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [showCreateOrderModal, setShowCreateOrderModal] = useState(false);
  const [viewingOrderId, setViewingOrderId] = useState(null);
  const [addResultData, setAddResultData] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ==================== Fetch Lab Tests ====================
  const fetchTests = useCallback(async () => {
    setTestsLoading(true);
    try {
      const params = {};
      if (testSearch) params.search = testSearch;
      if (testCategoryFilter) params.category = testCategoryFilter;

      const res = await getAllLabTests(params);
      setTests(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching lab tests:", err);
    } finally {
      setTestsLoading(false);
    }
  }, [testSearch, testCategoryFilter]);

  // ==================== Fetch Lab Orders ====================
  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    try {
      const params = {};
      if (orderStatusFilter) params.status = orderStatusFilter;

      const [ordersRes, patientsRes, recordsRes, testsRes] =
        await Promise.allSettled([
          getAllLabOrders(params),
          getPatients(),
          getMedicalRecords(),
          getAllLabTests({ activeOnly: "true" }),
        ]);

      if (ordersRes.status === "fulfilled")
        setOrders(ordersRes.value.data?.data || []);
      if (patientsRes.status === "fulfilled")
        setPatients(patientsRes.value.data?.data || []);
      if (recordsRes.status === "fulfilled")
        setMedicalRecords(recordsRes.value.data?.data || []);
      if (testsRes.status === "fulfilled")
        setLabTests(testsRes.value.data?.data || []);
    } catch (err) {
      console.error("Error fetching lab orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  }, [orderStatusFilter]);

  useEffect(() => {
    if (activeTab === "tests") {
      fetchTests();
    } else {
      fetchOrders();
    }
  }, [activeTab, fetchTests, fetchOrders]);

  // ==================== Handlers ====================
  const handleAddTest = () => {
    setEditingTest(null);
    setShowTestModal(true);
  };

  const handleEditTest = (test) => {
    setEditingTest(test);
    setShowTestModal(true);
  };

  const handleDeactivateTest = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this test?"))
      return;
    try {
      await deleteLabTest(id);
      fetchTests();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to deactivate test");
    }
  };

  const handleSaveTest = async () => {
    setShowTestModal(false);
    setEditingTest(null);
    await fetchTests();
  };

  const handleViewOrder = (orderId) => {
    setViewingOrderId(orderId);
  };

  const handleAddResult = (orderId, testIndex, test) => {
    setAddResultData({ orderId, testIndex, test });
  };

  const handleCancelOrder = async (orderId) => {
    const reason = window.prompt("Enter cancellation reason (optional):");
    if (reason === null) return;

    try {
      await cancelLabOrder(orderId, { reason });
      setViewingOrderId(null);
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel order");
    }
  };

  const handleSaveOrder = async () => {
    setShowCreateOrderModal(false);
    setAddResultData(null);
    setViewingOrderId(null);
    await fetchOrders();
  };

  // Get unique categories
  const categories = [...new Set(tests.map((t) => t.category))].filter(Boolean);

  // ==================== Loading ====================
  const isLoading = activeTab === "tests" ? testsLoading : ordersLoading;

  if (isLoading) {
    return (
      <div className="laboratory-page">
        <PageHeader />
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status"></div>
          <p>Loading laboratory data...</p>
        </div>
      </div>
    );
  }

  // ==================== Render ====================
  return (
    <div className="laboratory-page">
      <PageHeader />

      {/* Tabs */}
      <div className="lab-tabs">
        <button
          className={`lab-tab ${activeTab === "tests" ? "active" : ""}`}
          onClick={() => setActiveTab("tests")}
        >
          <i className="bi bi-clipboard2-pulse me-2"></i>
          Lab Tests
        </button>
        <button
          className={`lab-tab ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          <i className="bi bi-clipboard2-check me-2"></i>
          Lab Orders
        </button>
      </div>

      {/* ==================== Lab Tests Tab ==================== */}
      {activeTab === "tests" && (
        <div className="tab-content">
          {/* Stats */}
          <div className="lab-stats-container">
            <div className="lab-stat-card">
              <div className="lab-icon-box blue-card">
                <i className="bi bi-clipboard2-pulse-fill"></i>
              </div>
              <div className="lab-stat-info">
                <span>Total Tests</span>
                <h3>{tests.length}</h3>
                <small>All lab tests</small>
              </div>
            </div>
            <div className="lab-stat-card">
              <div className="lab-icon-box green-card">
                <i className="bi bi-check-circle-fill"></i>
              </div>
              <div className="lab-stat-info">
                <span>Active Tests</span>
                <h3>{tests.filter((t) => t.isActive).length}</h3>
                <small>Available for orders</small>
              </div>
            </div>
            <div className="lab-stat-card">
              <div className="lab-icon-box purple-card">
                <i className="bi bi-tags-fill"></i>
              </div>
              <div className="lab-stat-info">
                <span>Categories</span>
                <h3>{categories.length}</h3>
                <small>Unique categories</small>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="filter-card">
            <div className="filter-group">
              <div className="search-wrapper">
                <i className="bi bi-search search-icon"></i>
                <input
                  type="text"
                  className="input-field search-input"
                  placeholder="Search by name or code..."
                  value={testSearch}
                  onChange={(e) => setTestSearch(e.target.value)}
                />
              </div>

              <select
                className="input-field select-input"
                value={testCategoryFilter}
                onChange={(e) => setTestCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {(testSearch || testCategoryFilter) && (
                <button
                  className="btn-reset"
                  onClick={() => {
                    setTestSearch("");
                    setTestCategoryFilter("");
                  }}
                >
                  Reset
                </button>
              )}
            </div>

            <button className="btn-add-new" onClick={handleAddTest}>
              + New Test
            </button>
          </div>

          {/* Table */}
          <div className="table-card">
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Test Name</th>
                    <th>Code</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.length > 0 ? (
                    tests.map((test, index) => (
                      <tr key={test._id}>
                        <td>
                          <span className="record-number">{index + 1}</span>
                        </td>
                        <td>
                          <div className="test-name-cell">
                            <strong>{test.name}</strong>
                            {test.normalRange && (
                              <small>Range: {test.normalRange}</small>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="code-badge">{test.code}</span>
                        </td>
                        <td>
                          <span className="category-badge">
                            {test.category}
                          </span>
                        </td>
                        <td>
                          <span className="price-value">{test.price} EGP</span>
                        </td>
                        <td>
                          <span
                            className={`status-badge ${test.isActive ? "status-completed" : "status-cancelled"}`}
                          >
                            {test.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td>
                          <div className="actions-cell">
                            <button
                              className="btn-action edit"
                              title="Edit"
                              onClick={() => handleEditTest(test)}
                            >
                              <i className="bi bi-pencil-fill"></i>
                            </button>
                            {test.isActive && (
                              <button
                                className="btn-action delete"
                                title="Deactivate"
                                onClick={() => handleDeactivateTest(test._id)}
                              >
                                <i className="bi bi-slash-circle-fill"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="empty-state">
                        <i
                          className="bi bi-clipboard-x"
                          style={{ fontSize: "3rem", color: "#ccc" }}
                        ></i>
                        <p>No lab tests found</p>
                        <button className="btn-add-new" onClick={handleAddTest}>
                          + Create First Test
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== Lab Orders Tab ==================== */}
      {activeTab === "orders" && (
        <div className="tab-content">
          {/* Stats */}
          <div className="lab-stats-container">
            <div className="lab-stat-card">
              <div className="lab-icon-box blue-card">
                <i className="bi bi-clipboard2-pulse-fill"></i>
              </div>
              <div className="lab-stat-info">
                <span>Total Orders</span>
                <h3>{orders.length}</h3>
                <small>All lab orders</small>
              </div>
            </div>
            <div className="lab-stat-card">
              <div className="lab-icon-box orange-card">
                <i className="bi bi-hourglass-split"></i>
              </div>
              <div className="lab-stat-info">
                <span>Pending</span>
                <h3>
                  {orders.filter((o) => o.orderStatus === "pending").length}
                </h3>
                <small>Awaiting processing</small>
              </div>
            </div>
            <div className="lab-stat-card">
              <div className="lab-icon-box green-card">
                <i className="bi bi-check-circle-fill"></i>
              </div>
              <div className="lab-stat-info">
                <span>Completed</span>
                <h3>
                  {orders.filter((o) => o.orderStatus === "completed").length}
                </h3>
                <small>Finished orders</small>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="filter-card">
            <div className="filter-group">
              <select
                className="input-field select-input"
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {orderStatusFilter && (
                <button
                  className="btn-reset"
                  onClick={() => setOrderStatusFilter("")}
                >
                  Reset
                </button>
              )}
            </div>

            <button
              className="btn-add-new"
              onClick={() => setShowCreateOrderModal(true)}
            >
              + New Order
            </button>
          </div>

          {/* Table */}
          <div className="table-card">
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Patient</th>
                    <th>Tests</th>
                    <th>Total Price</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length > 0 ? (
                    orders.map((order, index) => (
                      <tr key={order._id}>
                        <td>
                          <span className="record-number">{index + 1}</span>
                        </td>
                        <td>
                          <div className="patient-cell">
                            <div className="patient-avatar">
                              <i className="bi bi-person-fill"></i>
                            </div>
                            <div>
                              <strong>
                                {order.patientId?.fullName ||
                                  order.patientId?.name ||
                                  "Unknown"}
                              </strong>
                              <small>{order.patientId?.phone || "-"}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="tests-count">
                            {order.tests?.length || 0} test(s)
                          </span>
                        </td>
                        <td>
                          <span className="price-value">
                            {order.totalPrice} EGP
                          </span>
                        </td>
                        <td>
                          <span
                            className={`status-badge ${getStatusColor(order.orderStatus)}`}
                          >
                            {order.orderStatus}
                          </span>
                        </td>
                        <td>
                          <div className="date-cell">
                            <strong>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </strong>
                            <small>
                              {new Date(order.createdAt).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </small>
                          </div>
                        </td>
                        <td>
                          <div className="actions-cell">
                            <button
                              className="btn-action view"
                              title="View Details"
                              onClick={() => handleViewOrder(order._id)}
                            >
                              <i className="bi bi-eye-fill"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="empty-state">
                        <i
                          className="bi bi-clipboard-x"
                          style={{ fontSize: "3rem", color: "#ccc" }}
                        ></i>
                        <p>No lab orders found</p>
                        <button
                          className="btn-add-new"
                          onClick={() => setShowCreateOrderModal(true)}
                        >
                          + Create First Order
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== Modals ==================== */}
      {showTestModal && (
        <TestModal
          editingTest={editingTest}
          onClose={() => {
            setShowTestModal(false);
            setEditingTest(null);
          }}
          onSave={handleSaveTest}
        />
      )}

      {showCreateOrderModal && (
        <CreateOrderModal
          patients={patients}
          medicalRecords={medicalRecords}
          labTests={labTests}
          onClose={() => setShowCreateOrderModal(false)}
          onSave={handleSaveOrder}
        />
      )}

      {viewingOrderId && (
        <ViewOrderModal
          orderId={viewingOrderId}
          onClose={() => setViewingOrderId(null)}
          onAddResult={handleAddResult}
          onCancel={handleCancelOrder}
        />
      )}

      {addResultData && (
        <AddResultModal
          orderId={addResultData.orderId}
          testIndex={addResultData.testIndex}
          test={addResultData.test}
          onClose={() => setAddResultData(null)}
          onSave={handleSaveOrder}
        />
      )}
    </div>
  );
}
