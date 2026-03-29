import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.wrapper}>
          <Link to="/" style={styles.logo}>
            <div style={styles.logoIcon}>
              <span style={styles.logoText}>PR</span>
            </div>
            <span style={styles.brand}>Prism Repair</span>
          </Link>

          <nav style={styles.nav}>
            <Link to="/" style={styles.link}>Accueil</Link>
            <Link to="/clients" style={styles.link}>Clients</Link>
            <Link to="/articles" style={styles.link}>Articles</Link>
            <Link to="/reparations" style={styles.link}>Réparations</Link>
          </nav>

          <div style={styles.actions}>
            <Link to="/" style={styles.contactLink}>Contact</Link>
            <button style={styles.loginBtn}>Connexion</button>
          </div>
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 40,
    background: 'linear-gradient(to right, #1e40af, #1e3a8a, #1e3a8a)',
    backdropFilter: 'blur(4px)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    borderBottom: '1px solid rgba(255,255,255,0.1)'
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    paddingLeft: '16px',
    paddingRight: '16px'
  },
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
    cursor: 'pointer'
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18px'
  },
  brand: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '18px'
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    marginLeft: '40px'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '15px',
    transition: 'color 0.3s ease',
    cursor: 'pointer',
    ':hover': {
      color: '#e0e7ff'
    }
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginLeft: 'auto'
  },
  contactLink: {
    fontSize: '14px',
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    padding: '6px 12px',
    borderRadius: '6px',
    textDecoration: 'none',
    transition: 'background 0.3s ease',
    cursor: 'pointer'
  },
  loginBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    background: 'white',
    color: '#1e40af',
    fontWeight: '600',
    padding: '8px 12px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    fontSize: '14px'
  }
};
