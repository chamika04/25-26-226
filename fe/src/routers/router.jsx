import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import App from "../App";
import Home from "../Pages/Home";
import About from "../components/About";
import MainLayout from "../components/MainLayout";
import AuthLayout from "../components/AuthLayout"; 

import RegReq from "../Pages/Admin/Register_Requests";
import Login from "../Pages/Login/Username";
import RegisterForm from "../Pages/Login/Register";
import Admin from "../Pages/Admin/Admin";
import AdminLayout from "../Pages/Admin/Layout";
import AdminDashboard from "../Pages/Admin/AdminDashboard";

import ETU_HeadLayout from "../Pages/ETU_Head/ETU-HeadLayout";
import ETU_HeadDashboard from "../Pages/ETU_Head/ETU-HeadDashboard";
import ETU_HeadGraphs from "../Pages/ETU_Head/ETU_HeadGraphs";  
import MedandEquip from "../Pages/ETU_Head/MedandEquipShow";
import DocDetails from "../Pages/ETU_Head/DocDetails";

import ETU_DocDashboard from "../Pages/ETU_Doctor/ETU-DocDashboard";
import ETU_DocLayout from "../Pages/ETU_Doctor/ETU-DocLayout";
import DocManage from "../Pages/ETU_Doctor/DocManage";
import DocAppointments from "../Pages/ETU_Doctor/DocAppointments";

import ETU_NurseDashboard from "../Pages/ETU_Nurse/ETU_NurseDashboard";
import ETU_NurseLayout from "../Pages/ETU_Nurse/ETU_NurseLayout";
import Medicine from "../Pages/ETU_Nurse/Medicine";
import Equipment from "../Pages/ETU_Nurse/Equipment";

import OPD_DocDashboard from "../Pages/OPD_Doctor/OPD_DocDashboard";
import OPD_DocLayout from "../Pages/OPD_Doctor/OPD_DocLayout";

import DocAvailability from "../Pages/Patient/DocAvailability";
import DocProfile from "../Pages/Patient/DocProfile";
import Dashboard_patient from "../Pages/Patient/Dashboard_patient";

import PharmacistDashboard from "../Pages/Pharmacist/PharmacistDashboard";
import PharmacistLayout from "../Pages/Pharmacist/PharmacistLayout";
import PharmacistGraphs from "../Pages/Pharmacist/PharmacistGraphs";
import Prescriptions from "../Pages/Pharmacist/Prescriptions";
import Dispense from "../Pages/Pharmacist/Dispense";
import InventoryRequests from "../Pages/Pharmacist/Inventory_Req";
import MedicineAnalytics from "../Pages/Pharmacist/Analytics";
import EquipmentInventory from "../Pages/Pharmacist/Equipment";

import StoreManagerDashboard from "../Pages/Store_Manager/StoreManagerDashboard";
import StoreManagerLayout from "../Pages/Store_Manager/StoreManagerLayout";
import EditProduct from "../Pages/Store_Manager/EditProduct";

import WardNurseDashboard from "../Pages/Ward_Nurse/WardNurseDashboard";
import WardNurseLayout from "../Pages/Ward_Nurse/WardNurseLayout";    

import MethaRoleLayout from "../Pages/MethaRole/MethaRoleLayout";
import MethaRoleDashboard from "../Pages/MethaRole/MethaRoleDashboard";

const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/registerForm", element: <RegisterForm /> },
      
    ],
  },

  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home />},
      { path: "/about", element: <About/> },
      { path:"/dashboard_patient", element:<Dashboard_patient/> },
      { path:"/docAvailability", element:<DocAvailability/> },
      { path:"/docProfile", element:<DocProfile/> },

      /*{ path:"/product/:id", element:<SingleProduct/>,
        loader:({params})=>fetch(`http://localhost:5000/product/${params.id}`)
      }*/
    ],
  },

  {
    path:"/ETU_Head/dashboard",
    element:<ETU_HeadLayout/>,
    children:[
      { path:"/ETU_Head/dashboard/dashboard", element:<ETU_HeadDashboard/> },
      { path:"/ETU_Head/dashboard/graphs", element:<ETU_HeadGraphs/> },
      { path:"/ETU_Head/dashboard/medandequip", element:<MedandEquip/> },
      { path:"/ETU_Head/dashboard/doctors", element:<DocDetails/> },

    ]
  },

  {
    path:"/ETU_Doctor/dashboard",
    element:<ETU_DocLayout/>,
    children:[
      { path:"/ETU_Doctor/dashboard/ETU_DocDashboard", element:<ETU_DocDashboard/> },
      {path: "/ETU_Doctor/dashboard/docManage", element:<DocManage/> },
      {path: "/ETU_Doctor/dashboard/docAppointments", element:<DocAppointments/> },
      
    ]
  },

  {
    path:"/ETU_Nurse/dashboard",
    element:<ETU_NurseLayout/>,
    children:[
      { path:"/ETU_Nurse/dashboard/ETU_NurseDashboard", element:<ETU_NurseDashboard/> },
      { path:"/ETU_Nurse/dashboard/medicine", element:<Medicine/> },
      { path:"/ETU_Nurse/dashboard/equipment", element:<Equipment/> },
      
    ]
  },

  {
    path:"/OPD_Doctor/dashboard",
    element:<OPD_DocLayout/>,
    children:[
      { path:"/OPD_Doctor/dashboard/OPD_DocDashboard", element:<OPD_DocDashboard/> },
      
    ]
  },

  {
    path:"/Pharmacist/dashboard",
    element:<PharmacistLayout/>,
    children:[
      { path:"/Pharmacist/dashboard/PharmacistDashboard", element:<PharmacistDashboard/> },
      { path:"/Pharmacist/dashboard/PharmacistGraphs", element:<PharmacistGraphs/> },
      { path:"/Pharmacist/dashboard/prescriptions", element:<Prescriptions/> },
      { path:"/Pharmacist/dashboard/dispense", element:<Dispense/> },
      { path:"/Pharmacist/dashboard/inventory-requests", element:<InventoryRequests/> },
      { path:"/Pharmacist/dashboard/analytics", element:<MedicineAnalytics/> },
      { path:"/Pharmacist/dashboard/equipment", element:<EquipmentInventory/> },
    ]
  },

  {
    path:"/Store_Manager/dashboard",
    element:<StoreManagerLayout/>,
    children:[
     { path:"/Store_Manager/dashboard/StoreManagerDashboard", element:<StoreManagerDashboard/> },
     {
        path:"/Store_Manager/dashboard/edit/:id",
        element:<EditProduct/>,
        loader: ({ params }) =>
        axios.get(`http://localhost:8070/product/get/${params.id}`)
        .then(response => response.data)
      }
      
    ]
  },

  {
    path:"/Ward_Nurse/dashboard",
    element:<WardNurseLayout/>,
    children:[
      { path:"/Ward_Nurse/dashboard/WardNurseDashboard", element:<WardNurseDashboard/> },
      
    ]
  },

  {
    path:"/Metha/dashboard",
    element:<MethaRoleLayout/>,
    children:[
      { path:"/Metha/dashboard/MethaRoleDashboard", element:<MethaRoleDashboard/> },
      
    ]
  },

  {
    path:"/admin",
    element:<AdminLayout/>,
    children:[
      { path : '/admin/users', element : <Admin></Admin> },
      { path : '/admin/RegReq', element : <RegReq></RegReq> } ,
      { path : '/admin/AdminDashboard', element : <AdminDashboard></AdminDashboard> } 
    ]
  }
 
]);

export default router;