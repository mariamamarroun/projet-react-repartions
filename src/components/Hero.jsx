import hero from '../assets/hero-bg.jpg';
import { ChevronRight } from 'lucide-react';

export default function Hero() {
    const imageUrl="https://images.unsplash.com/photo-1729883596874-4372ae94435f?w=1920&h=600&fit=crop";

  return (
    <div style={{
      ...styles.hero,
      backgroundImage: `linear-gradient(135deg, rgba(82, 39, 255, 0.8), rgba(0, 112, 255, 0.8)), url(${imageUrl})`
    }}>
      <div style={styles.content}>
        <h1 style={styles.title}>Pièces de Réparation <br /> Électronique</h1>
        <p style={styles.description}>
          Trouvez toutes les pièces détachées et outils professionnels
          pour réparer vos appareils électroniques
        </p>
        <div style={styles.buttons}>
          <button style={styles.primary}>
            Voir les produits <ChevronRight size={20} />
          </button>
          <button style={styles.secondary}>Guides de réparation</button>
        </div>
      </div>
    </div>
  ); 
}

const styles = {
  hero: {
    minHeight: '400px',
    height: '60vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    zIndex: 0
  },
  content: {
    maxWidth: '700px',
    color: 'white',
    textAlign: 'center',
    zIndex: 1
  },
  title: {
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '20px',
    textShadow: '2px 2px 8px rgba(0,0,0,0.3)'
  },
  description: {
    fontSize: '18px',
    marginBottom: '30px',
    lineHeight: '1.6',
    textShadow: '1px 1px 4px rgba(0,0,0,0.2)'
  },
  buttons: {
    marginTop: '30px',
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  primary: {
    background: 'white',
    color: '#5227FF',
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
  },
  secondary: {
    background: 'transparent',
    color: 'white',
    border: '2px solid white',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    transition: 'all 0.3s ease'
  }
};