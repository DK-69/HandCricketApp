import { createContext, useEffect, useState } from 'react';
import { checkUser, logoutUser } from '../api/auth';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🟡 Called on initial load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await checkUser();
        // console.log("✅ checkUser response:", data);
        if (data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      isAuthenticated,
      setIsAuthenticated,
      loading,
      logout
    }}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>

  );
};

export default AuthProvider;
