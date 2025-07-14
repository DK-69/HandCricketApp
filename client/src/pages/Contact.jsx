import { Form } from "react-router-dom";
import styles from "./Aboutstyle.module.css";

export const contactData = async ({ request }) => {
  try {
    const res = await request.formData();
    const data = Object.fromEntries(res);
    console.log("📬 Contact form submitted:", data);
    return null;
  } catch (error) {
    console.error("❌ Contact form error:", error.message);
  }
};

const Contact = () => {
  return (
    <div className={styles.contactMainWrapper}>
      {/* 🔹 Personal Info Section */}
      <section className={styles.profileSection}>
        <h1 className={styles.profileHeading}>About Me</h1>
        <p><strong>Name:</strong> Deekshith Kumar Pampati</p>
        <p><strong>Degree:</strong> B.Tech in Computer Science and Engineering</p>
        <p><strong>Institute:</strong> Indian Institute of Technology (IIT) Dharwad</p>
        <p><strong>Interests:</strong> MERN stack, Problem Solving, Cybersecurity, Cloud Engineering</p>
        <p><strong>Skills:</strong> C++, Python, React, Node.js, DSA</p>

        <h2 className={styles.profileSubheading}>Connect with me:</h2>
        <ul className={styles.profileLinksList}>
          <li>
            📄 <a href="https://drive.google.com/file/d/1xBbDOsFIX7YP7TQ1kNfVuWM_2aAdyYUo/view?usp=sharing" target="_blank" rel="noopener noreferrer">Resume</a>
          </li>
          <li>
            💼 <a href="https://www.linkedin.com/in/pampati-deekshith-kumar-aa54b5314/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </li>
          
        </ul>
      </section>

      {/* 🔹 Contact Form Section */}
      <section className={styles.formSection}>
        <h2 className={styles.formHeading}>Contact Me</h2>
        <p className={styles.formSubheading}>Get in touch with me.</p>

        <Form method="POST" action="/contact" className={styles.contactForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="username">Full Name</label>
              <input
                type="text"
                name="username"
                id="username"
                required
                autoComplete="off"
                placeholder="Enter full name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                name="email"
                id="email"
                required
                autoComplete="off"
                placeholder="abc@example.com"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="message">Message</label>
            <textarea
              name="message"
              id="message"
              rows="6"
              placeholder="I am here to help you regarding the App."
            ></textarea>
          </div>

          <div className={styles.formButtonWrapper}>
            <button type="submit" className={styles.submitButton}>Send Message</button>
          </div>
        </Form>
      </section>
    </div>
  );
};
export default Contact;