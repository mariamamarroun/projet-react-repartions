export default function TopBar() {
  return (
    <div style={styles.topBar}>
      <div>
        📞 +212 663419279 ; ✉️ contacmery@repairshop.ma
      </div>
      <div>
        Livraison gratuite pour les commandes supérieures à 500 DH
      </div>
    </div>
  );
}

const styles = {
  topBar: {
    background: '#6159ac',
    color: 'white',
    padding: '8px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px'
  }
};
