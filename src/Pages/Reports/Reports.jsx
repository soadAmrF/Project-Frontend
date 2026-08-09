import React, { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import "./Reports.css";
import {
  appointmentReport,
  dailyIncomeReport,
  dailyPatientsReport,
  doctorsReport,
  monthlyIncomeReport,
  monthlyPatientsReport,
  yearlyIncomeReport,
} from "@/services/api";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ==================== Helper: Format Month Name ====================
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const formatMonth = (month) => monthNames[month - 1] || "";

// ==================== Component: Stats Cards ====================
function ReportStatsCards({
  dailyIncome,
  dailyPatients,
  totalDoctors,
  selectedDate,
}) {
  const dateObj = new Date(selectedDate);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="report-stats-container">
      <div className="report-stat-card">
        <div className="report-icon-box green-card">
          <i className="bi bi-cash-coin"></i>
        </div>
        <div className="report-stat-info">
          <span>Daily Income</span>
          <h3>{dailyIncome} EGP</h3>
          <small>{formattedDate}</small>
        </div>
      </div>

      <div className="report-stat-card">
        <div className="report-icon-box blue-card">
          <i className="bi bi-people-fill"></i>
        </div>
        <div className="report-stat-info">
          <span>Daily Patients</span>
          <h3>{dailyPatients}</h3>
          <small>{formattedDate}</small>
        </div>
      </div>

      <div className="report-stat-card">
        <div className="report-icon-box purple-card">
          <i className="bi bi-person-badge-fill"></i>
        </div>
        <div className="report-stat-info">
          <span>Total Doctors</span>
          <h3>{totalDoctors}</h3>
          <small>All time</small>
        </div>
      </div>
    </div>
  );
}

// ==================== Component: Appointments Table ====================
function AppointmentsTable({ appointments, selectedDate }) {
  const total = appointments.reduce((sum, a) => sum + a.totalAppointments, 0);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "status-completed";
      case "pending":
        return "status-pending";
      case "cancelled":
        return "status-cancelled";
      default:
        return "";
    }
  };

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h3>
            <i className="bi bi-calendar-check me-2"></i>
            Appointments Breakdown
          </h3>
          <small>
            Distribution for {new Date(selectedDate).toLocaleDateString()}
          </small>
        </div>
        <div className="total-badge">
          Total: <strong>{total}</strong>
        </div>
      </div>

      {appointments.length > 0 ? (
        <div className="table-responsive">
          <table className="report-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Count</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a, idx) => (
                <tr key={idx}>
                  <td>
                    <span className={`status-badge ${getStatusColor(a._id)}`}>
                      {a._id || "Unknown"}
                    </span>
                  </td>
                  <td>
                    <strong>{a.totalAppointments}</strong>
                  </td>
                  <td>
                    {total > 0
                      ? ((a.totalAppointments / total) * 100).toFixed(1)
                      : 0}
                    %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-chart">
          <i
            className="bi bi-calendar-x"
            style={{ fontSize: "3rem", color: "#ccc" }}
          ></i>
          <p>No appointments for this date</p>
        </div>
      )}
    </div>
  );
}

