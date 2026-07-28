import { createBrowserRouter } from "react-router-dom";

import Login from "@/Pages/Auth/Login/Login";
import Dashboard from "@/pages/Dashboard/Dashboard";
import MainLayout from "@/components/layout/MainLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
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