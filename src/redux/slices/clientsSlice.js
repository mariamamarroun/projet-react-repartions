import { createSlice } from "@reduxjs/toolkit";

function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === "x" ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

const initialState = {
  clients: [],
};

const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    ajouterClient: (state, action) => {
      state.clients.push({
        id:     action.payload.id || uuid(),
        status: "Pending",           // Default status
        ...action.payload,
      });
    },

    supprimerClient: (state, action) => {
      state.clients = state.clients.filter(c => c.id !== action.payload);
    },

    modifierClient: (state, action) => {
      const client = state.clients.find(c => c.id === action.payload.id);
      if (client) {
        if (action.payload.nouveauNom    !== undefined) client.nom    = action.payload.nouveauNom;
        if (action.payload.nouveauPrenom !== undefined) client.prenom = action.payload.nouveauPrenom;
        if (action.payload.nouvelEmail   !== undefined) client.email  = action.payload.nouvelEmail;
        if (action.payload.nouveauModele !== undefined) client.modele = action.payload.nouveauModele;
        if (action.payload.nouveauStatus !== undefined) client.status = action.payload.nouveauStatus;
      }
    },

    changerStatut: (state, action) => {
      const { id, status } = action.payload;
      const client = state.clients.find(c => c.id === id);
      if (client) client.status = status;
    },
  },
});

export const {
  ajouterClient,
  supprimerClient,
  modifierClient,
  changerStatut,
} = clientsSlice.actions;

export default clientsSlice.reducer;