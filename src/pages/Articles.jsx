import { useState } from "react";
import "./Articles.css";

const sampleProducts = [
  { id: 1, name: "Écran iPhone 12", price: 799, img: "https://tse3.mm.bing.net/th/id/OIP.vHq2i98aQvCrRzr16oWeAQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3", inStock: true },
  { id: 2, name: "Batterie Samsung S20", price: 495, img: "https://tse4.mm.bing.net/th/id/OIP.EZ8a_Slx1vaMUrt8LZPYxwHaJd?rs=1&pid=ImgDetMain&o=7&rm=3", inStock: false },
  { id: 3, name: "Carte mère MacBook Pro", price: 2490, img: "https://tse3.mm.bing.net/th/id/OIP.GIBI9sspdAn8Oy1abLFLdAHaFo?rs=1&pid=ImgDetMain&o=7&rm=3", inStock: true },
  { id: 4, name: "Connecteur de charge USB-C", price: 199, img: "https://tse1.mm.bing.net/th/id/OIP.ye5oAlqnPTXxiQxZOxT6yQHaGe?rs=1&pid=ImgDetMain&o=7&rm=3", inStock: true },
  { id: 5, name: "Disque dur SSD 1TB", price: 1299, img: "https://www.negoce.ci/14406-large_default/disque-dur-externe-sandisk-extreme-ssd-1tb.jpg", inStock: true },
  { id: 6, name: "RAM 8GB DDR4", price: 599, img: "https://tse3.mm.bing.net/th/id/OIP.l-MFL8dUahMUkKNs8LD-xwHaEu?rs=1&pid=ImgDetMain&o=7&rm=3", inStock: true },
  { id: 7, name: "Écran tactile Xiaomi Redmi Note 11", price: 799, img: "https://m.media-amazon.com/images/I/51-vc6Iw9VL._AC_.jpg", inStock: true },
  { id: 8, name: "Batterie MacBook Pro 13\" A2289", price: 899, img: "https://i.ebayimg.com/images/g/yvQAAOSw519jbKej/s-l1600.jpg", inStock: false },
  { id: 9, name: "Carte mère HP Pavilion", price: 1990, img: "https://tse3.mm.bing.net/th/id/OIP.dTr9LY-OB9EvX4rQjzyeTAHaFY?rs=1&pid=ImgDetMain&o=7&rm=3", inStock: true },
  { id: 10, name: "Microphone interne smartphone", price: 149, img: "https://tse3.mm.bing.net/th/id/OIP.JH-YNMJ59d0IFca5PjAS8QHaCx?rs=1&pid=ImgDetMain&o=7&rm=3", inStock: true },
  { id: 11, name: "Caméra arrière iPhone 12", price: 499, img: "https://tse3.mm.bing.net/th/id/OIP.OEKnToYnYY4nn_9UG4f_egHaHa?rs=1&pid=ImgDetMain&o=7&rm=3", inStock: true },
  { id: 12, name: "Câble flex volume iPhone", price: 79, img: "https://tse1.mm.bing.net/th/id/OIP.oHRNQJFs16SVcgvmYZLsEgHaHa?rs=1&pid=ImgDetMain&o=7&rm=3", inStock: true },
  { id: 13, name: "Écran MacBook Air 13\"", price: 2199, img: "https://tse1.mm.bing.net/th/id/OIP.iKHfWcxykR9LjlySAbzKjAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3", inStock: true },
  { id: 14, name: "Batterie Huawei P30", price: 399, img: "https://static2.sos-pc14.fr/17182-thickbox_default/batterie-originale-hb356687ecw-pour-huawei-p30-lite.jpg", inStock: true },
  { id: 15, name: "Carte mère Lenovo ThinkPad", price: 1799, img: "https://tse1.mm.bing.net/th/id/OIP.RrYa7nrv3MnvG597p9gCYQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3", inStock: true },
  { id: 16, name: "RAM 16GB DDR4", price: 1199, img: "https://tse3.mm.bing.net/th/id/OIP.vC9p-AKU9rIYb6vE1oQtRAHaFe?rs=1&pid=ImgDetMain&o=7&rm=3", inStock: true },
  { id: 17, name: "Disque dur HDD 2TB", price: 699, img: "https://th.bing.com/th/id/OIP.OKYXZNBmLv1BasDQ_nSY7wHaHa?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3", inStock: true },
  { id: 18, name: "Connecteur batterie Samsung", price: 129, img: "https://tse1.mm.bing.net/th/id/OIP.BWZlBrM_ACFTPCzTakss1QHaHa?rs=1&pid=ImgDetMain&o=7&rm=3", inStock: true },
  { id: 19, name: "Microphone interne MacBook", price: 249, img: "https://www.practical-tips.com/wp-content/uploads/2024/12/20s-7.png", inStock: true },
  { id: 20, name: "Écran tactile Samsung Galaxy S21", price: 899, img: "https://tse1.mm.bing.net/th/id/OIP.PLSpCfGb7Nvcu8EVH1wjrQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3", inStock: true }
];

