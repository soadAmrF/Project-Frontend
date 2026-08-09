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

  // ==================== Get Patients ====================

  const fetchPatientsData = async () => {
    setIsLoading(true);

    try {
      const res = await getPatients();

      const data = res?.data?.data || res?.data || [];

      setPatients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setPatients([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientsData();
  }, []);

  // ==================== Save Patient ====================

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

  // ==================== Delete Patient ====================

  const handleDeletePatient = async (id) => {
    if (!id) return;

    const confirmed = window.confirm(
      "هل أنت متأكد من حذف هذا المريض؟\nسيتم حذف جميع سجلاته الطبية أيضاً.",
    );

    if (!confirmed) return;

    try {
      await deletePatient(id);

      setPatients((prev) =>
        prev.filter((patient) => (patient._id || patient.id) !== id),
      );
    } catch (err) {
      console.error("Error deleting patient:", err);
    }
  };

  // ==================== Modal ====================

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

  // ==================== Search ====================

  const searchValue = search.trim().toLowerCase();

  const filteredPatients = patients.filter((patient) => {
    const name = String(
      patient.fullName ||
        patient.name ||
        patient.patientName ||
        patient.patientId?.fullName ||
        "",
    ).toLowerCase();

    const phone = String(
      patient.phone || patient.patientPhone || patient.patientId?.phone || "",
    ).toLowerCase();

    const email = String(
      patient.email || patient.patientEmail || patient.patientId?.email || "",
    ).toLowerCase();

    const id = String(
      patient._id ||
        patient.id ||
        patient.patientId?._id ||
        patient.patientId?.id ||
        "",
    ).toLowerCase();

    const matchesSearch =
      searchValue === "" ||
      name.includes(searchValue) ||
      phone.includes(searchValue) ||
      email.includes(searchValue) ||
      id.includes(searchValue);

    const gender = String(patient.gender || "").toLowerCase();

    const selectedGender = genderFilter.toLowerCase();

    const matchesGender = genderFilter === "" || gender === selectedGender;

    return matchesSearch && matchesGender;
  });

  // ==================== Clear Filters ====================

  const clearFilters = () => {
    setSearch("");
    setGenderFilter("");
  };

  return (
    <div className="patients-page">
      <PageHeader
        title="Patients"
        subtitle="Manage patients and medical records"
      />

      {/* ==================== Stats ==================== */}

      <PatientStats patients={patients} />

      {/* ==================== Filters ==================== */}

      <div className="filter-card">
        <div className="filter-group">
          <div className="search-wrapper">
            <i className="bi bi-search"></i>

            <input
              type="text"
              placeholder="Search patient name, phone, email, or ID..."
              className="input-field search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                type="button"
                className="search-clear"
                onClick={() => setSearch("")}
              >
                ×
              </button>
            )}
          </div>

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
            <button type="button" className="btn-reset" onClick={clearFilters}>
              Reset
            </button>
          )}
        </div>

        <button type="button" className="btn-add-new" onClick={openAddModal}>
          <i className="bi bi-plus-lg"></i>
          New Patient
        </button>
      </div>

      {/* ==================== Results Info ==================== */}

      {(search || genderFilter) && (
        <div className="search-results-info">
          <span>
            <i className="bi bi-search"></i>
            {filteredPatients.length} patient
            {filteredPatients.length !== 1 ? "s" : ""} found
          </span>
        </div>
      )}

      {/* ==================== Medical Section ==================== */}

      <PatientMedicalSection
        patients={filteredPatients}
        allPatients={patients}
        onDeletePatient={handleDeletePatient}
        onEditPatient={openEditModal}
        isLoading={isLoading}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* ==================== Modal ==================== */}

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
