import { useEffect, useRef, useState } from "react";
import { Renderer, Triangle, Program, Mesh } from "ogl";
import "./Prism.css";
import Hero from "../components/Hero";
import CategoriesSection from "../components/CategoriesSection";
import Footer from "../components/Footer";

/* ============================================================
   OGL BACKGROUND — Liquid Dark Smoke shader
   ============================================================ */
const PrismBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: true, dpr: Math.min(window.devicePixelRatio, 2) });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);

    const program = new Program(gl, {
      vertex: `
        attribute vec2 position;
        void main() {
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `,
      /* ── Liquid Dark Smoke — subtle, slow, premium ── */
      fragment: `
        precision highp float;
        uniform float iTime;
        uniform vec2  iResolution;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash(i),             hash(i + vec2(1.0, 0.0)), f.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
            f.y
          );
        }

        float fbm(vec2 p) {
          float v = 0.0, a = 0.5;
          for (int i = 0; i < 5; i++) {
            v += a * noise(p);
            p  = p * 2.1 + vec2(1.7, 9.2);
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec2 uv = gl_FragCoord.xy / iResolution.xy;
          uv.y    = 1.0 - uv.y;

          float t  = iTime * 0.07;
          vec2  q  = vec2(fbm(uv + t * 0.3),         fbm(uv + vec2(5.2, 1.3) + t * 0.25));
          vec2  r  = vec2(fbm(uv + 4.0 * q + vec2(1.7, 9.2) + t * 0.15),
                          fbm(uv + 4.0 * q + vec2(8.3, 2.8) + t * 0.12));
          float f  = fbm(uv + 4.0 * r);

          /* Deep dark base — almost black with a cool tint */
          vec3 base   = vec3(0.02, 0.02, 0.05);
          /* Subtle cyan vein */
          vec3 vein   = vec3(0.0,  0.38, 0.55);
          /* Faint violet warmth */
          vec3 warm   = vec3(0.18, 0.08, 0.28);

          vec3 col = mix(base, vein, clamp(f * f * 1.4, 0.0, 1.0));
          col      = mix(col,  warm, clamp(length(q) * 0.5, 0.0, 1.0));
          col      = mix(col,  base * 0.3, clamp(length(r) * 0.4, 0.0, 1.0));

          /* Very slight vignette */
          vec2 vig = uv * (1.0 - uv.yx);
          col     *= pow(vig.x * vig.y * 20.0, 0.18);

          gl_FragColor = vec4(col, 1.0);
        }
      `,
      uniforms: {
        iTime:       { value: 0 },
        iResolution: { value: [1, 1] },
      },
    });

    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const resize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      program.uniforms.iResolution.value = [
        gl.drawingBufferWidth,
        gl.drawingBufferHeight,
      ];
    };
    window.addEventListener("resize", resize);
    resize();

    let raf;
    const render = (t) => {
      program.uniforms.iTime.value = t * 0.001;
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
    };
  }, []);

  return <div className="prism-bg" ref={containerRef} />;
};

/* ============================================================
   HEADER
   ============================================================ */
