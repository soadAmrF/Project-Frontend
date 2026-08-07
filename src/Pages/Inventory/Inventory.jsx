import { useEffect, useState, useCallback } from "react";
import {
  getAllInventory,
  createInventory,
  updateInventory,
  deleteInventory,
  getAllInventoryTransactions,
  createInventoryTransaction,
} from "../../services/api";

import InventoryStats from "./components/InventoryStats";
import SearchBar from "./components/SearchBar";
import InventoryModal from "./components/InventoryModal";
import InventoryTable from "./components/InventoryTable";
import TransactionModal from "./components/TransactionModal";
import TransactionTable from "./components/TransactionTable";

import "./Inventory.css";

export default function Inventory() {
  const [activeTab, setActiveTab] = useState("items");

  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    lowStock: false,
    expired: false,
  });

  const [showItemModal, setShowItemModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(false);
  const [showTxModal, setShowTxModal] = useState(false);

  
  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.lowStock) params.lowStock = "true";
      if (filters.expired) params.expired = "true";

      const res = await getAllInventory(params);
      const data = res?.data?.data || res?.data || [];
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  
  const loadTransactions = useCallback(async () => {
    setTxLoading(true);
    try {
      const res = await getAllInventoryTransactions();
      const data = res?.data?.data || res?.data || [];
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setTxLoading(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  useEffect(() => {
    if (activeTab === "transactions") {
      loadTransactions();
    }
  }, [activeTab, loadTransactions]);

  
  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchInput.trim() }));
  };

  const openAddModal = () => {
    setCurrentItem(null);
    setShowItemModal(true);
  };

  const openEditModal = (item) => {
    setCurrentItem(item);
    setShowItemModal(true);
  };

  const handleSaveItem = async (payload) => {
    if (currentItem?._id) {
      await updateInventory(currentItem._id, payload);
    } else {
      await createInventory(payload);
    }
    loadItems();
  };

  const handleDeleteItem = async (item) => {
    if (!window.confirm(`هل تريد تعطيل الصنف "${item.name}"؟`)) return;

    try {
      await deleteInventory(item._id);
      loadItems();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveTransaction = async (payload) => {
    await createInventoryTransaction(payload);
    loadTransactions();
    loadItems();
  };

  return (
    <div className="container-fluid py-4 inventory-page">
      {}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <h2 className="mb-0">المخزن</h2>

        <div className="d-flex gap-2">
          {activeTab === "items" ? (
            <button className="btn btn-primary" onClick={openAddModal}>
              + صنف جديد
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => setShowTxModal(true)}
            >
              + حركة جديدة
            </button>
          )}
        </div>
      </div>

      {}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "items" ? "active" : ""}`}
            onClick={() => setActiveTab("items")}
          >
            الأصناف
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "transactions" ? "active" : ""}`}
            onClick={() => setActiveTab("transactions")}
          >
            حركات المخزن
          </button>
        </li>
      </ul>

      {}
      {activeTab === "items" && (
        <>
          <InventoryStats items={items} />

          <SearchBar
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            onSearch={handleSearch}
            filters={filters}
            setFilters={setFilters}
          />

          <InventoryTable
            items={items}
            loading={loading}
            onEdit={openEditModal}
            onDelete={handleDeleteItem}
          />
        </>
      )}

      {}
      {activeTab === "transactions" && (
        <TransactionTable transactions={transactions} loading={txLoading} />
      )}

      {}
      <InventoryModal
        show={showItemModal}
        onClose={() => setShowItemModal(false)}
        onSave={handleSaveItem}
        currentItem={currentItem}
      />

      <TransactionModal
        show={showTxModal}
        onClose={() => setShowTxModal(false)}
        onSave={handleSaveTransaction}
        items={items}
      />
    </div>
  );
}
