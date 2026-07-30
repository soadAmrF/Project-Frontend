import DashboardHeader from "@/Pages/Dashboard/components/DashboardHeader";
import StatisticsCards from "@/Pages/Dashboard/components/StatisticsCards";
import ChartSection from "@/Pages/Dashboard/components/ChartSection";
import RecentPatients from "@/Pages/Dashboard/components/RecentPatients";
import CalendarCard from "@/Pages/Dashboard/components/CalendarCard";
import "@/Pages/Dashboard/Dashboard.css";

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