const Header = ({ cartCount, onCartClick, onLoginClick }) => (
  <header className="site-header">
    <a href="/" className="header-logo">PRISM REPAIR</a>
    <nav className="header-nav">
      <a href="/reparations" className="nav-link">Réparations</a>
      <a href="/clients"     className="nav-link">Clients</a>
      <a href="/articles"    className="nav-link">Articles</a>
    </nav>
    <div className="nav-actions">
      <button className="login-btn" onClick={onLoginClick}>Connexion</button>
      <button className="cart-btn"  onClick={onCartClick}>
        <span className="cart-icon">🛒</span>
        Panier
        {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
      </button>
    </div>
  </header>
);

/* ============================================================
   PRODUCT CARD
   ============================================================ */
const ProductCard = ({ product, onAddToCart }) => (
  <div className="product-card">
    <div className="image-container">
      <img src={product.img} alt={product.name} loading="lazy" />
      <span className={`badge ${product.status === "Rupture" ? "out" : "in"}`}>
        {product.status}
      </span>
      <div className="quick-view-overlay">
        <button className="quick-view-btn">👁 Aperçu rapide</button>
      </div>
    </div>
    <div className="product-info">
      <h3>{product.name}</h3>
      <p className="price">{product.price}</p>
      <button
        className="add-btn"
        disabled={product.status === "Rupture"}
        onClick={() => product.status !== "Rupture" && onAddToCart(product)}
      >
        {product.status === "Rupture" ? "Indisponible" : "+ Ajouter au panier"}
      </button>
    </div>
  </div>
);

/* ============================================================
   HOME PAGE
   ============================================================ */
const Home = () => {
  const [cartCount,   setCartCount]   = useState(0);
  const [cartFlash,   setCartFlash]   = useState(false);

  const handleAddToCart = (product) => {
    setCartCount((n) => n + 1);
    setCartFlash(true);
    setTimeout(() => setCartFlash(false), 600);
  };

  const handleCartClick  = () => alert(`Votre panier contient ${cartCount} article(s).`);
  const handleLoginClick = () => alert("Connexion / Inscription");

  const products = [
    { id: 1,  name: "Écran iPhone 13 OLED",                         price: "245 DT",  status: "En Stock", img: "https://quieromac.com/cdn/shop/files/iphone_15_pro_max_01_ca239ca4-71b4-4258-9d0f-3208715c316e.jpg?v=1748109878" },
    { id: 2,  name: "Batterie Samsung S21",                          price: "85 DT",   status: "Rupture",  img: "https://tse3.mm.bing.net/th/id/OIP.iPrdbZXc294s4-DEa0_grwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" },
    { id: 3,  name: "Connecteur de Charge",                          price: "25 DT",   status: "En Stock", img: "https://m.media-amazon.com/images/I/61-0T6xwUUL._AC_SL1500_.jpg" },
    { id: 4,  name: "Kit Outils Pro",                                price: "120 DT",  status: "En Stock", img: "https://m.media-amazon.com/images/I/61YJhNkuggL._AC_.jpg" },
    { id: 5,  name: "Vitre Arrière iPhone",                          price: "45 DT",   status: "En Stock", img: "https://tse1.mm.bing.net/th/id/OIP.AHuNFA_VoBpC-hXE9pKC6AHaE8?rs=1&pid=ImgDetMain&o=7&rm=3" },
    { id: 6,  name: "Caméra Faciale",                                price: "95 DT",   status: "Rupture",  img: "https://tse4.mm.bing.net/th/id/OIP.UHnrxkwoefAzSa1OeUXGlAHaEO?rs=1&pid=ImgDetMain&o=7&rm=3" },
    { id: 7,  name: "Adhésif Écran Pro",                             price: "15 DT",   status: "En Stock", img: "https://tse1.mm.bing.net/th/id/OIP.jDc2XD9kIHCnHzNkKjGbowHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" },
    { id: 8,  name: "Nappe Power / Volume",                          price: "35 DT",   status: "En Stock", img: "https://www.planetemobile.fr/photo/d14288f2873c0005c75e959b6ae5d744.jpg/w1000h1000zc2q100/samsung-original-nappe-volume-power-pour-samsung-galaxy-a14-sm-a145.jpg" },
    { id: 9,  name: "Batterie Huawei P30 Pro — 4200 mAh Originale", price: "279 DH",  status: "En Stock", img: "https://down-th.img.susercontent.com/file/e8223fe3f3bc2000675d1e230dbc4e1e" },
    { id: 10, name: "Kit Ouverture Ventouses + Spatules",            price: "99 DH",   status: "En Stock", img: "https://th.bing.com/th/id/R.febf1fb46dbef093ea430303b9a56f7a?rik=wH%2fnhGI3tiu26A&riu=http%3a%2f%2fcdn.shopify.com%2fs%2ffiles%2f1%2f0665%2f2493%2f8486%2fproducts%2fCopiedeLivres-MiseenpagecAHBoutique-fondgris_1_62c7e97e-109a-4f04-983d-51d115910bda.png%3fv%3d1668368090&ehk=ITVwqta%2fUftA8UDW87KUyPbQY4M2QmlJf2TKUl9XTj8%3d&risl=&pid=ImgRaw&r=0" },
    { id: 11, name: "Haut-Parleur Externe Samsung S21 — Audio HD",   price: "129 DH",  status: "En Stock", img: "https://tse3.mm.bing.net/th/id/OIP.58hs3lftXSfvXePyQt8vvAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" },
    { id: 12, name: "Adhésif Double Face iPhone — Rouleau 2 mm",     price: "49 DH",   status: "En Stock", img: "https://tse4.mm.bing.net/th/id/OIP.88whM_S9oAXlaz3wiFRy7gHaGu?rs=1&pid=ImgDetMain&o=7&rm=3" },
  ];

  return (
    <div className="home-wrapper">
      {/* HEADER FIXE */}
      <Header
        cartCount={cartCount}
        onCartClick={handleCartClick}
        onLoginClick={handleLoginClick}
      />

      {/* HERO avec fond shader */}
      <Hero PrismBackground={PrismBackground} />

      {/* CATÉGORIES */}
      <CategoriesSection />

      {/* PRODUITS */}
      <main className="main-content">
        <section className="product-section">
          <div className="section-header">
            <h2>Nos Produits en Stock</h2>
            <div className="line-separator" />
          </div>

          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
};

export default Home;