// ==================== Main Component: Reports ====================
export default function Reports() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [dailyIncome, setDailyIncome] = useState(0);
  const [dailyPatients, setDailyPatients] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [appointments, setAppointments] = useState([]);

  const [monthlyIncome, setMonthlyIncome] = useState([]);
  const [monthlyPatients, setMonthlyPatients] = useState([]);
  const [yearlyIncome, setYearlyIncome] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  // ==================== Fetch Daily Data ====================
  const fetchDailyData = async () => {
    try {
      const [incomeRes, patientsRes, appointmentsRes] =
        await Promise.allSettled([
          dailyIncomeReport(selectedDate),
          dailyPatientsReport(selectedDate),
          appointmentReport(selectedDate),
        ]);

      if (incomeRes.status === "fulfilled") {
        setDailyIncome(incomeRes.value.data?.data?.totalIncome || 0);
      }
      if (patientsRes.status === "fulfilled") {
        setDailyPatients(patientsRes.value.data?.data?.totalPatients || 0);
      }
      if (appointmentsRes.status === "fulfilled") {
        setAppointments(appointmentsRes.value.data?.data || []);
      }
    } catch (error) {
      console.error("Error fetching daily data:", error);
    }
  };

  // ==================== Fetch Long-term Data ====================
  const fetchLongTermData = async () => {
    try {
      const [
        doctorsRes,
        monthlyIncomeRes,
        monthlyPatientsRes,
        yearlyIncomeRes,
      ] = await Promise.allSettled([
        doctorsReport(),
        monthlyIncomeReport(),
        monthlyPatientsReport(),
        yearlyIncomeReport(),
      ]);

      if (doctorsRes.status === "fulfilled") {
        setTotalDoctors(doctorsRes.value.data?.data?.totalDoctors || 0);
      }
      if (monthlyIncomeRes.status === "fulfilled") {
        const data = (monthlyIncomeRes.value.data?.data || []).map((item) => ({
          ...item,
          monthName: `${formatMonth(item.month)} ${item.year}`,
        }));
        setMonthlyIncome(data);
      }
      if (monthlyPatientsRes.status === "fulfilled") {
        const data = (monthlyPatientsRes.value.data?.data || []).map(
          (item) => ({
            ...item,
            monthName: `${formatMonth(item.month)} ${item.year}`,
          }),
        );
        setMonthlyPatients(data);
      }
      if (yearlyIncomeRes.status === "fulfilled") {
        const data = (yearlyIncomeRes.value.data?.data || []).map((item) => ({
          ...item,
          yearName: `${item.year}`,
        }));
        setYearlyIncome(data);
      }
    } catch (error) {
      console.error("Error fetching long-term data:", error);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      await fetchDailyData();
      await fetchLongTermData();
      setIsLoading(false);
    };
    loadAll();
  }, [selectedDate]);

  if (isLoading) {
    return (
      <div className="reports-page">
        <PageHeader />
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status"></div>
          <p>Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reports-page">
      <PageHeader />

      {/* Date Picker */}
      <div className="report-controls">
        <div className="control-group">
          <label>
            <i className="bi bi-calendar-event me-2"></i>
            Select Date for Daily Reports
          </label>
          <input
            type="date"
            className="input-field date-input"
            value={selectedDate}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <ReportStatsCards
        dailyIncome={dailyIncome}
        dailyPatients={dailyPatients}
        totalDoctors={totalDoctors}
        selectedDate={selectedDate}
      />

      {/* Charts Row 1 */}
      <div className="charts-row">
        <div className="chart-card large">
          <div className="chart-header">
            <div>
              <h3>
                <i className="bi bi-graph-up-arrow me-2"></i>
                Monthly Income
              </h3>
              <small>Total income per month</small>
            </div>
          </div>
          {monthlyIncome.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyIncome}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="monthName"
                  tick={{ fontSize: 11 }}
                  angle={-30}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e0e6ed",
                  }}
                  formatter={(value) => [`${value} EGP`, "Income"]}
                />
                <Bar
                  dataKey="totalIncome"
                  fill="#5156be"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-chart">
              <p>No income data available</p>
            </div>
          )}
        </div>

        <AppointmentsTable
          appointments={appointments}
          selectedDate={selectedDate}
        />
      </div>

      {/* Charts Row 2 */}
      <div className="charts-row">
        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3>
                <i className="bi bi-people me-2"></i>
                Monthly Patients
              </h3>
              <small>Unique patients per month</small>
            </div>
          </div>
          {monthlyPatients.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyPatients}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="monthName"
                  tick={{ fontSize: 11 }}
                  angle={-30}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e0e6ed",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="totalPatients"
                  stroke="#2e7d32"
                  strokeWidth={3}
                  dot={{ fill: "#2e7d32", r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-chart">
              <p>No patient data available</p>
            </div>
          )}
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <div>
              <h3>
                <i className="bi bi-bar-chart-fill me-2"></i>
                Yearly Income
              </h3>
              <small>Total income per year</small>
            </div>
          </div>
          {yearlyIncome.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={yearlyIncome}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5156be" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#5156be" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="yearName" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "1px solid #e0e6ed",
                  }}
                  formatter={(value) => [`${value} EGP`, "Income"]}
                />
                <Area
                  type="monotone"
                  dataKey="totalIncome"
                  stroke="#5156be"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorIncome)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-chart">
              <p>No yearly data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
