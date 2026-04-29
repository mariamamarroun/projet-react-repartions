import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  const imageUrl =
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1920";

  return (
    <div style={styles.wrapper}>
      <div
        style={{
          ...styles.hero,
          backgroundImage: `
          linear-gradient(135deg, rgba(108,59,255,0.9), rgba(15,15,26,0.95)),
          url(${imageUrl})
        `,
        }}
      >
        <motion.div
          style={styles.content}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <h1 style={styles.title}>
            Professional Electronic <br /> Repair Services
          </h1>

          <p style={styles.description}>
            High-quality components and tools to repair your devices with
            precision, speed, and reliability.
          </p>

          <div style={styles.buttons}>
            <motion.button
              style={styles.primary}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
            >
              View Products <ChevronRight size={20} />
            </motion.button>

            <motion.button
              style={styles.secondary}
              whileHover={{ scale: 1.05 }}
            >
              Repair Guides
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    overflow: "hidden",
  },

  hero: {
    height: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    transform: "scale(1.05)", // subtle zoom effect 🔥
  },

  content: {
    textAlign: "center",
    color: "#FFFFFF",
    maxWidth: "720px",
    padding: "0 20px",
  },

  title: {
    fontSize: "56px",
    fontWeight: "800",
    marginBottom: "20px",
    lineHeight: "1.2",
    letterSpacing: "1px",
  },

  description: {
    fontSize: "18px",
    opacity: 0.85,
    marginBottom: "35px",
    lineHeight: "1.6",
  },

  buttons: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    flexWrap: "wrap",
  },

  primary: {
    background: "linear-gradient(135deg, #6C3BFF, #A78BFA)",
    color: "#FFFFFF",
    padding: "14px 30px",
    borderRadius: "14px",
    border: "none",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 10px 35px rgba(108,59,255,0.6)",
    transition: "all 0.3s ease",
  },

  secondary: {
    background: "transparent",
    border: "1px solid #A78BFA",
    color: "#A78BFA",
    padding: "14px 30px",
    borderRadius: "14px",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};