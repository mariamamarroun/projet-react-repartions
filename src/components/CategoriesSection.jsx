import React from "react";
import { motion } from "framer-motion";
import {
  Monitor,
  Battery,
  Wrench,
  Cpu,
  Cable,
  Package,
} from "lucide-react";

const categories = [
  { name: "Écrans", Icon: Monitor, bgColor: "white", iconColor: "#1E40AF", textColor: "#1E40AF" },
  { name: "Batteries", Icon: Battery, bgColor: "white", iconColor: "#065F46", textColor: "#065F46" },
  { name: "Outils", Icon: Wrench, bgColor: "white", iconColor: "#C2410C", textColor: "#C2410C" },
  { name: "Composants", Icon: Cpu, bgColor: "white", iconColor: "#6B21A8", textColor: "#6B21A8" },
  { name: "Câbles", Icon: Cable, bgColor: "white", iconColor: "#831843", textColor: "#831843" },
  { name: "Accessoires", Icon: Package, bgColor: "white", iconColor: "#3730A3", textColor: "#3730A3" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.8 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15, duration: 0.6 },
  },
};

const CategoriesSection = () => {
  return (
    <section className="bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Catégories</h2>
        <motion.div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
            padding: "20px 0",
          }}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {categories.map((category, index) => {
            const { name, Icon, bgColor, iconColor, textColor } = category;
            return (
            <motion.div
              key={name}
              className="rounded-2xl shadow-md text-center transition-all duration-300 text-white"
              style={{
                width: "128px",
                padding: "24px",
                backgroundColor: bgColor,
                cursor: "pointer",
              }}
              variants={itemVariants}
              whileHover={{
                scale: 1.1,
                rotateY: 5,
                boxShadow: `0 20px 40px ${iconColor}40`,
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  backgroundColor: iconColor,
                }}
                whileHover={{ rotate: 360, scale: 1.15 }}
                transition={{ type: "spring", stiffness: 200, damping: 10, duration: 0.6 }}
              >
                <Icon className="text-white w-8 h-8" />
              </motion.div>
              <motion.p
                style={{
                  fontWeight: "500",
                  fontSize: "14px",
                  color: textColor,
                  textAlign: "center",
                  margin: 0,
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                {name}
              </motion.p>
            </motion.div>
            );F
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;
