import React, { useState } from "react";
import {
  Smartphone,
  Laptop,
  Tablet,
  CheckCircle,
  Clock,
  ChevronRight,
  User,
  Settings
} from "lucide-react";
import "./Reparations.css";

export default function Reparations() {
  const [page, setPage] = useState("form");
  const [repairs, setRepairs] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(null);

  const [form, setForm] = useState({
    deviceType: "Phone",
    model: "",
    customer: "",
    contact: "",
    problem: ""
  });

  const stepsTemplate = [
    "Votre appareil a été enregistré dans notre système.",
    "Analyse complète du problème matériel.",
    "Nos techniciens remplacent les composants nécessaires.",
    "Vérification du fonctionnement complet de l'appareil.",
    "Votre appareil est prêt pour récupération en magasin."
  ];

  // SUBMIT NEW REPAIR
  const submitRepair = () => {
    if (!form.model || !form.customer)
      return alert("Veuillez remplir les champs");

    const id = "REP-" + Math.floor(10000 + Math.random() * 90000);

    const newRepair = {
      id,
      ...form,
      status: "In Progress",
      timeline: stepsTemplate.map((s, i) => ({
        title: s,
        completed: i === 0,
        date: i === 0 ? new Date().toLocaleDateString("fr-FR") : null,
        time: i === 0
          ? new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
          : null
      }))
    };

    setRepairs([...repairs, newRepair]);
    setForm({ deviceType: "Phone", model: "", customer: "", contact: "", problem: "" });
    alert("Demande enregistrée !");
    setPage("admin");
  };

  // UPDATE STEP
  const updateStep = (repairIdx, stepIdx) => {
    const updated = [...repairs];
    const repair = updated[repairIdx];

    repair.timeline[stepIdx].completed = true;
    repair.timeline[stepIdx].date = new Date().toLocaleDateString("fr-FR");
    repair.timeline[stepIdx].time = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

    if (stepIdx === stepsTemplate.length - 1) {
      repair.status = "Completed";
    }

    setRepairs(updated);
  };

  // GET DEVICE ICON
  const getDeviceIcon = (type, size = 18) => {
    if (type === "Phone") return <Smartphone size={size} />;
    if (type === "Laptop") return <Laptop size={size} />;
    return <Tablet size={size} />;
  };

  return (
    <div className="app-container">

      {/* NAVBAR */}
      <nav className="main-nav">
        <div className="nav-content">
          <span className="logo">RepairLogix</span>
          <div className="nav-buttons">
            <button className={page === "form" ? "active" : ""} onClick={() => setPage("form")}>
              <User size={16} /> Client
            </button>
            <button className={page === "admin" ? "active" : ""} onClick={() => setPage("admin")}>
              <Settings size={16} /> Admin
            </button>
          </div>
        </div>
      </nav>

      <div className="content-area">

        {/* CLIENT FORM */}
        {page === "form" && (
          <div className="card fade-in">
            <h2>Nouvelle Demande</h2>
            <div className="form-container">
              <div className="input-group">
                <label>Type d'appareil</label>
                <select value={form.deviceType} onChange={(e) => setForm({ ...form, deviceType: e.target.value })}>
                  <option>Phone</option>
                  <option>Laptop</option>
                  <option>Tablet</option>
                </select>
              </div>
              <div className="input-group">
                <label>Modèle</label>
                <input type="text" placeholder="Ex: iPhone 15 Pro" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
              </div>
              <div className="input-group">
                <label>Nom client</label>
                <input type="text" placeholder="Nom complet" value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} />
              </div>
              <div className="input-group">
                <label>Contact</label>
                <input type="text" placeholder="Téléphone / Email" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} />
              </div>
              <div className="input-group">
                <label>Problème</label>
                <textarea placeholder="Décrivez la panne..." value={form.problem} onChange={(e) => setForm({ ...form, problem: e.target.value })} />
              </div>
              <button className="primary-btn" onClick={submitRepair}>Envoyer la demande</button>
            </div>
          </div>
        )}

        {/* ADMIN LIST */}
        {page === "admin" && (
          <div className="card fade-in">
            <h2>Liste des réparations</h2>
            <table>
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Client</th>
                  <th>Appareil</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {repairs.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: "center" }}>Aucune demande</td></tr>
                ) : (
                  repairs.map((r, i) => (
                    <tr key={r.id}>
                      <td>{r.id}</td>
                      <td>{r.customer}</td>
                      <td>{getDeviceIcon(r.deviceType)} {r.model}</td>
                      <td><span className={r.status === "Completed" ? "badge done" : "badge progress"}>{r.status}</span></td>
                      <td><button onClick={() => { setCurrentIdx(i); setPage("tracking"); }}>Gérer <ChevronRight size={14} /></button></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TRACKING VIEW */}
        {page === "tracking" && currentIdx !== null && (
          <div className="card tracking-card fade-in">
            <div className="tracking-header">
              {getDeviceIcon(repairs[currentIdx].deviceType, 32)}
              <div>
                <h3>{repairs[currentIdx].model}</h3>
                <p>Ticket : {repairs[currentIdx].id}</p>
              </div>
              <div className={`status-pill ${repairs[currentIdx].status === "Completed" ? "completed" : ""}`}>
                {repairs[currentIdx].status === "Completed" ? "Terminée" : "In Progress"}
              </div>
            </div>

            <div className="timeline-container">
              {repairs[currentIdx].timeline.map((step, si) => {
                const isCompleted = step.completed;
                const isCurrent = !step.completed && (si === 0 || repairs[currentIdx].timeline[si - 1].completed);
                return (
                  <div key={si} className="timeline-item">
                    <div className="timeline-icon">
                      {isCompleted ? <CheckCircle className="icon-success" /> : isCurrent ? <Clock className="icon-pending" /> : <div className="empty-circle"></div>}
                    </div>
                    <div className="timeline-content">
                      <h4>{step.title}</h4>
                      {isCompleted && <p className="time-stamp">{step.date} • {step.time}</p>}
                      {isCurrent && <button className="step-btn" onClick={() => updateStep(currentIdx, si)}>Valider cette étape</button>}
                      {si === repairs[currentIdx].timeline.length - 1 && step.completed && (
                        <div className="pickup-success">Votre appareil est prêt pour récupération en magasin</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}