import { useState, useEffect, useRef } from "react";
import "./Articles.css";

/* ── PRODUCTS ─────────────────────────────────────────────── */
const sampleProducts = [
  { id: 1,  name: "Écran iPhone 12",                 price: 799,  img: "https://tse3.mm.bing.net/th/id/OIP.vHq2i98aQvCrRzr16oWeAQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",       inStock: true,  category: "iPhone"  },
  { id: 2,  name: "Batterie Samsung S20",            price: 495,  img: "https://tse4.mm.bing.net/th/id/OIP.EZ8a_Slx1vaMUrt8LZPYxwHaJd?rs=1&pid=ImgDetMain&o=7&rm=3",       inStock: false, category: "Samsung" },
  { id: 3,  name: "Carte mère MacBook Pro",          price: 2490, img: "https://tse3.mm.bing.net/th/id/OIP.GIBI9sspdAn8Oy1abLFLdAHaFo?rs=1&pid=ImgDetMain&o=7&rm=3",       inStock: true,  category: "MacBook" },
  { id: 4,  name: "Connecteur de charge USB-C",      price: 199,  img: "https://tse1.mm.bing.net/th/id/OIP.ye5oAlqnPTXxiQxZOxT6yQHaGe?rs=1&pid=ImgDetMain&o=7&rm=3",       inStock: true,  category: "Tools"   },
  { id: 5,  name: "Disque dur SSD 1TB",              price: 1299, img: "https://www.negoce.ci/14406-large_default/disque-dur-externe-sandisk-extreme-ssd-1tb.jpg",             inStock: true,  category: "MacBook" },
  { id: 6,  name: "RAM 8GB DDR4",                    price: 599,  img: "https://tse3.mm.bing.net/th/id/OIP.l-MFL8dUahMUkKNs8LD-xwHaEu?rs=1&pid=ImgDetMain&o=7&rm=3",       inStock: true,  category: "MacBook" },
  { id: 7,  name: "Écran Xiaomi Redmi Note 11",      price: 799,  img: "https://m.media-amazon.com/images/I/51-vc6Iw9VL._AC_.jpg",                                           inStock: true,  category: "Samsung" },
  { id: 8,  name: "Batterie MacBook Pro 13\" A2289", price: 899,  img: "https://i.ebayimg.com/images/g/yvQAAOSw519jbKej/s-l1600.jpg",                                        inStock: false, category: "MacBook" },
  { id: 9,  name: "Carte mère HP Pavilion",          price: 1990, img: "https://tse3.mm.bing.net/th/id/OIP.dTr9LY-OB9EvX4rQjzyeTAHaFY?rs=1&pid=ImgDetMain&o=7&rm=3",       inStock: true,  category: "Tools"   },
  { id: 10, name: "Microphone interne smartphone",   price: 149,  img: "https://tse3.mm.bing.net/th/id/OIP.JH-YNMJ59d0IFca5PjAS8QHaCx?rs=1&pid=ImgDetMain&o=7&rm=3",       inStock: true,  category: "Tools"   },
  { id: 11, name: "Caméra arrière iPhone 12",        price: 499,  img: "https://tse3.mm.bing.net/th/id/OIP.OEKnToYnYY4nn_9UG4f_egHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",       inStock: true,  category: "iPhone"  },
  { id: 12, name: "Câble flex volume iPhone",        price: 79,   img: "https://tse1.mm.bing.net/th/id/OIP.oHRNQJFs16SVcgvmYZLsEgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",       inStock: true,  category: "iPhone"  },
  { id: 13, name: "Écran MacBook Air 13\"",          price: 2199, img: "https://tse1.mm.bing.net/th/id/OIP.iKHfWcxykR9LjlySAbzKjAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",       inStock: true,  category: "MacBook" },
  { id: 14, name: "Batterie Huawei P30",             price: 399,  img: "https://static2.sos-pc14.fr/17182-thickbox_default/batterie-originale-hb356687ecw-pour-huawei-p30-lite.jpg", inStock: true, category: "Samsung" },
  { id: 15, name: "Carte mère Lenovo ThinkPad",      price: 1799, img: "https://tse1.mm.bing.net/th/id/OIP.RrYa7nrv3MnvG597p9gCYQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",       inStock: true,  category: "Tools"   },
  { id: 16, name: "RAM 16GB DDR4",                   price: 1199, img: "https://tse3.mm.bing.net/th/id/OIP.vC9p-AKU9rIYb6vE1oQtRAHaFe?rs=1&pid=ImgDetMain&o=7&rm=3",       inStock: true,  category: "MacBook" },
  { id: 17, name: "Disque dur HDD 2TB",              price: 699,  img: "https://tse1.mm.bing.net/th/id/OIP.PLSpCfGb7Nvcu8EVH1wjrQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",       inStock: true,  category: "Tools"   },
  { id: 18, name: "Connecteur batterie Samsung",     price: 129,  img: "https://tse3.mm.bing.net/th/id/OIP.iPrdbZXc294s4-DEa0_grwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",       inStock: true,  category: "Samsung" },
  { id: 19, name: "Microphone interne MacBook",      price: 249,  img: "https://tse3.mm.bing.net/th/id/OIP.58hs3lftXSfvXePyQt8vvAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",       inStock: true,  category: "MacBook" },
  { id: 20, name: "Écran Samsung Galaxy S21",        price: 899,  img: "https://tse1.mm.bing.net/th/id/OIP.PLSpCfGb7Nvcu8EVH1wjrQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",       inStock: true,  category: "Samsung" },
];

