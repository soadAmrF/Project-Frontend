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
    <>
      {/* =================================================
          CONTROLS
      ================================================= */}

      <div className="invoice-controls">
        <div className="invoice-search-wrapper">
          <i className="bi bi-search"></i>

          <input
            className="invoice-search"
            type="text"
            placeholder="Search invoice number, patient or doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="invoice-status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>

          <option value="paid">Paid</option>

          <option value="unpaid">Unpaid</option>

          <option value="cancelled">Cancelled</option>
        </select>

        <button className="btn-new" onClick={onOpenNewInvoiceModal}>
          <i className="bi bi-plus-lg"></i>
          New Invoice
        </button>
      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="responsive-table-wrapper">
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Patient Status</th>
              <th>Payment</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan="8" className="empty-invoices">
                  <i
                    className="bi bi-receipt"
                    style={{
                      display: "block",
                      fontSize: "28px",
                      marginBottom: "8px",
                    }}
                  ></i>
                  No invoices found
                </td>
              </tr>
            ) : (
              invoices.map((inv) => {
                const doctorName =
                  inv.doctorId?.userId?.fullName ||
                  inv.doctorId?.userId?.fullname ||
                  inv.doctorName ||
                  "N/A";

                return (
                  <tr key={inv._id}>
                    <td className="inv-num">#INV-{inv.invoiceNumber}</td>

                    <td>
                      <strong>
                        {inv.patientId?.fullName || inv.patientName || "N/A"}
                      </strong>
                    </td>

                    <td>{doctorName}</td>

                    <td>
                      <span className="badge-info">
                        {inv.patientStatus || "Regular"}
                      </span>
                    </td>

                    <td>
                      {inv.paymentMethod === "creditCard"
                        ? "Card / Visa"
                        : "Cash"}
                    </td>

                    <td>
                      <strong>
                        {Number(inv.total || 0).toLocaleString("en-EG", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        EGP
                      </strong>
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
                          title="Print Invoice"
                          onClick={() => onPrintInvoice && onPrintInvoice(inv)}
                        >
                          <i className="bi bi-printer"></i>
                        </button>

                        {inv.status !== "cancelled" && (
                          <button
                            className="btn-action btn-delete"
                            title="Cancel Invoice"
                            onClick={() =>
                              onDeleteInvoice && onDeleteInvoice(inv._id)
                            }
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
