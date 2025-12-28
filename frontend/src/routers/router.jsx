import { createBrowserRouter } from "react-router-dom";
import axios from "axios";

import App from "../App";
import Home from "../home/Home";
import About from "../components/About";
import Username from "../components/Username";
import Password from "../components/Password";
import Register from "../components/Register";
import Profile from "../components/Profile";
import Recovery from "../components/Recovery";
import Reset from "../components/Reset";
import BedDashboard from "../components/Bed_demand_focasting/Bed_Dashboard";
import Sidebar from "../components/Bed_demand_focasting/Sidebar";
import Layout from "../components/Bed_demand_focasting/Layout";
import Forecast from "../components/Bed_demand_focasting/Forecast";
import Optimization from "../components/Bed_demand_focasting/Optimization";
import DailyInput from "../components/Bed_demand_focasting/DailyInput";
import Trends from "../components/Bed_demand_focasting/Trends";
import Inventory from "../components/Bed_demand_focasting/Inventory";

import DashboardLayout from "../dashboard/DashboardLayout";
import Dashboard from "../dashboard/Dashboard";
import UploadProduct from "../dashboard/UploadProduct";
import ManageProduct from "../dashboard/ManageProduct";
import EditProduct from "../dashboard/EditProduct";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/login", element: <Username /> },
      { path: "/password", element: <Password /> },
      { path: "/register", element: <Register /> },
      { path: "/profile", element: <Profile /> },
      { path: "/recovery", element: <Recovery /> },
      { path: "/reset", element: <Reset /> },
      { path: "/bed-dashboard", element: <BedDashboard /> },
      { path: "/Sidebar", element: <Sidebar /> },
      { path: "/Layout", element: <Layout /> },
      { path: "/Forecast", element: <Forecast /> },
      { path: "/Optimization", element: <Optimization /> },
      { path: "/DailyInput", element: <DailyInput /> },
      { path: "/Trends", element: <Trends /> },
      { path: "/Inventory", element: <Inventory /> },
    ],
  },
  {
    path: "/admin/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "upload", element: <UploadProduct /> },
      { path: "manage", element: <ManageProduct /> },
      {
        path: "edit/:id",
        element: <EditProduct />,
        loader: ({ params }) =>
          axios
            .get(`http://localhost:8070/product/get/${params.id}`)
            .then((response) => response.data),
      },
    ],
  },
]);

export default router;