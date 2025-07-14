import { useState, useContext } from "react";
import { loginUser } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Header from "./Header";
import styles from "./jwt.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });

  const { setUser, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: "", password: "" });

    try {
      const res = await loginUser(email, password);
      if (res.errors) {
        setErrors(res.errors);
      } else if (res.user) {
        setUser(res.user);
        setIsAuthenticated(true);
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <div className={styles.jwtWrapper}>
      <Header />
      <form onSubmit={handleSubmit} className={styles.authFormContainer}>
        <h2 className={styles.authFormTitle}>Log in</h2>

        <label className={styles.authLabel}>Email</label>
        <input
          type="text"
          value={email}
          className={styles.authInput}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className={styles.authError}>{errors.email}</div>

        <label className={styles.authLabel}>Password</label>
        <input
          type="password"
          value={password}
          className={styles.authInput}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className={styles.authError}>{errors.password}</div>

        <button type="submit" className={styles.authButton}>Log in</button>
      </form>
    </div>
  );
};

export default Login;
