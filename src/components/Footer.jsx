import React from "react";
import "../pages/Prism.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-col branding">
          <h4>PRISM REPAIR</h4>
          <p>Votre partenaire pour la réparation électronique en Maroc.</p>
        </div>
        <div className="footer-col links">
          <h4>Liens utiles</h4>
          <ul>
            <li>
              <a href="/reparations">Réparations</a>
            </li>
            <li>
              <a href="/clients">Clients</a>
            </li>
            <li>
              <a href="/articles">Articles</a>
            </li>
          </ul>
        </div>
        <div className="footer-col contact">
          <h4>Contact</h4>
          <p>
            Email: <a href="mailto:contact@prismrepair.tn">contact@prismrepair.tn</a>
          </p>
          <p>Téléphone: +216 123 456 789</p>
          <div className="social-icons">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Instagram">📸</a>
            <a href="#" aria-label="Twitter">🐦</a>
          </div>
        </div>
      </div>
      <p className="copyright">© 2026 Prism Repair - Tous droits réservés</p>
    </footer>
  );
};

export default Footer;
