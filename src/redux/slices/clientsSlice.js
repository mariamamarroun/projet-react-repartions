import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  clients: [],
};

const clientsSlice = createSlice({
  name: "clients",
  initialState,
  reducers: {
    ajouterClient: (state, action) => {
      const newClient = {
        id: Date.now(),
        ...action.payload,
      };
      state.clients.push(newClient);
    },
    supprimerClient: (state, action) => {
      state.clients = state.clients.filter(c => c.id !== action.payload);
    },
    modifierClient: (state, action) => {
      const client = state.clients.find(c => c.id === action.payload.id);
      if (client) {
        client.nom = action.payload.nouveauNom;
        client.prenom = action.payload.nouveauPrenom;
        client.email = action.payload.nouvelEmail;
        client.modele = action.payload.nouveauModele;
      }
    },
  },
});

export const { ajouterClient, supprimerClient, modifierClient } = clientsSlice.actions;
export default clientsSlice.reducer;