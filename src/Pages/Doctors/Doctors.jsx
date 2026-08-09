import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDoctors } from "@/services/api";

import PageHeader from "@/components/PageHeader";
import DoctorStats from "./components/DoctorStats";
import SearchBar from "./components/SearchBar";
import DoctorTable from "./components/DoctorTable";
import AddDoctorModal from "./components/AddDoctorModal";

import "./doctors.css";

export default function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchDoctors = async () => {
    try {
      const res = await getDoctors();
      setDoctors(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const search = searchTerm.toLowerCase().trim();

    const doctorName = String(doctor.userId?.name || "").toLowerCase();

    const doctorFullName = String(doctor.userId?.fullname || "").toLowerCase();

    const phone = String(doctor.userId?.phone || "").toLowerCase();

    const specialization = String(doctor.specialization || "").toLowerCase();

    const degree = String(doctor.degree || "").toLowerCase();

    const fees = String(doctor.fees ?? "").toLowerCase();

    const workingDays = Array.isArray(doctor.workingDays)
      ? doctor.workingDays.join(" ").toLowerCase()
      : String(doctor.workingDays || "").toLowerCase();

    const matchesSearch =
      !search ||
      doctorName.includes(search) ||
      doctorFullName.includes(search) ||
      phone.includes(search) ||
      specialization.includes(search) ||
      degree.includes(search) ||
      fees.includes(search) ||
      workingDays.includes(search);

    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && doctor.isActive === true) ||
      (filterStatus === "inactive" && doctor.isActive === false);

    return matchesSearch && matchesStatus;
  });

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setShowFilter(false);
  };

  return (
    <div className="doctors-page">
      <PageHeader
        title="Doctors"
        subtitle="Manage doctors and their information"
      >
        <nav>
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/dashboard">Home</Link>
            </li>

            <li className="breadcrumb-item">
              <Link to="/settings">Settings</Link>
            </li>

            <li className="breadcrumb-item active">Doctors</li>
          </ol>
        </nav>
      </PageHeader>

      <DoctorStats />

      <div className="doctors-table-section">
        <div className="table-header-tools">
          <div className="left-tools">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <div className="filter-wrapper">
              <button
                type="button"
                className={`filter-btn ${
                  filterStatus !== "all" ? "filter-active" : ""
                }`}
                onClick={() => setShowFilter((prev) => !prev)}
              >
                <i className="bi bi-funnel"></i>

                <span>Filter</span>

                {filterStatus !== "all" && (
                  <span className="filter-count">1</span>
                )}

                <i
                  className={`bi bi-chevron-down filter-chevron ${
                    showFilter ? "open" : ""
                  }`}
                ></i>
              </button>

              {showFilter && (
                <div className="filter-dropdown">
                  <div className="filter-dropdown-header">
                    <div>
                      <strong>Filter Doctors</strong>
                      <span>Choose a status</span>
                    </div>

                    <i className="bi bi-funnel"></i>
                  </div>

                  <div className="filter-options">
                    <button
                      type="button"
                      className={`filter-option ${
                        filterStatus === "all" ? "selected" : ""
                      }`}
                      onClick={() => {
                        setFilterStatus("all");
                        setShowFilter(false);
                      }}
                    >
                      <div className="filter-option-left">
                        <span className="filter-option-icon all">
                          <i className="bi bi-people"></i>
                        </span>

                        <span>All Doctors</span>
                      </div>

                      {filterStatus === "all" && (
                        <i className="bi bi-check2"></i>
                      )}
                    </button>

                    <button
                      type="button"
                      className={`filter-option ${
                        filterStatus === "active" ? "selected" : ""
                      }`}
                      onClick={() => {
                        setFilterStatus("active");
                        setShowFilter(false);
                      }}
                    >
                      <div className="filter-option-left">
                        <span className="filter-option-icon active">
                          <i className="bi bi-check-circle"></i>
                        </span>

                        <span>Active</span>
                      </div>

                      {filterStatus === "active" && (
                        <i className="bi bi-check2"></i>
                      )}
                    </button>

                    <button
                      type="button"
                      className={`filter-option ${
                        filterStatus === "inactive" ? "selected" : ""
                      }`}
                      onClick={() => {
                        setFilterStatus("inactive");
                        setShowFilter(false);
                      }}
                    >
                      <div className="filter-option-left">
                        <span className="filter-option-icon inactive">
                          <i className="bi bi-x-circle"></i>
                        </span>

                        <span>Inactive</span>
                      </div>

                      {filterStatus === "inactive" && (
                        <i className="bi bi-check2"></i>
                      )}
                    </button>
                  </div>

                  {filterStatus !== "all" && (
                    <button
                      type="button"
                      className="clear-filter"
                      onClick={clearFilters}
                    >
                      <i className="bi bi-arrow-counterclockwise"></i>
                      Clear Filter
                    </button>
                  )}
                </div>
              )}
            </div>

            {(searchTerm || filterStatus !== "all") && (
              <button
                type="button"
                className="clear-search-filter"
                onClick={clearFilters}
              >
                <i className="bi bi-x-circle"></i>
                Clear
              </button>
            )}
          </div>

          <button
            type="button"
            className="btn-add"
            onClick={() => setShowModal(true)}
          >
            <i className="bi bi-plus-lg"></i>
            <span>Add Doctor</span>
          </button>
        </div>

        <div className="results-info">
          <span>
          </span>
        </div>

        <DoctorTable doctors={filteredDoctors} />
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