const CATEGORIES = ["Tous", "iPhone", "Samsung", "MacBook", "Tools"];

/* ── GLOW BURST ───────────────────────────────────────────── */
function GlowBurst({ x, y, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 700); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="glow-burst" style={{ left: x, top: y }} aria-hidden>
      {[...Array(8)].map((_, i) => <span key={i} className="burst-p" style={{ "--i": i }} />)}
    </div>
  );
}

/* ── PRODUCT CARD ─────────────────────────────────────────── */
function ProductCard({ product, onAdd, delay }) {
  const [added, setAdded] = useState(false);
  const [burst, setBurst] = useState(null);
  const btnRef = useRef(null);

  const handleAdd = () => {
    if (!product.inStock || added) return;
    if (btnRef.current) {
      const r  = btnRef.current.getBoundingClientRect();
      const pr = btnRef.current.closest(".art-page").getBoundingClientRect();
      setBurst({ x: r.left - pr.left + r.width / 2, y: r.top - pr.top + r.height / 2 });
    }
    setAdded(true);
    onAdd(product);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="a-card" style={{ "--delay": `${delay}ms` }}>
      {burst && <GlowBurst x={burst.x} y={burst.y} onDone={() => setBurst(null)} />}

      <div className="a-card-img">
        <img src={product.img} alt={product.name} loading="lazy" />
        <span className={`a-badge ${product.inStock ? "in" : "out"}`}>
          {product.inStock ? "En Stock" : "Rupture"}
        </span>
        <div className="a-quick-view"><span>👁 Aperçu rapide</span></div>
      </div>

      <div className="a-card-body">
        <p className="a-card-name">{product.name}</p>
        <p className="a-card-price">{product.price.toLocaleString()} DH</p>
        <button
          ref={btnRef}
          className={`a-add-btn ${added ? "added" : ""} ${!product.inStock ? "disabled" : ""}`}
          onClick={handleAdd}
          disabled={!product.inStock}
        >
          {added ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
          )}
          <span>{added ? "Ajouté !" : product.inStock ? "Ajouter" : "Indisponible"}</span>
        </button>
      </div>
    </div>
  );
}

