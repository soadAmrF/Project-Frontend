import React from "react";

export default function TreatmentActions({
  searchTerm,
  onSearchChange,
  onPrint,
  onAdd,
}) {
  return (
    <div className="actions-container">
      <div className="search-box-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Search by medicine or patient..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <button
          className="btn btn-primary"
          onClick={() => onSearchChange(searchTerm)}
        >
          Search
        </button>
      </div>

      <div className="buttons-group">
        <button className="btn btn-outline-print" onClick={onPrint}>
          Print Prescription
        </button>
        <button className="btn btn-add" onClick={onAdd}>
          + Add Treatment
        </button>
      </div>
    </div>
  );
}
