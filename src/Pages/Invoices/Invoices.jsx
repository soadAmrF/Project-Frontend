import React, { useState, useEffect } from "react";
import InvoiceStats from "./Components/InvoiceStats";
import InvoiceTable from "./Components/InvoiceTable";
import NewInvoiceDrawer from "./Components/NewInvoiceDrawer";
import "./Invoices.css";

export default function Invoices() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // 1. قراءة الفواتير من localStorage أولاً كقيمة أولية لكي لا يختفي شيء عند الـ Refresh
  const [invoices, setInvoices] = useState(() => {
    const savedInvoices = localStorage.getItem("app_invoices");
    return savedInvoices ? JSON.parse(savedInvoices) : [];
  });

  // 2. مزامنة وتحديث localStorage فور تغير قائمة الفواتير
  useEffect(() => {
    localStorage.setItem("app_invoices", JSON.stringify(invoices));
  }, [invoices]);

  // 3. جلب البيانات من الباك إند (اختياري عند وجود سيرفر)
  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch("/api/invoices");
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setInvoices(data);
        }
      }
    } catch (error) {
      console.log("Using local persistence storage");
    }
  };

  // 4. حفظ الفاتورة بالجهة الرئيسية والباك إند والذاكرة
  const handleSaveInvoice = async (newInv) => {
    const tempInvoice = {
      ...newInv,
      _id: Date.now().toString(),
      invoiceNumber:
        newInv.invoiceNumber ||
        `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
    };

    // إضافتها أعلى القائمة مباشرة
    setInvoices((prev) => [tempInvoice, ...prev]);

    setSearch("");
    setStatusFilter("");
    setIsModalOpen(false);

    // إرسالها للباك إند في الخلفية
    try {
      await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tempInvoice),
      });
    } catch (error) {
      console.error("Backend offline, saved locally.", error);
    }
  };

  // 5. حذف الفاتورة
  const handleDeleteInvoice = async (invoiceId, indexToDelete) => {
    setInvoices((prev) => prev.filter((_, idx) => idx !== indexToDelete));
    try {
      if (invoiceId) {
        await fetch(`/api/invoices/${invoiceId}`, { method: "DELETE" });
      }
    } catch (error) {
      console.error("Backend delete failed", error);
    }
  };

  // 6. فلترة الفواتير
  const filteredInvoices = invoices.filter((inv) => {
    const patientName = inv.patientName || inv.patient_name || "";
    const invNumber = inv.invoiceNumber || inv.invoice_number || "";

    const matchesSearch =
      invNumber.toString().toLowerCase().includes(search.toLowerCase()) ||
      patientName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter ? inv.status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="invoices-page">
      <h1>Invoices & Billing</h1>

      <InvoiceStats invoices={invoices} />

      <InvoiceTable
        invoices={filteredInvoices}
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onDeleteInvoice={handleDeleteInvoice}
        onPrintInvoice={() => window.print()}
        onOpenNewInvoiceModal={() => setIsModalOpen(true)}
      />

      <NewInvoiceDrawer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveInvoice}
      />
    </div>
  );
}
