import { useEffect, useState, useCallback } from "react";
import {
  getAllLabOrders,
  addTestResult,
  updateLabOrderStatus,
} from "../../services/api";

import LabStats from "./components/LabStats";
import LabSearchBar from "./components/LabSearchBar";
import LabOrderTable from "./components/LabOrderTable";
import OrderDetailsModal from "./components/OrderDetailsModal";
import AddResultModal from "./components/AddResultModal";

import "./Laboratory.css";

export default function Laboratory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ status: "", patientName: "" });

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.status) params.status = filters.status;

      
      const res = await getAllLabOrders(params);
      const data = res?.data?.data || res?.data || [];
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load lab orders:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleAddResultClick = (order) => {
    setSelectedOrder(order);
    setShowResultModal(true);
  };

  const handleSaveResult = async (orderId, payload) => {
    await addTestResult(orderId, payload);
    loadOrders(); 
  };

  return (
    <div className="container-fluid py-4 laboratory-page">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h2 className="mb-0">المعمل</h2>
      </div>

      <LabStats orders={orders} />

      <LabSearchBar filters={filters} setFilters={setFilters} />

      <LabOrderTable
        orders={orders}
        loading={loading}
        onView={handleViewDetails}
        onAddResult={handleAddResultClick}
      />

      <OrderDetailsModal
        show={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        order={selectedOrder}
      />

      <AddResultModal
        show={showResultModal}
        onClose={() => setShowResultModal(false)}
        onSave={handleSaveResult}
        order={selectedOrder}
      />
    </div>
  );
}
