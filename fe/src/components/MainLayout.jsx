import Navbar from "./Navbar";
import HospitalFooter from "./MyFooter";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <HospitalFooter />
    </>
  );
};

export default MainLayout;
