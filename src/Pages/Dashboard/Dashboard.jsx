import DashboardHeader from "./components/DashboardHeader";
import StatisticsCards from "./components/StatisticsCards";
import ChartSection from "./components/ChartSection";
import RecentPatients from "./components/RecentPatients";
import CalendarCard from "./components/CalendarCard";
import "./Dashboard.css";
import Navbar from "./components/Nav";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <Navbar />
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
