import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ajouterClient, supprimerClient, modifierClient } from "../redux/slices/clientsSlice";
import "./Clients.css";

/* ============================================================
   CONSTANTS
   ============================================================ */
const STATUS_OPTIONS = ["Pending", "In Repair", "Completed"];
const STATUS_LABELS  = { "Pending": "En attente", "In Repair": "En réparation", "Completed": "Terminé" };

/* ============================================================
   UTILITIES
   ============================================================ */
const getInitials = (prenom = "", nom = "") =>
  `${prenom[0] || ""}${nom[0] || ""}`.toUpperCase() || "?";

const slugStatus = (s) =>
  s?.toLowerCase().replace(" ", "-");

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

const validate = (form) => {
  const errors = {};
  if (!form.prenom.trim()) errors.prenom = "Prénom requis";
  if (!form.nom.trim())    errors.nom    = "Nom requis";
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Email invalide";
  if (!form.modele.trim()) errors.modele = "Modèle requis";
  return errors;
};

/* ============================================================
   TOAST SYSTEM
   ============================================================ */
function ToastStack({ toasts }) {
  const icons = { success: "✓", error: "✕", info: "ℹ" };
  return (
    <div className="toast-stack">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <span style={{ fontWeight: 700 }}>{icons[t.type]}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((message, type = "success") => {
    const id = uuid();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);
  return { toasts, push };
}

/* ============================================================
   STAT PILLS (top of page)
   ============================================================ */
function StatPills({ clients }) {
  const total     = clients.length;
  const pending   = clients.filter(c => c.status === "Pending").length;
  const inRepair  = clients.filter(c => c.status === "In Repair").length;
  const done      = clients.filter(c => c.status === "Completed").length;
  return (
    <div className="stat-pills">
      <div className="stat-pill"><span className="stat-pill-dot cyan" />{total} total</div>
      <div className="stat-pill"><span className="stat-pill-dot amber" />{pending} en attente</div>
      <div className="stat-pill"><span className="stat-pill-dot violet" />{inRepair} en réparation</div>
      <div className="stat-pill"><span className="stat-pill-dot emerald" />{done} terminés</div>
    </div>
  );
}

/* ============================================================
   REPAIR STEPPER
   ============================================================ */
const STEPS = ["Identité", "Appareil", "Confirmation"];

function RepairStepper({ onSubmit, toast }) {
  const [step,    setStep]    = useState(0);
  const [dir,     setDir]     = useState(1);   // 1 = forward, -1 = back
  const [form,    setForm]    = useState({ prenom: "", nom: "", email: "", modele: "", problem: "" });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: undefined }));
  };

  const validateStep = () => {
    const e = {};
    if (step === 0) {
      if (!form.prenom.trim()) e.prenom = "Prénom requis";
      if (!form.nom.trim())    e.nom    = "Nom requis";
    }
    if (step === 1) {
      if (!form.modele.trim()) e.modele = "Modèle requis";
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        e.email = "Email invalide";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (!validateStep()) { toast("Veuillez corriger les erreurs", "error"); return; }
    setDir(1);
    setStep(s => s + 1);
  };

  const goBack = () => { setDir(-1); setStep(s => s - 1); };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      onSubmit(form);
      setForm({ prenom: "", nom: "", email: "", modele: "", problem: "" });
      setStep(0);
      setLoading(false);
    }, 900);
  };

  const progressPct = (step / (STEPS.length - 1)) * 100;

  const Field = ({ name, label, placeholder, type = "text" }) => (
    <div className="field">
      <label className="field-label">{label}</label>
      <input
        className={`field-input ${errors[name] ? "error" : ""}`}
        type={type}
        placeholder={placeholder}
        value={form[name]}
        onChange={e => set(name, e.target.value)}
        autoComplete="off"
      />
      {errors[name] && <span className="field-error">⚠ {errors[name]}</span>}
    </div>
  );

  return (
    <div>
      {/* Progress indicator */}
      <div className="stepper-progress">
        {STEPS.map((label, i) => (
          <React.Fragment key={i}>
            <div className={`step-node ${i < step ? "done" : ""}`}>
              <div className={`step-node-circle ${i === step ? "active" : i < step ? "done" : ""}`}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className="step-node-label">{label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="step-connector-bar">
                <div className="step-connector-fill" style={{ width: step > i ? "100%" : "0%" }} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step content */}
      <div className="step-body">
        <div className={`step-slide ${dir < 0 ? "back" : ""}`} key={step}>
          {step === 0 && (
            <div>
              <p className="step-section-title">👤 Informations personnelles</p>
              <div className="field-group">
                <Field name="prenom"  label="Prénom"  placeholder="Ex: Ahmed" />
                <Field name="nom"     label="Nom"     placeholder="Ex: Benali" />
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="step-section-title">📱 Appareil & Contact</p>
              <div className="field-group">
                <Field name="email"   label="Email (optionnel)" placeholder="client@email.com" type="email" />
                <Field name="modele"  label="Modèle de l'appareil" placeholder="Ex: iPhone 15 Pro Max" />
                <div className="field">
                  <label className="field-label">Description de la panne</label>
                  <input
                    className="field-input"
                    placeholder="Écran cassé, batterie…"
                    value={form.problem}
                    onChange={e => set("problem", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="step-section-title">✅ Confirmation de la demande</p>
              <div className="confirm-card">
                <div className="confirm-row">
                  <span className="confirm-key">Client</span>
                  <span className="confirm-value">{form.prenom} {form.nom}</span>
                </div>
                {form.email && (
                  <div className="confirm-row">
                    <span className="confirm-key">Email</span>
                    <span className="confirm-value">{form.email}</span>
                  </div>
                )}
                <div className="confirm-divider" />
                <div className="confirm-row">
                  <span className="confirm-key">Appareil</span>
                  <span className="confirm-value">{form.modele}</span>
                </div>
                {form.problem && (
                  <div className="confirm-row">
                    <span className="confirm-key">Panne</span>
                    <span className="confirm-value">{form.problem}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer navigation */}
      <div className="stepper-footer">
        {step > 0
          ? <button className="step-back-btn" onClick={goBack}>← Retour</button>
          : <span />
        }
        {step < STEPS.length - 1 ? (
          <button className="step-next-btn" onClick={goNext}>
            Continuer →
          </button>
        ) : (
          <button className={`step-next-btn finish`} onClick={handleSubmit} disabled={loading}>
            {loading ? "⏳ Envoi…" : "⚡ Envoyer la demande"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   CLIENT CARD
   ============================================================ */
function ClientCard({ client, onEdit, onDelete, delay }) {
  const initials = getInitials(client.prenom, client.nom);
  const slug     = slugStatus(client.status || "Pending");
  const label    = STATUS_LABELS[client.status] || client.status;

  return (
    <div
      className={`client-card status-${slug}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="client-avatar">{initials}</div>

      <div className="client-info">
        <p className="client-name">{client.prenom} {client.nom}</p>
        <div className="client-meta">
          <span>📱 {client.modele}</span>
          {client.email && <span>✉ {client.email}</span>}
        </div>
      </div>

      <div className="client-right">
        <span className={`status-badge ${slug}`}>{label}</span>
        <button className="card-action-btn" onClick={() => onEdit(client)} title="Modifier">✏️</button>
        <button className="card-action-btn delete" onClick={() => onDelete(client.id)} title="Supprimer">🗑</button>
      </div>
    </div>
  );
}

/* ============================================================
   EDIT MODAL
   ============================================================ */
function EditModal({ client, onSave, onClose }) {
  const [form, setForm]   = useState({
    prenom:  client.prenom  || "",
    nom:     client.nom     || "",
    email:   client.email   || "",
    modele:  client.modele  || "",
    status:  client.status  || "Pending",
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: undefined }));
  };

  const handleSave = () => {
    const e = {};
    if (!form.prenom.trim()) e.prenom = "Prénom requis";
    if (!form.nom.trim())    e.nom    = "Nom requis";
    if (!form.modele.trim()) e.modele = "Modèle requis";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email invalide";
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...client, ...form });
  };

  const Field = ({ name, label, placeholder, type = "text" }) => (
    <div className="field">
      <label className="field-label">{label}</label>
      <input
        className={`field-input ${errors[name] ? "error" : ""}`}
        type={type}
        value={form[name]}
        onChange={e => set(name, e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
      {errors[name] && <span className="field-error">⚠ {errors[name]}</span>}
    </div>
  );

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <div>
            <p className="modal-title">✏️ Modifier le client</p>
            <p style={{ fontSize: "0.78rem", color: "var(--text-3)", marginTop: 4 }}>
              {client.prenom} {client.nom} — ID #{client.id?.toString().slice(-6)}
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-field-group">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field name="prenom" label="Prénom" placeholder="Prénom" />
            <Field name="nom"    label="Nom"    placeholder="Nom" />
          </div>
          <Field name="email"  label="Email"    placeholder="client@email.com" type="email" />
          <Field name="modele" label="Appareil" placeholder="Modèle" />

          <div className="field">
            <label className="field-label">Statut</label>
            <select
              className="field-input"
              value={form.status}
              onChange={e => set("status", e.target.value)}
            >
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s} style={{ background: "var(--s3)" }}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="modal-actions">
          <button className="modal-cancel-btn" onClick={onClose}>Annuler</button>
          <button className="modal-save-btn"   onClick={handleSave}>Sauvegarder</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   CLIENT LIST
   ============================================================ */
function ClientList({ clients, onEdit, onDelete }) {
  const [search,    setSearch]    = useState("");
  const [statusFilter, setStatusFilter] = useState("Tous");

  const filters = ["Tous", ...STATUS_OPTIONS];

  const visible = clients.filter(c => {
    const q     = search.toLowerCase();
    const match = !q || [c.nom, c.prenom, c.email, c.modele].some(v => v?.toLowerCase().includes(q));
    const sf    = statusFilter === "Tous" || c.status === statusFilter;
    return match && sf;
  });

  return (
    <div>
      <div className="list-toolbar">
        <div className="list-search-wrap">
          <span className="list-search-ico">🔍</span>
          <input
            className="list-search"
            placeholder="Rechercher un client…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-chips">
          {filters.map(f => (
            <button
              key={f}
              className={`filter-chip ${statusFilter === f ? "active" : ""}`}
              onClick={() => setStatusFilter(f)}
            >
              {f === "Tous" ? "Tous" : STATUS_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="client-grid">
        {visible.length === 0 ? (
          <div className="list-empty">
            <div className="list-empty-icon">📋</div>
            <p>Aucun client trouvé</p>
            <span>Ajoutez une demande via le formulaire</span>
          </div>
        ) : (
          visible.map((c, i) => (
            <ClientCard
              key={c.id}
              client={c}
              delay={i * 50}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ============================================================
   ROOT COMPONENT
   ============================================================ */
export default function Clients() {
  const clients  = useSelector(s => s.clients?.clients ?? []);
  const dispatch = useDispatch();
  const { toasts, push } = useToast();
  const [editTarget, setEditTarget] = useState(null);

  /* Add client */
  const handleSubmit = (form) => {
    if (!form.nom || !form.prenom) { push("Champs obligatoires manquants", "error"); return; }
    dispatch(ajouterClient({
      id:     uuid(),
      ...form,
      status: "Pending",
    }));
    push(`Demande de ${form.prenom} ${form.nom} enregistrée !`, "success");
  };

  /* Edit client */
  const handleSave = (updated) => {
    dispatch(modifierClient({
      id:           updated.id,
      nouveauNom:   updated.nom,
      nouveauPrenom:updated.prenom,
      nouvelEmail:  updated.email,
      nouveauModele:updated.modele,
      nouveauStatus:updated.status,
    }));
    setEditTarget(null);
    push("Client mis à jour avec succès", "success");
  };

  /* Delete client */
  const handleDelete = (id) => {
    dispatch(supprimerClient(id));
    push("Client supprimé", "info");
  };

  /* Stats */
  const total    = clients.length;
  const inRepair = clients.filter(c => c.status === "In Repair").length;
  const done     = clients.filter(c => c.status === "Completed").length;

  return (
    <div className="clients-module">
      {/* PAGE HERO */}
      <div className="page-hero">
        <div className="page-hero-top">
          <div>
            <h1 className="page-title">Espace <em>Clients</em></h1>
            <p className="page-subtitle">Gestion des demandes de réparation — Prism Repair</p>
          </div>
          <StatPills clients={clients} />
        </div>
      </div>

      {/* LAYOUT */}
      <div className="clients-layout">

        {/* LEFT — STEPPER */}
        <div className="glass-panel">
          <div className="panel-header">
            <p className="panel-title">
              <span className="panel-title-icon cyan">⚡</span>
              Nouvelle demande
            </p>
            <p className="panel-sub">Suivez les étapes pour enregistrer un client</p>
          </div>
          <div className="panel-body">
            <RepairStepper onSubmit={handleSubmit} toast={push} />
          </div>
        </div>

        {/* RIGHT — LIST */}
        <div className="glass-panel">
          <div className="panel-header">
            <p className="panel-title">
              <span className="panel-title-icon violet">📋</span>
              Clients enregistrés
              {total > 0 && (
                <span style={{
                  marginLeft: 8,
                  background: "var(--violet-d)",
                  border: "1px solid rgba(167,139,250,0.25)",
                  color: "var(--violet)",
                  fontSize: "0.68rem",
                  fontWeight: 700,
                  padding: "2px 9px",
                  borderRadius: "50px",
                  fontFamily: "'Instrument Sans', sans-serif"
                }}>{total}</span>
              )}
            </p>
            <p className="panel-sub">Recherche, filtre et gestion des statuts</p>
          </div>
          <div className="panel-body">
            <ClientList
              clients={clients}
              onEdit={setEditTarget}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editTarget && (
        <EditModal
          client={editTarget}
          onSave={handleSave}
          onClose={() => setEditTarget(null)}
        />
      )}

      {/* TOASTS */}
      <ToastStack toasts={toasts} />
    </div>
  );
}