import DashboardHeader from "./components/DashboardHeader";
import StatisticsCards from "./components/StatisticsCards";
import ChartSection from "./components/ChartSection";
import RecentPatients from "./components/RecentPatients";
import CalendarCard from "./components/CalendarCard";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <DashboardHeader />

      <div className="dashboard-grid">
        <div className="main-content">
          <StatisticsCards />
          <ChartSection />
          <RecentPatients />
        </div>

        <div className="side-content">
          <CalendarCard />
        </div>
      </div>
    </div>
  );
}
