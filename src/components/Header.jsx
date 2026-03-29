export default function Header() {
  return (
    <div style={styles.header}>
      <h2 style={styles.logo}>REPAIR SHOP</h2>

      <input
        type="text"
        placeholder="Rechercher des produits, marques, modèles..."
        style={styles.search}
      />

      <div style={styles.cart}>🛒</div>
    </div>
  );
}

const styles = {
  header: {
    background: 'white',
    padding: '20px 40px',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    position: 'relative',
    zIndex: 50
  },
  logo: {
    color: '#1e5bff'
  },
  search: {
    flex: 1,
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ddd'
  },
  cart: {
    fontSize: '22px',
    cursor: 'pointer'
  }
};
