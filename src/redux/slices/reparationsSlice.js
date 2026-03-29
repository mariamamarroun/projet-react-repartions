import { createSlice } from "@reduxjs/toolkit";

const reparationsSlice = createSlice({
  name: "reparations",
  initialState: [],
  reducers: {
    ajouterReparation: (state, action) => {
      state.push({
        id: Date.now(),
        message: action.payload
      });
    },
    supprimerReparation: (state, action) => {
      return state.filter(r => r.id !== action.payload);
    }
  }
});

export const { ajouterReparation, supprimerReparation } = reparationsSlice.actions;
export default reparationsSlice.reducer;
