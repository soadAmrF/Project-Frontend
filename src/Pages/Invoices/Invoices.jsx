import React, { useEffect, useState } from "react";
import InvoiceTable from "./Components/InvoiceTable";
import NewInvoiceDrawer from "./Components/NewInvoiceDrawer";
import "./Invoices.css";
import PageHeader from "@/components/PageHeader";

const API_URL = "https://project-backend-ruddy-theta.vercel.app/api/v1/invoice";

export default function Invoices() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // GET ALL INVOICES
  // =========================
  const fetchInvoices = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      console.log("Invoices API:", result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to get invoices");
      }

      setInvoices(result.data || []);
    } catch (error) {
      console.error("Get invoices error:", error);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // =========================
  // CREATE INVOICE
  // =========================
  const handleSaveInvoice = async (newInvoice) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newInvoice),
      });

      const result = await response.json();

      console.log("Create invoice:", result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to create invoice");
      }

      await fetchInvoices();

      setSearch("");
      setStatusFilter("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Create invoice error:", error);
      alert(error.message);
    }
  };

  // =========================
  // CANCEL INVOICE
  // =========================
  const handleCancelInvoice = async (invoiceId) => {
    if (!invoiceId) return;

    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this invoice?",
    );

    if (!confirmCancel) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/${invoiceId}/cancel`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      console.log("Cancel invoice:", result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to cancel invoice");
      }

      await fetchInvoices();
    } catch (error) {
      console.error("Cancel invoice error:", error);
      alert(error.message);
    }
  };

  // =========================
  // STATS
  // =========================
  const totalBilled = invoices.reduce(
    (sum, invoice) => sum + (Number(invoice.total) || 0),
    0,
  );

  const paidCount = invoices.filter(
    (invoice) => invoice.status === "paid",
  ).length;

  const unpaidCount = invoices.filter(
    (invoice) => invoice.status === "unpaid",
  ).length;

  const cancelledCount = invoices.filter(
    (invoice) => invoice.status === "cancelled",
  ).length;

  // =========================
  // FILTER
  // =========================
  const filteredInvoices = invoices.filter((inv) => {
    const patientName = inv.patientId?.fullName || inv.patientName || "";

    const invoiceNumber = inv.invoiceNumber?.toString() || "";

    const doctorName =
      inv.doctorId?.userId?.fullName ||
      inv.doctorId?.userId?.fullname ||
      inv.doctorName ||
      "";

    const searchValue = search.toLowerCase().trim();

    const matchesSearch =
      invoiceNumber.toLowerCase().includes(searchValue) ||
      patientName.toLowerCase().includes(searchValue) ||
      doctorName.toLowerCase().includes(searchValue);

    const matchesStatus = statusFilter ? inv.status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="invoices-page">
        <PageHeader />


      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon icon-blue">
            <i className="bi bi-cash-stack"></i>
          </div>

          <div className="stat-info">
            <span className="stat-title">Total Billed</span>

            <h2 className="stat-value">
              {totalBilled.toLocaleString("en-EG", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              <small>EGP</small>
            </h2>

            <span className="stat-sub">All invoices</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-green">
            <i className="bi bi-check2-circle"></i>
          </div>

          <div className="stat-info">
            <span className="stat-title">Paid Invoices</span>

            <h2 className="stat-value text-green">{paidCount}</h2>

            <span className="stat-sub">Completed payments</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-orange">
            <i className="bi bi-clock-history"></i>
          </div>

          <div className="stat-info">
            <span className="stat-title">Unpaid Invoices</span>

            <h2 className="stat-value text-orange">{unpaidCount}</h2>

            <span className="stat-sub">Waiting for payment</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-gray">
            <i className="bi bi-x-circle"></i>
          </div>

          <div className="stat-info">
            <span className="stat-title">Cancelled</span>

            <h2 className="stat-value text-gray">{cancelledCount}</h2>

            <span className="stat-sub">Cancelled invoices</span>
          </div>
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="invoice-loading">
          <div className="loading-spinner"></div>
          <span>Loading invoices...</span>
        </div>
      ) : (
        <InvoiceTable
          invoices={filteredInvoices}
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onDeleteInvoice={handleCancelInvoice}
          onPrintInvoice={() => window.print()}
          onOpenNewInvoiceModal={() => setIsModalOpen(true)}
        />
      )}

      {/* DRAWER */}
      <NewInvoiceDrawer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveInvoice}
      />
    </div>
  );
}
