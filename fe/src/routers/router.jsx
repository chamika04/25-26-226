import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import App from "../App";
import Home from "../Pages/Home";
import About from "../components/About";
import MainLayout from "../components/MainLayout";
import AuthLayout from "../components/AuthLayout"; 

import DashboardLayout from "../Pages/Medicine/DashBoard/DashboardLayout";
import Dashboard from "../Pages/Medicine/DashBoard/Dashboard";
import UploadProduct from "../Pages/Medicine/DashBoard/UploadProduct";
import EditProduct from "../Pages/Medicine/DashBoard/EditProduct";
import ManageMed from "../Pages/Medicine/DashBoard/ManageMed";
import ManageEquip from"../Pages/Medicine/DashBoard/ManageEquip";

import Forecast from "../Pages/ETU_Head/Forecast";
import DashBedLayout from "../Pages/ETU_Head/ETU-HeadLayout";
import Dashboard_Bed from "../Pages/ETU_Head/ETU-HeadDashboard";

import RegReq from "../Pages/Admin/Register_Requests";
import Login from "../Pages/Login/Username";
import RegisterForm from "../Pages/Login/Register";
import Admin from "../Pages/Admin/Admin";
import AdminLayout from "../Pages/Admin/Layout";
import AdminDashboard from "../Pages/Admin/AdminDashboard";



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
      /*{ path:"/product/:id", element:<SingleProduct/>,
        loader:({params})=>fetch(`http://localhost:5000/product/${params.id}`)
      }*/
    ],
  },

  {
    path:"/ETU_Head/dashboard",
    element:<DashBedLayout/>,
    children:[
      { path:"/ETU_Head/dashboard/forecast", element:<Forecast/> },
      { path:"/ETU_Head/dashboard/dashboard", element:<Dashboard_Bed/> },
      
    ]
  },

  
  {
    path:"/Doctor/dashboard",
    element:<DashBedLayout/>,
    children:[
      
      
    ]
  },
    
  {
    path:"/ETU_Doctor/dashboard",
    element:<DashBedLayout/>,
    children:[
      
    ]
  },

  {
    path:"/ETU_Nurse/dashboard",
    element:<DashBedLayout/>,
    children:[
      
      
    ]
  },

  {
    path:"/OPD_Doctor/dashboard",
    element:<DashBedLayout/>,
    children:[
      
      
    ]
  },

  {
    path:"/Pharmacist/dashboard",
    element:<DashBedLayout/>,
    children:[
      
      
    ]
  },

  {
    path:"/Store_Manager/dashboard",
    element:<DashBedLayout/>,
    children:[
     
      
    ]
  },

  {
    path:"/Ward_Nurse/dashboard",
    element:<DashBedLayout/>,
    children:[
      
      
    ]
  },

  {
    path:"/medicine/dashboard",
    element:<DashboardLayout/>,
    children:[
      { path:"/medicine/dashboard", element:<Dashboard/> }, 
      { path:"/medicine/dashboard/upload", element:<UploadProduct/> },
      { path:"/medicine/dashboard/manage", element:<ManageMed/> },
      { path:"/medicine/dashboard/manage_eqp", element:<ManageEquip/> },
      
      {
        path:"/medicine/dashboard/edit/:id",
        element:<EditProduct/>,
        loader: ({ params }) =>
        axios.get(`http://localhost:8070/product/get/${params.id}`)
        .then(response => response.data)
      }
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