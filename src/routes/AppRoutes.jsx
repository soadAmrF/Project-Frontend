import { createBrowserRouter } from "react-router-dom";

import MainLayout from "@/components/layout/MainLayout";
import LoginPage from "@/Pages/Auth/Login/LoginPage";
import Dashboard from "@/pages/Dashboard/Dashboard";
import Profile from "@/Pages/Profile/Profile";
import ProtectedRoute from "./ProtectedRoute";
import Doctors from "@/Pages/Doctors/Doctors";
import Users from "@/Pages/Users/Users";
import Reception from "@/Pages/Reception/Reception";
import Appointments from "@/Pages/Appointments/Appointments";
import Patients from "@/Pages/Patients/Patients";
import Laboratory from "@/Pages/Laboratory/Laboratory";
import Reports from "@/Pages/Reports/Reports";
import Invoices from "@/Pages/Invoices/Invoices";
import Treatments from "@/Pages/Treatments/Treatments";
import MedicalRecords from "@/Pages/MedicalRecords/MedicalRecords";
import Settings from "@/Pages/Settings/Settings";
import Inventory from "@/Pages/Inventory/Inventory";
import ClinicInfo from "@/Pages/ClinicInfo/ClinicInfo";
import GuestRoute from "./GuestRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <GuestRoute>
        <LoginPage />
      </GuestRoute>
    ),
  },
  {
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/doctors",
        element: <Doctors />,
      },
      {
        path: "/reception",
        element: <Reception />,
      },
      {
        path: "/appointments",
        element: <Appointments />,
      },
      {
        path: "/patients",
        element: <Patients />,
      },
      {
        path: "/treatments",
        element: <Treatments />,
      },
      {
        path: "/MedicalRecords",
        element: <MedicalRecords />,
      },
      {
        path: "/invoices",
        element: <Invoices />,
      },
      {
        path: "/inventory",
        element: <Inventory />,
      },
      {
        path: "/reports",
        element: <Reports />,
      },
      {
        path: "/laboratory",
        element: <Laboratory />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/settings/clinic-info",
        element: <ClinicInfo />,
      },
      {
        path: "/settings/users",
        element: <Users />,
      },
    ],
  },
]);

export default router;
