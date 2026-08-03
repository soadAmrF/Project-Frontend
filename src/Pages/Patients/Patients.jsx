import React, { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import { getPatients } from "@/services/api";
import PatientStats from "./Components/PatientStats";
import PatientMedicalSection from "./Components/PatientMedicalSection";
import PatientModal from "./Components/PatientModal";
import "./Patients.css";

const dummyPatients = [
  {
    _id: "1",
    fullName: "Assem Monir Mahmoud",
    gender: "male",
    phone: "01452697412",
    bloodGroup: "O+",
    medicalNotes: "No allergies",
  },
  {
    _id: "2",
    fullName: "Ahmed Mohamed Ali",
    gender: "male",
    phone: "01123456789",
    bloodGroup: "A+",
    medicalNotes: "Diabetic patient",
  },
  {
    _id: "3",
    fullName: "Mona Ali Ibrahim",
    gender: "female",
    phone: "01098765432",
    bloodGroup: "B+",
    medicalNotes: "Penicillin allergy",
  },
];

export default function Patients() {
  const [patients, setPatients] = useState(() => {
    const saved = localStorage.getItem("my_patients");
    return saved ? JSON.parse(saved) : dummyPatients;
  });

  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPatientsData();
  }, []);

  const fetchPatientsData = async () => {
    try {
      const res = await getPatients();
      if (res?.data?.data && res.data.data.length > 0) {
        setPatients(res.data.data);
      }
    } catch (err) {
      console.log("Using local data");
    }
  };

  const handleAddNewPatient = (newItem) => {
    const updated = [newItem, ...patients];
    setPatients(updated);
    localStorage.setItem("my_patients", JSON.stringify(updated));
  };

  const handleDeletePatient = (id) => {
    const updated = patients.filter((p) => p._id !== id);
    setPatients(updated);
    localStorage.setItem("my_patients", JSON.stringify(updated));
  };

  const filteredPatients = patients.filter((item) => {
    const pName = item.fullName || "";
    const pPhone = String(item.phone || "");
    const matchesSearch =
      pName.toLowerCase().includes(search.toLowerCase()) ||
      pPhone.includes(search);
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
            placeholder="Search patient name or phone..."
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
        </div>
        <button className="btn-add-new" onClick={() => setShowModal(true)}>
          + New Patient
        </button>
      </div>

      <PatientMedicalSection
        patients={filteredPatients}
        onDeletePatient={handleDeletePatient}
      />

      {showModal && (
        <PatientModal
          onClose={() => setShowModal(false)}
          onSaveSuccess={handleAddNewPatient}
        />
      )}
    </div>
  );
}
