import { Sidebar } from "flowbite-react";
import {
  HiOutlineHome,
  HiOutlineChartBar,
  HiOutlineBeaker,
  HiOutlineClipboardList,
  HiOutlineLogout,
} from "react-icons/hi";
import { useNavigate, useLocation } from "react-router-dom";

const ETU_HeadSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const userLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const itemClass = (path) =>
    `transition-all duration-200 rounded-lg px-3 py-2 flex items-center gap-2
     ${
       isActive(path)
         ? "bg-blue-200 text-blue-900 font-semibold"
         : "text-slate-800 hover:bg-blue-100"
     }`;

  return (
    <Sidebar aria-label="Pharmacist Sidebar" className="h-screen w-64 border-r border-blue-200">
      {/* Slightly lighter blue – not pastel */}
      <div className="h-full bg-gradient-to-b from-blue-100 via-blue-400 to-blue-800 p-3">
        
        {/* Logo (clean, no outline, no box) */}
        <div className="flex justify-center items-center py-6">
          <img
            src="/img/logo.png"
            alt="Hospital Logo"
            className="w-20 h-20 mt-9 mb-9 object-contain"
          />
        </div>

        <Sidebar.Items className="bg-transparent">
          <Sidebar.ItemGroup className="bg-transparent space-y-1">

            <Sidebar.Item
              onClick={() => navigate("/ETU_Head/dashboard/dashboard")}
              icon={HiOutlineHome}
              className={itemClass("/ETU_Head/dashboard/dashboard")}
            >
              Dashboard
            </Sidebar.Item>

            <Sidebar.Item
              onClick={() => navigate("/ETU_Head/dashboard/graphs")}
              icon={HiOutlineChartBar}
              className={itemClass("/ETU_Head/dashboard/graphs")}
            >
              Trends
            </Sidebar.Item>

            <Sidebar.Item
              onClick={() => navigate("/ETU_Head/dashboard/medandequip")}
              icon={HiOutlineBeaker}
              className={itemClass("/ETU_Head/dashboard/medandequip")}
            >
              Inventory
            </Sidebar.Item>

            <Sidebar.Item
              onClick={() => navigate("/ETU_Head/dashboard/doctors")}
              icon={HiOutlineClipboardList}
              className={itemClass("/ETU_Head/dashboard/doctors")}
            >
              Doctors
            </Sidebar.Item>
          </Sidebar.ItemGroup>

          {/* Logout */}
          <Sidebar.ItemGroup className="bg-transparent mt-6">
            <Sidebar.Item
              icon={HiOutlineLogout}
              onClick={userLogout}
              className="transition-all duration-200 rounded-lg px-3 py-2 text-slate-800 hover:bg-red-100 hover:text-red-700"
            >
              Log Out
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </div>
    </Sidebar>
  );
};

export default ETU_HeadSidebar;
