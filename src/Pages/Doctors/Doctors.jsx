import PageHeader from "@/components/PageHeader";
import DoctorStats from "./components/DoctorStats";
import SearchBar from "./components/SearchBar";
import DoctorTable from "./components/DoctorTable";

import { useEffect, useState } from "react";
import { getDoctors } from "@/services/api";

import "./doctors.css";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);

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
    <div className="container-fluid">
      <PageHeader />

      <div className="d-flex justify-content-end gap-2 mb-4">
        <button className="btn btn-light border">
          <i className="bi bi-funnel me-2"></i>
          Filter
        </button>

        <button className="btn btn-primary">
          <i className="bi bi-plus-lg me-2"></i>
          Add Doctor
        </button>
      </div>

      <DoctorStats />

      <div className="doctor-table-card mt-4">
        <SearchBar />

        <DoctorTable doctors={doctors} />
      </div>
    </div>
  );
}
