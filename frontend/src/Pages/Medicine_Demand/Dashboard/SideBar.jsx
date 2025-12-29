import { Sidebar } from 'flowbite-react';
import {
  HiOutlineHome,
  HiOutlineClipboardList,
  HiOutlineCalendar,
  HiOutlineCash,
  HiOutlineChatAlt,
  HiOutlineLogout,
  HiOutlineDocumentText, 
  HiOutlineCollection, 
  HiOutlineBeaker, 
  
  
} from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

// JavaScript Version (No TypeScript types used)
const HospitalSidebar = () => {
  const navigate = useNavigate();

  const userLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Sidebar aria-label="Hospital Sidebar" className="bg-blue-50 border-r-2 border-blue-200 h-screen overflow-hidden">
      {/* Logo */}
      <div className="flex justify-center p-5">
        <img src="../../public/img/logo.png" alt="Hospital Logo" className="w-24 h-24" />
      </div>

      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item
            href="/medicine/dashboard"
            icon={HiOutlineHome}
            className="transition-all duration-300 hover:bg-blue-300 p-3 rounded-lg"
          >
            Dashboard
          </Sidebar.Item>

          <Sidebar.Collapse
            icon={HiOutlineCollection}
            label="Stock Management"
            className="transition-all duration-300 hover:bg-blue-300 p-3 rounded-lg"
          >
            <Sidebar.Item href="/medicine/dashboard/manage" icon={HiOutlineBeaker}>
              Medicine Management
            </Sidebar.Item>
            <Sidebar.Item href="/medicine/dashboard/manage_eqp" icon={HiOutlineClipboardList}>
              Equipment Management
            </Sidebar.Item>
          </Sidebar.Collapse> 

          <Sidebar.Collapse
            icon={HiOutlineCalendar}
            label="Appointments"
            className="transition-all duration-300 hover:bg-blue-300 p-3 rounded-lg"
          >
            <Sidebar.Item href="/medicine/dashboard/bookings">Bookings</Sidebar.Item>
            <Sidebar.Item href="/medicine/dashboard/schedule">Schedule</Sidebar.Item>
          </Sidebar.Collapse>

          <Sidebar.Collapse
            icon={HiOutlineCash}
            label="Billing"
            className="transition-all duration-300 hover:bg-blue-300 p-3 rounded-lg"
          >
            <Sidebar.Item href="/admin/dashboard/invoices">Invoices</Sidebar.Item>
            <Sidebar.Item href="/admin/dashboard/payments">Payments</Sidebar.Item>
          </Sidebar.Collapse>

          <Sidebar.Item
            href="/admin/dashboard/support"
            icon={HiOutlineChatAlt}
            className="transition-all duration-300 hover:bg-blue-300 p-3 rounded-lg"
          >
            Support
          </Sidebar.Item>
        </Sidebar.ItemGroup>

        <Sidebar.ItemGroup>
          <Sidebar.Item
            href="/admin/dashboard/docs"
            icon={HiOutlineDocumentText}
            className="transition-all duration-300 hover:bg-blue-300 p-3 rounded-lg"
          >
            Documentation
          </Sidebar.Item>

          <Sidebar.Item
            icon={HiOutlineLogout}
            onClick={userLogout}
            className="transition-all duration-300 hover:bg-red-500 p-3 rounded-lg text-black"
          >
            Log Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default HospitalSidebar;
