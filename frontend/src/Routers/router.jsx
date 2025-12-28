import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";
import App from "../App";
import Home from "../Pages/Home";
import Shop from "../Pages/Medicine/Shop";
import About from "../components/About";

import SingleProduct from "../Pages/Medicine/SingleProduct";
import DashboardLayout from "../Pages/Medicine/DashBoard/DashboardLayout";
import Dashboard from "../Pages/Medicine/DashBoard/Dashboard";
import UploadProduct from "../Pages/Medicine/DashBoard/UploadProduct";
import EditProduct from "../Pages/Medicine/DashBoard/EditProduct";
import ManageMed from "../Pages/Medicine/DashBoard/ManageMed";
import ManageEquip from"../Pages/Medicine/DashBoard/ManageEquip";
import Card from "../Pages/Medicine/Card";
import Forecast from "../Pages/Medicine/Forecast";

import Username from "../Pages/Login/Username";
import Password from "../Pages/Login/Password";
import Register from "../Pages/Login/Register";
import Admin from "../Pages/Admin/Admin";
import Profile from "../Pages/Login/Profile";
import Recovery from "../Pages/Login/Recovery";
import Reset from "../Pages/Login/Reset";
import ShowP4Shop from "../Pages/Medicine/ShowP4Shop";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/shop",
        element: <Shop/>,
      },
      {
        path: "/about",
        element: <About/>
      },
      {
        path: "/showP4Shop",
        element: <ShowP4Shop />, 
      },
      {
        path: "/card",
        element: <Card/>,
      }, 
      {
        path: "/login",
        element: <Username />,
      },
      {
          path : '/password',
          element : <Password/>
      },
      {
          path : '/register',
          element : <Register></Register>
       },
      {
          path : '/profile',
          element : <Profile></Profile>
      },
      {
          path : '/recovery',
          element : <Recovery></Recovery>
      },
      {
          path : '/reset',
          element : <Reset></Reset>
      },
       { path: "/bed-dashboard", element: <BedDashboard /> },
      { path: "/Sidebar", element: <Sidebar /> },
      { path: "/Layout", element: <Layout /> },
      { path: "/Forecast", element: <Forecast /> },
      { path: "/Optimization", element: <Optimization /> },
      { path: "/DailyInput", element: <DailyInput /> },
      { path: "/Trends", element: <Trends /> },
      { path: "/Inventory", element: <Inventory /> },
      {
        path:"/product/:id",
        element:<SingleProduct/>,
        loader:({params})=>fetch(`http://localhost:5000/product/${params.id}`)
      }
      
    ],
  },
  

  
  
  
  {
    path:"/medicine/dashboard",
    element:<DashboardLayout/>,
    children:[
      {
        path:"/medicine/dashboard",
        element:<Dashboard/>
      }, 
      {
        path:"/medicine/dashboard/upload",
        element:<UploadProduct/>
      },
      {
        path:"/medicine/dashboard/manage",
        element:<ManageMed/>
      },
      {
        path:"/medicine/dashboard/manage_eqp",
        element:<ManageEquip/>
      },
      {
        path:"/medicine/dashboard/forecast",
        element:<Forecast/>
      },
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
    element:<Admin/>,
    children:[
      {
        path : '/admin/users',
        element : <Admin></Admin>
      } 
    ]
  }
 
]);

export default router;