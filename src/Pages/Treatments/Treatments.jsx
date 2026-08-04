import React, { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import TreatmentStatsCards from "./Components/TreatmentStatsCards";
import TreatmentActions from "./Components/TreatmentActions";
import TreatmentTable from "./Components/TreatmentTable";
import TreatmentModal from "./Components/TreatmentModal";
import { getTreatments } from "@/services/api";
import "./Treatments.css";

export default function Treatments() {
  const defaultData = [
    {
      id: "101",
      patientName: "Ahmed Ali",
      medicineName: "Amoxicillin 500mg",
      dosage: "1 capsule / 8h",
      duration: "7 days",
      instructions: "After food",
      status: "active",
    },
    {
      id: "102",
      patientName: "Sara Mahmoud",
      medicineName: "Panadol Extra",
      dosage: "2 tabs as needed",
      duration: "3 days",
      instructions: "Max 8 tabs/day",
      status: "completed",
    },
    {
      id: "103",
      patientName: "Mohamed Hassan",
      medicineName: "Ibuprofen 400mg",
      dosage: "1 tab / 12h",
      duration: "5 days",
      instructions: "With water",
      status: "active",
    },
    {
      id: "104",
      patientName: "Eman Omar",
      medicineName: "Augmentin 1g",
      dosage: "1 tab / 12h",
      duration: "7 days",
      instructions: "With meal",
      status: "pending",
    },
  ];

  const [treatments, setTreatments] = useState(defaultData);
  const [filtered, setFiltered] = useState(defaultData);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    getTreatments()
      .then((res) => {
        if (res?.data?.length) {
          setTreatments(res.data);
          setFiltered(res.data);
        }
      })
      .catch((err) => console.error("API Error:", err));
  }, []);

  // دالة الفلترة
  const handleSearch = (term) => {
    setSearch(term);
    setCurrentPage(1);
    if (!term.trim()) return setFiltered(treatments);
    const lower = term.toLowerCase();
    setFiltered(
      treatments.filter(
        (t) =>
          t.patientName?.toLowerCase().includes(lower) ||
          t.medicineName?.toLowerCase().includes(lower),
      ),
    );
  };

  // دالة الانتقال بين الصفحات مع إرجاع الشاشة لأعلى الجدول تلقائياً
  // دالة الانتقال البسيطة بدون أي تحريك للشاشة
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSave = (data) => {
    const updated = selected
      ? treatments.map((t) =>
          (t._id || t.id) === (selected._id || selected.id)
            ? { ...t, ...data }
            : t,
        )
      : [{ ...data, id: String(Date.now()).slice(-3) }, ...treatments];
    setTreatments(updated);
    setFiltered(updated);
  };

  const handleDelete = (id) => {
    const updated = treatments.filter((t) => (t._id || t.id) !== id);
    setTreatments(updated);
    setFiltered(updated);
  };

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const currentItems = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="treatment-container">
      <PageHeader />
      <TreatmentStatsCards treatments={treatments} />
      <TreatmentActions
        searchTerm={search}
        onSearchChange={handleSearch}
        onPrint={() => window.print()}
        onAdd={() => {
          setSelected(null);
          setIsModalOpen(true);
        }}
      />

      {/* 1. جدول البيانات */}
      <TreatmentTable
        treatments={currentItems}
        onDelete={handleDelete}
        onEdit={(item) => {
          setSelected(item);
          setIsModalOpen(true);
        }}
      />

      {/* 2. شريط الانتقال بالسكرول والتصفح */}
      <div className="pagination-wrapper">
        <button
          className="btn btn-secondary"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span style={{ fontSize: "13px", color: "#4b5563", fontWeight: 600 }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-secondary"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>

      <TreatmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={selected}
      />
    </div>
  );
}
