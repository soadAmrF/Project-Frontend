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
import PageHeader from "@/components/PageHeader";

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

  // =========================
  // LOAD INVENTORY
  // =========================

  const loadItems = useCallback(async () => {
    setLoading(true);

    try {
      const params = {};

      if (filters.search) {
        params.search = filters.search;
      }

      if (filters.lowStock) {
        params.lowStock = "true";
      }

      if (filters.expired) {
        params.expired = "true";
      }

      const res = await getAllInventory(params);

      const data = res?.data?.data || res?.data || [];

      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load inventory:", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // =========================
  // LOAD TRANSACTIONS
  // =========================

  const loadTransactions = useCallback(async () => {
    setTxLoading(true);

    try {
      const res = await getAllInventoryTransactions();

      const data = res?.data?.data || res?.data || [];

      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load transactions:", err);
    } finally {
      setTxLoading(false);
    }
  }, []);

  // =========================
  // EFFECTS
  // =========================

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  useEffect(() => {
    if (activeTab === "transactions") {
      loadTransactions();
    }
  }, [activeTab, loadTransactions]);

  // =========================
  // SEARCH
  // =========================

  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      search: searchInput.trim(),
    }));
  };

  // =========================
  // ADD ITEM
  // =========================

  const openAddModal = () => {
    setCurrentItem(null);
    setShowItemModal(true);
  };

  // =========================
  // EDIT ITEM
  // =========================

  const openEditModal = (item) => {
    setCurrentItem(item);
    setShowItemModal(true);
  };

  // =========================
  // SAVE ITEM
  // =========================

  const handleSaveItem = async (payload) => {
    if (currentItem?._id) {
      await updateInventory(currentItem._id, payload);
    } else {
      await createInventory(payload);
    }

    await loadItems();
  };

  // =========================
  // DELETE ITEM
  // =========================

  const handleDeleteItem = async (item) => {
    const confirmed = window.confirm(
      `Do you want to deactivate "${item.name}"?`,
    );

    if (!confirmed) return;

    try {
      await deleteInventory(item._id);
      await loadItems();
    } catch (err) {
      console.error(err);

      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete item.",
      );
    }
  };

  // =========================
  // SAVE TRANSACTION
  // =========================

  const handleSaveTransaction = async (payload) => {
    await createInventoryTransaction(payload);

    await loadTransactions();
    await loadItems();
  };

  return (
    <div className="inventory-page">
      {/* =========================
          PAGE HEADER
      ========================= */}

      <div className="inventory-page-header">
        <div className="inventory-title-row">
          <div className="inventory-page-icon">
            <i className="bi bi-box-seam"></i>
          </div>

          <div>
            <PageHeader />
          </div>
        </div>

        <div className="inventory-header-actions">
          {activeTab === "items" ? (
            <button
              type="button"
              className="inventory-primary-btn"
              onClick={openAddModal}
            >
              <i className="bi bi-plus-lg"></i>
              Add Item
            </button>
          ) : (
            <button
              type="button"
              className="inventory-primary-btn"
              onClick={() => setShowTxModal(true)}
            >
              <i className="bi bi-arrow-left-right"></i>
              Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* =========================
          TABS
      ========================= */}

      <div className="inventory-tabs-wrapper">
        <button
          type="button"
          className={`inventory-tab ${activeTab === "items" ? "active" : ""}`}
          onClick={() => setActiveTab("items")}
        >
          <i className="bi bi-box-seam"></i>
          Items
        </button>

        <button
          type="button"
          className={`inventory-tab ${
            activeTab === "transactions" ? "active" : ""
          }`}
          onClick={() => setActiveTab("transactions")}
        >
          <i className="bi bi-arrow-left-right"></i>
          Transactions
        </button>
      </div>

      {/* =========================
          CONTENT
      ========================= */}

      <div className="inventory-content">
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

        {activeTab === "transactions" && (
          <TransactionTable transactions={transactions} loading={txLoading} />
        )}
      </div>

      {/* =========================
          ITEM MODAL
      ========================= */}

      <InventoryModal
        show={showItemModal}
        onClose={() => {
          setShowItemModal(false);
          setCurrentItem(null);
        }}
        onSave={handleSaveItem}
        currentItem={currentItem}
      />

      {/* =========================
          TRANSACTION MODAL
      ========================= */}

      <TransactionModal
        show={showTxModal}
        onClose={() => setShowTxModal(false)}
        onSave={handleSaveTransaction}
        items={items}
      />
    </div>
  );
}
