import React from "react";

export default function InvoiceStats({ invoices = [] }) {
  let totalBilled = 0;
  let paidCount = 0;
  let unpaidCount = 0;
  let cancelledCount = 0;

  invoices.forEach((inv) => {
    totalBilled += Number(inv.total) || 0;

    if (inv.status === "paid") {
      paidCount++;
    }

    if (inv.status === "unpaid") {
      unpaidCount++;
    }

    if (inv.status === "cancelled") {
      cancelledCount++;
    }
  });

  return (
    <div className="stats-grid">
      {/* TOTAL */}
      <div className="stat-card">
        <div className="stat-icon icon-blue">
          <i className="bi bi-receipt"></i>
        </div>

        <div className="stat-info">
          <span className="stat-title">Total Billed</span>

          <h2 className="stat-value">
            {totalBilled.toLocaleString("en-EG", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            <small>EGP</small>
          </h2>

          <span className="stat-sub">All invoices</span>
        </div>
      </div>

      {/* PAID */}
      <div className="stat-card">
        <div className="stat-icon icon-green">
          <i className="bi bi-check-circle"></i>
        </div>

        <div className="stat-info">
          <span className="stat-title">Paid Invoices</span>

          <h2 className="stat-value text-green">{paidCount}</h2>

          <span className="stat-sub">Completed payments</span>
        </div>
      </div>

      {/* UNPAID */}
      <div className="stat-card">
        <div className="stat-icon icon-orange">
          <i className="bi bi-clock"></i>
        </div>

        <div className="stat-info">
          <span className="stat-title">Unpaid Invoices</span>

          <h2 className="stat-value text-orange">{unpaidCount}</h2>

          <span className="stat-sub">Waiting for payment</span>
        </div>
      </div>

      {/* CANCELLED */}
      <div className="stat-card">
        <div className="stat-icon icon-gray">
          <i className="bi bi-x-circle"></i>
        </div>

        <div className="stat-info">
          <span className="stat-title">Cancelled</span>

          <h2 className="stat-value text-gray">{cancelledCount}</h2>

          <span className="stat-sub">Cancelled invoices</span>
        </div>
      </div>
    </div>
  );
}
