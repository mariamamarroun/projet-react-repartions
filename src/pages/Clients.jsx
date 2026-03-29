import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ajouterClient, supprimerClient, modifierClient } from "../redux/slices/clientsSlice";
import Stepper, { Step } from "../pages/Stepper";

export default function Clients() {
  const clients = useSelector((state) => (state.clients && state.clients.clients) ? state.clients.clients : []);
  const dispatch = useDispatch();


  // État pour le formulaire du Stepper
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    modele: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fonction pour AJOUTER (déclenchée à la fin du Stepper)
  const handleFinalSubmit = () => {
    if (formData.nom && formData.prenom) {
      dispatch(ajouterClient(formData));
      setFormData({ nom: "", prenom: "", email: "", modele: "" }); // Reset
      alert("Demande de réparation envoyée aux entreprises ! 🛠️");
    }
  };

  // Fonction pour MODIFIER
  const handleEdit = (client) => {
    const nouveauNom = prompt("Modifier le nom du client :", client.nom);
    const nouveauModele = prompt("Modifier le modèle :", client.modele);
    
    if (nouveauNom || nouveauModele) {
      dispatch(modifierClient({ 
        id: client.id, 
        nouveauNom: nouveauNom || client.nom,
        nouveauPrenom: client.prenom,
        nouvelEmail: client.email,
        nouveauModele: nouveauModele || client.modele
      }));
    }
  };

  return (
    <div className="page-container" style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", color: "#ffffff", marginBottom: "20px" }}>🛠️ Espace Client & Réparation</h2>

      {/* --- SECTION STEPPER (AJOUTER) --- */}
      <div style={{ marginBottom: "50px" }}>
        <Stepper onFinalStepCompleted={handleFinalSubmit} nextButtonText="Continuer" backButtonText="Retour">
          <Step>
            <div style={stepStyle}>
              <h3>Étape 1 : Identité</h3>
              <input name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" style={inputStyle} />
              <input name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prénom" style={inputStyle} />
            </div>
          </Step>
          <Step>
            <div style={stepStyle}>
              <h3>Étape 2 : Contact & Appareil</h3>
              <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" style={inputStyle} />
              <input name="modele" value={formData.modele} onChange={handleChange} placeholder="Modèle du téléphone" style={inputStyle} />
            </div>
          </Step>
          <Step>
            <div style={{ ...stepStyle, textAlign: "center" }}>
              <h3>Étape 3 : Confirmation</h3>
              <p>Envoyer les informations à l'entreprise de réparation ?</p>
              <div style={{ background: "#f0f0f0", padding: "10px", borderRadius: "8px", color: "#333" }}>
                {formData.prenom} {formData.nom} - {formData.modele}
              </div>
            </div>
          </Step>
        </Stepper>
      </div>

      <hr style={{ border: "0.5px solid #ddd", margin: "40px 0" }} />

      {/* --- SECTION LISTE (AFFICHER, MODIFIER, SUPPRIMER) --- */}
      <div className="clients-list">
        <h3>📋 Clients enregistrés</h3>
        {clients.length === 0 ? (
          <p>Aucun client pour le moment.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {clients.map((c) => (
              <li key={c.id} style={clientItemStyle}>
                <div>
                  <strong>{c.prenom} {c.nom}</strong> <br />
                  <small style={{ color: "#666" }}>📱 {c.modele} | 📧 {c.email}</small>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => handleEdit(c)} style={editBtnStyle}>✏️</button>
                  <button onClick={() => dispatch(supprimerClient(c.id))} style={deleteBtnStyle}>❌</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Styles en ligne pour la démonstration
const stepStyle = { display: "flex", flexDirection: "column", gap: "15px", padding: "10px" };
const inputStyle = { padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "16px" };
const clientItemStyle = { 
  display: "flex", 
  justifyContent: "space-between", 
  alignItems: "center", 
  padding: "15px", 
  background: "white", 
  borderRadius: "10px", 
  marginBottom: "10px",
  boxShadow: "0 2px 5px rgba(0,0,0,0.05)"
};
const editBtnStyle = { background: "#ffcc00", border: "none", borderRadius: "5px", padding: "5px 10px", cursor: "pointer" };
const deleteBtnStyle = { background: "#ff4444", color: "white", border: "none", borderRadius: "5px", padding: "5px 10px", cursor: "pointer" };