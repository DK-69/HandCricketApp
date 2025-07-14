// client/src/components/layout/Navbar.jsx
import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  return (
    <nav className="navbar">
      <div className="navdiv">
        <div className="logo">
          <Link to="/">HandCricket</Link>
        </div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
          <li className="dropdown-container">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="profile-btn"
            >
              Profile
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/profile" onClick={() => setShowDropdown(false)}>
                  My Profile
                </Link>
                <button onClick={logout}>Logout</button>
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;