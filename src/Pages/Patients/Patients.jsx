import React, { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import {
  getPatients,
  addPatient,
  updatePatient,
  deletePatient,
} from "@/services/api";
import PatientStats from "./Components/PatientStats";
import PatientMedicalSection from "./Components/PatientMedicalSection";
import PatientModal from "./Components/PatientModal";
import "./Patients.css";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  // ==================== Fetch Data ====================
  const fetchPatientsData = async () => {
    setIsLoading(true);
    try {
      const res = await getPatients();
      const data = res?.data?.data || res?.data || [];
      setPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching patients:", err);
      alert(err.response?.data?.message || "فشل في تحميل بيانات المرضى");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientsData();
  }, []);

  // ==================== Add / Update ====================
  const handleSavePatient = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingPatient) {
        // ✅ تحديث مريض موجود
        const patientId = editingPatient._id || editingPatient.id;
        await updatePatient(patientId, formData);
      } else {
        // ✅ إضافة مريض جديد
        await addPatient(formData);
      }

      // إعادة تحميل البيانات من السيرفر
      await fetchPatientsData();
      closeModal();
    } catch (err) {
      console.error("Error saving patient:", err);
      alert(err.response?.data?.message || "فشل في حفظ بيانات المريض");
      throw err; // عشان الـ Modal يعرف إن فيه خطأ
    } finally {
      setIsSubmitting(false);
    }
  };

  // ==================== Delete ====================
  const handleDeletePatient = async (id) => {
    if (
      !window.confirm(
        "هل أنت متأكد من حذف هذا المريض؟\nسيتم حذف جميع سجلاته الطبية أيضاً.",
      )
    ) {
      return;
    }

    try {
      await deletePatient(id);
      // إزالة من القائمة المحلية فوراً (تحسين UX)
      setPatients((prev) => prev.filter((p) => (p._id || p.id) !== id));
    } catch (err) {
      console.error("Error deleting patient:", err);
      alert(err.response?.data?.message || "فشل في حذف المريض");
    }
  };

  // ==================== Modal Handlers ====================
  const openAddModal = () => {
    setEditingPatient(null);
    setShowModal(true);
  };

  const openEditModal = (patient) => {
    setEditingPatient(patient);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPatient(null);
  };

  // ==================== Filtering ====================
  const filteredPatients = patients.filter((item) => {
    const pName = (item.fullName || item.name || "").toLowerCase();
    const pPhone = String(item.phone || "");
    const pEmail = (item.email || "").toLowerCase();
    const pId = String(item._id || item.id || "").toLowerCase();

    const searchLower = search.toLowerCase();
    const matchesSearch =
      pName.includes(searchLower) ||
      pPhone.includes(search) ||
      pEmail.includes(searchLower) ||
      pId.includes(searchLower);

    const matchesGender = genderFilter === "" || item.gender === genderFilter;

    return matchesSearch && matchesGender;
  });

  // ==================== Loading State ====================
  if (isLoading) {
    return (
      <div className="patients-page">
        <PageHeader />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{ color: "#666" }}>جاري تحميل بيانات المرضى...</p>
        </div>
      </div>
    );
  }

  // ==================== Render ====================
  return (
    <div className="patients-page">
      <PageHeader />

      <PatientStats patients={patients} />

      <div className="filter-card">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Search patient name, phone, email, or ID..."
            className="input-field search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="input-field select-input"
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
          >
            <option value="">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {(search || genderFilter) && (
            <button
              className="btn-reset"
              onClick={() => {
                setSearch("");
                setGenderFilter("");
              }}
            >
              Reset
            </button>
          )}
        </div>
        <button className="btn-add-new" onClick={openAddModal}>
          + New Patient
        </button>
      </div>

      <PatientMedicalSection
        patients={filteredPatients}
        onDeletePatient={handleDeletePatient}
        onEditPatient={openEditModal}
        isLoading={isSubmitting}
      />

      {showModal && (
        <PatientModal
          patient={editingPatient}
          onClose={closeModal}
          onSave={handleSavePatient}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