/* ── CART DRAWER ──────────────────────────────────────────── */
function CartDrawer({ cart, open, onClose, onChangeQty, onRemove, totalItems, totalPrice, onCheckout }) {
  return (
    <>
      <div className={`drawer-backdrop ${open ? "vis" : ""}`} onClick={onClose} />
      <aside className={`cart-drawer ${open ? "open" : ""}`}>
        <div className="dr-header">
          <div className="dr-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            Mon Panier
            {totalItems > 0 && <span className="dr-count">{totalItems}</span>}
          </div>
          <button className="dr-close" onClick={onClose}>✕</button>
        </div>

        <div className="dr-items">
          {cart.length === 0 ? (
            <div className="dr-empty">
              <div className="dr-empty-icon">🛍️</div>
              <p>Panier vide</p>
              <span>Ajoutez des pièces pour commencer</span>
            </div>
          ) : (
            cart.map(i => (
              <div key={i.product.id} className="dr-item">
                <img src={i.product.img} alt={i.product.name} />
                <div className="di-info">
                  <p className="di-name">{i.product.name}</p>
                  <p className="di-price">{(i.product.price * i.qty).toLocaleString()} DH</p>
                </div>
                <div className="di-qty">
                  <button onClick={() => onChangeQty(i.product.id, -1)}>−</button>
                  <span>{i.qty}</span>
                  <button onClick={() => onChangeQty(i.product.id, 1)}>+</button>
                </div>
                <button className="di-rm" onClick={() => onRemove(i.product.id)}>🗑</button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="dr-footer">
            <div className="dr-total-row">
              <span>Total</span>
              <span className="dr-total">{totalPrice.toLocaleString()} DH</span>
            </div>
            <button className="dr-checkout" onClick={onCheckout}>
              Procéder au paiement →
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

/* ── SUCCESS MODAL ────────────────────────────────────────── */
function SuccessModal({ visible, totalItems, totalPrice, onClose }) {
  if (!visible) return null;
  const now = new Date();
  const ref = "PRX-" + Math.floor(100000 + Math.random() * 900000);
  return (
    <div className="modal-overlay">
      <div className="receipt">
        <div className="receipt-check-wrap">
          <div className="receipt-ring" />
          <div className="receipt-check">✓</div>
        </div>
        <p className="receipt-title">Commande confirmée</p>
        <p className="receipt-sub">Merci pour votre confiance ! Un e-mail de confirmation vous sera envoyé.</p>
        <div className="receipt-body">
          <div className="r-row"><span>Référence</span><span className="r-val mono">{ref}</span></div>
          <div className="r-row"><span>Date</span><span className="r-val">{now.toLocaleDateString("fr-FR")} {now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</span></div>
          <div className="r-row"><span>Articles</span><span className="r-val">{totalItems} pièce(s)</span></div>
          <div className="r-divider" />
          <div className="r-row r-total"><span>Montant total</span><span className="r-val r-total-price">{totalPrice.toLocaleString()} DH</span></div>
        </div>
        <button className="receipt-close" onClick={onClose}>Retour à la boutique</button>
      </div>
    </div>
  );
}

/* ── ROOT ─────────────────────────────────────────────────── */
export default function Articles() {
  const [query,        setQuery]        = useState("");
  const [category,     setCategory]     = useState("Tous");
  const [cart,         setCart]         = useState([]);
  const [drawerOpen,   setDrawerOpen]   = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const filtered = sampleProducts.filter(p => {
    const matchCat   = category === "Tous" || p.category === category;
    const matchQuery = p.name.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  });

  function addToCart(product) {
    setCart(prev => {
      const ex = prev.find(i => i.product.id === product.id);
      if (ex) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1 }];
    });
  }

  function changeQty(id, delta) {
    setCart(prev => prev.map(i => i.product.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0));
  }

  function removeFromCart(id) {
    setCart(prev => prev.filter(i => i.product.id !== id));
  }

  const totalItems = cart.reduce((a, i) => a + i.qty, 0);
  const totalPrice = cart.reduce((a, i) => a + i.qty * i.product.price, 0);

  return (
    <div className="art-page">

      {/* HEADER */}
      <div className="art-header">
        <div className="art-header-top">
          <div>
            <h1 className="art-title">Parts <em>Hub</em></h1>
            <p className="art-subtitle">{sampleProducts.length} composants · Livraison express Maroc</p>
          </div>
          <div className="art-search-wrap">
            <svg className="search-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="art-search"
              type="text"
              placeholder="Rechercher un composant…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
        </div>

        {/* CATEGORY CHIPS */}
        <div className="cat-bar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`cat-chip ${category === cat ? "active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
          <span className="cat-result">{filtered.length} résultat{filtered.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* GRID */}
      <div className="art-grid">
        {filtered.map((p, idx) => (
          <ProductCard key={p.id} product={p} onAdd={addToCart} delay={idx * 40} />
        ))}
        {filtered.length === 0 && (
          <div className="art-empty">
            <span>🔍</span>
            <p>Aucun article trouvé</p>
          </div>
        )}
      </div>

      {/* FLOATING CART BUBBLE */}
      <button
        className={`cart-bubble ${totalItems > 0 ? "active" : ""}`}
        onClick={() => setDrawerOpen(true)}
        aria-label="Ouvrir le panier"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
          <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
        </svg>
        {totalItems > 0 && <span className="bubble-badge">{totalItems}</span>}
      </button>

      <CartDrawer
        cart={cart}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onChangeQty={changeQty}
        onRemove={removeFromCart}
        totalItems={totalItems}
        totalPrice={totalPrice}
        onCheckout={() => { setDrawerOpen(false); setOrderSuccess(true); }}
      />

      <SuccessModal
        visible={orderSuccess}
        totalItems={totalItems}
        totalPrice={totalPrice}
        onClose={() => { setCart([]); setOrderSuccess(false); }}
      />
    </div>
  );
}