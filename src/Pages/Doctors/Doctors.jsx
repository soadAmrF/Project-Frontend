import PageHeader from "@/components/PageHeader";
import DoctorStats from "./components/DoctorStats";
import SearchBar from "./components/SearchBar";
import DoctorTable from "./components/DoctorTable";
import AddDoctorModal from "./components/AddDoctorModal";

import { useEffect, useState } from "react";
import { getDoctors } from "@/services/api";

import "./doctors.css";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchDoctors = async () => {
    try {
      const res = await getDoctors();
      setDoctors(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);
  return (
    <div className="reception-page">
      <PageHeader />

      <DoctorStats />

       <div className="table-section">
        <div className="table-header-tools">
          <div className="left-tools">
            <SearchBar />

            <button className="btn btn-light border">
              <i className="bi bi-funnel me-2"></i>
              Filter
            </button>
          </div>

          <button
            className="btn-add"
            onClick={() => setShowModal(true)}
          >
            + Add Doctor
          </button>
        </div>

        
        <DoctorTable doctors={doctors} />
      </div>

      {showModal && (
        <AddDoctorModal
          onClose={() => setShowModal(false)}
          fetchDoctors={fetchDoctors}
        />
      )}
    </div>
  );
}
