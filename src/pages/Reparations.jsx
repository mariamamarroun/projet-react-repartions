import React, { useState, useEffect } from "react";
import {
  Smartphone, Laptop, Tablet,
  CheckCircle, Clock, ChevronLeft,
  User, Settings, Zap, MessageCircle,
  Printer, Eye, BarChart2, Package
} from "lucide-react";
import "./Reparations.css";

/* ============================================================
   QUOTE ESTIMATOR LOGIC
   ============================================================ */
const PRICE_MATRIX = {
  Phone: {
    screen:    { label: "Écran",    min: 149, max: 399 },
    battery:   { label: "Batterie", min:  69, max: 159 },
    charge:    { label: "Charge",   min:  49, max:  89 },
    camera:    { label: "Caméra",   min:  99, max: 249 },
    default:   { label: "Général",  min:  59, max: 199 },
  },
  Laptop: {
    screen:    { label: "Écran",    min: 299, max: 699 },
    battery:   { label: "Batterie", min: 129, max: 259 },
    keyboard:  { label: "Clavier",  min:  99, max: 199 },
    default:   { label: "Général",  min:  79, max: 299 },
  },
  Tablet: {
    screen:    { label: "Écran",    min: 199, max: 499 },
    battery:   { label: "Batterie", min:  89, max: 179 },
    default:   { label: "Général",  min:  59, max: 229 },
  },
};

const getQuote = (deviceType, model, problem) => {
  if (!model && !problem) return null;
  const matrix = PRICE_MATRIX[deviceType] || PRICE_MATRIX.Phone;
  const prob = (problem || "").toLowerCase();
  let slot = matrix.default;
  if (prob.includes("écran") || prob.includes("screen") || prob.includes("vitre")) slot = matrix.screen || matrix.default;
  else if (prob.includes("batterie") || prob.includes("battery"))                  slot = matrix.battery || matrix.default;
  else if (prob.includes("charge") || prob.includes("connecteur"))                 slot = matrix.charge || matrix.default;
  else if (prob.includes("caméra") || prob.includes("camera"))                     slot = matrix.camera || matrix.default;
  else if (prob.includes("clavier") || prob.includes("keyboard"))                  slot = matrix.keyboard || matrix.default;
  // Premium models bump price slightly
  const premium = /pro|max|ultra|plus|fold/i.test(model);
  const bump = premium ? 1.2 : 1;
  return {
    min: Math.round(slot.min * bump),
    max: Math.round(slot.max * bump),
    type: slot.label,
  };
};

/* ============================================================
   SCANNING OVERLAY
   ============================================================ */
const ScanningOverlay = ({ visible }) => {
  if (!visible) return null;
  return (
    <div className="scanning-overlay">
      <div className="scan-wrapper">
        <div className="scan-ring-outer" />
        <div className="scan-ring" />
        <span className="scan-icon"><Zap size={28} /></span>
      </div>
      <p className="scan-text">Enregistrement en cours…</p>
      <p className="scan-sub">Analyse du diagnostic</p>
    </div>
  );
};

/* ============================================================
   SIDEBAR
   ============================================================ */
const Sidebar = ({ repairs }) => {
  const total     = repairs.length;
  const completed = repairs.filter(r => r.status === "Completed").length;
  const inProg    = total - completed;

  return (
    <aside className="rep-sidebar">
      <div className="sidebar-widget">
        <p className="widget-label">Total tickets</p>
        <p className="widget-stat cyan">{total}</p>
        <p className="widget-sub">toutes demandes</p>
      </div>
      <div className="sidebar-widget">
        <p className="widget-label">En cours</p>
        <p className="widget-stat violet">{inProg}</p>
        <p className="widget-sub">réparations actives</p>
      </div>
      <div className="sidebar-widget">
        <p className="widget-label">Terminées</p>
        <p className="widget-stat emerald">{completed}</p>
        <p className="widget-sub">appareils rendus</p>
      </div>
    </aside>
  );
};

/* ============================================================
   DEVICE ICON HELPER
   ============================================================ */
const DeviceIcon = ({ type, size = 18 }) => {
  if (type === "Phone")  return <Smartphone size={size} />;
  if (type === "Laptop") return <Laptop     size={size} />;
  return <Tablet size={size} />;
};

/* ============================================================
   CLIENT FORM PAGE
   ============================================================ */
