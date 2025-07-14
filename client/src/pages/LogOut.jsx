// client/src/pages/LogOut.jsx
import { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../api/auth";

const LogOut = () => {
  const { setUser, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      await logoutUser(); // clears cookie
      setUser(null);
      setIsAuthenticated(false);
      navigate("/login"); // redirect to login page
    };

    doLogout();
  }, []);

  return <p>Logging out...</p>;
};

export default LogOut;
