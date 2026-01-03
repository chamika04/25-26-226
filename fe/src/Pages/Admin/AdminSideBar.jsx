import { Sidebar } from 'flowbite-react';
import {
  HiOutlineHome,
  HiOutlineUserGroup,
  HiOutlineClipboardCheck,
  HiOutlineLogout,
} from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const userLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <Sidebar
      aria-label="Admin Sidebar"
      className="bg-blue-50 border-r-2 border-blue-200 h-screen overflow-hidden"
    >
      {/* Logo + Title */}
      <div className="flex flex-col items-center py-6">
        <img
          src="../public/img/logo.png"
          alt="Hospital Logo"
          className="w-24 h-24 mb-10 mt-8"
        />
        <h1 className="text-lg font-semibold text-blue-700 text-center">
          System Administration
        </h1>
      </div>

      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {/* Dashboard */}
          <Sidebar.Item
            href="/admin/AdminDashboard"
            icon={HiOutlineHome}
            className="hover:bg-blue-200 rounded-md"
          >
            Dashboard
          </Sidebar.Item>

          {/* Users */}
          <Sidebar.Item
            href="/admin/users"
            icon={HiOutlineUserGroup}
            className="hover:bg-blue-200 rounded-md"
          >
            Users
          </Sidebar.Item>

          {/* Registration Requests */}
          <Sidebar.Item
            href="/admin/RegReq"
            icon={HiOutlineClipboardCheck}
            className="hover:bg-blue-200 rounded-md"
          >
            Registration Requests
          </Sidebar.Item>
        </Sidebar.ItemGroup>

        <Sidebar.ItemGroup>
          {/* Logout */}
          <Sidebar.Item
            icon={HiOutlineLogout}
            onClick={userLogout}
            className="hover:bg-red-100 text-red-600 rounded-md cursor-pointer"
          >
            Log Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default AdminSidebar;
