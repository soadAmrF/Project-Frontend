import React from "react";

export default function InvoiceStats({ invoices = [] }) {
  let totalBilled = 0;
  let paidCount = 0;
  let unpaidCount = 0;
  let cancelledCount = 0;

  invoices.forEach((inv) => {
    totalBilled += Number(inv.total) || 0;
    if (inv.status === "paid") paidCount++;
    if (inv.status === "unpaid") unpaidCount++;
    if (inv.status === "cancelled") cancelledCount++;
  });

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon icon-blue">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
          </svg>
        </div>
        <div className="stat-info">
          <span className="stat-title">Total Billed ($)</span>
          <h2 className="stat-value">
            ${totalBilled.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </h2>
          <span className="stat-sub">This Month</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon icon-green">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <div className="stat-info">
          <span className="stat-title">Paid Invoices</span>
          <h2 className="stat-value text-green">{paidCount}</h2>
          <span className="stat-sub">Invoices</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon icon-orange">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <div className="stat-info">
          <span className="stat-title">Unpaid Invoices</span>
          <h2 className="stat-value text-orange">{unpaidCount}</h2>
          <span className="stat-sub">Invoices</span>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon icon-gray">
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>
        <div className="stat-info">
          <span className="stat-title">Cancelled Invoices</span>
          <h2 className="stat-value text-gray">{cancelledCount}</h2>
          <span className="stat-sub">Invoices</span>
        </div>
      </div>
    </div>
  );
}
