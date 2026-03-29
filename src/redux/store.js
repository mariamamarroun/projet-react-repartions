import { configureStore } from "@reduxjs/toolkit";
import clientsReducer from "./slices/clientsSlice";
import articlesReducer from "./slices/articlesSlice";
import reparationsReducer from "./slices/reparationsSlice";

export const store = configureStore({
  reducer: {
    clients: clientsReducer,
    articles: articlesReducer,
    reparations: reparationsReducer,
  },
});