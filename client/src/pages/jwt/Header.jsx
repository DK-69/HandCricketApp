import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import styles from "./jwt.module.css";

const Header = () => {
  const { user, isAuthenticated } = useContext(AuthContext);

  return (
    <nav className={styles.jwtHeaderNav}>
      <h1 className={styles.thish1}><Link to="/">Hand Cricket</Link></h1>
      <ul className={styles.authUL}>
        {isAuthenticated ? (
          <>
            <li>Welcome, {user?.email}</li>
            <li><Link to="/logout">Log out</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/login"  className={styles.authButtonLogin}>Log in</Link></li>
            <li><Link to="/signup" className={styles.authButton}>Sign up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Header;
