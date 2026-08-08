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

  const [activeTab, setActiveTab] = useState("records");
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  const fetchPatientsData = async () => {
    setIsLoading(true);
    try {
      const res = await getPatients();
      const data = res?.data?.data || res?.data || [];
      setPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching patients:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientsData();
  }, []);

  const handleSavePatient = async (formData) => {
    setIsSubmitting(true);
    try {
      if (editingPatient) {
        const patientId = editingPatient._id || editingPatient.id;
        await updatePatient(patientId, formData);
      } else {
        await addPatient({
          ...formData,
          category: formData.category || activeTab,
        });
      }

      await fetchPatientsData();
      closeModal();
    } catch (err) {
      console.error("Error saving patient:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

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
      setPatients((prev) => prev.filter((p) => (p._id || p.id) !== id));
    } catch (err) {
      console.error("Error deleting patient:", err);
    }
  };

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

  const filteredPatients = patients.filter((item) => {
    const pName = (
      item.fullName ||
      item.name ||
      item.patientName ||
      ""
    ).toLowerCase();
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
        isLoading={isLoading}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {showModal && (
        <PatientModal
          patient={editingPatient}
          onClose={closeModal}
          onSave={handleSavePatient}
          isSubmitting={isSubmitting}
          activeTab={activeTab}
        />
      )}
    </div>
  );
}