export default function Articles() {
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [orderSuccess, setOrderSuccess] = useState(false);

  

  const filtered = sampleProducts.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  function addToCart(product) {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id
            ? { ...i, qty: i.qty + 1 }
            : i
        );
      }
      return [...prev, { product, qty: 1 }];
    });
  }

  function changeQty(id, delta) {
    setCart(prev =>
      prev
        .map(i =>
          i.product.id === id ? { ...i, qty: i.qty + delta } : i
        )
        .filter(i => i.qty > 0)
    );
  }

  function removeFromCart(id) {
    setCart(prev => prev.filter(i => i.product.id !== id));
  }

  const totalItems = cart.reduce((acc, i) => acc + i.qty, 0);
  const totalPrice = cart.reduce((acc, i) => acc + i.qty * i.product.price, 0);

  return (
    <div className="articles-page">

      {/* SEARCH */}
      <div className="header-search">
        <input
          type="text"
          placeholder="Rechercher un composant ou outil..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {/* MON PANIER PREMIUM */}
      <div className={`cart-panel ${cart.length > 0 ? "active" : ""}`}>
        <h2>Mon Panier</h2>

        {cart.length === 0 ? (
          <div className="empty-cart-banner">
            <div className="cart-icon">🛍️</div>
            <p>Votre panier est vide.</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.map(i => (
                <div key={i.product.id} className="cart-item">
                  <img src={i.product.img} alt={i.product.name} />

                  <div className="info">
                    <div className="title">{i.product.name}</div>
                    <div className="price">{i.product.price} DH</div>
                  </div>

                  <div className="quantity">
                    <button onClick={() => changeQty(i.product.id, -1)}>-</button>
                    <span>{i.qty}</span>
                    <button onClick={() => changeQty(i.product.id, 1)}>+</button>
                  </div>

                  <div
                    className="remove"
                    onClick={() => removeFromCart(i.product.id)}
                  >
                    🗑️
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-footer">
              <div>Total Articles: {totalItems}</div>
              <div className="total-price">{totalPrice} DH</div>

              <button
                className="checkout-btn"
                onClick={() => {
                  if (cart.length > 0) {
                    setOrderSuccess(true);
                  }
                }}
              >
                Procéder au paiement
              </button>
            </div>
          </>
        )}
      </div>

      {/* PRODUCTS */}
      <div className={`products-row ${cart.length > 0 ? "dimmed" : ""}`}>
        {filtered.map(p => (
          <div key={p.id} className="product-card">
            <img src={p.img} alt={p.name} />

            <div className="product-info">
              <h3>{p.name}</h3>
              <div className="price">{p.price} DH</div>

              <div className={`stock-badge ${p.inStock ? "stock-available" : "stock-unavailable"}`}>
                {p.inStock ? "En Stock" : "Rupture de Stock"}
              </div>
            </div>

            {p.inStock && (
              <div className="add-to-cart" onClick={() => addToCart(p)}>
                Ajouter au panier
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MODAL SUCCESS */}
      {orderSuccess && (
        <div className="order-modal-overlay">
          <div className="order-modal">
            <div className="success-icon">✓</div>
            <h2>Votre commande a été passée avec succès !</h2>
            <p>
              Merci pour votre confiance.<br />
              Vous recevrez un e-mail de confirmation d'ici quelques instants.
            </p>
            <div className="order-summary">
              <div>Total Articles: {totalItems}</div>
              <div className="total-price">
                Montant total: {totalPrice} DH
              </div>
            </div>
            <button
              className="checkout-btn"
              onClick={() => {
                setCart([]);
                setOrderSuccess(false);
              }}
            >
              Retour à la boutique
            </button>
          </div>
        </div>
      )}
    </div>
  );
}