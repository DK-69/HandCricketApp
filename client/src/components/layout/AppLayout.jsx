import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const AppLayout = () => {
  const location = useLocation();
  const hideNavbar = location.pathname.startsWith("/game") || location.pathname === "/toss";

  
  return (
    <div className="app-container">
      {!hideNavbar && <Navbar />}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;