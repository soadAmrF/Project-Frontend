import DashboardHeader from "./components/DashboardHeader";
import StatisticsCards from "./components/StatisticsCards";
import ChartSection from "./components/ChartSection";
import RecentPatients from "./components/RecentPatients";
import CalendarCard from "./components/CalendarCard";

export default function Dashboard() {
  return (
    <div className="container-fluid px-4 py-4">
      <DashboardHeader />

      <div className="row mt-4">
        <div className="col-lg-8">
          <StatisticsCards />

          <div className="mt-4">
            <ChartSection />
          </div>

          <div className="mt-4">
            <RecentPatients />
          </div>
        </div>

        <div className="col-lg-4">
          <CalendarCard />
        </div>
      </div>
    </div>
  );
}