const FormPage = ({ onSubmit }) => {
  const [form, setForm] = useState({
    deviceType: "Phone",
    model: "",
    customer: "",
    contact: "",
    problem: "",
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const quote = getQuote(form.deviceType, form.model, form.problem);

  const handleSubmit = () => {
    if (!form.model.trim() || !form.customer.trim()) {
      alert("Veuillez remplir le modèle et le nom client.");
      return;
    }
    onSubmit(form, quote);
    setForm({ deviceType: "Phone", model: "", customer: "", contact: "", problem: "" });
  };

  const devices = [
    { key: "Phone",  label: "Téléphone", Icon: Smartphone },
    { key: "Laptop", label: "Ordinateur", Icon: Laptop },
    { key: "Tablet", label: "Tablette",   Icon: Tablet },
  ];

  return (
    <div className="glass-card">
      <div className="card-title">
        <span className="card-title-icon"><Zap size={18} /></span>
        Nouvelle Demande
      </div>
      <p className="card-subtitle">Remplissez le formulaire de diagnostic pour enregistrer l'appareil.</p>

      <div className="form-grid">
        {/* DEVICE TYPE */}
        <div className="field full-width">
          <label className="field-label">Type d'appareil</label>
          <div className="device-selector">
            {devices.map(({ key, label, Icon }) => (
              <button
                key={key}
                className={`device-option ${form.deviceType === key ? "selected" : ""}`}
                onClick={() => set("deviceType", key)}
              >
                <Icon size={22} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* MODEL */}
        <div className="field">
          <label className="field-label">Modèle</label>
          <input
            type="text"
            placeholder="Ex: iPhone 15 Pro Max"
            value={form.model}
            onChange={e => set("model", e.target.value)}
          />
        </div>

        {/* CUSTOMER */}
        <div className="field">
          <label className="field-label">Nom client</label>
          <input
            type="text"
            placeholder="Nom complet"
            value={form.customer}
            onChange={e => set("customer", e.target.value)}
          />
        </div>

        {/* CONTACT */}
        <div className="field full-width">
          <label className="field-label">Contact</label>
          <input
            type="text"
            placeholder="Téléphone ou email"
            value={form.contact}
            onChange={e => set("contact", e.target.value)}
          />
        </div>

        {/* PROBLEM */}
        <div className="field full-width">
          <label className="field-label">Description de la panne</label>
          <textarea
            placeholder="Décrivez le problème en détail : symptômes, historique, chutes…"
            value={form.problem}
            onChange={e => set("problem", e.target.value)}
          />
        </div>

        {/* QUOTE ESTIMATOR */}
        <div className="field full-width">
          <label className="field-label">Estimation automatique du coût</label>
          <div className={`quote-box ${quote ? "has-quote" : ""}`}>
            <div>
              <p className="quote-label">
                {quote ? `Réparation ${quote.type} — ${form.deviceType}` : "Renseignez modèle + panne pour une estimation"}
              </p>
              {quote && <p className="quote-range">Fourchette indicative, hors pièces spéciales</p>}
            </div>
            {quote ? (
              <p className="quote-value">{quote.min} – {quote.max} DH</p>
            ) : (
              <p className="quote-value empty">— DH</p>
            )}
          </div>
        </div>
      </div>

      <button className="submit-btn" onClick={handleSubmit}>
        ⚡ Enregistrer la demande
      </button>
    </div>
  );
};

/* ============================================================
   ADMIN PAGE (Kanban-lite cards)
   ============================================================ */
const AdminPage = ({ repairs, onManage }) => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = repairs.filter(r => {
    const matchFilter = filter === "all"
      || (filter === "progress"  && r.status !== "Completed")
      || (filter === "completed" && r.status === "Completed");
    const q = search.toLowerCase();
    const matchSearch = !q
      || r.customer.toLowerCase().includes(q)
      || r.model.toLowerCase().includes(q)
      || r.id.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const getProgress = (repair) => {
    const done = repair.timeline.filter(s => s.completed).length;
    return Math.round((done / repair.timeline.length) * 100);
  };

  const handleWhatsApp = (repair, e) => {
    e.stopPropagation();
    const msg = encodeURIComponent(
      `Bonjour ${repair.customer}, votre réparation (${repair.id} — ${repair.model}) est en cours. Progression : ${getProgress(repair)}%.`
    );
    window.open(`https://wa.me/${repair.contact.replace(/\D/g, "")}?text=${msg}`, "_blank");
  };

  const handlePrint = (repair, e) => {
    e.stopPropagation();
    const w = window.open("", "_blank");
    w.document.write(`
      <html><head><title>Ticket ${repair.id}</title></head><body style="font-family:sans-serif;padding:30px">
        <h2>🔧 Ticket Réparation — ${repair.id}</h2>
        <p><b>Client :</b> ${repair.customer}</p>
        <p><b>Contact :</b> ${repair.contact || "—"}</p>
        <p><b>Appareil :</b> ${repair.deviceType} — ${repair.model}</p>
        <p><b>Panne :</b> ${repair.problem || "Non renseigné"}</p>
        <p><b>Statut :</b> ${repair.status}</p>
        <p><b>Progression :</b> ${getProgress(repair)}%</p>
        <hr/>
        <p style="font-size:12px;color:#888">Prism Repair — imprimé le ${new Date().toLocaleDateString("fr-FR")}</p>
      </body></html>
    `);
    w.print();
  };

  return (
    <div className="glass-card">
      <div className="card-title">
        <span className="card-title-icon"><BarChart2 size={18} /></span>
        Tableau de bord
      </div>
      <p className="card-subtitle">{repairs.length} réparation(s) enregistrée(s)</p>

      <div className="admin-toolbar">
        {[
          { key: "all",       label: "Tous" },
          { key: "progress",  label: "En cours" },
          { key: "completed", label: "Terminés" },
        ].map(f => (
          <button
            key={f.key}
            className={`admin-filter-btn ${filter === f.key ? "active" : ""}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
        <span className="admin-spacer" />
        <input
          className="admin-search"
          placeholder="Rechercher…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><Package size={28} color="var(--text-muted)" /></div>
          <p className="empty-title">Aucune réparation trouvée</p>
          <p className="empty-sub">Créez une nouvelle demande via l'onglet Client.</p>
        </div>
      ) : (
        <div className="repair-grid">
          {filtered.map((r, i) => {
            const pct  = getProgress(r);
            const done = r.status === "Completed";
            return (
              <div
                key={r.id}
                className={`repair-card ${done ? "completed" : ""}`}
                style={{ animationDelay: `${i * 0.06}s` }}
                onClick={() => onManage(repairs.indexOf(r))}
              >
                <div className="repair-card-top">
                  <div className={`repair-device-icon ${done ? "completed" : ""}`}>
                    <DeviceIcon type={r.deviceType} size={20} />
                  </div>
                  <span className={`repair-status-pill ${done ? "done" : "progress"}`}>
                    {done ? "Terminé" : "En cours"}
                  </span>
                </div>

                <p className="repair-card-model">{r.model}</p>
                <p className="repair-card-customer">👤 {r.customer}</p>
                <p className="repair-card-id">{r.id}</p>

                <div className="repair-progress-bar">
                  <div className="repair-progress-fill" style={{ width: `${pct}%` }} />
                </div>

                <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.75rem", color:"var(--text-muted)", marginTop:"2px" }}>
                  <span>{r.timeline.filter(s => s.completed).length}/{r.timeline.length} étapes</span>
                  <span style={{ color: done ? "var(--emerald)" : "var(--cyan)", fontWeight:700 }}>{pct}%</span>
                </div>

                <div className="repair-actions">
                  <button className="action-btn wa"     onClick={(e) => handleWhatsApp(r, e)} title="WhatsApp"><MessageCircle size={13} /> WA</button>
                  <button className="action-btn"        onClick={(e) => handlePrint(r, e)}    title="Imprimer"><Printer size={13} /> Ticket</button>
                  <button className="action-btn primary-action" onClick={(e) => { e.stopPropagation(); onManage(repairs.indexOf(r)); }}><Eye size={13} /> Gérer</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ============================================================
   TRACKING PAGE — DIGITAL PULSE TIMELINE
   ============================================================ */
const TrackingPage = ({ repair, repairIdx, onUpdate, onBack }) => {
  const done    = repair.timeline.filter(s => s.completed).length;
  const total   = repair.timeline.length;
  const pct     = Math.round((done / total) * 100);
  const isDone  = repair.status === "Completed";

  return (
    <div className="glass-card">
      <button className="back-btn" onClick={onBack}><ChevronLeft size={14} /> Retour</button>

      {/* HEADER */}
      <div className="tracking-header">
        <div className="tracking-device-icon">
          <DeviceIcon type={repair.deviceType} size={24} />
        </div>
        <div className="tracking-meta">
          <p className="tracking-model">{repair.model}</p>
          <p className="tracking-id">{repair.id} • {repair.customer}</p>
          {repair.problem && <p className="tracking-problem">{repair.problem}</p>}
        </div>
        <span className={`tracking-status-pill ${isDone ? "done" : "progress"}`}>
          {isDone ? "✓ Terminé" : "● En cours"}
        </span>
      </div>

      {/* OVERALL PROGRESS */}
      <div className="overall-progress">
        <div className="overall-progress-labels">
          <span className="overall-progress-label">Progression globale</span>
          <span className="overall-progress-pct">{pct}%</span>
        </div>
        <div className="overall-progress-bar">
          <div className="overall-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* TIMELINE */}
      <div className="timeline">
        {repair.timeline.map((step, si) => {
          const isCompleted = step.completed;
          const isCurrent   = !step.completed && (si === 0 || repair.timeline[si - 1].completed);
          const isPending    = !isCompleted && !isCurrent;

          return (
            <div key={si} className="timeline-step" style={{ animationDelay: `${si * 0.08}s` }}>
              {/* GLOW RING */}
              <div className={`step-ring ${isCompleted ? "done" : isCurrent ? "current" : "pending"}`}>
                {isCompleted ? <CheckCircle size={18} /> : isCurrent ? <Clock size={18} /> : <span style={{fontSize:"0.7rem",fontWeight:700,color:"var(--text-muted)"}}>{si + 1}</span>}
              </div>

              {/* CONTENT */}
              <p className={`step-title ${isPending ? "muted" : ""}`}>{step.title}</p>

              {isCompleted && (
                <p className="step-timestamp">✓ {step.date} à {step.time}</p>
              )}

              {isCurrent && (
                <button className="step-validate-btn" onClick={() => onUpdate(repairIdx, si)}>
                  <Zap size={13} /> Valider cette étape
                </button>
              )}

              {si === total - 1 && isCompleted && (
                <div className="pickup-banner">
                  <CheckCircle size={16} />
                  Appareil prêt — récupération en magasin
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================
   ROOT COMPONENT
   ============================================================ */
const STEPS_TEMPLATE = [
  "Appareil enregistré dans le système Prism Repair.",
  "Diagnostic matériel et logiciel complet effectué.",
  "Remplacement des composants défectueux par nos techniciens.",
  "Tests de validation : toutes les fonctions vérifiées.",
  "Appareil prêt — notification client envoyée.",
];

export default function Reparations() {
  const [page,        setPage]        = useState("form");
  const [repairs,     setRepairs]     = useState([]);
  const [currentIdx,  setCurrentIdx]  = useState(null);
  const [scanning,    setScanning]    = useState(false);

  const submitRepair = (form, quote) => {
    setScanning(true);
    setTimeout(() => {
      const id = "REP-" + Math.floor(10000 + Math.random() * 90000);
      const now = new Date();
      const newRepair = {
        id,
        ...form,
        quote,
        status: "In Progress",
        timeline: STEPS_TEMPLATE.map((s, i) => ({
          title: s,
          completed: i === 0,
          date: i === 0 ? now.toLocaleDateString("fr-FR") : null,
          time: i === 0 ? now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : null,
        })),
      };
      setRepairs(prev => [...prev, newRepair]);
      setScanning(false);
      setPage("admin");
    }, 2200);
  };

  const updateStep = (repairIdx, stepIdx) => {
    const updated  = repairs.map((r, ri) => {
      if (ri !== repairIdx) return r;
      const now = new Date();
      const timeline = r.timeline.map((s, si) => {
        if (si !== stepIdx) return s;
        return {
          ...s,
          completed: true,
          date: now.toLocaleDateString("fr-FR"),
          time: now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
        };
      });
      const status = stepIdx === STEPS_TEMPLATE.length - 1 ? "Completed" : r.status;
      return { ...r, timeline, status };
    });
    setRepairs(updated);
  };

  const handleManage = (idx) => {
    setCurrentIdx(idx);
    setPage("tracking");
  };

  const inProg    = repairs.filter(r => r.status !== "Completed").length;
  const completed = repairs.filter(r => r.status === "Completed").length;

  return (
    <div className="rep-app">
      <ScanningOverlay visible={scanning} />

      {/* NAV */}
      <nav className="rep-nav">
        <span className="rep-nav-logo">PRISM REPAIR</span>

        <div className="rep-nav-tabs">
          {[
            { key: "form",     label: "Client",    icon: <User size={14} /> },
            { key: "admin",    label: "Admin",     icon: <Settings size={14} /> },
          ].map(t => (
            <button
              key={t.key}
              className={`rep-tab ${page === t.key || (page === "tracking" && t.key === "admin") ? "active" : ""}`}
              onClick={() => setPage(t.key)}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        <div className="rep-nav-meta">
          {inProg > 0    && <span className="rep-count-badge">{inProg} en cours</span>}
          {completed > 0 && <span className="rep-count-badge" style={{background:"var(--emerald-dim)",borderColor:"rgba(0,255,170,.3)",color:"var(--emerald)"}}>{completed} terminées</span>}
        </div>
      </nav>

      {/* LAYOUT */}
      <div className="rep-layout">
        <Sidebar repairs={repairs} />

        <main className="rep-main">
          {page === "form" && (
            <FormPage onSubmit={submitRepair} />
          )}

          {page === "admin" && (
            <AdminPage repairs={repairs} onManage={handleManage} />
          )}

          {page === "tracking" && currentIdx !== null && (
            <TrackingPage
              repair={repairs[currentIdx]}
              repairIdx={currentIdx}
              onUpdate={updateStep}
              onBack={() => setPage("admin")}
            />
          )}
        </main>
      </div>
    </div>
  );
}