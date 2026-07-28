import { createBrowserRouter } from "react-router-dom";

import LoginPage from "@/Pages/Auth/Login/LoginPage"
import Dashboard from "@/pages/Dashboard/Dashboard";
import MainLayout from "@/components/layout/MainLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    element: <MainLayout />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);

export default router;