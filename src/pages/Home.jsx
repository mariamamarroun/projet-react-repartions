import { useEffect, useRef } from "react";
import { Renderer, Triangle, Program, Mesh } from "ogl";
import "./Prism.css";
import Hero from "../components/Hero";
import CategoriesSection from "../components/CategoriesSection";
import Footer from "../components/Footer";

const PrismBackground = () => {
  const containerRef = useRef(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const renderer = new Renderer({ alpha: true, dpr: 2 });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);

    const program = new Program(gl, {
      vertex: `attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }`,
      fragment: `
        precision highp float;
        uniform float iTime;
        uniform vec2 iResolution;
        void main() {
          vec2 uv = gl_FragCoord.xy / iResolution.xy;
          // Bleu électrique profond comme sur vos photos
          vec3 baseBlue = vec3(0.007, 0.007, 0.72); 
          vec3 crystal = 0.12 * cos(iTime * 0.4 + uv.xyx + vec3(0,2,4));
          gl_FragColor = vec4(baseBlue + crystal, 1.0);
        }`,
      uniforms: { iTime: { value: 0 }, iResolution: { value: [1, 1] } },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    const resize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      program.uniforms.iResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight];
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

const Home = () => {
  const products = [
    { id: 1, name: "Écran iPhone 13 OLED", price: "245.00 DT", status: "En Stock", img: "https://quieromac.com/cdn/shop/files/iphone_15_pro_max_01_ca239ca4-71b4-4258-9d0f-3208715c316e.jpg?v=1748109878" },
    { id: 2, name: "Batterie Samsung S21", price: "85.00 DT", status: "Rupture", img: "https://tse3.mm.bing.net/th/id/OIP.iPrdbZXc294s4-DEa0_grwHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" },
    { id: 3, name: "Connecteur de Charge", price: "25.00 DT", status: "En Stock", img: "https://m.media-amazon.com/images/I/61-0T6xwUUL._AC_SL1500_.jpg" },
    { id: 4, name: "Kit Outils Pro", price: "120.00 DT", status: "En Stock", img: "https://m.media-amazon.com/images/I/61YJhNkuggL._AC_.jpg" },
    { id: 5, name: "Vitre Arrière iPhone", price: "45.00 DT", status: "En Stock", img: "https://tse1.mm.bing.net/th/id/OIP.AHuNFA_VoBpC-hXE9pKC6AHaE8?rs=1&pid=ImgDetMain&o=7&rm=3" },
    { id: 6, name: "Caméra Faciale", price: "95.00 DT", status: "Rupture", img: "https://tse4.mm.bing.net/th/id/OIP.UHnrxkwoefAzSa1OeUXGlAHaEO?rs=1&pid=ImgDetMain&o=7&rm=3" },
    { id: 7, name: "Adhésif Écran Pro", price: "15.00 DT", status: "En Stock", img: "https://tse1.mm.bing.net/th/id/OIP.jDc2XD9kIHCnHzNkKjGbowHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" },
    { id: 8, name: "Nappe Power/Volume", price: "35.00 DT", status: "En Stock", img: "https://www.planetemobile.fr/photo/d14288f2873c0005c75e959b6ae5d744.jpg/w1000h1000zc2q100/samsung-original-nappe-volume-power-pour-samsung-galaxy-a14-sm-a145.jpg" },
    { id: 9, name: "Batterie Huawei P30 Pro - 4200mAh Originale", price: "279 DH", status: "En Stock", rating: 4.6, img: "https://down-th.img.susercontent.com/file/e8223fe3f3bc2000675d1e230dbc4e1e" },
    { id: 10, name: "Kit Ouverture Ventouses + Spatules - Set Complet", price: "99 DH", status: "En Stock", rating: 4.4, img: "https://th.bing.com/th/id/R.febf1fb46dbef093ea430303b9a56f7a?rik=wH%2fnhGI3tiu26A&riu=http%3a%2f%2fcdn.shopify.com%2fs%2ffiles%2f1%2f0665%2f2493%2f8486%2fproducts%2fCopiedeLivres-MiseenpagecAHBoutique-fondgris_1_62c7e97e-109a-4f04-983d-51d115910bda.png%3fv%3d1668368090&ehk=ITVwqta%2fUftA8UDW87KUyPbQY4M2QmlJf2TKUl9XTj8%3d&risl=&pid=ImgRaw&r=0" },
    { id: 11, name: "Haut-Parleur Externe Samsung S21 - Audio HD", price: "129 DH", status: "En Stock", rating: 4.5, img: "https://tse3.mm.bing.net/th/id/OIP.58hs3lftXSfvXePyQt8vvAHaHa?rs=1&pid=ImgDetMain&o=7&rm=3" },
    { id: 12, name: "Adhésif Double Face iPhone - Rouleau 2mm x 50m", price: "49 DH", status: "En Stock", rating: 4.7, img: "https://tse4.mm.bing.net/th/id/OIP.88whM_S9oAXlaz3wiFRy7gHaGu?rs=1&pid=ImgDetMain&o=7&rm=3" },
  
  ];

  return (
    <div className="home-wrapper">
      {/* SECTION HERO */}
      <Hero />
     

      {/* SECTION CATÉGORIES */}
      <CategoriesSection />

      {/* SECTION PRODUITS */}
      <main className="main-content !bg-primary">
        <section className="product-section">
          <div className="section-header">
             <h2>Nos Produits en Stock</h2>
             <div className="line-separator"></div>
          </div>
          
          <div className="product-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="image-container">
                  <img src={product.img} alt={product.name} />
                  <span className={`badge ${product.status === "Rupture" ? "out" : "in"}`}>
                    {product.status}
                  </span>
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="price">{product.price}</p>
                  <button className="add-btn" disabled={product.status === "Rupture"}>
                    {product.status === "Rupture" ? "Indisponible" : "Ajouter au panier"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <Footer />
      </main>
    </div>
  );
};

export default Home;