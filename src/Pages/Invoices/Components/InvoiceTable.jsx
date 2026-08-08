import React from "react";

export default function InvoiceTable({
  invoices = [],
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  onDeleteInvoice,
  onPrintInvoice,
  onOpenNewInvoiceModal,
}) {
  return (
    <div className="table-container">
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search invoice # or patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <button className="btn-new" onClick={onOpenNewInvoiceModal}>
          + New Invoice
        </button>
      </div>

      <div className="responsive-table-wrapper">
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Patient Status</th>
              <th>Payment Method</th>
              <th>Total ($)</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, idx) => (
              <tr key={inv._id || idx}>
                <td className="inv-num">
                  #INV-{inv.invoiceNumber || idx + 1000}
                </td>
                <td>
                  {inv.patientName ||
                    inv.patientId?.fullName ||
                    inv.patientId?.name ||
                    "N/A"}
                </td>
                <td>{inv.doctorName || inv.doctorId?.name || "N/A"}</td>
                <td>
                  <span className="badge-info">
                    {inv.patientStatus || "Regular"}
                  </span>
                </td>
                <td>{inv.paymentMethod || "cash"}</td>
                <td>
                  <strong>${Number(inv.total || 0).toFixed(2)}</strong>
                </td>
                <td>
                  <span className={`badge ${inv.status || "unpaid"}`}>
                    {inv.status || "unpaid"}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-action btn-print"
                      title="Print"
                      onClick={() => onPrintInvoice && onPrintInvoice(inv)}
                    >
                      🖨️
                    </button>
                    <button
                      className="btn-action btn-delete"
                      title="Delete"
                      onClick={() => onDeleteInvoice && onDeleteInvoice(idx)}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
