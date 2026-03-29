import { createSlice } from "@reduxjs/toolkit";

const articlesSlice = createSlice({
  name: "articles",
  initialState: [],
  reducers: {
    ajouterArticle: (state, action) => {
      state.push({
        id: Date.now(),
        nom: action.payload
      });
    }
  }
});

export const { ajouterArticle } = articlesSlice.actions;
export default articlesSlice.reducer;
