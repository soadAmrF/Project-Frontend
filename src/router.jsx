import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./Components/pages/loginPage";
import Dashbord from "./dashbord";


export const router = createBrowserRouter([
    {
        path: '/',
        element: <LoginPage/>
    },
    {
        path: '/dashbord',
        element: <Dashbord/>
    },
])