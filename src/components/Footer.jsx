import { Mail, Phone, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        
        <div>
          <h2 style={styles.logo}>PRISM REPAIR</h2>
          <p style={styles.text}>
            Premium electronic repair solutions in Morocco.
          </p>
        </div>

        <div>
          <h4 style={styles.title}>Quick Links</h4>
          <ul style={styles.list}>
            <li>Home</li>
            <li>Products</li>
            <li>Repairs</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h4 style={styles.title}>Contact</h4>
          <p><Mail size={16}/> contact@prismrepair.com</p>
          <p><Phone size={16}/> +212 600 000 000</p>
        </div>

        <div>
          <h4 style={styles.title}>Newsletter</h4>
          <input placeholder="Your email" style={styles.input}/>
          <button style={styles.button}>Subscribe</button>
        </div>

      </div>

      <p style={styles.copy}>© 2026 Prism Repair. All rights reserved.</p>
    </footer>
  );
};

const styles = {
  footer: {
    background: "#0F0F1A",
    color: "#fff",
    padding: "60px 20px",
  },
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
    gap: "30px",
  },
  logo: {
    color: "#A78BFA",
  },
  text: {
    opacity: 0.7,
  },
  title: {
    marginBottom: "10px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    opacity: 0.8,
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    width: "100%",
    marginBottom: "10px",
  },
  button: {
    background: "#6C3BFF",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  copy: {
    textAlign: "center",
    marginTop: "40px",
    opacity: 0.6,
  },
};

export default Footer;